require("./register-ts.cjs");
const assert = require("node:assert/strict");
const { parseHTML, DOMParser } = require("linkedom");
const fs = require("node:fs");
const { publicPaths, markdownPath } = require("../src/lib/site-paths.ts");
const { publicAgentTools } = require("../src/lib/agent-catalogue.ts");
const { company } = require("../src/lib/company.ts");
const base = process.env.QA_BASE_URL || "http://localhost:3010";
const failures = [];
let markdownPages = 0;
let mcpCalls = 0;
async function check(label, callback) {
  try { await callback(); } catch (error) { failures.push(`${label}: ${error.message}`); }
}
async function rpc(method, params = {}) {
  const response = await fetch(`${base}/mcp`, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json, text/event-stream" }, body: JSON.stringify({ jsonrpc: "2.0", id: ++mcpCalls, method, params }) });
  assert.equal(response.status, 200);
  const text = await response.text();
  return text.startsWith("event:") ? JSON.parse(text.split("\n").find((line) => line.startsWith("data: ")).slice(6)) : JSON.parse(text);
}

async function main() {
  await check("robots", async () => {
    const response = await fetch(`${base}/robots.txt`);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type"), /text\/plain/);
    const text = await response.text();
    assert.match(text, /User-agent: \*/i);
    assert.match(text, /Content-Signal: search=yes, ai-train=no/);
    assert.match(text, /Sitemap: https:\/\/soeicam\.com\/sitemap\.xml/);
  });
  await check("sitemap", async () => {
    const response = await fetch(`${base}/sitemap.xml`);
    assert.equal(response.status, 200);
    const xml = new DOMParser().parseFromString(await response.text(), "text/xml");
    const urls = [...xml.querySelectorAll("url > loc")].map((node) => node.textContent);
    assert.equal(urls.length, publicPaths().length * 2);
    for (const lang of ["fr", "en"]) for (const path of ["terms", "pricing", "about", "contact"]) assert(urls.includes(`https://soeicam.com/${lang}/${path}`));
  });
  for (const lang of ["fr", "en"]) await check(`${lang} homepage`, async () => {
    const response = await fetch(`${base}/${lang}`, { headers: { Accept: "text/html" } });
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type"), /text\/html/);
    assert.match(response.headers.get("link"), /llms\.txt/);
    assert.match(response.headers.get("link"), /text\/markdown/);
    assert.match(response.headers.get("vary"), /Accept/i);
    const { document } = parseHTML(await response.text());
    assert.equal(document.querySelector('link[rel="canonical"]').getAttribute("href"), `https://soeicam.com/${lang}`);
    const structured = [...document.querySelectorAll('script[type="application/ld+json"]')].map((node) => JSON.parse(node.textContent));
    for (const type of ["Organization", "WebSite", "WebPage"]) assert(structured.some((node) => node["@type"] === type), `missing ${type}`);
    const organization = structured.find((node) => node["@type"] === "Organization");
    for (const property of ["name", "url", "logo", "email", "telephone", "address"]) assert(organization[property]);
    if (company.sameAs.length) assert.deepEqual(organization.sameAs, company.sameAs);
    else assert.equal(organization.sameAs, undefined);
    for (const path of ["about", "contact", "terms", "privacy", "pricing"]) assert(document.querySelector(`a[href="/${lang}/${path}"]`), `homepage link: ${path}`);
  });
  for (const language of ["fr", "en"]) for (const path of publicPaths()) await check(`Markdown ${language}${path}`, async () => {
    const htmlPath = `/${language}${path === "/" ? "" : path}`;
    const response = await fetch(`${base}${htmlPath}`, { headers: { Accept: "text/markdown" } });
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type"), /text\/markdown/);
    assert.match(response.headers.get("vary"), /Accept/i);
    assert.match(response.headers.get("cache-control"), /no-store/);
    assert.match(response.headers.get("link"), /rel="canonical"/);
    const text = await response.text();
    assert(text.startsWith("# "));
    assert(text.includes(`Canonical: https://soeicam.com${htmlPath}`));
    const direct = await fetch(`${base}${markdownPath(language, path)}`);
    assert.equal(direct.status, 200);
    assert.equal(await direct.text(), text);
    markdownPages++;
  });
  await check("root Markdown and Accept preferences", async () => {
    const markdown = await fetch(base, { headers: { Accept: "text/markdown" }, redirect: "manual" });
    assert.equal(markdown.status, 200);
    assert.match(markdown.headers.get("content-type"), /text\/markdown/);
    const html = await fetch(`${base}/fr`, { headers: { Accept: "text/html,text/markdown;q=0" } });
    assert.match(html.headers.get("content-type"), /text\/html/);
    const rsc = await fetch(`${base}/fr`, { headers: { Accept: "text/markdown", RSC: "1" } });
    assert(!rsc.headers.get("content-type").includes("text/markdown"));
    const unknown = await fetch(`${base}/fr/not-a-real-page`, { headers: { Accept: "text/markdown" } });
    assert.equal(unknown.status, 404);
  });
  await check("llms and discovery cards", async () => {
    const llms = await fetch(`${base}/llms.txt`);
    assert.equal(llms.status, 200);
    const guide = await llms.text();
    assert(guide.includes("/fr/pricing") && guide.includes("/en/terms") && guide.includes("/mcp"));
    const legacy = await fetch(`${base}/.well-known/mcp/server-card.json`);
    assert.equal(legacy.status, 200);
    assert.match(legacy.headers.get("content-type"), /application\/json/);
    assert.equal(legacy.headers.get("access-control-allow-origin"), "*");
    const card = await legacy.json();
    assert.equal(card.transport.endpoint, "https://soeicam.com/mcp");
    assert(card.capabilities.tools && card.capabilities.resources);
    const current = await (await fetch(`${base}/mcp/server-card`)).json();
    assert.equal(current.remotes[0].url, card.transport.endpoint);
  });
  await check("working MCP catalogue endpoint", async () => {
    const init = await rpc("initialize", { protocolVersion: "2025-11-25", capabilities: {}, clientInfo: { name: "soeicam-audit", version: "1.0.0" } });
    assert.equal(init.result.serverInfo.name, "com.soeicam/catalogue");
    const listed = await rpc("tools/list");
    assert.deepEqual(new Set(listed.result.tools.map((tool) => tool.name)), new Set(publicAgentTools.map((tool) => tool.name)));
    const called = await rpc("tools/call", { name: "search_yola_products", arguments: { category: "stirred", size: "250g" } });
    const result = called.result.structuredContent || JSON.parse(called.result.content[0].text);
    assert.equal(result.total, 3);
    assert.equal(result.products[0].pricing.supplyPrice, 425);
    const hostile = await fetch(`${base}/mcp`, { method: "POST", headers: { Origin: "https://attacker.example", "Content-Type": "application/json" }, body: "{}" });
    assert.equal(hostile.status, 403);
  });
  const result = { markdown_pages_checked: markdownPages, expected_markdown_pages: publicPaths().length * 2, public_tools: publicAgentTools.length, mcp_http_calls: mcpCalls, pending_owner_input: company.sameAs.length ? [] : ["Official social/directory URLs for sameAs"], failures };
  fs.writeFileSync("docs/agent-qa-results.json", JSON.stringify(result, null, 2) + "\n");
  console.log(JSON.stringify(result, null, 2));
  if (failures.length) process.exitCode = 1;
}
main().catch((error) => { console.error(error.message); process.exitCode = 1; });
