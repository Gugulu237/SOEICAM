import HomePage from "@/components/HomePage";
import { seo, homeSchema } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import { getPage } from "@/lib/pages";
import { routeLanguage, type LocaleProps } from "@/lib/route-language";
export async function generateMetadata({ params }: LocaleProps) {
  const lang = await routeLanguage(params);
  const c = getPage(lang, "home");
  return seo(lang, "/", c.title, c.description);
}
export default async function Page({ params }: LocaleProps) {
  const lang = await routeLanguage(params);
  const c = getPage(lang, "home");
  return <><JsonLd data={homeSchema(lang, c.h1, c.description)} /><HomePage /></>;
}
