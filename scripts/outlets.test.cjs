require("./register-ts.cjs");
const test = require("node:test");
const assert = require("node:assert/strict");
const Module = require("node:module");
const originalLoad = Module._load;
Module._load = function(request, ...args) { return request === "server-only" ? {} : originalLoad.call(this, request, ...args); };
const { publicOutlets, coordinates, distanceKm, searchText, directionsUrl } = require("../src/lib/outlets.ts");
const { createOutletSource, readOutletRows, outletFailureDiagnostic } = require("../src/server/outlet-source.ts");
const shop = overrides => ({ id: "one", business_name: "Test shop", category: "shop", is_active: true, gps_lat: 3.85, gps_lng: 11.5, town: "Yaoundé", ...overrides });
const config = { url: "https://example.supabase.co", key: "server-test-key" };

test("public projection excludes finances, contacts, credentials and internal fields", () => {
  const [outlet] = publicOutlets([shop({ balance: 500000, phone: "private", contact_person: "private", email: "private", notes: "private", acquired_by_name: "private", extra_data: { secret: "private" } })], []);
  assert.deepEqual(Object.keys(outlet).sort(), ["id", "name", "group", "category", "address", "town", "neighbourhood", "lat", "lng"].sort());
  assert.equal(JSON.stringify(outlet).includes("private"), false);
});
test("only active retail customers and eligible branches are public", () => {
  const rows = [shop(), shop({ id: "off", is_active: false }), shop({ id: "cash", category: "cash_customer" }), shop({ id: "office", category: "institutional" }), shop({ id: "rejected", acquisition_verified: "rejected" }), shop({ id: "child", parent_id: "off" }), shop({ id: "orphan", parent_id: "missing" }), shop({ id: "cycle", parent_id: "cycle" })];
  assert.deepEqual(publicOutlets(rows, [{ id: "hidden", name: "Branch", customer_id: "off", gps_lat: 3.9, gps_lng: 11.6 }]).map(row => row.id), ["customer:one"]);
});
test("rejects invalid and missing GPS without inventing coordinates", () => {
  for (const gps_lat of [null, undefined, "", "  ", false, true, {}, [], "NaN", Infinity, 91]) assert.equal(coordinates({ gps_lat, gps_lng: 11.5 }), null);
  assert.equal(coordinates({ gps_lat: 3, gps_lng: 181 }), null);
  assert.equal(coordinates({ gps_lat: 0, gps_lng: 0 }), null);
  assert.deepEqual(coordinates({ gps_lat: "3.85", gps_lng: "11.5" }), { lat: 3.85, lng: 11.5 });
});
test("HQ locations replace legacy customer pins, distinct branches keep their own GPS", () => {
  const rows = publicOutlets([shop()], [
    { id: "hq", customer_id: "one", name: "Headquarters", is_headquarters: true, gps_lat: 3.9, gps_lng: 11.6 },
    { id: "branch", customer_id: "one", name: "Branch", gps_lat: 4, gps_lng: 12 },
    { id: "missing", customer_id: "one", name: "Missing GPS" },
    { id: "inactive", customer_id: "one", name: "Inactive", gps_lat: 4, gps_lng: 12, is_active: false },
  ]);
  assert.equal(rows.length, 2);
  assert.equal(rows.find(row => row.id === "location:branch").lat, 4);
  assert.equal(rows.some(row => row.id === "customer:one"), false);
});
test("distinct customer branches survive while duplicate location pins are omitted", () => {
  const rows = publicOutlets([shop(), shop({ id: "two", business_name: "Branch two", parent_id: "one", gps_lat: 4 })], [{ id: "hq", customer_id: "one", name: "Test shop", gps_lat: 3.85, gps_lng: 11.5 }]);
  assert.equal(rows.length, 2);
  assert.equal(rows.find(row => row.id === "customer:two").group, "Test shop");
});
test("accent-insensitive search, local distances and GPS directions", () => {
  assert.equal(searchText(" Yaoundé ÉTOA "), "yaounde etoa");
  assert.equal(distanceKm({ lat: 3, lng: 11 }, { lat: 3, lng: 11 }), 0);
  assert.ok(Math.abs(distanceKm({ lat: 0, lng: 0 }, { lat: 1, lng: 0 }) - 111.2) < .1);
  const url = new URL(directionsUrl({ lat: 3.85, lng: 11.5 }));
  assert.equal(url.searchParams.get("destination"), "3.85,11.5");
  assert.equal(url.searchParams.get("api"), "1");
});
test("source paginates even when upstream page size is smaller, selecting only necessary fields", async () => {
  let calls = 0;
  const records = await readOutletRows("customer", config, async (url, options) => {
    assert.equal(options.method, undefined);
    assert.equal(options.headers.apikey, config.key);
    assert.equal(options.redirect, "error");
    assert.equal(url.searchParams.get("select").includes("balance"), false);
    assert.equal(url.searchParams.get("select").includes("phone"), false);
    assert.equal(Number(url.searchParams.get("offset")), calls);
    calls++;
    return new Response(JSON.stringify([shop({ id: String(calls) })]), { headers: { "content-range": `${calls - 1}-${calls - 1}/3` } });
  });
  assert.equal(records.length, 3);
  assert.equal(calls, 3);
});
test("sync shares concurrent requests, refreshes edits and removals, and does not serve expired data on failure", async () => {
  let time = 100000, count = 0, rows = [shop()], failed = false;
  const source = createOutletSource(() => config, async url => {
    count++;
    if (failed) return new Response("private upstream error", { status: 500 });
    const data = url.pathname.endsWith("/customer") ? rows : [];
    return new Response(JSON.stringify(data));
  }, () => time);
  const initial = await Promise.all([source(), source()]);
  assert.equal(count, 2); assert.equal(initial[0].outlets.length, 1);
  await source(); assert.equal(count, 2);
  rows = [shop({ business_name: "Updated", gps_lat: 4 })]; time += 61000;
  assert.equal((await source()).outlets[0].name, "Updated");
  rows = []; time += 61000;
  assert.equal((await source()).outlets.length, 0);
  failed = true; time += 61000;
  await assert.rejects(source(), /unavailable/);
  failed = false; rows = [shop()];
  assert.equal((await source()).outlets.length, 1);
});
test("API failures return a generic 503 without source details", async () => {
  const source = require("../src/server/outlet-source.ts");
  const previous = source.getOutletSnapshot;
  const previousLog = console.error, logs = [];
  console.error = (...args) => logs.push(args);
  source.getOutletSnapshot = async () => { throw new Error("private credentials and database information"); };
  try {
    const { GET } = require("../src/app/api/outlets/route.ts");
    const response = await GET();
    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), { error: "outlets_unavailable" });
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.deepEqual(logs, [["[outlet-sync]", JSON.stringify({ reason: "unexpected" })]]);
    assert.equal(JSON.stringify(logs).includes("private"), false);
  } finally { source.getOutletSnapshot = previous; console.error = previousLog; }
});

