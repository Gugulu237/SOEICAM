import { company } from "./company";
import { translations } from "./i18n";
import { categoryContent, categoryKeys, inCategory, pageContent, pagePath, type PageKey } from "./pages";
import { guides, guideSlugs } from "./guides";
import { products, categories, sizeLabels, type Language } from "./products";
import { getProductContent } from "./product-content";
import { localizedPath } from "./locales";
import { resellerPrices, pricingNote, formatPrice } from "./pricing";
import { termsSections } from "./terms";
import { privacySections } from "./privacy-copy";
import { markdownPath, publicPaths } from "./site-paths";

export function resourceLinks(language: Language, path: string) {
  return [
    `<${company.site}${localizedPath(language, path)}>; rel="canonical"`,
    `</llms.txt>; rel="describedby"; type="text/plain"`,
    `<${markdownPath(language, path)}>; rel="alternate"; type="text/markdown"; hreflang="${language}"`,
    `</.well-known/mcp/server-card.json>; rel="service-desc"; type="application/json"`,
  ].join(", ");
}

const productLines = (language: Language, selection = products) => selection.map((product) => {
  const copy = getProductContent(product, language);
  return `- [${copy.displayName}](${company.site}${localizedPath(language, `/products/${product.slug}`)}): ${copy.short}`;
}).join("\n");

export function pageMarkdown(language: Language, path: string): string | null {
  if (!publicPaths().includes(path)) return null;
  const copy = translations[language];
  const canonical = `${company.site}${localizedPath(language, path)}`;
  let title = "";
  const parts: string[] = [];
  const section = (heading: string, text: string) => parts.push(`## ${heading}\n\n${text}`);
  const product = products.find((item) => path === `/products/${item.slug}`);
  const guide = guideSlugs.find((slug) => path === `/guides/${slug}`);
  const category = categoryKeys.find((key) => path === `/products/category/${key}`);
  if (product) {
    const content = getProductContent(product, language);
    title = content.displayName;
    parts.push(content.short, `![${content.name}](${company.site}${product.image})`, ...content.paragraphs);
    section(language === "fr" ? "Goût et texture" : "Taste and texture", content.taste);
    section(language === "fr" ? "À savourer" : "Enjoy it", content.occasions.map((item) => `- ${item}`).join("\n"));
    section(language === "fr" ? "Tarifs et disponibilité" : "Prices and availability", `[${getPageTitle(language, "pricing")}](${company.site}${localizedPath(language, "/pricing")})\n\n${copy.products.availability}`);
  } else if (guide) {
    const content = guides[language][guide];
    title = content.title;
    parts.push(content.description);
    for (const item of content.sections) section(item.title, item.text);
  } else if (category) {
    const content = categoryContent[language][category];
    title = content.title;
    parts.push(content.short, ...content.paragraphs, productLines(language, products.filter((item) => inCategory(item, category))));
  } else {
    const key = (Object.keys(pageContent[language]) as PageKey[]).find((item) => pagePath(item) === path);
    if (!key) return null;
    title = pageContent[language][key].h1;
    parts.push(pageContent[language][key].description);
    switch (key) {
      case "home":
        parts.push(copy.home.intro);
        section(copy.home.exploreTitle, `${copy.home.exploreIntro}\n\n${copy.home.stirredText}\n\n${copy.home.drinkableText}`);
        section(copy.home.companyTitle, copy.home.companyText);
        section(copy.home.dairyTitle, copy.home.dairyText);
        section(language === "fr" ? "Les produits Yola" : "Yola products", productLines(language));
        break;
      case "products": parts.push(productLines(language)); break;
      case "about":
        parts.push(copy.about.lead, copy.about.body);
        section(copy.about.process, copy.about.processText);
        section(copy.about.brand, copy.about.brandText);
        section(copy.about.distribution, copy.about.distributionText);
        section(copy.about.brandTitle, copy.about.brandTextLong);
        break;
      case "dairy":
        parts.push(copy.dairy.intro, copy.dairy.contextText, copy.dairy.stepsIntro);
        for (const item of copy.dairy.steps) section(item.title, item.body);
        section(copy.dairy.sourcesTitle, "- [FAO: Milk processing](https://www.fao.org/dairy-production-products/processing/en/)\n- [FAO: Dairy chain](https://www.fao.org/dairy-production-products/socio-economics/the-dairy-chain/en/)\n- [WHO: Listeriosis](https://www.who.int/news-room/fact-sheets/detail/listeriosis)");
        break;
      case "pricing":
        parts.push(pricingNote[language]);
        parts.push([
          language === "fr" ? "| Type | Format | Prix de livraison | Vente conseillée |" : "| Type | Size | Supply price | Recommended selling |",
          "| --- | --- | --- | --- |",
          ...resellerPrices.map((row) => `| ${categories[language][row.category]} | ${sizeLabels[row.size]} | ${formatPrice(row.supply, language)} | ${formatPrice(row.recommended, language)} |`),
        ].join("\n"));
        parts.push(language === "fr" ? "Devise : XAF (FCFA). Prix indicatifs par pot ou bouteille, sans garantie de stock ni offre de paiement en ligne." : "Currency: XAF (FCFA). Prices are per pack and indicative, not live stock or checkout offers.");
        break;
      case "terms": for (const [heading, body] of termsSections[language]) section(heading, body); break;
      case "privacy": for (const [heading, body] of privacySections[language]) section(heading, body); break;
      case "professionals":
        parts.push(copy.home.companyText, ...categoryContent[language].professional.paragraphs, pricingNote[language]);
        section(language === "fr" ? "Gamme et approvisionnement" : "Range and supply", productLines(language));
        break;
      case "find-our-products":
        parts.push(language === "fr" ? "Consultez la page interactive pour les points de vente actuellement publiés. Les coordonnées GPS ne sont pas déduites ni inventées. Contactez SOEICAM pour confirmer un approvisionnement ou une disponibilité." : "Use the interactive page for the currently published retail outlets. GPS coordinates are not inferred or invented. Contact SOEICAM to confirm supply or availability.");
        break;
      case "contact": parts.push(copy.contact.intro, copy.contact.whatsappText); break;
    }
  }
  section(language === "fr" ? "Contacter SOEICAM" : "Contact SOEICAM", `${company.legalName}\n\n${company.address}\n\n[${company.phone}](tel:${company.telephone})\n\n[${company.email}](mailto:${company.email})\n\n[WhatsApp](https://wa.me/${company.whatsapp})`);
  section(language === "fr" ? "Pages utiles" : "Useful pages", ["products", "pricing", "about", "contact", "terms", "privacy"].map((item) => `- [${getPageTitle(language, item as PageKey)}](${company.site}${localizedPath(language, `/${item}`)})`).join("\n"));
  return `# ${title}\n\nCanonical: ${canonical}\nLanguage: ${language}-CM\n\n${parts.join("\n\n")}\n`;
}

