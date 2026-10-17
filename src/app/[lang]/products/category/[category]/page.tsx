import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import JsonLd from "@/components/JsonLd";
import {
  categoryKeys,
  categoryContent,
  categoryPath,
  inCategory,
} from "@/lib/pages";
import { products, sizeOrder, sizeLabels } from "@/lib/products";
import { routeLanguage } from "@/lib/route-language";
import { localizedPath } from "@/lib/locales";
import { seo, breadcrumbSchema, productSchema } from "@/lib/seo";
type Props = { params: Promise<{ lang: string; category: string }> };
export function generateStaticParams() {
  return categoryKeys.map((category) => ({ category }));
}
export const dynamicParams = false;
async function content(params: Props["params"]) {
  const lang = await routeLanguage(params);
  const { category } = await params;
  const key = categoryKeys.find((k) => k === category);
  if (!key) notFound();
  return { lang, key, c: categoryContent[lang][key] };
}
export async function generateMetadata({ params }: Props) {
  const { lang, key, c } = await content(params);
  return seo(
    lang,
    categoryPath(key),
    `${c.title} | SOEICAM`,
    c.short +
      (lang === "fr"
        ? " Découvrez les parfums et les conditionnements, puis contactez SOEICAM pour votre demande."
        : " Explore flavours and packs, then contact SOEICAM for product information."),
  );
}
export default async function Page({ params }: Props) {
  const { lang, key, c } = await content(params);
  const fr = lang === "fr";
  const selected = products.filter((p) => inCategory(p, key));
  const groups = sizeOrder
    .map((size) => ({ size, items: selected.filter((p) => p.size === size) }))
    .filter((g) => g.items.length);
  return (
    <>
      <JsonLd
        data={breadcrumbSchema(lang, [
          { name: fr ? "Accueil" : "Home", path: "/" },
          { name: fr ? "Produits YOLA" : "YOLA products", path: "/products" },
          { name: c.title, path: categoryPath(key) },
        ])}
      />
      {groups
        .filter((g) => g.items.length > 1)
        .map((g) => (
          <JsonLd
            key={g.size}
            data={{
              "@context": "https://schema.org",
              "@type": "ProductGroup",
              name: `${key === "drinkable" ? (fr ? "Yaourt à boire" : "Drinking yogurt") : fr ? "Yaourt brassé" : "Stirred yogurt"} YOLA ${sizeLabels[g.size]}`,
              brand: { "@type": "Brand", name: "YOLA" },
              variesBy: "flavour",
              hasVariant: g.items.map((p) => productSchema(p, lang)),
            }}
          />
        ))}
      <section className="page-hero catalog-hero">
        <div className="page-container category-hero">
          <div>
            <nav
              className="breadcrumb"
              aria-label={fr ? "Fil d'Ariane" : "Breadcrumb"}
            >
              <Link href={localizedPath(lang, "/products")}>
                {fr ? "Tous les produits" : "All products"}
              </Link>
            </nav>
            <h1>{c.title}</h1>
            <p>{c.short}</p>
          </div>
          <div className="category-hero-image">
            <Image
              src={selected[0].image}
              alt={c.title}
              fill
              priority
              sizes="(max-width: 700px) 180px, 280px"
            />
          </div>
        </div>
      </section>
      <section className="category-intro page-container">
        {c.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
        <nav
          className="category-links"
          aria-label={fr ? "Autres gammes" : "Other ranges"}
        >
          {categoryKeys
            .filter((k) => k !== key)
            .map((k) => (
              <Link key={k} href={localizedPath(lang, categoryPath(k))}>
                {categoryContent[lang][k].title}
              </Link>
            ))}
        </nav>
      </section>
      <section className="page-container category-products">
        {groups.map((g) => (
          <div className="product-group" key={g.size}>
            <div className="group-heading">
              <h2>{sizeLabels[g.size]}</h2>
            </div>
            <div className="product-grid">
              {g.items.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        ))}
      </section>
      <section className="contact-band">
        <div className="page-container contact-band-inner">
          <div>
            <h2>{fr ? "Parlons de vos besoins" : "Tell us what you need"}</h2>
            <p>
              {fr
                ? "Disponibilité, choix des références et demandes commerciales auprès de SOEICAM."
                : "Discuss availability, product selection and commercial enquiries with SOEICAM."}
            </p>
          </div>
          <Link
            className="button button-light"
            href={localizedPath(
              lang,
              key === "professional"
                ? "/contact?product=stirred-nature-10kg&type=foodservice"
                : "/contact",
            )}
          >
            {fr ? "Nous contacter" : "Contact us"}
          </Link>
        </div>
      </section>
    </>
  );
}
