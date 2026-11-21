# SOEICAM agent readiness

## Scope and production baseline

Implemented locally on 20 November 2026 in the existing bilingual Next.js app. This work does not itself publish a Hostinger deployment. Direct production HTTP requests during this task already returned robots.txt, sitemap.xml, canonical metadata and homepage Organization JSON-LD. The supplied audit may reflect a different snapshot or fetch path; its cause is not established.

The public catalogue contains 22 products. Existing g/kg sales units, URLs, store-locator privacy controls and contact workflows are preserved. No customer data, credentials, email submission, order creation, payment, live stock or private outlet-management functions are exposed to agent tools.

## Requested checks

| # | Requirement | Implementation |
| --- | --- | --- |
| 1 | Parseable robots.txt | Static text route at /robots.txt, allows public content and disallows /api/. |
| 2 | Content Signals | `Content-Signal: search=yes, ai-train=no`. This declares a preference; it does not technically prevent copying or training. |
| 3 | Sitemap | /sitemap.xml lists all 76 canonical FR/EN public pages. |
| 4 | Sitemap pointer | Absolute https://soeicam.com/sitemap.xml directive in robots.txt. |
| 5 | Metadata and canonical | Existing bilingual metadata preserved; new pricing and terms pages use the same canonical/hreflang helpers. |
| 6 | Homepage JSON-LD | Server-rendered Organization, WebSite and WebPage blocks; Brand identifies Yola. |
| 7 | Complete company entity | Verified company name, legal name, website, logo, address, email, telephone and customer-service contact. No unverified opening hours or certifications. |
| 8 | External entity links | **Pending owner input.** Add approved official profile URLs to company.sameAs in src/lib/company.ts. Empty sameAs is omitted rather than inventing links. |
| 9 | Multiple schema types | Organization, Brand, WebSite, WebPage, Product, ProductGroup, BreadcrumbList and Article across relevant pages. |
| 10 | Company and legal links | Footer links About, Contact, Privacy and Terms; terms are bilingual website-use notes, not a complete sales contract or compliance guarantee. |
| 11 | Public prices | Homepage and footer link to /fr/pricing or /en/pricing. Full price tables are server-rendered, also available in Markdown and tools. |
| 12 | llms.txt | /llms.txt provides company context, bilingual key pages, all product links and agent resources. |
| 13 | Markdown negotiation | Known public pages return text/markdown for an explicit preferred Accept: text/markdown. Explicit /markdown/fr/... and /markdown/en/... alternatives are also available. |
| 14 | Link headers | Canonical, Markdown alternate, llms.txt describedby and MCP service-desc links on public HTML/negotiated responses. |
| 15 | WebMCP | Three real read-only tools registered on page load when document.modelContext or legacy navigator.modelContext is supported. No compatibility shim pretends unsupported browsers have native WebMCP. |
| 16 | MCP discovery and service | Requested /.well-known/mcp/server-card.json compatibility card plus current /mcp/server-card discovery, backed by a working /mcp endpoint. |

## Prices and public tool boundaries

The shared price source is src/lib/pricing.ts. XAF is the currency code; FCFA is the display label. Prices are per pack, indicative, and subject to confirmation. Recommended resale prices are not imposed. The delivery price is not a promise that transport or taxes are included. An enquiry does not create an accepted order or payment.

| Range | Pack | Delivery price FCFA | Recommended resale FCFA |
| --- | --- | ---: | ---: |
| Drinking | 250 g | 350 | 400 |
| Drinking | 330 g | 425 | 500 |
| Drinking | 500 g | 650 | 800 |
| Stirred | 250 g | 425 | 500 |
| Stirred | 500 g | 850 | 1,000 |
| Stirred | 1 kg | 1,650 | 2,000 |
| Stirred | 2.5 kg | 3,950 | 4,500 |
| Stirred | 10 kg | 15,500 | 18,500 |

Tools shared by WebMCP and MCP:

- get_company_information: public company identity and contact links.
- search_yola_products: bounded, validated catalogue search by language, category, size and flavour.
- get_yola_reseller_prices: owner-supplied indicative prices by range and format.

