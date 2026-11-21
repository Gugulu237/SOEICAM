import { serveMcp } from "@/lib/mcp-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const POST = serveMcp;
export const GET = serveMcp;
export const DELETE = serveMcp;
export const OPTIONS = serveMcp;
