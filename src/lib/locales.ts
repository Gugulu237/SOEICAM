import type { Language } from "./products";

export const languages: Language[] = ["fr", "en"];
export const defaultLanguage: Language = "fr";
export function isLanguage(value: string): value is Language {
  return value === "fr" || value === "en";
}
export function localizedPath(language: Language, path = "/") {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  const unprefixed = path.replace(/^\/(en|fr)(?=\/|\?|$)/, "") || "/";
  return `/${language}${unprefixed === "/" ? "" : unprefixed}`;
}
