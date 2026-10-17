"use client";
import Link from "next/link";
import type { ComponentProps } from "react";
import { useLanguage } from "./SiteShell";
import { localizedPath } from "@/lib/locales";
export default function LocalizedLink({
  href,
  ...props
}: ComponentProps<typeof Link>) {
  const { language } = useLanguage();
  return (
    <Link
      {...props}
      href={typeof href === "string" ? localizedPath(language, href) : href}
    />
  );
}
