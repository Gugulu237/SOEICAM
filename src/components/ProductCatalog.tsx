"use client";

import Image from "next/image";
import Link from "./LocalizedLink";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/components/SiteShell";
import {
  categories,
  flavorOrder,
  flavors,
  productTitle,
  products,
  sizeLabels,
  sizeOrder,
} from "@/lib/products";
import type { Category, Flavor, Product, Size } from "@/lib/products";
import ProductCard from "./ProductCard";
import { categoryKeys, categoryPath, categoryContent } from "@/lib/pages";

function QuickView({
  product,
  visibleProducts,
  onClose,
  onSelect,
}: {
  product: Product;
  visibleProducts: Product[];
  onClose: () => void;
  onSelect: (product: Product) => void;
}) {
  const { copy, language } = useLanguage();
  const closeButton = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLElement>(null);
  const index = visibleProducts.findIndex((item) => item.slug === product.slug);
  const previous =
    visibleProducts[
      (index - 1 + visibleProducts.length) % visibleProducts.length
    ];
  const next = visibleProducts[(index + 1) % visibleProducts.length];

  useEffect(() => {
    closeButton.current?.focus();
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Tab") {
        const items = dialog.current?.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled])",
        );
        if (items?.length) {
          const first = items[0],
            last = items[items.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
      }
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft" && visibleProducts.length > 1)
        onSelect(previous);
      if (event.key === "ArrowRight" && visibleProducts.length > 1)
        onSelect(next);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, onSelect, previous, next, visibleProducts.length]);

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        ref={dialog}
        className="quick-modal"
        role="dialog"
        aria-modal="true"
        aria-label={productTitle(product, language)}
      >
        <button
          ref={closeButton}
          className="modal-close icon-button"
          type="button"
          aria-label={copy.common.close}
          title={copy.common.close}
          onClick={onClose}
        >
          <X size={23} />
        </button>
        <div className="quick-modal-image">
          <Image
            src={product.image}
            alt={productTitle(product, language)}
            fill
            sizes="(max-width: 700px) 75vw, 35vw"
          />
        </div>
        <div className="quick-modal-copy">
          <span className="eyebrow green">
            YOLA / {sizeLabels[product.size]}
          </span>
          <h2>{flavors[language][product.flavor]}</h2>
          <p>{categories[language][product.category]}</p>
          <div className="quick-modal-actions">
            <Link
              className="button button-primary"
              href={`/products/${product.slug}`}
            >
              {copy.common.viewProduct}
            </Link>
            {visibleProducts.length > 1 && (
              <div className="modal-navigation">
                <button type="button" onClick={() => onSelect(previous)}>
                  {copy.common.prev}
                </button>
                <button type="button" onClick={() => onSelect(next)}>
                  {copy.common.next}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function Catalog() {
  const { copy, language } = useLanguage();
  const [category, setCategory] = useState<Category | "all">("all");
  const [usage, setUsage] = useState("all");
  const [size, setSize] = useState<Size | "all">("all");
  const [flavor, setFlavor] = useState<Flavor | "all">("all");
  const [query, setQuery] = useState("");
  const [quickProduct, setQuickProduct] = useState<Product | null>(null);
  const quickTrigger = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const initialCategory = new URLSearchParams(window.location.search).get(
      "category",
    );
    if (initialCategory === "stirred" || initialCategory === "drinkable")
      setCategory(initialCategory);
  }, []);

  const availableSizes = sizeOrder.filter((item) =>
    products.some(
      (product) =>
        (category === "all" || product.category === category) &&
        product.size === item,
    ),
  );
  const visible = useMemo(
    () =>
      products.filter((product) => {
        if (category !== "all" && product.category !== category) return false;
        if (size !== "all" && product.size !== size) return false;
        if (flavor !== "all" && product.flavor !== flavor) return false;
        if (
          usage === "individual" &&
          !["250g", "330g", "500g"].includes(product.size)
        )
          return false;
        if (usage === "family" && !["1kg", "2.5kg"].includes(product.size))
          return false;
        if (usage === "professional" && product.size !== "10kg") return false;
        const searchable =
          `${productTitle(product, language)} ${product.slug} ${sizeLabels[product.size]}`.toLocaleLowerCase();
        return searchable.includes(query.trim().toLocaleLowerCase());
      }),
    [category, size, flavor, query, usage, language],
  );

  const categoryOrder: Category[] =
    category === "all" ? ["stirred", "drinkable"] : [category];
  const groups = categoryOrder.flatMap((kind) =>
    sizeOrder
      .map((format) => ({
        kind,
        format,
        items: visible.filter(
          (product) => product.category === kind && product.size === format,
        ),
      }))
      .filter((group) => group.items.length),
  );

  function chooseCategory(next: Category | "all") {
    setCategory(next);
    if (
      size !== "all" &&
      !products.some(
        (product) =>
          (next === "all" || product.category === next) &&
          product.size === size,
      )
    )
      setSize("all");
  }

  function reset() {
    setCategory("all");
    setSize("all");
    setFlavor("all");
    setUsage("all");
    setQuery("");
  }

  return (
    <>
      <section className="page-hero catalog-hero">
        <div className="page-container catalog-hero-inner">
          <div>
            <span className="eyebrow green">{copy.products.eyebrow}</span>
            <h1>{copy.products.title}</h1>
            <p>{copy.products.intro}</p>
          </div>
          <Image
            src="/brand/logos/yola.png"
            alt="Yola"
            width={165}
            height={105}
          />
        </div>
      </section>
      <section
        className="catalog-section page-container"
        aria-label={copy.products.title}
      >
        <nav
          className="category-links"
          aria-label={language === "fr" ? "Gammes YOLA" : "YOLA ranges"}
        >
          {categoryKeys.map((key) => (
            <Link key={key} href={categoryPath(key)}>
              {categoryContent[language][key].title}
            </Link>
          ))}
        </nav>
        <div className="catalog-controls">
          <div
            className="catalog-tabs"
            role="group"
            aria-label={copy.products.title}
          >
            {(["all", "stirred", "drinkable"] as const).map((item) => (
              <button
                type="button"
                key={item}
                className={category === item ? "selected" : ""}
                aria-pressed={category === item}
                onClick={() => chooseCategory(item)}
              >
                {item === "all" ? copy.products.all : copy.products[item]}
              </button>
            ))}
          </div>
          <label className="catalog-search">
            <Search size={19} />
            <span className="sr-only">{copy.products.search}</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={copy.products.searchPlaceholder}
            />
          </label>
          <label className="catalog-select">
            <span>{copy.products.size}</span>
            <select
              value={size}
              onChange={(event) => setSize(event.target.value as Size | "all")}
            >
              <option value="all">{copy.products.allSizes}</option>
              {availableSizes.map((item) => (
                <option key={item} value={item}>
                  {sizeLabels[item]}
                </option>
              ))}
            </select>
          </label>
          <label className="catalog-select">
            <span>{copy.products.flavor}</span>
            <select
              value={flavor}
              onChange={(event) =>
                setFlavor(event.target.value as Flavor | "all")
              }
            >
              <option value="all">{copy.products.allFlavors}</option>
              {flavorOrder.map((item) => (
                <option key={item} value={item}>
                  {flavors[language][item]}
                </option>
              ))}
            </select>
          </label>
          <label className="catalog-select">
            <span>{language === "fr" ? "Usage" : "Occasion"}</span>
            <select value={usage} onChange={(e) => setUsage(e.target.value)}>
              <option value="all">
                {language === "fr" ? "Tous les usages" : "All occasions"}
              </option>
              <option value="individual">
                {language === "fr" ? "Petits formats" : "Smaller formats"}
              </option>
              <option value="family">
                {language === "fr" ? "À partager" : "Sharing"}
              </option>
              <option value="professional">
                {language === "fr" ? "Professionnel" : "Professional"}
              </option>
            </select>
          </label>
        </div>
        <div className="catalog-summary" aria-live="polite">
          <span>
            <SlidersHorizontal size={16} /> {visible.length}{" "}
            {visible.length === 1
              ? copy.products.countSingular
              : copy.products.count}
          </span>
          {(category !== "all" ||
            size !== "all" ||
            flavor !== "all" ||
            query ||
            usage !== "all") && (
            <button type="button" onClick={reset}>
              {copy.products.reset}
              <X size={15} />
            </button>
          )}
        </div>
        {groups.length ? (
          groups.map((group) => (
            <div
              className="product-group"
              key={`${group.kind}-${group.format}`}
            >
              <div className="group-heading">
                <h2>
                  {categories[language][group.kind]}{" "}
                  <span>{sizeLabels[group.format]}</span>
                </h2>
                <span>{group.items.length}</span>
              </div>
              <div className="product-grid">
                {group.items.map((product) => (
                  <ProductCard
                    key={product.slug}
                    product={product}
                    onQuickView={(p) => {
                      quickTrigger.current =
                        document.activeElement as HTMLElement;
                      setQuickProduct(p);
                    }}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="empty-results">
            <p>{copy.products.empty}</p>
            <button
              className="button button-outline"
              type="button"
              onClick={reset}
            >
              {copy.products.reset}
            </button>
          </div>
        )}
      </section>
      {quickProduct && (
        <QuickView
          product={quickProduct}
          visibleProducts={visible}
          onClose={() => {
            setQuickProduct(null);
            quickTrigger.current?.focus();
          }}
          onSelect={setQuickProduct}
        />
      )}
    </>
  );
}

export default function ProductCatalog() {
  return <Catalog />;
}
