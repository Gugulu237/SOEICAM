import type { Metadata } from "next";
import ProductCatalog from "@/components/ProductCatalog";

export const metadata: Metadata = { title: "Yola Products", description: "Browse Yola drinkable and stirred yogurts by size and flavor." };
export default function Page() { return <ProductCatalog />; }
