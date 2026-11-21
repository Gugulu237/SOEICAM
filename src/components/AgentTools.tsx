"use client";

import { useEffect } from "react";
import { registerPublicBrowserTools, type BrowserModelContext } from "@/lib/webmcp";

export default function AgentTools({ language }: { language: "fr" | "en" }) {
  useEffect(() => {
    const context = (document as Document & { modelContext?: BrowserModelContext }).modelContext
      ?? (navigator as Navigator & { modelContext?: BrowserModelContext }).modelContext;
    if (typeof context?.registerTool !== "function") return;
    return registerPublicBrowserTools(context, language);
  }, [language]);
  return null;
}
