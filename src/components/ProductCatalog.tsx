"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, ChevronLeft, ChevronRight, Eye, Search, SlidersHorizontal, X } from "lucide-react";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/components/SiteShell";
import { categories, flavorOrder, flavors, productTitle, products, sizeLabels, sizeOrder } from "@/lib/products";
import type { Category, Flavor, Product, Size } from "@/lib/products";

function ProductTile({ product, onQuickView }: { product: Product; onQuickView: (product: Product) => void }) {
  const { copy, language } = useLanguage();
  return <article className="product-card">
    <Link href={`/products/${product.slug}`} className="product-card-main" aria-label={productTitle(product, language)}>
      <div className="product-card-media"><Image src={product.image} alt={productTitle(product, language)} fill sizes="(max-width: 600px) 48vw, (max-width: 900px) 31vw, 22vw" /></div>
      <div className="product-card-info"><span className="product-card-type">{categories[language][product.category]}</span><h3>{flavors[language][product.flavor]}</h3><span className="product-card-bottom"><span>{sizeLabels[product.size]}</span><ArrowRight size={18} /></span></div>
    </Link>
    <button className="quick-view icon-button" type="button" aria-label={`${copy.common.viewImage}: ${productTitle(product, language)}`} title={copy.common.viewImage} onClick={() => onQuickView(product)}><Eye size={18} /></button>
  </article>;
}

function QuickView({ product, visibleProducts, onClose, onSelect }: { product: Product; visibleProducts: Product[]; onClose: () => void; onSelect: (product: Product) => void }) {
  const { copy, language } = useLanguage();
  const closeButton = useRef<HTMLButtonElement>(null);
  const index = visibleProducts.findIndex((item) => item.slug === product.slug);
  const previous = visibleProducts[(index - 1 + visibleProducts.length) % visibleProducts.length];
  const next = visibleProducts[(index + 1) % visibleProducts.length];

  useEffect(() => {
    closeButton.current?.focus();
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft" && visibleProducts.length > 1) onSelect(previous);
      if (event.key === "ArrowRight" && visibleProducts.length > 1) onSelect(next);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = oldOverflow; window.removeEventListener("keydown", onKeyDown); };
  }, [onClose, onSelect, previous, next, visibleProducts.length]);

  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="quick-modal" role="dialog" aria-modal="true" aria-label={productTitle(product, language)}>
      <button ref={closeButton} className="modal-close icon-button" type="button" aria-label={copy.common.close} title={copy.common.close} onClick={onClose}><X size={23} /></button>
      <div className="quick-modal-image"><Image src={product.image} alt={productTitle(product, language)} fill sizes="(max-width: 700px) 75vw, 35vw" /></div>
      <div className="quick-modal-copy"><span className="eyebrow green">YOLA / {sizeLabels[product.size]}</span><h2>{flavors[language][product.flavor]}</h2><p>{categories[language][product.category]}</p><div className="quick-modal-actions"><Link className="button button-primary" href={`/products/${product.slug}`}>{copy.common.viewProduct}<ArrowRight size={17} /></Link>{visibleProducts.length > 1 && <div className="modal-arrows"><button className="icon-button" type="button" aria-label={copy.common.prev} onClick={() => onSelect(previous)}><ChevronLeft size={22} /></button><button className="icon-button" type="button" aria-label={copy.common.next} onClick={() => onSelect(next)}><ChevronRight size={22} /></button></div>}</div></div>
    </section>
  </div>;
}

