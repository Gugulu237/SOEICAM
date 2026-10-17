"use client";
import Script from "next/script";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "./SiteShell";
import Link from "./LocalizedLink";
import { track } from "@/lib/analytics";
const id = process.env.NEXT_PUBLIC_GA4_ID;
const configured = !!id && /^G-[A-Z0-9]+$/.test(id);
export default function AnalyticsConsent() {
  const { language } = useLanguage();
  const path = usePathname();
  const [choice, setChoice] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [analyticsReady, setAnalyticsReady] = useState(false);
  useEffect(() => {
    try {
      setChoice(localStorage.getItem("soeicam-analytics"));
    } catch {
      setChoice("declined");
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!configured || choice !== "accepted" || !analyticsReady) return;
    const product = path.match(/\/products\/([^/]+)$/)?.[1];
    track("page_view", { language });
    if (product) track("view_item", { product_id: product, language });
    else if (path.endsWith("/products")) track("view_item_list", { language });
  }, [path, language, choice, analyticsReady]);
  function choose(value: string) {
    try {
      localStorage.setItem("soeicam-analytics", value);
    } catch {}
    setChoice(value);
    if (window.gtag)
      window.gtag("consent", "update", {
        analytics_storage: value === "accepted" ? "granted" : "denied",
        ad_storage: "denied",
      });
  }
  if (!configured || !ready) return null;
  return (
    <>
      {choice === "accepted" && (
        <>
          <Script
            id="ga-settings"
            onReady={() => setAnalyticsReady(true)}
            strategy="afterInteractive"
          >{`window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});gtag('js',new Date());gtag('config','${id}',{send_page_view:false,page_location:window.location.origin+window.location.pathname,page_referrer:'',allow_google_signals:false,allow_ad_personalization_signals:false});`}</Script>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
            strategy="afterInteractive"
          />
        </>
      )}
      {!choice ? (
        <aside
          className="consent-banner"
          aria-label={
            language === "fr" ? "Mesure d'audience" : "Audience measurement"
          }
        >
          <p>
            {language === "fr"
              ? "Acceptez-vous la mesure d'audience facultative ? Vos demandes restent accessibles sans l'accepter."
              : "Allow optional audience measurement? You can contact us without accepting."}{" "}
            <Link href="/privacy">
              {language === "fr" ? "Confidentialité" : "Privacy"}
            </Link>
          </p>
          <button
            className="button button-outline"
            onClick={() => choose("declined")}
          >
            {language === "fr" ? "Refuser" : "Decline"}
          </button>
          <button
            className="button button-primary"
            onClick={() => choose("accepted")}
          >
            {language === "fr" ? "Accepter" : "Accept"}
          </button>
        </aside>
      ) : (
        <button className="consent-settings" onClick={() => setChoice(null)}>
          {language === "fr" ? "Choix de confidentialité" : "Privacy choices"}
        </button>
      )}
    </>
  );
}
