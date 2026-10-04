import type { Metadata } from "next";
import type { ReactNode } from "react";
import SiteShell from "@/components/SiteShell";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "SOEICAM | Food Processing in Cameroon", template: "%s | SOEICAM" },
  description: "SOEICAM is a Cameroonian food processing company and the producer of Yola yogurt. Explore the range, learn about the company, and get in touch.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body><a className="skip-link" href="#main-content">Skip to content</a><SiteShell>{children}</SiteShell></body></html>;
}
