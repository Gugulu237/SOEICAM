import { createMcpHandler, fromJsonSchema, hostHeaderValidationResponse, originValidationResponse, McpServer, type JsonSchemaType } from "@modelcontextprotocol/server";
import { publicAgentTools, runPublicAgentTool } from "./agent-catalogue";
import { company } from "./company";
import { llmsText } from "./markdown";
import { mcpIdentity, mcpServerCard, mcpProtocolVersions } from "./mcp-card";

function buildServer() {
  const server = new McpServer(mcpIdentity, {
    supportedProtocolVersions: mcpProtocolVersions,
    maxToolInputElements: 32,
    instructions: "Read-only public SOEICAM catalogue. Prices are indicative XAF reseller prices; do not claim live stock, order acceptance or payment. No customer data or message submission tools are available.",
  });
  for (const tool of publicAgentTools) {
    server.registerTool(tool.name, {
      description: tool.description,
      inputSchema: fromJsonSchema<Record<string, unknown>>(tool.inputSchema as unknown as JsonSchemaType),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    }, async (input) => {
      const result = runPublicAgentTool(tool.name, input);
      return { content: [{ type: "text" as const, text: JSON.stringify(result) }], structuredContent: result };
    });
  }
  server.registerResource("site-guide", `${company.site}/llms.txt`, { mimeType: "text/plain", description: "Public SOEICAM site guide and page links." }, async (uri) => ({
    contents: [{ uri: uri.href, mimeType: "text/plain", text: llmsText() }],
  }));
  server.registerResource("server-card", "mcp://server-card.json", { mimeType: "application/json" }, async (uri) => ({
    contents: [{ uri: uri.href, mimeType: "application/json", text: JSON.stringify(mcpServerCard) }],
  }));
  return server;
}

const handler = createMcpHandler(buildServer, { legacy: "stateless", responseMode: "json", maxRequestBodySize: 32768 });
const hosts = ["soeicam.com", "www.soeicam.com", "localhost", "127.0.0.1", "[::1]"];

export async function serveMcp(request: Request) {
  const rejected = hostHeaderValidationResponse(request, hosts) ?? originValidationResponse(request, hosts);
  if (rejected) return rejected;
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: {
    "Allow": "POST, OPTIONS",
    "Access-Control-Allow-Origin": request.headers.get("origin") || company.site,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept, MCP-Protocol-Version, Mcp-Method, Mcp-Name",
    "Vary": "Origin",
  } });
  try {
    const response = await handler.fetch(request);
    response.headers.set("Cache-Control", "no-store");
    response.headers.set("X-Robots-Tag", "noindex");
    response.headers.set("X-Content-Type-Options", "nosniff");
    if (request.headers.get("origin")) {
      response.headers.set("Access-Control-Allow-Origin", request.headers.get("origin")!);
      response.headers.append("Vary", "Origin");
    }
    return response;
  } catch {
    return Response.json({ error: "Public catalogue service is unavailable." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