All three tools are read-only. Unknown properties, unsupported enum values, excessive query lengths and invalid limits are rejected. The server limits request bodies to 32 KB and rejects unapproved Host/Origin values. Only the production domains and local development hosts are allowed; add an actual preview hostname deliberately if a hosted preview needs MCP access. There is no wildcard CORS access to the tool endpoint. Discovery cards are public with permissive CORS.

## Content negotiation and caching

Only an explicit acceptable text/markdown media range triggers Markdown; q=0 and higher-priority HTML are respected. Flight/prefetch requests are not rewritten. skipProxyUrlNormalize keeps their headers visible in Proxy. Negotiated responses use Vary: Accept and private, no-store to prevent an HTML/Markdown cache mix-up. Direct Markdown routes can be publicly cached for five minutes. Query parameters and cookies do not enter the Markdown body. Unknown pages stay 404. Root HTML retains its permanent French redirect; root Markdown returns the French representation directly.

Markdown is generated from the same public catalogue/content sources. The store-locator representation links to the interactive map rather than exposing backend data or claiming real-time stock.

## Standards and compatibility

WebMCP is an evolving browser API, not a guarantee of support in every browser. The current draft uses document.modelContext; navigator.modelContext remains feature-detected for older implementations. Cleanup is registered on unmount/locale changes.

MCP uses the official @modelcontextprotocol/server SDK 2.4.0 and a stateless Web-standard HTTP handler. Supported protocol versions are 2026-07-28, 2025-11-25, 2025-06-18 and 2025-03-26. The compatibility card mirrors SEP-1649 discovery at the exact requested path; the newer experimental Server Card format is also served at /mcp/server-card. These discovery formats should not be represented as a universally adopted final standard. Runtime initialize, tools/list and resources/list remain authoritative.

## Verification and deployment

- npm test: validation, product/privacy regressions, shared tools, mocked WebMCP registration, actual SDK protocol calls, hostile origins/hosts and payload limits.
- npm run build: production Next.js build, TypeScript and static routes.
- npm run qa:seo: server-rendered HTML, metadata, schema, catalogue links, redirects, 404s and sitemap.
- npm run qa:agents: all 76 negotiated and explicit Markdown representations, headers, discovery documents and real HTTP MCP calls.
- Generated summaries: docs/qa-results.json and docs/agent-qa-results.json. A local HTTP timing is not a field Core Web Vitals measurement.
- Verified results: 25/25 regression tests, 76/76 HTML pages, 76/76 negotiated and explicit Markdown pages, 76 sitemap URLs and 27 legacy redirects. Native and forced-WASM production builds both passed. Browser checks at desktop, 768 px tablet and 390 px mobile confirmed readable prices without horizontal overflow; the native WebMCP catalogue tool returned the three 250 g cups with the correct 425/500 FCFA prices.

Next.js and matching optional WASM SWC are pinned to 16.4.6; Nodemailer is patched to 10.1.4. npm audit reports zero vulnerabilities after these updates. CommonJS next.config.js, npm, the existing Node version and Webpack remain in place for the Hostinger environment. No TypeScript configuration-loader workaround is reintroduced.

After an approved GitHub push, deploy the new main revision in Hostinger with npm run build and .next output. Verify production Content-Type, Vary, Cache-Control and Link headers for both HTML and Markdown, and confirm Hostinger forwards POST /mcp rather than caching it. Purge any old CDN copy of robots.txt and llms.txt if necessary. Submit the sitemap in Search Console and run external schema validators. Review the website terms and provide official profile URLs before treating all editorial checks as complete.

## Primary references

- [Next.js Proxy and Flight headers](https://nextjs.org/docs/app/api-reference/file-conventions/proxy)
- [Content Signals](https://contentsignals.org/)
- [WebMCP draft](https://webmachinelearning.github.io/webmcp/)
- [Official MCP TypeScript SDK v2](https://ts.sdk.modelcontextprotocol.io/v2/)
- [Web-standard serving](https://ts.sdk.modelcontextprotocol.io/v2/serving/web-standard.html)
- [Legacy client compatibility](https://ts.sdk.modelcontextprotocol.io/v2/serving/legacy-clients.html)
- [Original SEP-1649 proposal](https://github.com/modelcontextprotocol/modelcontextprotocol/issues/1649)
- [Current experimental Server Card extension](https://github.com/modelcontextprotocol/ext-server-card)
