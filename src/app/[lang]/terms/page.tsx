import Link from "next/link";
import { termsSections } from "@/lib/terms";
import { getPage } from "@/lib/pages";
import { localizedPath } from "@/lib/locales";
import { seo } from "@/lib/seo";
import { routeLanguage, type LocaleProps } from "@/lib/route-language";

export async function generateMetadata({ params }: LocaleProps) {
  const lang = await routeLanguage(params);
  const copy = getPage(lang, "terms");
  return seo(lang, "/terms", copy.title, copy.description);
}

export default async function Page({ params }: LocaleProps) {
  const lang = await routeLanguage(params);
  return <>
    <section className="page-hero"><div className="page-container"><h1>{getPage(lang, "terms").h1}</h1></div></section>
    <div className="editorial page-container">
      {termsSections[lang].map(([title, body]) => <section key={title}><h2>{title}</h2><p>{body}</p></section>)}
      <Link className="text-link" href={localizedPath(lang, "/privacy")}>{lang === "fr" ? "Confidentialité" : "Privacy"}</Link>
    </div>
  </>;
}
