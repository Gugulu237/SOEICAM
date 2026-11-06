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

export async function readOutletRows(table: Table, config: Config, request: typeof fetch = fetch): Promise<ErpRow[]> {
  const base = new URL(config.url);
  if (base.protocol !== "https:" || base.username || base.password) throw new Error("Invalid outlet source configuration");
  const records: ErpRow[] = [];
  for (;;) {
    const url = new URL(`/rest/v1/${table}`, base.origin);
    url.search = new URLSearchParams({ select: fields[table], order: "id.asc", limit: String(PAGE_SIZE), offset: String(records.length) }).toString();
    const headers: Record<string, string> = { apikey: config.key, Accept: "application/json", Prefer: "count=exact" };
    // Legacy service-role keys are JWTs; new Supabase secret keys use apikey only.
    if (config.key.startsWith("eyJ")) headers.Authorization = `Bearer ${config.key}`;
    const response = await request(url, { headers, cache: "no-store", redirect: "error", signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error("Outlet source unavailable");
    const body = await response.text();
    if (body.length > 2_000_000) throw new Error("Outlet page exceeds limit");
    const page: unknown = JSON.parse(body);
    if (!Array.isArray(page) || page.some(row => !row || typeof row !== "object" || Array.isArray(row))) throw new Error("Invalid outlet response");
    records.push(...page);
    if (records.length > MAX_ROWS) throw new Error("Outlet source exceeds limit");
    const count = response.headers.get("content-range")?.split("/")[1];
    const total = count && /^\d+$/.test(count) ? Number(count) : null;
    if (total !== null ? records.length >= total : page.length < PAGE_SIZE) return records;
    if (!page.length || records.length >= MAX_ROWS) throw new Error("Incomplete outlet response");
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
      const source = config();
      if (!source.url || !source.key) throw new Error("Outlet source is not configured");
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
