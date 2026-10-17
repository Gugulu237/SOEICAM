"use client";
import Link from "./LocalizedLink";
import { useLanguage } from "./SiteShell";
import { guides, guideSlugs } from "@/lib/guides";
export default function GuideLinks() {
  const { language } = useLanguage();
  return (
    <section className="page-container discovery-section">
      <h2 className="brand-script">
        {language === "fr" ? "Les guides YOLA" : "YOLA guides"}
      </h2>
      <div className="guide-links">
        {guideSlugs.map((slug) => (
          <article key={slug}>
            <h3>
              <Link href={`/guides/${slug}`}>
                {guides[language][slug].title}
              </Link>
            </h3>
            <p>{guides[language][slug].description}</p>
            <Link className="text-link" href={`/guides/${slug}`}>
              {language === "fr" ? "Lire le guide" : "Read the guide"}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