function getPageTitle(language: Language, key: PageKey) { return pageContent[language][key].h1; }

export function llmsText() {
  const sections = [
    "# SOEICAM",
    "> SOEICAM SARL is a Cameroonian food-processing company producing and commercialising Yola stirred and drinking yogurt. Public information is available in French and English.",
    "## Company\n\nAddress: Rue Sion 1, Odza, Yaoundé, Cameroon.\nTelephone: +237 688 64 22 93.\nEmail: info@soeicam.com.",
    "## Scope and accuracy\n\nThe catalogue has 22 references. Product units remain g/kg as supplied by the owner; some photographed labels show ml. Do not infer nutrition, certifications, live stock, delivery coverage or guaranteed availability. Prices are indicative reseller supply and recommended selling prices in XAF, not binding checkout offers. No online orders or payments are accepted. Robots content-use preferences are declared at /robots.txt.",
    "## Discovery\n\n- [Sitemap](https://soeicam.com/sitemap.xml)\n- [MCP server card](https://soeicam.com/.well-known/mcp/server-card.json)\n- [Current MCP server card](https://soeicam.com/mcp/server-card)\n- MCP endpoint: https://soeicam.com/mcp (read-only public catalogue, prices and company information).\n- WebMCP: the same read-only tools are registered when the browser supports document.modelContext or navigator.modelContext. No email, customer database, purchase or administration tools are exposed.",
  ];
  for (const language of ["fr", "en"] as const) {
    sections.push(`## ${language === "fr" ? "French" : "English"} pages\n\n` + publicPaths().map((path) => {
      const text = pageMarkdown(language, path)!;
      const title = text.split("\n")[0].slice(2);
      return `- [${title}](${company.site}${localizedPath(language, path)}) ([Markdown](${company.site}${markdownPath(language, path)}))`;
    }).join("\n"));
  }
  return sections.join("\n\n") + "\n";
}
