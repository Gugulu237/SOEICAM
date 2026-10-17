import { notFound } from "next/navigation";
import { isLanguage } from "./locales";
export type LocaleProps = { params: Promise<{ lang: string }> };
export async function routeLanguage(params: Promise<{ lang: string }>) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  return lang;
}
