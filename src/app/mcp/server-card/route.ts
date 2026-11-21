import { mcpServerCard, serverCardHeaders } from "@/lib/mcp-card";

export const dynamic = "force-static";
export function GET() { return Response.json(mcpServerCard, { headers: serverCardHeaders }); }
