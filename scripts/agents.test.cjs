require("./register-ts.cjs");
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { products } = require("../src/lib/products.ts");
const { resellerPrice, resellerPrices } = require("../src/lib/pricing.ts");
const { publicAgentTools, runPublicAgentTool } = require("../src/lib/agent-catalogue.ts");
const { registerPublicBrowserTools } = require("../src/lib/webmcp.ts");
const { publicPaths } = require("../src/lib/site-paths.ts");
const { pageMarkdown, llmsText } = require("../src/lib/markdown.ts");
const { wantsMarkdown } = require("../src/lib/negotiation.ts");
const { serveMcp } = require("../src/lib/mcp-server.ts");
const { mcpServerCard, legacyMcpCard } = require("../src/lib/mcp-card.ts");

test("approved per-pack prices cover all products and distinguish supply from selling", () => {
  assert.equal(resellerPrices.length, 8);
  for (const product of products) assert(resellerPrice(product));
  assert.deepEqual(resellerPrice({ category: "stirred", size: "250g" }), { category: "stirred", size: "250g", supply: 425, recommended: 500 });
  assert.equal(resellerPrice({ category: "drinkable", size: "250g" }).supply, 350);
  assert.equal(resellerPrice({ category: "stirred", size: "10kg" }).recommended, 18500);
});

test("Markdown negotiation respects q=0, preference and explicit media types", () => {
  for (const accept of [null, "*/*", "text/html", "text/markdown;q=0", "text/html,text/markdown;q=0.2", "text/markdown;q=bad"]) assert.equal(wantsMarkdown(accept), false, accept);
  for (const accept of ["text/markdown", "text/markdown; charset=utf-8", "text/html;q=0.2,text/markdown;q=0.9", "TEXT/MARKDOWN"]) assert.equal(wantsMarkdown(accept), true, accept);
});

test("every public page has bilingual Markdown with the HTML canonical and useful links", () => {
  for (const language of ["fr", "en"]) for (const path of publicPaths()) {
    const markdown = pageMarkdown(language, path);
    assert(markdown.startsWith("# "));
    assert(markdown.includes(`https://soeicam.com/${language}${path === "/" ? "" : path}`));
    assert(markdown.includes("info@soeicam.com"));
    assert(markdown.includes(`/${language}/terms`));
    assert(!markdown.includes("undefined"));
  }
  assert.equal(pageMarkdown("fr", "/api/enquiries"), null);
  assert.equal(pageMarkdown("fr", "/products/missing"), null);
  assert(llmsText().includes("/markdown/fr/products/stirred-nature-250g"));
  assert.match(pageMarkdown("fr", "/pricing"), /\| --- \| --- \| --- \| --- \|\n\| Yaourt/);
  assert(!pageMarkdown("fr", "/pricing").includes("|\n\n|"));
});

test("public agent tools return only catalogue data and validate all inputs", () => {
  assert.equal(publicAgentTools.length, 3);
  assert.equal(runPublicAgentTool("search_yola_products", {}).total, 22);
  const result = runPublicAgentTool("search_yola_products", { query: "Yola Fraise", category: "stirred", size: "250g" });
  assert.equal(result.total, 1);
  assert.equal(result.products[0].name, "Yola Fraise 250g");
  assert.equal(result.products[0].pricing.currency, "XAF");
  const prices = runPublicAgentTool("get_yola_reseller_prices", { category: "stirred", size: "250g" });
  assert.equal(prices.prices[0].supplyPrice, 425);
  assert.equal(prices.prices[0].recommendedSellingPrice, 500);
  for (const input of [null, [], { limit: 0 }, { limit: 500 }, { category: "private" }, { query: "a".repeat(81) }, { email: "private@example.test" }, JSON.parse('{"__proto__":{}}')]) assert.throws(() => runPublicAgentTool("search_yola_products", input));
  assert.throws(() => runPublicAgentTool("submit_order", {}));
  assert.throws(() => runPublicAgentTool("send_email", {}));
  const text = JSON.stringify(runPublicAgentTool("get_company_information", {}));
  assert(!/SMTP_PASSWORD|accessToken|customers|rccm|NIU/.test(text));
});

