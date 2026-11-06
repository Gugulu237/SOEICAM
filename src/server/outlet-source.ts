import "server-only";
import { publicOutlets, type ErpRow, type OutletSnapshot } from "@/lib/outlets";

const fields = {
  customer: "id,business_name,parent_id,category,address,town,neighbourhood,gps_lat,gps_lng,is_active,acquisition_verified",
  customer_location: "id,customer_id,name,is_headquarters,address,town,neighbourhood,gps_lat,gps_lng,is_active",
} as const;
type Table = keyof typeof fields;
type Config = { url: string; key: string };
const PAGE_SIZE = 500;
const MAX_ROWS = 20000;

type FailureReason = "missing_configuration" | "invalid_configuration" | "request_timeout" | "connection_failed" | "database_rejected_request" | "invalid_response" | "response_limit" | "incomplete_response" | "unexpected";
type OutletFailure = {
  reason: FailureReason;
  table?: Table;
  status?: number;
  databaseCode?: string;
  missing?: string[];
};
class OutletSourceError extends Error {
  constructor(readonly diagnostic: OutletFailure) {
    super("Outlet source unavailable");
  }
}

// Log only our controlled fields, never an upstream message, URL, key or record.
export function outletFailureDiagnostic(error: unknown): OutletFailure {
  return error instanceof OutletSourceError ? error.diagnostic : { reason: "unexpected" };
}

function environmentValue(value: string): string {
  const trimmed = value.trim();
  return /^(".*"|'.*')$/.test(trimmed) ? trimmed.slice(1, -1).trim() : trimmed;
}

function sourceConfig(config: Config): Config {
  const url = environmentValue(config.url), key = environmentValue(config.key);
  const missing = [!url && "ERP_SUPABASE_URL", !key && "ERP_SUPABASE_SECRET_KEY"].filter((name): name is string => !!name);
  if (missing.length) throw new OutletSourceError({ reason: "missing_configuration", missing });
  try {
    const base = new URL(url);
    if (base.protocol !== "https:" || base.username || base.password) throw new Error();
    return { url: base.origin, key };
  } catch {
    throw new OutletSourceError({ reason: "invalid_configuration" });
  }
}

function databaseCode(body: string): string | undefined {
  try {
    const code: unknown = JSON.parse(body)?.code;
    return typeof code === "string" && /^(PGRST\d{3}|[0-9A-Z]{5})$/.test(code) ? code : undefined;
  } catch { return undefined; }
}

export async function readOutletRows(table: Table, config: Config, request: typeof fetch = fetch): Promise<ErpRow[]> {
  const source = sourceConfig(config);
  const records: ErpRow[] = [];
  for (;;) {
    const url = new URL(`/rest/v1/${table}`, source.url);
    url.search = new URLSearchParams({ select: fields[table], order: "id.asc", limit: String(PAGE_SIZE), offset: String(records.length) }).toString();
    const headers: Record<string, string> = { apikey: source.key, Accept: "application/json", Prefer: "count=exact" };
    // Legacy service-role keys are JWTs; new Supabase secret keys use apikey only.
    if (source.key.startsWith("eyJ")) headers.Authorization = `Bearer ${source.key}`;
    let response: Response, body: string;
    try {
      response = await request(url, { headers, cache: "no-store", redirect: "error", signal: AbortSignal.timeout(10000) });
      body = await response.text();
    } catch (error) {
      const timedOut = error instanceof Error && ["AbortError", "TimeoutError"].includes(error.name);
      throw new OutletSourceError({ reason: timedOut ? "request_timeout" : "connection_failed", table });
    }
    if (body.length > 2_000_000) throw new OutletSourceError({ reason: "response_limit", table });
    if (!response.ok) throw new OutletSourceError({ reason: "database_rejected_request", table, status: response.status, databaseCode: databaseCode(body) });
    let page: unknown;
    try { page = JSON.parse(body); } catch { throw new OutletSourceError({ reason: "invalid_response", table }); }
    if (!Array.isArray(page) || page.some(row => !row || typeof row !== "object" || Array.isArray(row))) throw new OutletSourceError({ reason: "invalid_response", table });
    records.push(...page);
    if (records.length > MAX_ROWS) throw new OutletSourceError({ reason: "response_limit", table });
    const count = response.headers.get("content-range")?.split("/")[1];
    const total = count && /^\d+$/.test(count) ? Number(count) : null;
    if (total !== null ? records.length >= total : page.length < PAGE_SIZE) return records;
    if (!page.length || records.length >= MAX_ROWS) throw new OutletSourceError({ reason: "incomplete_response", table });
  }
}

// One refresh per process, at most once per minute. No permanent customer export.
export function createOutletSource(config: () => Config, request: typeof fetch = fetch, now = Date.now) {
  let saved: OutletSnapshot | undefined;
  let expires = 0;
  let pending: Promise<OutletSnapshot> | undefined;
  return async (): Promise<OutletSnapshot> => {
    if (saved && now() < expires) return saved;
    if (pending) return pending;
    pending = (async () => {
      const source = sourceConfig(config());
      const [customers, locations] = await Promise.all([
        readOutletRows("customer", source, request), readOutletRows("customer_location", source, request),
      ]);
      saved = { outlets: publicOutlets(customers, locations), syncedAt: new Date(now()).toISOString() };
      expires = now() + 60000;
      return saved;
    })();
    try { return await pending; } finally { pending = undefined; }
  };
}

export const getOutletSnapshot = createOutletSource(() => ({
  url: process.env.ERP_SUPABASE_URL || "",
  key: process.env.ERP_SUPABASE_SECRET_KEY || "",
}));
