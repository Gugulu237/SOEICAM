import type { Category, Product, Size } from "./products";

export const priceCurrency = "XAF";
export const resellerPrices: {
  category: Category;
  size: Size;
  supply: number;
  recommended: number;
}[] = [
  { category: "drinkable", size: "250g", supply: 350, recommended: 400 },
  { category: "drinkable", size: "330g", supply: 425, recommended: 500 },
  { category: "drinkable", size: "500g", supply: 650, recommended: 800 },
  { category: "stirred", size: "250g", supply: 425, recommended: 500 },
  { category: "stirred", size: "500g", supply: 850, recommended: 1000 },
  { category: "stirred", size: "1kg", supply: 1650, recommended: 2000 },
  { category: "stirred", size: "2.5kg", supply: 3950, recommended: 4500 },
  { category: "stirred", size: "10kg", supply: 15500, recommended: 18500 },
];

export function resellerPrice(product: Pick<Product, "category" | "size">) {
  return resellerPrices.find((row) => row.category === product.category && row.size === product.size);
}

export function formatPrice(amount: number, language: "fr" | "en") {
  return `${new Intl.NumberFormat(language === "fr" ? "fr-CM" : "en-CM").format(amount)} FCFA`;
}

export const pricingNote = {
  fr: "Prix indicatifs par format, identiques pour les parfums proposés. Confirmez la disponibilité, les quantités et les modalités de livraison avec SOEICAM. Le prix de vente conseillé n'est pas un prix imposé au revendeur. Ce site ne permet pas le paiement ni la conclusion automatique d'une commande.",
  en: "Indicative prices by pack size, identical for the available flavours. Confirm availability, quantities and delivery arrangements with SOEICAM. Recommended selling prices are not mandatory reseller prices. This website does not accept payment or automatically conclude an order.",
};
