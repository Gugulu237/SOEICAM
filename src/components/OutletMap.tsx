"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { loadOutletMap, type GoogleOutletMaps, type OutletMapInstance, type OutletMarker, type MapInfo } from "@/lib/google-outlet-map";
import { directionsUrl, type Outlet } from "@/lib/outlets";
import { outletCopy } from "@/lib/outlet-copy";
import type { SiteLanguage } from "@/lib/i18n";
import Link from "./LocalizedLink";

export default function OutletMap({ outlets, selected, selectionRevision, onSelect, onReadyChange, language }: {
  outlets: Outlet[]; selected: string; selectionRevision: number; onSelect: (id: string) => void; language: SiteLanguage;
  onReadyChange: (ready: boolean) => void;
}) {
  const copy = outletCopy[language];
  const container = useRef<HTMLDivElement>(null);
  const mapState = useRef<{ maps: GoogleOutletMaps; map: OutletMapInstance; info: MapInfo } | null>(null);
  const pins = useRef(new Map<string, { marker: OutletMarker; element: HTMLElement }>());
  const select = useRef(onSelect);
  select.current = onSelect;
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => { onReadyChange(status === "ready"); }, [status, onReadyChange]);

  useEffect(() => {
    let active = true;
    const fail = () => { if (active) setStatus("error"); };
    window.addEventListener("soeicam:outlet-map-error", fail);
    setStatus("loading");
    loadOutletMap(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "", language).then(maps => {
      if (!active || !container.current) return;
      const map = new maps.Map(container.current, {
        center: { lat: 3.848, lng: 11.502 }, zoom: 12,
        mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || "DEMO_MAP_ID",
        mapTypeControl: false, streetViewControl: false, fullscreenControl: true,
        gestureHandling: "cooperative", clickableIcons: false,
      });
      mapState.current = { maps, map, info: new maps.InfoWindow() };
      setStatus("ready");
    }).catch(fail);
    return () => {
      active = false; window.removeEventListener("soeicam:outlet-map-error", fail);
      mapState.current?.info.close();
      if (mapState.current) mapState.current.maps.event.clearInstanceListeners(mapState.current.map);
      mapState.current = null;
    };
  }, [language]);

  useEffect(() => {
    const state = mapState.current;
    if (status !== "ready" || !state) return;
    const { maps, map, info } = state;
    const bounds = new maps.LatLngBounds();
    const events = new AbortController();
    const currentPins = new Map<string, { marker: OutletMarker; element: HTMLElement }>();
    for (const outlet of outlets) {
      const element = document.createElement("div");
      element.className = "outlet-pin";
      const tip = document.createElement("span"); tip.className = "outlet-pin-tip";
      const face = document.createElement("span"); face.className = "outlet-pin-face";
      const logo = document.createElement("img");
      logo.src = "/_next/image?url=%2Fbrand%2Flogos%2Fyola.png&w=128&q=75";
      logo.alt = ""; logo.width = 38; logo.height = 38; logo.decoding = "async"; logo.draggable = false;
      const fallback = document.createElement("span");
      fallback.className = "outlet-pin-fallback"; fallback.textContent = "YOLA"; fallback.hidden = true;
      const label = document.createElement("span");
      label.className = "outlet-pin-name"; label.textContent = outlet.name;
      let originalLogo = false;
      logo.onerror = () => {
        if (!originalLogo) { originalLogo = true; logo.src = "/brand/logos/yola.png"; }
        else { logo.hidden = true; fallback.hidden = false; }
      };
      element.setAttribute("aria-hidden", "true");
      face.append(logo, fallback); element.append(tip, face, label);
      const marker = new maps.marker.AdvancedMarkerElement({ map, position: { lat: outlet.lat, lng: outlet.lng }, title: outlet.name, gmpClickable: true, anchorLeft: "-50%", anchorTop: "-100%", zIndex: 10 });
      marker.append(element);
      marker.addEventListener("gmp-click", () => select.current(outlet.id), { signal: events.signal });
      currentPins.set(outlet.id, { marker, element });
      bounds.extend(outlet);
    }
    pins.current = currentPins;
    if (outlets.length === 1) { map.panTo(outlets[0]); map.setZoom(15); }
    else if (outlets.length > 1) map.fitBounds(bounds, 100);
    return () => {
      events.abort();
      info.close();
      for (const { marker } of currentPins.values()) { maps.event.clearInstanceListeners(marker); marker.map = null; }
      currentPins.clear();
    };
  }, [outlets, status]);

  useEffect(() => {
    const state = mapState.current;
    if (status !== "ready" || !state) return;
    for (const [id, pin] of pins.current) {
      pin.element.classList.toggle("is-selected", id === selected);
      pin.marker.zIndex = id === selected ? 1000 : 10;
    }
    const outlet = outlets.find(item => item.id === selected), pin = pins.current.get(selected);
    if (!outlet || !pin) { state.info.close(); return; }
    const content = document.createElement("div"); content.className = "outlet-map-info";
    const category = document.createElement("span"); category.className = "outlet-map-category"; category.textContent = copy.category[outlet.category];
    const title = document.createElement("strong"); title.textContent = outlet.name;
    const address = document.createElement("p"); address.textContent = [outlet.address, outlet.neighbourhood, outlet.town].filter(Boolean).join(", ");
    const directions = document.createElement("a"); directions.href = directionsUrl(outlet); directions.target = "_blank"; directions.rel = "noopener noreferrer"; directions.textContent = copy.directions;
    content.append(category, title, address, directions);
    state.info.setContent(content);
    state.info.open({ map: state.map, anchor: pin.marker, shouldFocus: false });
    state.map.panTo(outlet);
    if ((state.map.getZoom() || 0) < 14) state.map.setZoom(14);
  }, [selected, selectionRevision, outlets, status, copy.directions, copy.category]);

  return <div className="outlet-map-wrap" id="outlet-map" aria-label={copy.map}>
    <div ref={container} className="outlet-map-canvas" aria-label={copy.map} hidden={status === "error"} />
    {status !== "ready" && <div className="outlet-map-message" role="status">
      <MapPin size={34} strokeWidth={1.5} aria-hidden="true" />
      <p>{status === "error" ? copy.mapUnavailable : copy.mapLoading}</p>
      {status === "error" && <Link className="button button-outline" href="/contact">{copy.contact}</Link>}
    </div>}
  </div>;
}
