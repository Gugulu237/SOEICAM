require("./register-ts.cjs");
const { parseHTML, DOMParser } = require("linkedom");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { products } = require("../src/lib/products.ts");
const { getProductContent } = require("../src/lib/product-content.ts");
const {
  pageContent,
  pagePath,
  categoryKeys,
  categoryPath,
} = require("../src/lib/pages.ts");
const { guideSlugs } = require("../src/lib/guides.ts");
const base = process.env.QA_BASE_URL || "http://localhost:3010";
const site = "https://soeicam.com";
const paths = [
  ...Object.keys(pageContent.en).map(pagePath),
  ...categoryKeys.map(categoryPath),
  ...products.map((p) => `/products/${p.slug}`),
  ...guideSlugs.map((s) => `/guides/${s}`),
];
const rows = [];
const internal = new Set();
const failures = [];
const timings = [];
async function main() {
  for (const lang of ["fr", "en"])
    for (const route of paths) {
      const urlPath = `/${lang}${route === "/" ? "" : route}`;
      try {
        const start = performance.now();
        const response = await fetch(base + urlPath, {
          headers: { "user-agent": "Googlebot" },
        });
        timings.push(performance.now() - start);
        assert.equal(response.status, 200, urlPath);
        const html = await response.text();
        const { document } = parseHTML(html);
        assert.equal(document.documentElement.lang, `${lang}-CM`);
        assert.equal(
          document.querySelectorAll("main h1").length,
          1,
          "exactly one H1",
        );
        const title = document.querySelector("title")?.textContent;
        const description = document
          .querySelector('meta[name="description"]')
          ?.getAttribute("content");
        const canonical = document
          .querySelector('link[rel="canonical"]')
          ?.getAttribute("href");
        assert(title && description);
        assert.equal(canonical, site + urlPath);
        for (const other of ["fr", "en"]) {
          const alternate = [
            ...document.querySelectorAll('link[rel="alternate"]'),
          ].find(
            (link) =>
              (link.getAttribute("hreflang") ||
                link.getAttribute("hrefLang")) === `${other}-CM`,
          );
          assert.equal(
            alternate?.getAttribute("href"),
            `${site}/${other}${route === "/" ? "" : route}`,
          );
        }
        for (const image of document.querySelectorAll("main img"))
          assert(image.hasAttribute("alt"), "image alt attribute");
        for (const script of document.querySelectorAll(
          'script[type="application/ld+json"]',
        )) {
          const data = JSON.parse(script.textContent);
          assert(data["@type"]);
          const serial = JSON.stringify(data);
          assert(
            !/"(?:Offer|AggregateRating|Review)"/.test(serial),
            "no fabricated commerce data",
          );
        }
        for (const a of document.querySelectorAll("a[href]")) {
          const href = a.getAttribute("href");
          if (
            href.startsWith("/") &&
            !href.startsWith("//") &&
            !href.startsWith("/_next")
          )
            internal.add(href.split(/[?#]/)[0]);
        }
        if (route === "/products") {
          const cardLinks = [
            ...document.querySelectorAll("main .product-card-main"),
          ].map((a) => a.getAttribute("href"));
          assert.equal(
            cardLinks.length,
            19,
            "catalogue is complete without JavaScript",
          );
          assert(!document.querySelector(".catalog-loading"));
          assert.equal(
            document.querySelectorAll(".product-card-description").length,
            0,
            "catalogue cards show names without descriptions",
          );
          const names = [
            ...document.querySelectorAll("main .product-card h3"),
          ].map((heading) => heading.textContent);
          assert.deepEqual(
            new Set(names),
            new Set(
              products.map((p) => getProductContent(p, lang).displayName),
            ),
          );
        }
        const product = products.find((p) => route === `/products/${p.slug}`);
        if (product) {
          const copy = getProductContent(product, lang);
          assert.equal(
            document.querySelector("h1").textContent,
            copy.displayName,
          );
          assert.equal(
            document.querySelectorAll(".detail-intro").length,
            0,
            "no short description below the product title",
          );
          for (const paragraph of copy.paragraphs)
            assert(
              document.querySelector("main").textContent.includes(paragraph),
              "full product copy in initial HTML",
            );
        }
        rows.push({
          url: site + urlPath,
          language: `${lang}-CM`,
          primary_keyword: product
            ? getProductContent(product, lang).name
            : document.querySelector("h1").textContent,
          title,
          meta_description: description,
          h1: document.querySelector("h1").textContent,
          canonical,
        });
      } catch (error) {
        failures.push(`${urlPath}: ${error.message}`);
      }
    }
  for (const route of internal) {
    const result = await fetch(base + route, { redirect: "manual" });
    if (result.status !== 200)
      failures.push(`Internal link ${route}: ${result.status}`);
  }
  for (const route of [
    "/",
    "/products",
    "/about",
    "/contact",
    "/dairy",
    ...products.map((p) => `/products/${p.slug}`),
  ]) {
    const response = await fetch(base + route + "?test=preserved", {
      redirect: "manual",
    });
    if (
      response.status !== 308 ||
      response.headers.get("location") !==
        `/fr${route === "/" ? "" : route}?test=preserved`
    )
      failures.push(`Legacy redirect: ${route}`);
  }
  for (const route of [
    "/fr/products/not-a-product",
    "/en/products/category/missing",
    "/de",
    "/en/guides/missing",
  ]) {
    const response = await fetch(base + route);
    if (response.status !== 404) failures.push(`Expected 404: ${route}`);
  }
  const xml = await (await fetch(base + "/sitemap.xml")).text();
  const sitemap = new DOMParser().parseFromString(xml, "text/xml");
  assert.equal(sitemap.querySelectorAll("url > loc").length, paths.length * 2);
  const robots = await (await fetch(base + "/robots.txt")).text();
  assert(robots.includes("Sitemap: https://soeicam.com/sitemap.xml"));
  assert(!robots.includes("Disallow: /\n"));
  for (const p of products)
    assert(
      fs.existsSync(path.join(__dirname, "../public", p.image)),
      `Missing image: ${p.image}`,
    );
  const prefilled = parseHTML(
    await (
      await fetch(
        base + "/fr/contact?product=stirred-nature-10kg&type=foodservice",
      )
    ).text(),
  ).document;
  assert(
    prefilled.querySelector(
      'select[name="product"] option[value="stirred-nature-10kg"][selected]',
    ),
  );
  assert(
    prefilled.querySelector(
      'select[name="customerType"] option[value="foodservice"][selected]',
    ),
  );
  assert.equal(
    (await fetch(base + "/api/enquiries")).status,
    503,
    "unconfigured SMTP is not presented as working",
  );
  for (const language of ["fr-CM", "en-CM"]) {
    const localRows = rows.filter((row) => row.language === language);
    assert.equal(
      new Set(localRows.map((row) => row.title)).size,
      paths.length,
      "unique titles per language",
    );
    assert.equal(
      new Set(localRows.map((row) => row.meta_description)).size,
      paths.length,
      "unique descriptions per language",
    );
  }
  const headers = [
    "url",
    "language",
    "primary_keyword",
    "title",
    "meta_description",
    "h1",
    "canonical",
  ];
  const csv = [headers, ...rows.map((r) => headers.map((k) => r[k]))]
    .map((row) =>
      row.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(","),
    )
    .join("\n");
  fs.writeFileSync(
    path.join(__dirname, "../docs/metadata-inventory.csv"),
    "\ufeff" + csv + "\n",
  );
  const summary = {
    pages_checked: rows.length,
    expected_pages: paths.length * 2,
    internal_links_checked: internal.size,
    products_per_language: products.length,
    sitemap_urls: sitemap.querySelectorAll("url > loc").length,
    legacy_redirects: products.length + 5,
    failures,
    local_response_ms_median: Math.round(
      timings.sort((a, b) => a - b)[Math.floor(timings.length / 2)],
    ),
    note: "HTTP/server-HTML checks, not visual browser QA, Google Search Console inspection or field Core Web Vitals.",
  };
  fs.writeFileSync(
    path.join(__dirname, "../docs/qa-results.json"),
    JSON.stringify(summary, null, 2) + "\n",
  );
  console.log(JSON.stringify(summary, null, 2));
  if (failures.length) process.exitCode = 1;
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
