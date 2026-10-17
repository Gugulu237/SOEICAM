import type { MetadataRoute } from "next";
import { languages, localizedPath } from "@/lib/locales";
import { products } from "@/lib/products";
import {
  categoryKeys,
  categoryPath,
  pageContent,
  pagePath,
  type PageKey,
} from "@/lib/pages";
import { guideSlugs } from "@/lib/guides";
import { absolute } from "@/lib/seo";
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...Object.keys(pageContent.en).map((k) => pagePath(k as PageKey)),
    ...categoryKeys.map(categoryPath),
    ...products.map((p) => `/products/${p.slug}`),
    ...guideSlugs.map((s) => `/guides/${s}`),
  ];
  return languages.flatMap((lang) =>
    paths.map((path) => ({
      url: absolute(localizedPath(lang, path)),
      alternates: {
        languages: {
          "fr-CM": absolute(localizedPath("fr", path)),
          "en-CM": absolute(localizedPath("en", path)),
        },
      },
    })),
  );
}
