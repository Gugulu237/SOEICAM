"use client";
import Link from "@/components/LocalizedLink";
import { useLanguage } from "@/components/SiteShell";
export default function NotFound() {
  const { language } = useLanguage();
  return (
    <section className="not-found page-container">
      <span className="eyebrow">404</span>
      <h1>{language === "fr" ? "Page introuvable" : "Page not found"}</h1>
      <p>
        {language === "fr"
          ? "Retrouvez les yaourts YOLA dans notre catalogue."
          : "Find the YOLA range in our catalogue."}
      </p>
      <Link className="button button-primary" href="/products">
        {language === "fr" ? "Nos produits" : "Our products"}
      </Link>
    </section>
  );
}
