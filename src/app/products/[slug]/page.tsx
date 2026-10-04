import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";
import { products, productTitle } from "@/lib/products";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return products.map((product) => ({ slug: product.slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  return { title: product ? productTitle(product, "en") : "Product" };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
