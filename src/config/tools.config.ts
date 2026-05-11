export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  icon: string; // SVG path data
}

export const TOOLS_REGISTRY: Record<string, ToolDefinition> = {
  "json-validator": {
    id: "json-validator",
    name: "JSON Validator",
    description: "Validate JSON instantly. All processing happens in your browser.",
    shortDescription: "Validate JSON locally.",
    icon: "lock" // SVG icon key
  },
  "json-formatter": {
    id: "json-formatter",
    name: "JSON Editor",
    description: "Professional JSON editor with tree view, format, diff, and bidirectional transforms.",
    shortDescription: "Edit JSON locally.",
    icon: "format"
  }
};

export const TOOLS_LIST = Object.values(TOOLS_REGISTRY);
