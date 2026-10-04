export type Language = "en" | "fr";
export type Category = "stirred" | "drinkable";
export type Flavor = "nature" | "strawberry" | "vanilla" | "chocolate" | "unsweetened";
export type Size = "250g" | "330g" | "500g" | "1kg" | "2.5kg" | "10kg";

export type Product = {
  slug: string;
  category: Category;
  size: Size;
  flavor: Flavor;
  image: string;
};

const asset = (name: string) => `/brand/products/${name}.png`;

export const products: Product[] = [
  { slug: "drinkable-nature-250g", category: "drinkable", size: "250g", flavor: "nature", image: asset("drinkable-250g-nature") },
  { slug: "drinkable-strawberry-250g", category: "drinkable", size: "250g", flavor: "strawberry", image: asset("drinkable-250g-strawberry") },
  { slug: "drinkable-nature-330g", category: "drinkable", size: "330g", flavor: "nature", image: asset("drinkable-330g-nature") },
  { slug: "drinkable-strawberry-330g", category: "drinkable", size: "330g", flavor: "strawberry", image: asset("drinkable-330g-strawberry") },
  { slug: "drinkable-unsweetened-330g", category: "drinkable", size: "330g", flavor: "unsweetened", image: asset("drinkable-330g-unsweetened") },
  { slug: "drinkable-vanilla-330g", category: "drinkable", size: "330g", flavor: "vanilla", image: asset("drinkable-330g-vanilla") },
  { slug: "drinkable-nature-500g", category: "drinkable", size: "500g", flavor: "nature", image: asset("drinkable-500g-nature") },
  { slug: "stirred-chocolate-500g", category: "stirred", size: "500g", flavor: "chocolate", image: asset("stirred-500g-chocolate") },
  { slug: "stirred-nature-500g", category: "stirred", size: "500g", flavor: "nature", image: asset("stirred-500g-nature") },
  { slug: "stirred-strawberry-500g", category: "stirred", size: "500g", flavor: "strawberry", image: asset("stirred-500g-strawberry") },
  { slug: "stirred-unsweetened-500g", category: "stirred", size: "500g", flavor: "unsweetened", image: asset("stirred-500g-unsweetened") },
  { slug: "stirred-vanilla-500g", category: "stirred", size: "500g", flavor: "vanilla", image: asset("stirred-500g-vanilla") },
  { slug: "stirred-nature-1kg", category: "stirred", size: "1kg", flavor: "nature", image: asset("stirred-1kg-nature") },
  { slug: "stirred-unsweetened-1kg", category: "stirred", size: "1kg", flavor: "unsweetened", image: asset("stirred-1kg-unsweetened") },
  { slug: "stirred-vanilla-1kg", category: "stirred", size: "1kg", flavor: "vanilla", image: asset("stirred-1kg-vanilla") },
  { slug: "stirred-nature-2.5kg", category: "stirred", size: "2.5kg", flavor: "nature", image: asset("stirred-2.5kg-nature") },
  { slug: "stirred-strawberry-2.5kg", category: "stirred", size: "2.5kg", flavor: "strawberry", image: asset("stirred-2.5kg-strawberry") },
  { slug: "stirred-vanilla-2.5kg", category: "stirred", size: "2.5kg", flavor: "vanilla", image: asset("stirred-2.5kg-vanilla") },
  { slug: "stirred-nature-10kg", category: "stirred", size: "10kg", flavor: "nature", image: asset("stirred-10kg-nature") },
];

export const sizeOrder: Size[] = ["250g", "330g", "500g", "1kg", "2.5kg", "10kg"];
export const flavorOrder: Flavor[] = ["nature", "strawberry", "vanilla", "chocolate", "unsweetened"];

export const flavors: Record<Language, Record<Flavor, string>> = {
  en: { nature: "Natural", strawberry: "Strawberry", vanilla: "Vanilla", chocolate: "Chocolate", unsweetened: "Unsweetened" },
  fr: { nature: "Nature", strawberry: "Fraise", vanilla: "Vanille", chocolate: "Chocolat", unsweetened: "Non sucré" },
};

export const categories: Record<Language, Record<Category, string>> = {
  en: { stirred: "Stirred yogurt", drinkable: "Drinkable yogurt" },
  fr: { stirred: "Yaourt brassé", drinkable: "Yaourt à boire" },
};

export const sizeLabels: Record<Size, string> = {
  "250g": "250 g", "330g": "330 g", "500g": "500 g",
  "1kg": "1 kg", "2.5kg": "2,5 kg", "10kg": "10 kg",
};

export const flavorColors: Record<Flavor, string> = {
  nature: "#087ac0",
  strawberry: "#d9293e",
  vanilla: "#ae7b1e",
  chocolate: "#81503b",
  unsweetened: "#118448",
};

export function productTitle(product: Product, language: Language) {
  return `${categories[language][product.category]} · ${flavors[language][product.flavor]} · ${sizeLabels[product.size]}`;
}
