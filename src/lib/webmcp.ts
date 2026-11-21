import { publicAgentTools, runPublicAgentTool } from "./agent-catalogue";

type BrowserTool = {
  name: string;
  description: string;
  inputSchema: object;
  annotations: { readOnlyHint: boolean };
  execute: (input: unknown) => Promise<object>;
};
export type BrowserModelContext = {
  registerTool: (tool: BrowserTool, options?: { signal: AbortSignal }) => unknown;
  unregisterTool?: (name: string) => void;
};

export function registerPublicBrowserTools(context: BrowserModelContext, language: "fr" | "en") {
  const controller = new AbortController();
  const registered: string[] = [];
  for (const tool of publicAgentTools) {
    try {
      const registration = context.registerTool({
        ...tool,
        annotations: { readOnlyHint: true },
        execute: async (input) => {
          const result = runPublicAgentTool(tool.name, input, language);
          return { content: [{ type: "text", text: JSON.stringify(result) }], structuredContent: result };
        },
      }, { signal: controller.signal });
      registered.push(tool.name);
      // Feature-detect the native API, without installing a fake browser polyfill.
      Promise.resolve(registration).catch(() => {});
    } catch {
      // An unsupported experimental API must not break the storefront.
    }
  }
  return () => {
    controller.abort();
    for (const name of registered) {
      try { context.unregisterTool?.(name); } catch { /* Already unregistered. */ }
    }
  };
}
