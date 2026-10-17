# SOEICAM SEO and commercial-enquiry upgrade

## Scope and evidence

Reviewed the existing Next.js application, all 19 product records, translated interface, supplied packaging photographs and company details. This is an upgrade of the existing website, not a replacement design. Existing photography, milk composition, blue/green palette, image preview, filters and navigation are retained. At the user's subsequent request, headings and product titles use the rounded, connected Lobster display font as a close visual match to the drinking-yogurt labels, in YOLA green on light backgrounds and white on dark bands. It is not asserted to be the original packaging typeface. The font is self-hosted through next/font/local, with its SIL Open Font License included in public/fonts/Lobster-OFL.txt. Body copy, navigation and form controls retain the simple sans-serif font for easy reading.

An independent live fetch of soeicam.com was unavailable during the audit. Findings below distinguish source/locally verified behavior from live-search tests that still need account access. No keyword-volume, ranking, traffic or sales results are asserted.

## Before and after

| Area                | Confirmed before                                                        | Implemented                                                                                                                                        |
| ------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Catalogue rendering | Entire catalogue sat behind a useSearchParams/Suspense loading fallback | All 19 cards and product links are in the initial server HTML; interactive filters remain                                                          |
| Localisation        | Browser-only language state, default English HTML, no language URLs     | Complete /fr and /en pages, server-set fr-CM/en-CM, equivalent-page switching and query preservation                                               |
| Product copy        | Flavour-only H1, generic availability sentence                          | Compact product names, full description, taste, occasions, size/flavour alternatives and prefilled enquiry                                         |
| Metadata            | Generic English metadata, no canonicals or alternates                   | Page-specific bilingual titles/descriptions, self-canonicals, reciprocal hreflang, x-default French, social metadata                               |
| Discovery           | Catalogue filters were the main category journey                        | Four substantive range pages, professional/reseller page, two practical guides and contextual links                                                |
| Company             | Temporary website-development wording                                   | Finished corporate copy using verified Cameroonian ownership, YOLA relationship and contact presence                                               |
| Indexing            | No sitemap or robots handler                                            | 64 canonical language URLs in sitemap; API excluded in robots; legacy redirects                                                                    |
| Structured data     | None                                                                    | Organization, Product, genuine flavour ProductGroups, BreadcrumbList and Article                                                                   |
| Enquiries           | Basic required-email mailto draft                                       | Qualified bilingual form, optional email, product preselection, customer types, consent, Hostinger SMTP integration and explicit external handoffs |
| Measurement         | No configured measurement                                               | Optional consent-gated GA4 hooks and Search Console verification setting; inactive without actual IDs                                              |

## Route inventory

Each of the following is published under both `/fr` and `/en`:

- Home, products, about, dairy, contact, professionals, privacy.
- `/products/category/stirred`, `/drinkable`, `/family`, `/professional` (the latter three also under `/products/category/`).
- All 19 unchanged product slugs, listed in `src/lib/products.ts` and the metadata inventory.
- `/guides/stirred-or-drinking-yogurt` and `/guides/choosing-family-yogurt-formats`.

The previous `/`, `/products`, `/about`, `/dairy`, `/contact` and 19 product URLs permanently redirect to their French equivalents. Query parameters survive. Invalid products, categories, guides and languages return 404. Filter views canonicalise to the complete localised catalogue rather than becoming separate indexed pages.

`metadata-inventory.csv` maps all 64 URLs to language, qualitative keyword target, title, description, visible H1 and canonical. `qa-results.json` is generated from a running production build rather than inferred from content files.

## Content and claims

At the user's request, visible product labels use compact names such as `Yola Nature 500g` and `Yola Nature 330g Yaourt à Boire`, with title-case `Yola` across French and English product titles. Cards and detail-page headings do not have a short description beneath them. Full product descriptions remain further down detail pages; descriptive metadata and image alternatives retain the category information for search and accessibility.

The user confirmed preserving existing product units: 250 g, 330 g and 500 g bottles; 500 g, 1 kg, 2.5 kg and 10 kg stirred packs. URLs are unchanged apart from the language prefix. Some source cups show 500 ml, while the existing product master uses 500 g; no conversion is claimed.

The photographed 10 kg pack is Nature Sucré. Professional copy makes suitability conditional, especially for sauces, marinades and shawarma. It is not promoted as an unsweetened cooking yogurt or a validated starter for kossam. No nutritional, medical, certification, ingredient-origin, fruit-piece, serving-yield, shelf-life or delivery guarantees have been invented.

Schema describes informational product pages. There are no invented offers, prices, stock, ratings, reviews, GTINs or nutritional data. Syntax and page correspondence are checked locally; Google product rich-result eligibility is not promised because no verified Offer/Review/AggregateRating is supplied. Google Rich Results Test and Search Console remain post-deployment checks.

