import ContactPage from "@/components/ContactPage";
import { seo } from "@/lib/seo";
import { getPage } from "@/lib/pages";
import { routeLanguage, type LocaleProps } from "@/lib/route-language";
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: LocaleProps) {
  const lang = await routeLanguage(params);
  const c = getPage(lang, "contact");
  return seo(lang, "/contact", c.title, c.description);
}
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  return (
    <ContactPage
      emailEnabled={!!(process.env.SMTP_USER && process.env.SMTP_PASSWORD)}
      initialProduct={typeof query.product === "string" ? query.product : ""}
      initialType={typeof query.type === "string" ? query.type : ""}
    />
  );
}
