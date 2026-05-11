export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  icon: string;
  category: "editor" | "codegen" | "dataops" | "specs";
}

export const TOOLS_REGISTRY: Record<string, ToolDefinition> = {
  "json-formatter": {
    id: "json-formatter",
    name: "JSON Editor",
    description: "Professional JSON editor with tree view, format, diff, and bidirectional transforms.",
    shortDescription: "Edit & diff JSON locally.",
    icon: "format",
    category: "editor",
  },
  "json-validator": {
    id: "json-validator",
    name: "JSON Validator",
    description: "Validate JSON instantly. All processing happens in your browser.",
    shortDescription: "Validate JSON locally.",
    icon: "lock",
    category: "editor",
  },
  "json-to-code": {
    id: "json-to-code",
    name: "JSON → Code",
    description: "Generate TypeScript interfaces, Zod schemas, Go structs, or Rust structs from any JSON.",
    shortDescription: "TypeScript · Zod · Go · Rust",
    icon: "code",
    category: "codegen",
  },
  "json-to-data": {
    id: "json-to-data",
    name: "JSON → Data",
    description: "Export JSON to SQL (with optional INSERT statements), CSV, or Excel spreadsheets.",
    shortDescription: "SQL · CSV · Excel",
    icon: "database",
    category: "dataops",
  },
  "json-to-spec": {
    id: "json-to-spec",
    name: "JSON → Specs",
    description: "Generate JSON Schema (draft 2020-12) or OpenAPI 3.0 YAML specification from a JSON sample.",
    shortDescription: "JSON Schema · OpenAPI",
    icon: "file",
    category: "specs",
  },
};

export const TOOLS_LIST = Object.values(TOOLS_REGISTRY);
