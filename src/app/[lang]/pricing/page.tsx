import Image from "next/image";
import Link from "next/link";
import { categories, flavors, products, sizeLabels } from "@/lib/products";
import { formatPrice, pricingNote, resellerPrices } from "@/lib/pricing";
import { getPage } from "@/lib/pages";
import { localizedPath } from "@/lib/locales";
import { seo, breadcrumbSchema } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import { routeLanguage, type LocaleProps } from "@/lib/route-language";

export async function generateMetadata({ params }: LocaleProps) {
  const lang = await routeLanguage(params);
  const copy = getPage(lang, "pricing");
  return seo(lang, "/pricing", copy.title, copy.description);
}

export default async function Page({ params }: LocaleProps) {
  const lang = await routeLanguage(params);
  const fr = lang === "fr";
  return <>
    <JsonLd data={breadcrumbSchema(lang, [{ name: "SOEICAM", path: "/" }, { name: getPage(lang, "pricing").h1, path: "/pricing" }])} />
    <section className="page-hero"><div className="page-container">
      <h1>{getPage(lang, "pricing").h1}</h1>
      <p>{pricingNote[lang]}</p>
    </div></section>
    <div className="page-container pricing-list">
      {(["drinkable", "stirred"] as const).map((category) => <section key={category}>
        <h2>{categories[lang][category]}</h2>
        {resellerPrices.filter((row) => row.category === category).map((row) => <article className="pricing-row" key={`${category}-${row.size}`}>
          <div className="pricing-format"><h3>{sizeLabels[row.size]}</h3></div>
          <div className="pricing-supply"><span>{fr ? "Prix de livraison" : "Supply price"}</span><strong>{formatPrice(row.supply, lang)}</strong></div>
          <div className="pricing-recommended"><span>{fr ? "Vente conseillée" : "Recommended selling"}</span><strong>{formatPrice(row.recommended, lang)}</strong></div>
          <div className="pricing-products">
            {products.filter((p) => p.category === category && p.size === row.size).map((p) => <Link href={localizedPath(lang, `/products/${p.slug}`)} key={p.slug}>
              <Image src={p.image} alt={`Yola ${flavors[lang][p.flavor]} ${sizeLabels[p.size]}`} width={100} height={112} />
              <span>{flavors[lang][p.flavor]}</span>
            </Link>)}
          </div>
        </article>)}
      </section>)}
      <Link className="button button-primary" href={localizedPath(lang, "/contact")}>{fr ? "Demander un approvisionnement" : "Enquire about supply"}</Link>
    </div>
  </>;
}