function Catalog() {
  const { copy, language } = useLanguage();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");
  const [category, setCategory] = useState<Category | "all">(initialCategory === "stirred" || initialCategory === "drinkable" ? initialCategory : "all");
  const [size, setSize] = useState<Size | "all">("all");
  const [flavor, setFlavor] = useState<Flavor | "all">("all");
  const [query, setQuery] = useState("");
  const [quickProduct, setQuickProduct] = useState<Product | null>(null);

  const availableSizes = sizeOrder.filter((item) => products.some((product) => (category === "all" || product.category === category) && product.size === item));
  const visible = useMemo(() => products.filter((product) => {
    if (category !== "all" && product.category !== category) return false;
    if (size !== "all" && product.size !== size) return false;
    if (flavor !== "all" && product.flavor !== flavor) return false;
    const searchable = `${productTitle(product, language)} ${product.slug} ${sizeLabels[product.size]}`.toLocaleLowerCase();
    return searchable.includes(query.trim().toLocaleLowerCase());
  }), [category, size, flavor, query, language]);

  const categoryOrder: Category[] = category === "all" ? ["stirred", "drinkable"] : [category];
  const groups = categoryOrder.flatMap((kind) => sizeOrder.map((format) => ({ kind, format, items: visible.filter((product) => product.category === kind && product.size === format) })).filter((group) => group.items.length));

  function chooseCategory(next: Category | "all") {
    setCategory(next);
    if (size !== "all" && !products.some((product) => (next === "all" || product.category === next) && product.size === size)) setSize("all");
  }

  function reset() { setCategory("all"); setSize("all"); setFlavor("all"); setQuery(""); }

  return <>
    <section className="page-hero catalog-hero"><div className="page-container catalog-hero-inner"><div><span className="eyebrow green">{copy.products.eyebrow}</span><h1>{copy.products.title}</h1><p>{copy.products.intro}</p></div><Image src="/brand/logos/yola.png" alt="Yola" width={165} height={105} /></div></section>
    <section className="catalog-section page-container" aria-label={copy.products.title}>
      <div className="catalog-controls">
        <div className="catalog-tabs" role="group" aria-label={copy.products.title}>
          {(["all", "stirred", "drinkable"] as const).map((item) => <button type="button" key={item} className={category === item ? "selected" : ""} aria-pressed={category === item} onClick={() => chooseCategory(item)}>{item === "all" ? copy.products.all : copy.products[item]}</button>)}
        </div>
        <label className="catalog-search"><Search size={19} /><span className="sr-only">{copy.products.search}</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.products.searchPlaceholder} /></label>
        <label className="catalog-select"><span>{copy.products.size}</span><select value={size} onChange={(event) => setSize(event.target.value as Size | "all")}><option value="all">{copy.products.allSizes}</option>{availableSizes.map((item) => <option key={item} value={item}>{sizeLabels[item]}</option>)}</select></label>
        <label className="catalog-select"><span>{copy.products.flavor}</span><select value={flavor} onChange={(event) => setFlavor(event.target.value as Flavor | "all")}><option value="all">{copy.products.allFlavors}</option>{flavorOrder.map((item) => <option key={item} value={item}>{flavors[language][item]}</option>)}</select></label>
      </div>
      <div className="catalog-summary"><span><SlidersHorizontal size={16} /> {visible.length} {visible.length === 1 ? copy.products.countSingular : copy.products.count}</span>{(category !== "all" || size !== "all" || flavor !== "all" || query) && <button type="button" onClick={reset}>{copy.products.reset}<X size={15} /></button>}</div>
      {groups.length ? groups.map((group) => <div className="product-group" key={`${group.kind}-${group.format}`}><div className="group-heading"><h2>{categories[language][group.kind]} <span>{sizeLabels[group.format]}</span></h2><span>{group.items.length}</span></div><div className="product-grid">{group.items.map((product) => <ProductTile key={product.slug} product={product} onQuickView={setQuickProduct} />)}</div></div>) : <div className="empty-results"><p>{copy.products.empty}</p><button className="button button-outline" type="button" onClick={reset}>{copy.products.reset}</button></div>}
    </section>
    {quickProduct && <QuickView product={quickProduct} visibleProducts={visible} onClose={() => setQuickProduct(null)} onSelect={setQuickProduct} />}
  </>;
}

export default function ProductCatalog() { return <Suspense fallback={<div className="catalog-loading" />}><Catalog /></Suspense>; }
