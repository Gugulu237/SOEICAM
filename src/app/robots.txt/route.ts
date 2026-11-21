import { company } from "@/lib/company";

export const dynamic = "force-static";
export function GET() {
  return new Response(`User-agent: *\nContent-Signal: search=yes, ai-train=no\nAllow: /\nDisallow: /api/\n\nSitemap: ${company.site}/sitemap.xml\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=300", "X-Content-Type-Options": "nosniff" },
  });
}
