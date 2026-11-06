"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, LocateFixed, MapPin, Search, Store, X } from "lucide-react";
import Link from "./LocalizedLink";
import { useLanguage } from "./SiteShell";
import OutletMap from "./OutletMap";
import { distanceKm, outletCategories, searchText, type OutletSnapshot, type Point } from "@/lib/outlets";
import { outletCopy } from "@/lib/outlet-copy";

export default function FindProductsPage() {
  const { language } = useLanguage(), copy = outletCopy[language];
  const [snapshot, setSnapshot] = useState<OutletSnapshot | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [query, setQuery] = useState(""), [town, setTown] = useState(""), [category, setCategory] = useState("");
  const [position, setPosition] = useState<Point | null>(null), [locating, setLocating] = useState(false), [locationError, setLocationError] = useState(false);
  const [selected, setSelected] = useState("");
  const [selectionRevision, setSelectionRevision] = useState(0);
  const [mapReady, setMapReady] = useState(false);
  const request = useRef<AbortController | null>(null);
  const geoRequest = useRef(0);
  const refresh = useCallback(async () => {
    request.current?.abort();
    const controller = new AbortController(); request.current = controller;
    const timer = setTimeout(() => controller.abort(), 25000);
    try {
      const response = await fetch("/api/outlets", { cache: "no-store", signal: controller.signal });
      if (!response.ok) throw new Error("Unavailable");
      const data: OutletSnapshot = await response.json();
      if (!Array.isArray(data.outlets) || typeof data.syncedAt !== "string") throw new Error("Invalid response");
      if (request.current !== controller) return;
      setSnapshot(previous => JSON.stringify(previous?.outlets) === JSON.stringify(data.outlets) ? { ...previous!, syncedAt: data.syncedAt } : data);
      setStatus("ready");
    } catch {
      if (request.current === controller) { setStatus("error"); setSnapshot(null); }
    } finally { clearTimeout(timer); }
  }, []);
  useEffect(() => {
    void refresh();
    const visibleRefresh = () => { if (document.visibilityState === "visible") void refresh(); };
    const interval = setInterval(visibleRefresh, 60000);
    document.addEventListener("visibilitychange", visibleRefresh);
    return () => { clearInterval(interval); document.removeEventListener("visibilitychange", visibleRefresh); request.current?.abort(); request.current = null; geoRequest.current++; };
  }, [refresh]);

  const outlets = snapshot?.outlets;
  const towns = useMemo(() => [...new Set(outlets?.map(item => item.town).filter(Boolean))].sort((a, b) => a.localeCompare(b, language)), [outlets, language]);
  const filtered = useMemo(() => {
    const words = searchText(query).split(/\s+/).filter(Boolean);
    return (outlets || []).filter(item => {
      const haystack = searchText([item.name, item.group, item.address, item.town, item.neighbourhood].join(" "));
      return (!town || item.town === town) && (!category || item.category === category) && words.every(word => haystack.includes(word));
    }).sort((a, b) => position ? distanceKm(position, a) - distanceKm(position, b) : a.name.localeCompare(b.name, language));
  }, [outlets, query, town, category, position, language]);
  const nearest = position ? filtered[0] : undefined;
  const activeSelected = filtered.some(item => item.id === selected) ? selected : nearest?.id || "";
  function locate() {
    const token = ++geoRequest.current;
    setLocationError(false);
    if (!navigator.geolocation) { setLocationError(true); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(result => {
      if (token !== geoRequest.current) return;
      setPosition({ lat: result.coords.latitude, lng: result.coords.longitude });
      setTown(""); setQuery(""); setSelected(""); setLocating(false);
    }, () => { if (token === geoRequest.current) { setLocationError(true); setLocating(false); } }, { timeout: 12000, maximumAge: 60000, enableHighAccuracy: false });
  }
  function chooseOutlet(id: string) {
    setSelected(id);
    setSelectionRevision(value => value + 1);
  }

  return <>
    <section className="locator-hero">
      <div className="page-container locator-hero-inner">
        <div>
          <span className="eyebrow green"><MapPin size={15} aria-hidden="true" />{copy.eyebrow}</span>
          <h1>{copy.title}</h1>
          <p>{copy.intro}</p>
        </div>
        <div className="locator-hero-mark" aria-hidden="true"><Store size={50} strokeWidth={1.25} /></div>
      </div>
    </section>
    <section className="page-container locator-section" aria-label={copy.title}>
      <div className="locator-toolbar">
        <div className="locator-search">
          <label className="sr-only" htmlFor="outlet-search">{copy.search}</label>
          <Search size={20} aria-hidden="true" />
          <input id="outlet-search" type="search" value={query} placeholder={copy.placeholder} onChange={event => { setQuery(event.target.value); setSelected(""); }} />
        </div>
        <div className="locator-filter"><label htmlFor="outlet-town">{copy.town}</label><select id="outlet-town" value={town} onChange={event => { setTown(event.target.value); setSelected(""); }}><option value="">{copy.allTowns}</option>{towns.map(value => <option key={value}>{value}</option>)}</select></div>
        <div className="locator-filter"><label htmlFor="outlet-type">{copy.type}</label><select id="outlet-type" value={category} onChange={event => { setCategory(event.target.value); setSelected(""); }}><option value="">{copy.allTypes}</option>{outletCategories.map(value => <option value={value} key={value}>{copy.category[value]}</option>)}</select></div>
        <button className="button button-primary locator-nearby" onClick={locate} disabled={locating}><LocateFixed size={18} aria-hidden="true" />{locating ? copy.locating : copy.nearby}</button>
      </div>
      {locationError && <p className="locator-notice" role="alert">{copy.geolocationError}</p>}
      <div className="locator-results-bar">
        <p role="status" aria-live="polite">{status === "loading" ? copy.loading : status === "error" ? "—" : <><strong>{filtered.length}</strong> {filtered.length === 1 ? copy.singular : copy.results}</>}</p>
        <div>{position && <button onClick={() => { geoRequest.current++; setPosition(null); setLocating(false); }}><X size={14} aria-hidden="true" />{copy.clearLocation}</button>}{(query || town || category) && <button onClick={() => { setQuery(""); setTown(""); setCategory(""); setSelected(""); }}>{copy.reset}</button>}</div>
      </div>
      <div className="locator-map-layout">
        <OutletMap outlets={filtered} selected={activeSelected} selectionRevision={selectionRevision} onSelect={chooseOutlet} onReadyChange={setMapReady} language={language} />
      </div>
      {status !== "ready" || !filtered.length ? <div className="locator-state" role="status">
            <Store size={32} strokeWidth={1.4} aria-hidden="true" />
            <p>{status === "loading" ? copy.loading : status === "error" ? copy.unavailable : outlets?.length ? copy.noMatch : copy.empty}</p>
            {status === "error" && <button className="button button-outline" onClick={() => { setStatus("loading"); void refresh(); }}>{copy.retry}</button>}
            {status === "ready" && !!outlets?.length && <button className="button button-outline" onClick={() => { setQuery(""); setTown(""); setCategory(""); }}>{copy.reset}</button>}
            {status !== "loading" && <Link href="/contact" className="text-link">{copy.contact}</Link>}
          </div> : mapReady ? <p className="locator-map-hint"><MapPin size={15} aria-hidden="true" />{copy.pinHint}{nearest && <> {copy.nearest}: {nearest.name} ({distanceKm(position!, nearest).toFixed(1)} km).</>}</p> : null}
      <div className="locator-footnote"><p>{copy.availability}{position && <> {copy.distanceNote}</>}</p>{snapshot && <p>{copy.updated} {new Date(snapshot.syncedAt).toLocaleTimeString(language === "fr" ? "fr-CM" : "en-GB", { hour: "2-digit", minute: "2-digit" })}</p>}</div>
    </section>
    <section className="locator-partner page-container"><div><span className="eyebrow green">SOEICAM × YOLA</span><h2>{copy.partnerTitle}</h2><p>{copy.partnerText}</p></div><Link className="button button-outline" href="/professionals">{copy.partnerAction}<ArrowUpRight size={18} aria-hidden="true" /></Link></section>
  </>;
}
