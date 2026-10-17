import type { Metadata } from "next";
import { company } from "./company";
import { localizedPath } from "./locales";
import { getProductContent } from "./product-content";
import type { Language, Product } from "./products";

export function absolute(path: string) {
  return new URL(path, company.site).href;
}
export function seo(
  language: Language,
  path: string,
  title: string,
  description: string,
  image = "/brand/range-hero.png",
): Metadata {
  const url = absolute(localizedPath(language, path));
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
      languages: {
        "fr-CM": absolute(localizedPath("fr", path)),
        "en-CM": absolute(localizedPath("en", path)),
        "x-default": absolute(localizedPath("fr", path)),
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: company.name,
      type: "website",
      locale: language === "fr" ? "fr_CM" : "en_CM",
      alternateLocale: language === "fr" ? "en_CM" : "fr_CM",
      images: [{ url: absolute(image), alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absolute(image)],
    },
  };
}
export const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${company.site}/#organization`,
  name: company.name,
  legalName: company.legalName,
  url: company.site,
  logo: absolute("/brand/logos/soeicam.png"),
  email: company.email,
  telephone: company.telephone,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rue Sion 1, Odza",
    addressLocality: "Yaoundé",
    addressCountry: "CM",
  },
  brand: { "@type": "Brand", name: "YOLA" },
};
export function productSchema(product: Product, language: Language) {
  const copy = getProductContent(product, language);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${absolute(localizedPath(language, `/products/${product.slug}`))}#product`,
    name: copy.name,
    description: copy.short,
    image: absolute(product.image),
    url: absolute(localizedPath(language, `/products/${product.slug}`)),
    brand: { "@type": "Brand", name: "YOLA" },
    manufacturer: { "@id": `${company.site}/#organization` },
    size: product.size,
    category:
      product.category === "stirred"
        ? language === "fr"
          ? "Yaourt brassé"
          : "Stirred yogurt"
        : language === "fr"
          ? "Yaourt à boire"
          : "Drinking yogurt",
  };
}
export function breadcrumbSchema(
  language: Language,
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absolute(localizedPath(language, item.path)),
    })),
  };
}
