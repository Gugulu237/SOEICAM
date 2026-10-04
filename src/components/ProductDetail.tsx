"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, MessageCircle } from "lucide-react";
import { useLanguage } from "@/components/SiteShell";
import { categories, flavors, productTitle, products, sizeLabels } from "@/lib/products";
import type { Product } from "@/lib/products";

export default function ProductDetail({ product }: { product: Product }) {
  const { copy, language } = useLanguage();
  const sameFormat = products.filter((item) => item.slug !== product.slug && item.category === product.category && item.size === product.size);
  const related = (sameFormat.length ? sameFormat : products.filter((item) => item.slug !== product.slug && item.category === product.category)).slice(0, 4);
  const enquiry = language === "fr" ? `Bonjour SOEICAM, je souhaite avoir des renseignements sur ${productTitle(product, "fr")}.` : `Hello SOEICAM, I would like information about ${productTitle(product, "en")}.`;

  return <>
    <section className="product-detail page-container">
      <nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/products"><ArrowLeft size={16} /> {copy.common.back}</Link><span>/</span><span>{flavors[language][product.flavor]}</span></nav>
      <div className="product-detail-layout">
        <div className="detail-media"><Image src={product.image} alt={productTitle(product, language)} fill priority sizes="(max-width: 800px) 90vw, 46vw" /></div>
        <div className="detail-copy"><Image src="/brand/logos/yola.png" alt="Yola" width={118} height={68} /><span className="eyebrow green">{categories[language][product.category]}</span><h1>{flavors[language][product.flavor]}</h1><p className="detail-format">{sizeLabels[product.size]}</p><p className="detail-intro">{copy.products.availability}</p>
          <dl className="detail-specs"><div><dt>{copy.products.type}</dt><dd>{categories[language][product.category]}</dd></div><div><dt>{copy.products.flavor}</dt><dd>{flavors[language][product.flavor]}</dd></div><div><dt>{copy.products.format}</dt><dd>{sizeLabels[product.size]}</dd></div></dl>
          <div className="detail-actions"><a className="button button-primary" href={`https://wa.me/237681218946?text=${encodeURIComponent(enquiry)}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} /> {copy.products.ask}</a><Link className="button button-outline" href="/contact">{copy.common.contact}<ArrowUpRight size={17} /></Link></div>
          <p className="detail-note">{copy.products.packNote}</p>
        </div>
      </div>
    </section>
    <section className="related-section"><div className="page-container"><div className="section-heading"><h2 className="brand-script">{copy.products.related}</h2><Link className="text-link dark" href="/products">{copy.common.viewAll}<ArrowRight size={17} /></Link></div><div className="product-grid related-grid">{related.map((item) => <Link href={`/products/${item.slug}`} key={item.slug} className="product-card"><div className="product-card-media"><Image src={item.image} alt={productTitle(item, language)} fill sizes="(max-width: 640px) 45vw, 22vw" /></div><div className="product-card-info"><span className="product-card-type">{categories[language][item.category]}</span><h3>{flavors[language][item.flavor]}</h3><span className="product-card-bottom"><span>{sizeLabels[item.size]}</span><ArrowRight size={17} /></span></div></Link>)}</div></div></section>
  </>;
}
