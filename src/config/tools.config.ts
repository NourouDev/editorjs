export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  icon: string;
}

export const TOOLS_REGISTRY: Record<string, ToolDefinition> = {
  "json-validator": {
    id: "json-validator",
    name: "JSON Validator & Formatter",
    description: "Lightning-fast, client-side only JSON validator and formatter that handles massive payloads without freezing the browser.",
    shortDescription: "Validate and format JSON locally.",
    icon: "🔒"
  },
  "json-formatter": {
    id: "json-formatter",
    name: "JSON Formatter",
    description: "Pretty print your JSON strings instantly. 100% private, 100% client-side.",
    shortDescription: "Pretty print JSON locally.",
    icon: "✨"
  }
};

export const TOOLS_LIST = Object.values(TOOLS_REGISTRY);
