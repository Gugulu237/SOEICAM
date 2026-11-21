import { isLanguage } from "@/lib/locales";
import { pageMarkdown, resourceLinks } from "@/lib/markdown";

export async function GET(request: Request, context: { params: Promise<{ lang: string; path?: string[] }> }) {
  const { lang, path = [] } = await context.params;
  if (!isLanguage(lang)) return new Response("Not found\n", { status: 404 });
  const publicPath = `/${path.join("/")}`;
  const body = pageMarkdown(lang, publicPath);
  if (!body) return new Response("Not found\n", { status: 404 });
  const negotiated = request.headers.get("x-soeicam-markdown-negotiated") === "1";
  return new Response(body, { headers: {
    "Content-Type": "text/markdown; charset=utf-8",
    "Content-Language": `${lang}-CM`,
    "X-Content-Type-Options": "nosniff",
    "Cache-Control": negotiated ? "private, no-store" : "public, max-age=300",
    "Vary": "Accept",
    "Link": resourceLinks(lang, publicPath),
  } });
}