test("WebMCP registration supplies real read-only callbacks and cleans up", async () => {
  const calls = [];
  const removed = [];
  const cleanup = registerPublicBrowserTools({ registerTool: (tool, options) => calls.push({ tool, options }), unregisterTool: (name) => removed.push(name) }, "en");
  assert.equal(calls.length, 3);
  assert(calls.every(({ tool }) => tool.annotations.readOnlyHint && tool.inputSchema.additionalProperties === false));
  const reply = await calls.find(({ tool }) => tool.name === "search_yola_products").tool.execute({ category: "stirred", size: "250g" });
  assert.equal(reply.structuredContent.products.length, 3);
  assert.equal(reply.structuredContent.products[0].name, "Yola Natural 250g");
  cleanup();
  assert.equal(removed.length, 3);
  assert(calls.every(({ options }) => options.signal.aborted));
});

async function rpc(method, params = {}, { modern = false, host = "localhost:3010", origin, textBody } = {}) {
  const headers = { host, "content-type": "application/json", accept: "application/json, text/event-stream" };
  if (origin) headers.origin = origin;
  if (modern) {
    headers["MCP-Protocol-Version"] = "2026-07-28";
    headers["Mcp-Method"] = method;
    if (params.name || params.uri) headers["Mcp-Name"] = params.name || params.uri;
    params = { ...params, _meta: { "io.modelcontextprotocol/protocolVersion": "2026-07-28", "io.modelcontextprotocol/clientInfo": { name: "soeicam-test", version: "1.0.0" }, "io.modelcontextprotocol/clientCapabilities": {} } };
  }
  const response = await serveMcp(new Request("http://localhost:3010/mcp", { method: "POST", headers, body: textBody || JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }) }));
  const text = await response.text();
  const data = text.startsWith("event:") ? JSON.parse(text.split("\n").find((line) => line.startsWith("data: ")).slice(6)) : JSON.parse(text);
  return { response, data };
}

test("MCP discovery is backed by a working legacy and modern SDK endpoint", async () => {
  const init = await rpc("initialize", { protocolVersion: "2025-11-25", capabilities: {}, clientInfo: { name: "test", version: "1.0.0" } });
  assert.equal(init.response.status, 200);
  assert.equal(init.data.result.serverInfo.name, mcpServerCard.name);
  assert(init.data.result.capabilities.tools && init.data.result.capabilities.resources);
  assert.equal(legacyMcpCard.transport.endpoint, "https://soeicam.com/mcp");
  for (const modern of [false, true]) {
    const listed = await rpc("tools/list", {}, { modern });
    assert.equal(listed.response.status, 200, JSON.stringify(listed.data));
    assert.equal(listed.data.result.tools.length, 3);
    const called = await rpc("tools/call", { name: "get_yola_reseller_prices", arguments: { category: "stirred", size: "250g" } }, { modern });
    assert.equal(called.response.status, 200, JSON.stringify(called.data));
    const result = called.data.result.structuredContent || JSON.parse(called.data.result.content[0].text);
    assert.equal(result.currency, "XAF");
    assert.equal(result.prices[0].supplyPrice, 425);
    const resources = await rpc("resources/list", {}, { modern });
    assert.equal(resources.response.status, 200);
    assert.equal(resources.data.result.resources.length, 2);
    const guide = await rpc("resources/read", { uri: "https://soeicam.com/llms.txt" }, { modern });
    assert.equal(guide.response.status, 200, JSON.stringify(guide.data));
    assert(guide.data.result.contents[0].text.includes("/fr/pricing"));
    const card = await rpc("resources/read", { uri: "mcp://server-card.json" }, { modern });
    assert.equal(JSON.parse(card.data.result.contents[0].text).remotes[0].url, "https://soeicam.com/mcp");
  }
  for (const version of ["2025-03-26", "2025-06-18"]) {
    const initialized = await rpc("initialize", { protocolVersion: version, capabilities: {}, clientInfo: { name: "compatibility-test", version: "1.0.0" } });
    assert.equal(initialized.data.result.protocolVersion, version);
  }
});

test("MCP denies hostile origins, DNS rebinding hosts, oversized and invalid tool input", async () => {
  assert.equal((await rpc("tools/list", {}, { host: "attacker.example" })).response.status, 403);
  assert.equal((await rpc("tools/list", {}, { origin: "https://attacker.example" })).response.status, 403);
  assert.equal((await rpc("tools/list", {}, { origin: "https://soeicam.com" })).response.status, 200);
  assert.equal((await rpc("tools/list", {}, { textBody: "a".repeat(33000) })).response.status, 413);
  const invalid = await rpc("tools/call", { name: "search_yola_products", arguments: { limit: 9999 } });
  assert(invalid.data.error || invalid.data.result.isError);
  const unknown = await rpc("tools/call", { name: "submit_order", arguments: {} });
  assert(unknown.data.error || unknown.data.result.isError);
});
