require("./register-ts.cjs");
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { createHmac } = require("node:crypto");
const { validateEnquiry } = require("../src/lib/enquiries.ts");
const { products } = require("../src/lib/products.ts");
const { getProductContent } = require("../src/lib/product-content.ts");
const valid = {
  name: "Test customer",
  phone: "+237 600 00 00 00",
  email: "",
  city: "Yaoundé",
  customerType: "retailer",
  category: "stirred",
  product: "stirred-nature-1kg",
  quantity: "5 pots",
  message: "Test enquiry, not a real order.",
  language: "fr",
  privacy: true,
};
test("all 19 products have distinct bilingual content and unchanged gram/kg units", () => {
  assert.equal(products.length, 19);
  for (const language of ["fr", "en"]) {
    const descriptions = new Set();
    for (const product of products) {
      const copy = getProductContent(product, language);
      assert(copy.name.includes("YOLA"));
      assert(copy.short.length > 90);
      assert(copy.paragraphs.join(" ").length > 300);
      descriptions.add(copy.short);
      assert(!product.size.includes("ml"));
    }
    assert.equal(descriptions.size, 19);
  }
});
test("enquiry validation accepts optional email but rejects invalid and mismatched data", () => {
  assert(validateEnquiry(valid));
  for (const change of [
    { privacy: false },
    { phone: "bad" },
    { email: "x\r\nBcc:test@example.com" },
    { name: "" },
    { message: "short" },
    { product: "missing" },
    { category: "drinkable" },
    { customerType: "admin" },
    { quantity: "a".repeat(161) },
  ])
    assert.equal(validateEnquiry({ ...valid, ...change }), null);
  assert.equal(validateEnquiry(null), null);
  assert.equal(validateEnquiry([]), null);
});
test("product labels are compact and distinguish bottles from stirred yogurt", () => {
  const name = (slug, language = "fr") =>
    getProductContent(
      products.find((p) => p.slug === slug),
      language,
    ).displayName;
  assert.equal(name("stirred-nature-500g"), "Yola Nature 500g");
  assert.equal(name("stirred-strawberry-500g"), "Yola Fraise 500g");
  assert.equal(name("stirred-unsweetened-500g"), "Yola Non Sucré 500g");
  assert.equal(
    name("drinkable-nature-330g"),
    "Yola Nature 330g Yaourt à Boire",
  );
  assert.equal(name("stirred-nature-2.5kg"), "Yola Nature 2,5kg");
  assert.equal(
    name("drinkable-strawberry-330g", "en"),
    "Yola Strawberry 330g Drinking Yogurt",
  );
  for (const language of ["fr", "en"]) {
    for (const product of products) {
      assert.match(getProductContent(product, language).displayName, /^Yola /);
    }
    assert.equal(
      new Set(products.map((p) => getProductContent(p, language).displayName))
        .size,
      19,
    );
  }
});
test("SMTP route rejects unsafe requests and reports accepted versus failed email honestly", async () => {
  const old = { ...process.env };
  process.env.SMTP_USER = "test@example.invalid";
  process.env.SMTP_PASSWORD = "local-test-only";
  process.env.ENQUIRY_TOKEN_SECRET = "test-secret";
  const mailer = require("nodemailer");
  const original = mailer.createTransport;
  let sent;
  let fail = false;
  mailer.createTransport = () => ({
    sendMail: async (options) => {
      sent = options;
      if (fail) throw Error("simulated");
      return { accepted: ["info@soeicam.com"] };
    },
    close() {},
  });
  try {
    const { POST, GET } = require("../src/app/api/enquiries/route.ts");
    const payload = `${Date.now() - 5000}:test`;
    const token = `${payload}.${createHmac("sha256", "test-secret").update(payload).digest("base64url")}`;
    const post = (body, origin = "https://soeicam.com") =>
      POST(
        new Request("https://soeicam.com/api/enquiries", {
          method: "POST",
          headers: { origin, "content-type": "application/json" },
          body: JSON.stringify(body),
        }),
      );
    assert.equal(
      (await post({ ...valid, token }, "https://attacker.invalid")).status,
      403,
    );
    assert.equal((await post({ ...valid, token: "forged" })).status, 400);
    assert.equal(
      (await post({ ...valid, token, website: "spam" })).status,
      400,
    );
    assert.equal((await post({ ...valid, token, privacy: false })).status, 400);
    assert.equal(
      (await post({ ...valid, token, message: "x".repeat(20000) })).status,
      413,
    );
    const response = await post({ ...valid, token });
    assert.equal(response.status, 200);
    assert.equal((await response.json()).accepted, true);
    assert.equal(sent.to, "info@soeicam.com");
    assert.equal(sent.replyTo, undefined);
    assert(sent.text.includes("YOLA"));
    fail = true;
    const failed = await post({ ...valid, token });
    assert.equal(failed.status, 502);
    assert.equal((await failed.json()).accepted, undefined);
    const challenge = await GET();
    assert.equal(challenge.headers.get("cache-control"), "no-store");
    assert((await challenge.json()).token);
    delete process.env.SMTP_PASSWORD;
    assert.equal((await GET()).status, 503);
  } finally {
    mailer.createTransport = original;
    for (const key of Object.keys(process.env))
      if (!(key in old)) delete process.env[key];
    Object.assign(process.env, old);
  }
});
