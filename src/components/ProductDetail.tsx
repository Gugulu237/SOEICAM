"use client";
import Image from "next/image";
import { MessageCircle } from "lucide-react";
import Link from "./LocalizedLink";
import ProductCard from "./ProductCard";
import { useLanguage } from "./SiteShell";
import {
  categories,
  flavors,
  products,
  sizeLabels,
  type Product,
} from "@/lib/products";
import { getProductContent } from "@/lib/product-content";
import { categoryPath } from "@/lib/pages";
import { whatsappUrl } from "@/lib/company";
import { track } from "@/lib/analytics";
export default function ProductDetail({ product }: { product: Product }) {
  const { copy, language } = useLanguage();
  const c = getProductContent(product, language);
  const fr = language === "fr";
  const sameFormat = products.filter(
    (p) =>
      p.slug !== product.slug &&
      p.category === product.category &&
      p.size === product.size,
  );
  const otherSizes = products.filter(
    (p) =>
      p.slug !== product.slug &&
      p.category === product.category &&
      p.flavor === product.flavor &&
      p.size !== product.size,
  );
  const enquiry = fr
    ? `Bonjour SOEICAM, je souhaite obtenir des informations sur ${c.name}. Merci de me communiquer les disponibilités et les modalités de commande.`
    : `Hello SOEICAM, I would like information about ${c.name}. Please share availability and ordering details.`;
  const event = (channel: string) =>
    track(channel === "whatsapp" ? "whatsapp_click" : "product_enquiry_click", {
      product_id: product.slug,
      language,
      channel,
    });
  return (
    <>
      <section className="product-detail page-container">
        <nav
          className="breadcrumb"
          aria-label={fr ? "Fil d'Ariane" : "Breadcrumb"}
        >
          <Link href="/products">{copy.nav.products}</Link>
          <span>/</span>
          <Link href={categoryPath(product.category)}>
            {categories[language][product.category]}
          </Link>
          <span>/</span>
          <span>
            {flavors[language][product.flavor]} {sizeLabels[product.size]}
          </span>
        </nav>
        <div className="product-detail-layout">
          <div className="detail-media">
            <Image
              src={product.image}
              alt={c.alt}
              fill
              priority
              sizes="(max-width: 700px) 90vw, 560px"
            />
          </div>
          <div className="detail-copy">
            <Image
              src="/brand/logos/yola.png"
              alt="YOLA"
              width={118}
              height={68}
            />
            <h1>{c.displayName}</h1>
            <dl className="detail-specs">
              <div>
                <dt>{copy.products.type}</dt>
                <dd>{categories[language][product.category]}</dd>
              </div>
              <div>
                <dt>{copy.products.flavor}</dt>
                <dd>{flavors[language][product.flavor]}</dd>
              </div>
              <div>
                <dt>{copy.products.format}</dt>
                <dd>{sizeLabels[product.size]}</dd>
              </div>
            </dl>
            <div className="detail-actions">
              <Link
                onClick={() => event("form")}
                className="button button-primary"
                href={`/contact?product=${product.slug}${product.size === "10kg" ? "&type=foodservice" : ""}`}
              >
                {product.size === "10kg"
                  ? fr
                    ? "Demander des informations sur YOLA 10 kg"
                    : "Enquire about YOLA 10 kg packs"
                  : copy.products.ask}
              </Link>
              <a
                onClick={() => event("whatsapp")}
                className="button button-outline"
                href={whatsappUrl(enquiry)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={18} /> WhatsApp
              </a>
            </div>
            <p className="detail-note">{copy.products.availability}</p>
          </div>
        </div>
        <div className="product-story">
          <div>
            <h2 className="brand-script">
              {fr ? "Le plaisir de ce format" : "Discover this format"}
            </h2>
            {c.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <aside>
            <h2>{fr ? "Goût et texture" : "Taste and texture"}</h2>
            <p>{c.taste}</p>
            <h2>{fr ? "À savourer" : "Enjoy it"}</h2>
            <ul>
              {c.occasions.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <p className="detail-note">
              {fr
                ? "Suivez les indications de conservation et les informations figurant sur l'emballage."
                : "Follow the storage instructions and product information on the packaging."}
            </p>
          </aside>
        </div>
      </section>
      {[
        {
          items: sameFormat,
          title: fr
            ? "Les autres parfums de ce format"
            : "Other flavours in this format",
        },
        {
          items: otherSizes,
          title: fr
            ? "Ce parfum, dans d'autres formats"
            : "This flavour in other sizes",
        },
      ]
        .filter((group) => group.items.length)
        .map((group) => (
          <section className="related-section" key={group.title}>
            <div className="page-container">
              <div className="section-heading">
                <h2 className="brand-script">{group.title}</h2>
                <Link className="text-link" href="/products">
                  {copy.common.viewAll}
                </Link>
              </div>
              <div className="product-grid">
                {group.items.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
            </div>
          </section>
        ))}
    </>
  );
}
