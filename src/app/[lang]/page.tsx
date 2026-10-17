import HomePage from "@/components/HomePage";
import { seo } from "@/lib/seo";
import { getPage } from "@/lib/pages";
import { routeLanguage, type LocaleProps } from "@/lib/route-language";
export async function generateMetadata({ params }: LocaleProps) {
  const lang = await routeLanguage(params);
  const c = getPage(lang, "home");
  return seo(lang, "/", c.title, c.description);
}
export default function Page() {
  return <HomePage />;
}