test("pasted whitespace and surrounding quotes do not break the server credentials", async () => {
  const quoted = { url: `  "${config.url}"  `, key: `  '${config.key}'  ` };
  await readOutletRows("customer", quoted, async (url, options) => {
    assert.equal(url.origin, config.url);
    assert.equal(options.headers.apikey, config.key);
    return new Response("[]");
  });
});

test("missing runtime configuration is distinguished from invalid configuration without a network request", async () => {
  const noRequest = async () => { assert.fail("Misconfigured sources must not make a request"); };
  await assert.rejects(createOutletSource(() => ({ url: " ", key: "secret" }), noRequest)(), error => {
    assert.deepEqual(outletFailureDiagnostic(error), { reason: "missing_configuration", missing: ["ERP_SUPABASE_URL"] });
    return true;
  });
  await assert.rejects(readOutletRows("customer", { url: "https://user:private@example.com", key: "secret" }, noRequest), error => {
    assert.deepEqual(outletFailureDiagnostic(error), { reason: "invalid_configuration" });
    return true;
  });
});

test("database failures identify the table and status but never include upstream private details", async () => {
  for (const code of ["42501", "PGRST205", "private-credential"]) {
    await assert.rejects(readOutletRows("customer_location", config, async () => new Response(JSON.stringify({ code, message: "private credentials", details: "private customer" }), { status: 403 })), error => {
      const diagnostic = outletFailureDiagnostic(error);
      assert.equal(diagnostic.reason, "database_rejected_request");
      assert.equal(diagnostic.table, "customer_location");
      assert.equal(diagnostic.status, 403);
      assert.equal(diagnostic.databaseCode, code.startsWith("private") ? undefined : code);
      assert.equal(JSON.stringify(diagnostic).includes("private"), false);
      return true;
    });
  }
});

test("timeouts, connection failures and invalid replies have safe distinct diagnostics", async () => {
  for (const [request, expected] of [
    [async () => { throw new DOMException("private URL", "TimeoutError"); }, "request_timeout"],
    [async () => { throw new TypeError("private connection URL"); }, "connection_failed"],
    [async () => new Response("private invalid JSON"), "invalid_response"],
  ]) {
    await assert.rejects(readOutletRows("customer", config, request), error => {
      assert.deepEqual(outletFailureDiagnostic(error), { reason: expected, table: "customer" });
      return true;
    });
  }
});
