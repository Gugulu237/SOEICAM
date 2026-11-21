import { company } from "./company";

export const mcpIdentity = { name: "com.soeicam/catalogue", title: "SOEICAM Yola public catalogue", version: "1.0.0" };
export const mcpProtocolVersions = ["2026-07-28", "2025-11-25", "2025-06-18", "2025-03-26"];
const description = "Read public Yola products, indicative reseller prices and SOEICAM business contacts.";
export const mcpCapabilities = { tools: {}, resources: {} };

// SEP-1649 compatibility discovery at the location requested by the audit.
export const legacyMcpCard = {
  version: "1.0",
  protocolVersion: "2026-07-28",
  serverInfo: mcpIdentity,
  description,
  documentationUrl: `${company.site}/llms.txt`,
  transport: { type: "streamable-http", endpoint: `${company.site}/mcp` },
  capabilities: mcpCapabilities,
};

// Current experimental Server Card extension shape; runtime discovery is authoritative.
export const mcpServerCard = {
  $schema: "https://static.modelcontextprotocol.io/schemas/v1/server-card.schema.json",
  ...mcpIdentity,
  description,
  websiteUrl: company.site,
  repository: { url: "https://github.com/Gugulu237/SOEICAM", source: "github" },
  icons: [{ src: `${company.site}/brand/logos/soeicam.png`, mimeType: "image/png" }],
  remotes: [{
    type: "streamable-http",
    url: `${company.site}/mcp`,
    supportedProtocolVersions: mcpProtocolVersions,
  }],
  _meta: { "com.soeicam/capabilities": mcpCapabilities, "com.soeicam/readOnly": true },
};

export const serverCardHeaders = {
  "Content-Type": "application/json; charset=utf-8",
  "Access-Control-Allow-Origin": "*",
  "Cache-Control": "public, max-age=300",
  "X-Content-Type-Options": "nosniff",
};
