import { products } from "./products";
export const customerTypes = [
  "consumer",
  "retailer",
  "distributor",
  "foodservice",
  "event",
  "other",
] as const;
export const customerLabels = {
  fr: {
    consumer: "Particulier",
    retailer: "Commerçant / revendeur",
    distributor: "Distributeur / grossiste",
    foodservice: "Restaurant / professionnel alimentaire",
    event: "Organisateur d'événement",
    other: "Autre",
  },
  en: {
    consumer: "Individual consumer",
    retailer: "Retailer",
    distributor: "Distributor / wholesaler",
    foodservice: "Restaurant / food-service business",
    event: "Event organiser",
    other: "Other",
  },
};
export type Enquiry = {
  name: string;
  phone: string;
  email: string;
  city: string;
  customerType: (typeof customerTypes)[number];
  category: string;
  product: string;
  quantity: string;
  message: string;
  language: "fr" | "en";
  privacy: boolean;
};
export function validateEnquiry(value: unknown): Enquiry | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const v = value as Record<string, unknown>;
  const field = (key: string, max: number, min = 0) =>
    typeof v[key] === "string" &&
    (v[key] as string).trim().length >= min &&
    (v[key] as string).trim().length <= max &&
    !/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(v[key] as string);
  if (
    !field("name", 100, 2) ||
    !field("phone", 30, 7) ||
    !field("email", 254) ||
    !field("city", 120, 2) ||
    !field("quantity", 160) ||
    !field("message", 3000, 10)
  )
    return null;
  if (
    !/^[+()\d\s.-]+$/.test(v.phone as string) ||
    (v.phone as string).replace(/\D/g, "").length < 7 ||
    (v.phone as string).replace(/\D/g, "").length > 15
  )
    return null;
  if (
    v.email &&
    (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(v.email as string) ||
      /[\r\n]/.test(v.email as string))
  )
    return null;
  if (
    !customerTypes.includes(v.customerType as Enquiry["customerType"]) ||
    !["", "stirred", "drinkable"].includes(v.category as string) ||
    !["fr", "en"].includes(v.language as string) ||
    v.privacy !== true
  )
    return null;
  if (
    typeof v.product !== "string" ||
    (v.product &&
      !products.some(
        (p) =>
          p.slug === v.product && (!v.category || p.category === v.category),
      ))
  )
    return null;
  return {
    name: (v.name as string).trim(),
    phone: (v.phone as string).trim(),
    email: (v.email as string).trim(),
    city: (v.city as string).trim(),
    customerType: v.customerType as Enquiry["customerType"],
    category: v.category as string,
    product: v.product,
    quantity: (v.quantity as string).trim(),
    message: (v.message as string).trim(),
    language: v.language as Enquiry["language"],
    privacy: true,
  };
}
