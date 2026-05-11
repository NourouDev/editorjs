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
    name: "JSON Validator",
    description: "Validate JSON instantly. All processing happens in your browser.",
    shortDescription: "Validate JSON locally.",
    icon: "lock"
  },
  "json-formatter": {
    id: "json-formatter",
    name: "JSON Editor",
    description: "Professional JSON editor with tree view, format, diff, and bidirectional transforms.",
    shortDescription: "Edit JSON locally.",
    icon: "format"
  },
  "json-to-typescript": {
    id: "json-to-typescript",
    name: "JSON → TypeScript",
    description: "Convert any JSON object into TypeScript interfaces instantly. Handles nested objects, arrays, optional fields, and union types.",
    shortDescription: "Generate TypeScript interfaces from JSON.",
    icon: "code"
  },
  "json-to-sql": {
    id: "json-to-sql",
    name: "JSON → SQL Schema",
    description: "Generate PostgreSQL CREATE TABLE statements from a JSON structure. Detects types, handles nested objects as foreign keys, and arrays as junction tables.",
    shortDescription: "Generate SQL schema from JSON.",
    icon: "database"
  }
};

export const TOOLS_LIST = Object.values(TOOLS_REGISTRY);
