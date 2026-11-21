import { NextRequest, NextResponse } from "next/server";
import { wantsMarkdown } from "./lib/negotiation";
import { publicPage, markdownPath } from "./lib/site-paths";
import { resourceLinks } from "./lib/markdown";

export function proxy(request: NextRequest) {
  const page = publicPage(request.nextUrl.pathname);
  if (!page) return NextResponse.next();
  const markdown = (request.method === "GET" || request.method === "HEAD") && request.headers.get("rsc") !== "1" && !request.headers.has("next-router-prefetch") && wantsMarkdown(request.headers.get("accept"));
  let response: NextResponse;
  if (markdown) {
    const destination = request.nextUrl.clone();
    destination.pathname = markdownPath(page.language, page.path);
    destination.search = "";
    const headers = new Headers(request.headers);
    headers.set("x-soeicam-markdown-negotiated", "1");
    response = NextResponse.rewrite(destination, { request: { headers } });
    response.headers.set("Cache-Control", "private, no-store");
  } else if (request.nextUrl.pathname === "/") {
    const destination = request.nextUrl.clone();
    destination.pathname = "/fr";
    response = NextResponse.redirect(destination, 308);
  } else response = NextResponse.next();
  response.headers.set("Link", resourceLinks(page.language, page.path));
  response.headers.set("Vary", "Accept");
  return response;
}

export const config = { matcher: ["/", "/fr/:path*", "/en/:path*"] };
