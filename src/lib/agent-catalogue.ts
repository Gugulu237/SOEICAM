import { company } from "./company";
import { categories, flavors, products, sizeOrder } from "./products";
import { getProductContent } from "./product-content";
import { pricingNote, priceCurrency, resellerPrice, resellerPrices } from "./pricing";
import { localizedPath } from "./locales";

type AgentArguments = Record<string, unknown>;
const languageProperty = { type: "string", enum: ["fr", "en"], description: "Response language; defaults to the page language or French." };
const categoryProperty = { type: "string", enum: ["stirred", "drinkable"] };
const sizeProperty = { type: "string", enum: sizeOrder };

export const publicAgentTools = [
  {
    name: "get_company_information",
    description: "Read SOEICAM SARL's public company identity, Yola brand, business contacts and official website links. Does not send messages or access customer records.",
    inputSchema: { type: "object", properties: { language: languageProperty }, additionalProperties: false },
  },
  {
    name: "search_yola_products",
    description: "Search the public Yola yogurt catalogue by flavour, type or size. Returns product pages, images and indicative reseller prices, not live stock or an order confirmation.",
    inputSchema: { type: "object", properties: {
      language: languageProperty,
      query: { type: "string", maxLength: 80 },
      category: categoryProperty,
      size: sizeProperty,
      flavor: { type: "string", enum: ["nature", "strawberry", "vanilla", "chocolate", "unsweetened"] },
      limit: { type: "integer", minimum: 1, maximum: 22 },
    }, additionalProperties: false },
  },
  {
    name: "get_yola_reseller_prices",
    description: "Read approved indicative Yola supply and recommended selling prices in XAF by pack type and size. No purchase, reservation, availability guarantee or customer-data access.",
    inputSchema: { type: "object", properties: { language: languageProperty, category: categoryProperty, size: sizeProperty }, additionalProperties: false },
  },
] as const;

export type PublicToolName = typeof publicAgentTools[number]["name"];
const normalise = (text: string) => text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

export function runPublicAgentTool(name: string, input: unknown, defaultLanguage: "fr" | "en" = "fr") {
  const tool = publicAgentTools.find((definition) => definition.name === name);
  if (!tool) throw new Error("Unknown public tool.");
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Arguments must be an object.");
  const args = input as AgentArguments;
  const properties = tool.inputSchema.properties as Record<string, { type: string; enum?: readonly unknown[]; maxLength?: number; minimum?: number; maximum?: number }>;
  for (const [key, value] of Object.entries(args)) {
    if (!Object.hasOwn(properties, key)) throw new Error("Invalid public tool arguments.");
    const rule = properties[key];
    if (!rule || (rule.enum && !rule.enum.includes(value))) throw new Error("Invalid public tool arguments.");
    if (rule.type === "string" && (typeof value !== "string" || value.length > (rule.maxLength ?? 100))) throw new Error("Invalid text argument.");
    if (rule.type === "integer" && (typeof value !== "number" || !Number.isInteger(value) || value < rule.minimum! || value > rule.maximum!)) throw new Error("Invalid result limit.");
  }
  const language = args.language === "en" ? "en" : args.language === "fr" ? "fr" : defaultLanguage;
  const url = (path: string) => `${company.site}${localizedPath(language, path)}`;
  if (name === "get_company_information") return {
    name: company.name, legalName: company.legalName, brand: "Yola", website: company.site,
    email: company.email, telephone: company.telephone, address: company.address,
    description: language === "fr" ? "Entreprise camerounaise de transformation alimentaire, productrice et commercialisatrice des yaourts Yola." : "Cameroonian food-processing company producing and commercialising Yola yogurt.",
    ...(company.sameAs.length ? { sameAs: company.sameAs } : {}),
    links: { products: url("/products"), prices: url("/pricing"), about: url("/about"), contact: url("/contact"), terms: url("/terms"), privacy: url("/privacy") },
  };
  if (name === "get_yola_reseller_prices") return {
    currency: priceCurrency, basis: "per pack", indicative: true, note: pricingNote[language], url: url("/pricing"),
    prices: resellerPrices.filter((row) => (!args.category || row.category === args.category) && (!args.size || row.size === args.size)).map((row) => ({
      category: row.category, size: row.size, supplyPrice: row.supply, recommendedSellingPrice: row.recommended,
    })),
  };
  const query = normalise(typeof args.query === "string" ? args.query.trim() : "");
  const matches = products.filter((product) => {
    if (args.category && args.category !== product.category) return false;
    if (args.size && args.size !== product.size) return false;
    if (args.flavor && args.flavor !== product.flavor) return false;
    const text = `Yola ${product.slug} ${flavors.fr[product.flavor]} ${flavors.en[product.flavor]} ${categories.fr[product.category]} ${categories.en[product.category]}`;
    return query.split(/\s+/).every((word) => normalise(text).includes(word));
  });
  return {
    total: matches.length, currency: priceCurrency, pricingNote: pricingNote[language],
    products: matches.slice(0, typeof args.limit === "number" ? args.limit : 22).map((product) => {
      const copy = getProductContent(product, language);
      const price = resellerPrice(product);
      return {
        slug: product.slug, name: copy.displayName, category: product.category, flavor: product.flavor, size: product.size,
        description: copy.short, image: `${company.site}${product.image}`, url: url(`/products/${product.slug}`),
        ...(price ? { pricing: { currency: priceCurrency, supplyPrice: price.supply, recommendedSellingPrice: price.recommended, indicative: true } } : {}),
      };
    }),
  };
}
