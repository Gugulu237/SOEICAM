import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";
import JsonLd from "@/components/JsonLd";
import { products } from "@/lib/products";
import { getProductContent } from "@/lib/product-content";
import { seo, productSchema, breadcrumbSchema } from "@/lib/seo";
import { categoryContent, categoryPath } from "@/lib/pages";
import { routeLanguage } from "@/lib/route-language";
type Props = { params: Promise<{ lang: string; slug: string }> };
export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}
export const dynamicParams = false;
export async function generateMetadata({ params }: Props) {
  const lang = await routeLanguage(params);
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();
  const c = getProductContent(product, lang);
  return seo(
    lang,
    `/products/${slug}`,
    c.seoTitle,
    c.metaDescription,
    product.image,
  );
}
export default async function Page({ params }: Props) {
  const lang = await routeLanguage(params);
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();
  const c = getProductContent(product, lang);
  return (
    <>
      <JsonLd data={productSchema(product, lang)} />
      <JsonLd
        data={breadcrumbSchema(lang, [
          { name: lang === "fr" ? "Accueil" : "Home", path: "/" },
          {
            name: categoryContent[lang][product.category].title,
            path: categoryPath(product.category),
          },
          { name: c.name, path: `/products/${slug}` },
        ])}
      />
      <ProductDetail product={product} />
    </>
  );
}
