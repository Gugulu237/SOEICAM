import {
  createHmac,
  randomBytes,
  timingSafeEqual,
  createHash,
} from "node:crypto";
import nodemailer from "nodemailer";
import { company } from "@/lib/company";
import { validateEnquiry, customerLabels } from "@/lib/enquiries";
import { products, categories } from "@/lib/products";
import { productName } from "@/lib/product-content";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const buckets = new Map<string, { count: number; expires: number }>();
function limited(key: string, max: number) {
  const now = Date.now();
  for (const [k, v] of buckets) if (v.expires < now) buckets.delete(k);
  const bucket = buckets.get(key) || { count: 0, expires: now + 15 * 60_000 };
  bucket.count++;
  buckets.set(key, bucket);
  return bucket.count > max;
}
function enabled() {
  return !!(process.env.SMTP_USER && process.env.SMTP_PASSWORD);
}
function sign(value: string) {
  return createHmac(
    "sha256",
    process.env.ENQUIRY_TOKEN_SECRET ||
      process.env.SMTP_PASSWORD ||
      "unconfigured",
  )
    .update(value)
    .digest("base64url");
}
function response(data: object, status = 200) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}
function validToken(token: unknown) {
  if (typeof token !== "string" || token.length > 200) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  const expected = Buffer.from(sign(payload));
  const actual = Buffer.from(signature);
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected))
    return false;
  const time = Number(payload.split(":")[0]);
  const age = Date.now() - time;
  return Number.isFinite(time) && age >= 2000 && age < 2 * 60 * 60_000;
}
export async function GET() {
  if (!enabled()) return response({ error: "unconfigured" }, 503);
  if (limited("tokens", 1000)) return response({ error: "rate_limit" }, 429);
  const payload = `${Date.now()}:${randomBytes(12).toString("hex")}`;
  return response({ token: `${payload}.${sign(payload)}` });
}
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const allowed = [company.site, "https://www.soeicam.com"];
  if (process.env.NODE_ENV !== "production")
    allowed.push(new URL(request.url).origin);
  if (!origin || !allowed.includes(origin))
    return response({ error: "origin" }, 403);
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return response({ error: "invalid" }, 415);
  if (!enabled()) return response({ error: "unconfigured" }, 503);
  // The global limit also protects deployments without a verified proxy-IP header.
  if (limited("email", 60)) return response({ error: "rate_limit" }, 429);
  if (process.env.TRUST_PROXY_IP === "true") {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
    const key = createHash("sha256").update(ip).digest("hex");
    if (limited(key, 5)) return response({ error: "rate_limit" }, 429);
  }
  let body: Record<string, unknown>;
  try {
    const reader = request.body?.getReader();
    if (!reader) return response({ error: "invalid" }, 400);
    const chunks: Uint8Array[] = [];
    let total = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      total += value.length;
      if (total > 16_384) {
        await reader.cancel();
        return response({ error: "too_large" }, 413);
      }
      chunks.push(value);
    }
    body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return response({ error: "invalid" }, 400);
  }
  if (
    !body ||
    typeof body !== "object" ||
    body.website ||
    !validToken(body.token)
  )
    return response({ error: "validation" }, 400);
  const enquiry = validateEnquiry(body);
  if (!enquiry) return response({ error: "validation" }, 400);
  const product = products.find((p) => p.slug === enquiry.product);
  const subject = `${enquiry.language === "fr" ? "Demande commerciale" : "Commercial enquiry"} YOLA - ${customerLabels[enquiry.language][enquiry.customerType]}`;
  const text = [
    `SOEICAM / YOLA — ${subject}`,
    `Nom / Name: ${enquiry.name}`,
    `Téléphone / Phone: ${enquiry.phone}`,
    `Email: ${enquiry.email || "-"}`,
    `Ville / City: ${enquiry.city}`,
    `Client: ${customerLabels[enquiry.language][enquiry.customerType]}`,
    `Catégorie / Category: ${enquiry.category ? categories[enquiry.language][enquiry.category as "stirred" | "drinkable"] : "-"}`,
    `Produit / Product: ${product ? productName(product, enquiry.language) : "-"}`,
    `Quantité / Quantity: ${enquiry.quantity || "-"}`,
    "",
    enquiry.message,
    "",
    "Privacy acknowledgement: accepted on the website.",
  ].join("\n");
  const port = Number(process.env.SMTP_PORT || "465");
  if (![465, 587].includes(port))
    return response({ error: "unconfigured" }, 503);
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.hostinger.com",
    port,
    secure: port === 465,
    requireTLS: port === 587,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    connectionTimeout: 10_000,
    socketTimeout: 15_000,
    disableFileAccess: true,
    disableUrlAccess: true,
    tls: { minVersion: "TLSv1.2" },
  });
  try {
    const result = await transport.sendMail({
      from: { name: "SOEICAM website", address: process.env.SMTP_USER! },
      to: company.email,
      replyTo: enquiry.email || undefined,
      subject,
      text,
    });
    if (!result.accepted?.length) return response({ error: "delivery" }, 502);
    return response({ accepted: true });
  } catch {
    return response({ error: "delivery" }, 502);
  } finally {
    transport.close();
  }
}