## Keyword strategy

These are intent-based editorial targets, not measured-volume claims:

| Intent          | French themes                                       | English themes                                       | Destination                     |
| --------------- | --------------------------------------------------- | ---------------------------------------------------- | ------------------------------- |
| Brand/company   | SOEICAM, yaourts YOLA Cameroun                      | SOEICAM Cameroon, YOLA yogurt                        | Home/About                      |
| Spoonable range | yaourt brassé YOLA, parfums et formats              | YOLA stirred yogurt, flavours and sizes              | Stirred category                |
| Bottle range    | yaourt à boire YOLA, 330 g                          | YOLA drinking yogurt, 330 g bottle                   | Drinkable category and variants |
| Household       | yaourt familial 1 kg, yaourt 2,5 kg                 | family yogurt packs, 1 kg yogurt                     | Family category and guide       |
| Trade           | fournisseur de yaourt, revendeur YOLA, distribution | yogurt supplier Cameroon, retailers and distributors | Professionals                   |
| Large packs     | yaourt YOLA 10 kg, approvisionnement restaurant     | 10 kg yogurt, professional pack enquiry              | Professional category/product   |
| Education       | brassé ou à boire, choisir son format               | stirred versus drinking yogurt, sharing formats      | Dairy and guides                |

Do not target unverified `sans sucre ajouté`, low-fat, probiotic or medical claims. Do not change gram units to match proposed ml keywords. Do not publish city doorway pages or imply distribution coverage outside the verified Yaoundé contact location. Validate demand and refine wording later with actual Search Console queries; no rankings are guaranteed.

## Measurement and operations

Optional events: `page_view`, `view_item`, `view_item_list`, `product_enquiry_click`, `whatsapp_click`, `phone_click`, `enquiry_started`, `professional_enquiry_started`, `email_draft_opened`, `generate_lead`, `distributor_enquiry_submitted`. Successful lead events fire only after SMTP accepts the message, never for a WhatsApp/email-draft launch. No form values are sent to analytics. URL query strings and referrers are excluded from explicit events.

Before enabling GA4, disable Enhanced Measurement's automatic page/form/outbound interactions and any automatic user-provided-data collection in the GA property; this application deliberately controls those events. Use no duplicate tag-manager installation. Set actual GA4/Search Console values only when approved. Confirm refusal, acceptance, withdrawal and DebugView events on the real property before treating measurement as operational.

Track impressions, clicks, indexed product URLs, FR/EN organic discovery, product engagement and accepted enquiries separately from external-app clicks. No baseline was available. Compare 28-day periods after deployment with attention to URL migration and seasonal changes.

## Verification

- Production build and TypeScript checks; native-WASM compatibility build retains CommonJS config and Webpack.
- Automated HTML checks of 64 pages: language, unique visible H1, metadata, canonical, reciprocal languages, parseable JSON-LD, all 19 initial catalogue cards, full product paragraphs, local images and reachable internal links.
- 24 old URL redirects, unknown-route 404s, 64 sitemap entries, robots and product/customer-type form preselection.
- Unit checks for bilingual product content, validation, request origin, honeypot, signed token, payload limit, SMTP acceptance/failure and unavailable configuration. Tests send no real email.
- Browser checks include desktop/mobile branding, mobile menu, category/size/flavour filters, quick view, equivalent-language product navigation and prefilled contact form. A mobile checkbox overflow and an overlapping mobile dairy header were corrected. Wide desktop heroes retain the complete product composition instead of enlarging and cropping it.

Still outstanding: authenticated real-mail delivery, production Hostinger deployment, Search Console URL inspection/Googlebot rendering, external schema-validator checks, field Core Web Vitals and representative-device performance. Local HTTP response timings are diagnostic only, not Core Web Vitals. Existing Next image optimisation, explicit image dimensions, priority hero loading and reduced-motion handling remain intact.

## Sources

- [Next.js internationalisation](https://nextjs.org/docs/app/guides/internationalization)
- [Google localised versions](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Google product snippets](https://developers.google.com/search/docs/appearance/structured-data/product-snippet)
- [FAO milk processing](https://www.fao.org/dairy-production-products/processing/en/)
- [FAO dairy chain](https://www.fao.org/dairy-production-products/socio-economics/the-dairy-chain/en)
- [FAO collection and transport](https://www.fao.org/dairy-production-products/processing/collection-and-transport/en)
- [WHO listeriosis and food safety](https://www.who.int/news-room/fact-sheets/detail/listeriosis)

These are general industry references, not evidence of SOEICAM's particular manufacturing process.
