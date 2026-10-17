import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import SiteShell from "@/components/SiteShell";
import JsonLd from "@/components/JsonLd";
import { isLanguage, languages } from "@/lib/locales";
import { organization } from "@/lib/seo";
import { company } from "@/lib/company";
import "../globals.css";

const yolaDisplay = localFont({
  src: "../../../public/fonts/Lobster-Regular.ttf",
  variable: "--font-yola-display",
  weight: "400",
  style: "normal",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(company.site),
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
};
export function generateStaticParams() {
  return languages.map((lang) => ({ lang }));
}
export const dynamicParams = false;
export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  return (
    <html lang={`${lang}-CM`} className={yolaDisplay.variable}>
      <body>
        <a className="skip-link" href="#main-content">
          {lang === "fr" ? "Aller au contenu" : "Skip to content"}
        </a>
        <JsonLd data={organization} />
        <SiteShell language={lang}>{children}</SiteShell>
      </body>
    </html>
  );
}
