"use client";
import Image from "next/image";
import { Eye } from "lucide-react";
import Link from "./LocalizedLink";
import { useLanguage } from "./SiteShell";
import { getProductContent } from "@/lib/product-content";
import type { Product } from "@/lib/products";
export default function ProductCard({
  product,
  onQuickView,
}: {
  product: Product;
  onQuickView?: (product: Product) => void;
}) {
  const { language, copy } = useLanguage();
  const content = getProductContent(product, language);
  return (
    <article className="product-card">
      <Link
        href={`/products/${product.slug}`}
        className="product-card-main"
        aria-label={content.displayName}
      >
        <div className="product-card-media">
          <Image
            src={product.image}
            alt={content.alt}
            fill
            sizes="(max-width: 700px) 46vw, (max-width: 900px) 31vw, 280px"
          />
        </div>
        <div className="product-card-info">
          <h3>{content.displayName}</h3>
        </div>
      </Link>
      {onQuickView && (
        <button
          className="quick-view icon-button"
          type="button"
          aria-label={`${copy.common.viewImage}: ${content.displayName}`}
          title={copy.common.viewImage}
          onClick={() => onQuickView(product)}
        >
          <Eye size={18} />
        </button>
      )}
    </article>
  );
}
