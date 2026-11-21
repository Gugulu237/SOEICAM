import { company } from "@/lib/company";
import { privacySections } from "@/lib/privacy-copy";
import { seo } from "@/lib/seo";
import { getPage } from "@/lib/pages";
import { routeLanguage, type LocaleProps } from "@/lib/route-language";
export async function generateMetadata({ params }: LocaleProps) {
  const lang = await routeLanguage(params);
  const c = getPage(lang, "privacy");
  return seo(lang, "/privacy", c.title, c.description);
}
export default async function Page({ params }: LocaleProps) {
  const lang = await routeLanguage(params);
  const sections = privacySections[lang];
  return (
    <>
      <section className="page-hero">
        <div className="page-container">
          <h1>{getPage(lang, "privacy").h1}</h1>
        </div>
      </section>
      <div className="editorial page-container">
        {sections.map(([title, text]) => (
          <section key={title}>
            <h2>{title}</h2>
            <p>{text}</p>
          </section>
        ))}
        <p>
          SOEICAM SARL
          <br />
          {company.address}
          <br />
          <a href={`mailto:${company.email}`}>{company.email}</a>
          <br />
          <a href={`tel:${company.telephone}`}>{company.phone}</a>
        </p>
      </div>
    </>
  );
}
