import FindProductsPage from "@/components/FindProductsPage";
import { seo } from "@/lib/seo";
import { getPage } from "@/lib/pages";
import { routeLanguage, type LocaleProps } from "@/lib/route-language";
export async function generateMetadata({ params }: LocaleProps) {
  const language = await routeLanguage(params);
  const copy = getPage(language, "find-our-products");
  return seo(language, "/find-our-products", copy.title, copy.description);
}
export default function Page() { return <FindProductsPage />; }
