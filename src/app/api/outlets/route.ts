import { getOutletSnapshot } from "@/server/outlet-source";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    return Response.json(await getOutletSnapshot(), { headers: { "Cache-Control": "no-store" } });
  } catch {
    // Never send database errors, source URLs, credentials or private records to visitors.
    return Response.json({ error: "outlets_unavailable" }, { status: 503, headers: { "Cache-Control": "no-store", "Retry-After": "60" } });
  }
}
