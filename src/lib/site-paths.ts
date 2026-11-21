import { products } from "./products";
import { pageContent, pagePath, categoryKeys, categoryPath, type PageKey } from "./pages";
import { guideSlugs } from "./guides";

export function publicPaths() {
  return [
    ...Object.keys(pageContent.en).map((key) => pagePath(key as PageKey)),
    ...categoryKeys.map(categoryPath),
    ...products.map((product) => `/products/${product.slug}`),
    ...guideSlugs.map((slug) => `/guides/${slug}`),
  ];
}

export function publicPage(pathname: string) {
  const cleaned = pathname.replace(/\/$/, "") || "/";
  const language = cleaned === "/en" || cleaned.startsWith("/en/") ? "en" : "fr";
  const path = cleaned.replace(/^\/(fr|en)(?=\/|$)/, "") || "/";
  return publicPaths().includes(path) ? { language: language as "fr" | "en", path } : null;
}

export function markdownPath(language: "fr" | "en", path = "/") {
  return `/markdown/${language}${path === "/" ? "" : path}`;
}
