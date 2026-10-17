import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import JsonLd from "@/components/JsonLd";
import { guides, guideSlugs } from "@/lib/guides";
import { routeLanguage } from "@/lib/route-language";
import { seo, absolute, breadcrumbSchema } from "@/lib/seo";
import { localizedPath } from "@/lib/locales";
import { company } from "@/lib/company";
type Props = { params: Promise<{ lang: string; slug: string }> };
export function generateStaticParams() {
  return guideSlugs.map((slug) => ({ slug }));
}
export const dynamicParams = false;
async function content(params: Props["params"]) {
  const lang = await routeLanguage(params);
  const { slug } = await params;
  const key = guideSlugs.find((s) => s === slug);
  if (!key) notFound();
  return { lang, key, c: guides[lang][key] };
}
export async function generateMetadata({ params }: Props) {
  const { lang, key, c } = await content(params);
  return seo(lang, `/guides/${key}`, `${c.title} | YOLA`, c.description);
}
export default async function Page({ params }: Props) {
  const { lang, key, c } = await content(params);
  const fr = lang === "fr";
  const path = `/guides/${key}`;
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: c.title,
          description: c.description,
          inLanguage: `${lang}-CM`,
          mainEntityOfPage: absolute(localizedPath(lang, path)),
          image: absolute("/brand/range-hero.png"),
          author: {
            "@type": "Organization",
            name: "SOEICAM",
            url: company.site,
          },
          publisher: { "@id": `${company.site}/#organization` },
        }}
      />
      <JsonLd
        data={breadcrumbSchema(lang, [
          { name: fr ? "Accueil" : "Home", path: "/" },
          { name: fr ? "Filière laitière" : "Dairy knowledge", path: "/dairy" },
          { name: c.title, path },
        ])}
      />
      <article>
        <header className="page-hero catalog-hero">
          <div className="page-container">
            <span className="eyebrow green">
              {fr ? "Les guides YOLA" : "YOLA guides"}
            </span>
            <h1>{c.title}</h1>
            <p>{c.description}</p>
          </div>
        </header>
        <div className="editorial page-container">
          <Image
            className="guide-image"
            src="/brand/range-hero.png"
            alt={
              fr
                ? "La gamme de yaourts brassés et à boire YOLA"
                : "The YOLA stirred and drinking yogurt range"
            }
            width={1100}
            height={620}
            sizes="(max-width: 700px) 90vw, 860px"
          />
          {c.sections.map((s) => (
            <section key={s.title}>
              <h2>{s.title}</h2>
              <p>{s.text}</p>
            </section>
          ))}
          <h2>{fr ? "Comparez les formats YOLA" : "Compare YOLA formats"}</h2>
          <nav className="category-links">
            <Link href={localizedPath(lang, "/products/category/stirred")}>
              {fr ? "Yaourts brassés" : "Stirred yogurt"}
            </Link>
            <Link href={localizedPath(lang, "/products/category/drinkable")}>
              {fr ? "Yaourts à boire" : "Drinking yogurt"}
            </Link>
            <Link href={localizedPath(lang, "/products/category/family")}>
              {fr ? "Formats à partager" : "Sharing packs"}
            </Link>
          </nav>
          <p className="source-note">
            {fr
              ? "Repères généraux sur la transformation et la manipulation du lait : "
              : "General background on milk processing and handling: "}
            <a
              href="https://www.fao.org/dairy-production-products/processing/en/"
              target="_blank"
              rel="noopener noreferrer"
            >
              FAO
            </a>
            .{" "}
            {fr
              ? "Les indications de l'étiquette de votre produit priment pour sa conservation."
              : "Follow your product's label for its storage requirements."}
          </p>
          <Link
            className="button button-primary"
            href={localizedPath(lang, "/contact")}
          >
            {fr ? "Poser une question à SOEICAM" : "Ask SOEICAM a question"}
          </Link>
        </div>
      </article>
    </>
  );
}
