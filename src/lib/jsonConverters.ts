// ─────────────────────────────────────────────────────────────────────────────
// Shared utilities
// ─────────────────────────────────────────────────────────────────────────────

export function toPascalCase(s: string): string {
  return s.replace(/(^|[-_ ])(.)/g, (_, __, c) => c.toUpperCase()).replace(/[^a-zA-Z0-9]/g, "") || "Root";
}

export function toCamelCase(s: string): string {
  const p = toPascalCase(s);
  return p.charAt(0).toLowerCase() + p.slice(1);
}

export function toSnakeCase(s: string): string {
  return s
    .replace(/([A-Z])/g, "_$1").toLowerCase()
    .replace(/^_/, "").replace(/[^a-z0-9_]/g, "_").replace(/__+/g, "_");
}

// ─────────────────────────────────────────────────────────────────────────────
// JSON → TypeScript Interfaces
// ─────────────────────────────────────────────────────────────────────────────

function collectTsInterfaces(
  name: string, value: unknown,
  interfaces: Map<string, string>, seen: WeakSet<object>
): string {
  if (value === null || typeof value !== "object") return inferTsPrimitive(value);
  if (Array.isArray(value)) {
    if (!value.length) return "unknown[]";
    const first = value[0];
    if (first !== null && typeof first === "object" && !Array.isArray(first)) {
      const childName = toPascalCase(name.replace(/s$/, ""));
      collectTsInterfaces(childName, first, interfaces, seen);
      return `${childName}[]`;
    }
    const types = [...new Set(value.map(i => inferTsPrimitive(i)))];
    return types.length === 1 ? `${types[0]}[]` : `(${types.join(" | ")})[]`;
  }
  if (seen.has(value as object)) return name;
  seen.add(value as object);
  const fields = Object.entries(value as Record<string, unknown>).map(([k, v]) => {
    const safe = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : `"${k}"`;
    return `  ${safe}: ${collectTsInterfaces(toPascalCase(k), v, interfaces, seen)};`;
  });
  interfaces.set(name, `export interface ${name} {\n${fields.join("\n")}\n}`);
  return name;
}

function inferTsPrimitive(v: unknown): string {
  if (v === null) return "null";
  if (typeof v === "boolean") return "boolean";
  if (typeof v === "number") return "number";
  if (typeof v === "string") return "string";
  return "unknown";
}

export function jsonToTypeScript(json: unknown, rootName = "Root"): string {
  const interfaces = new Map<string, string>();
  collectTsInterfaces(toPascalCase(rootName), json, interfaces, new WeakSet());
  if (!interfaces.size) return `export type ${toPascalCase(rootName)} = ${inferTsPrimitive(json)};`;
  return [...interfaces.values()].join("\n\n");
}

// ─────────────────────────────────────────────────────────────────────────────
// JSON → Zod Schema
// ─────────────────────────────────────────────────────────────────────────────

function zodExpr(val: unknown, depth: number, schemas: Map<string, string>, name: string): string {
  if (val === null) return "z.null()";
  if (typeof val === "boolean") return "z.boolean()";
  if (typeof val === "number") return Number.isInteger(val) ? "z.number().int()" : "z.number()";
  if (typeof val === "string") {
    if (/^\d{4}-\d{2}-\d{2}T/.test(val)) return "z.string().datetime()";
    if (/^[\w.+-]+@[\w-]+\.\w+$/.test(val)) return "z.string().email()";
    if (/^https?:\/\//.test(val)) return "z.string().url()";
    return "z.string()";
  }
  if (Array.isArray(val)) {
    if (!val.length) return "z.array(z.unknown())";
    // Use only first item for schema inference — avoids O(n) on large arrays
    const first = zodExpr(val[0], depth, schemas, name.replace(/s$/, ""));
    return `z.array(${first})`;
  }
  if (typeof val === "object") {
    const schemaName = `${toCamelCase(name)}Schema`;
    const pad = "  ".repeat(depth + 1);
    const fields = Object.entries(val as Record<string, unknown>)
      .map(([k, v]) => `${pad}${k}: ${zodExpr(v, depth + 1, schemas, k)}`).join(",\n");
    const expr = `z.object({\n${fields}\n${"  ".repeat(depth)}})`;
    schemas.set(schemaName, `export const ${schemaName} = ${expr};`);
    return schemaName;
  }
  return "z.unknown()";
}

export function jsonToZod(json: unknown, rootName = "Root"): string {
  const schemas = new Map<string, string>();
  const rootSchemaName = `${toCamelCase(rootName)}Schema`;
  const rootExpr = zodExpr(json, 0, schemas, rootName);
  const typeExport = `export type ${toPascalCase(rootName)} = z.infer<typeof ${rootSchemaName}>;`;
  const header = `import { z } from "zod";\n`;

  if (!schemas.has(rootSchemaName)) {
    return `${header}\nexport const ${rootSchemaName} = ${rootExpr};\n\n${typeExport}`;
  }
  return `${header}\n${[...schemas.values()].join("\n\n")}\n\n${typeExport}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// JSON → Go Structs
// ─────────────────────────────────────────────────────────────────────────────

function goType(val: unknown, fieldName: string, structs: Map<string, string>, seen: WeakSet<object>): string {
  if (val === null) return "interface{}";
  if (typeof val === "boolean") return "bool";
  if (typeof val === "number") return Number.isInteger(val) ? "int64" : "float64";
  if (typeof val === "string") {
    if (/^\d{4}-\d{2}-\d{2}/.test(val)) return "time.Time";
    return "string";
  }
  if (Array.isArray(val)) {
    if (!val.length) return "[]interface{}";
    return `[]${goType(val[0], fieldName.replace(/s$/, ""), structs, seen)}`;
  }
  if (typeof val === "object") {
    if (seen.has(val as object)) return toPascalCase(fieldName);
    seen.add(val as object);
    const structName = toPascalCase(fieldName);
    const fields = Object.entries(val as Record<string, unknown>).map(([k, v]) => {
      const fName = toPascalCase(k);
      const fType = goType(v, k, structs, seen);
      return `\t${fName} ${fType} \`json:"${k}" yaml:"${k}"\``;
    });
    structs.set(structName, `type ${structName} struct {\n${fields.join("\n")}\n}`);
    return structName;
  }
  return "interface{}";
}

export function jsonToGo(json: unknown, rootName = "Root", pkgName = "main"): string {
  const structs = new Map<string, string>();
  goType(json, rootName, structs, new WeakSet());
  const needsTime = [...structs.values()].some(s => s.includes("time.Time"));
  const imports = needsTime ? `import (\n\t"time"\n)\n\n` : "";
  return `package ${pkgName}\n\n${imports}${[...structs.values()].reverse().join("\n\n")}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// JSON → Rust Structs (with serde)
// ─────────────────────────────────────────────────────────────────────────────

function rustType(val: unknown, fieldName: string, structs: Map<string, string>, seen: WeakSet<object>): string {
  if (val === null) return "Option<serde_json::Value>";
  if (typeof val === "boolean") return "bool";
  if (typeof val === "number") return Number.isInteger(val) ? "i64" : "f64";
  if (typeof val === "string") {
    if (/^\d{4}-\d{2}-\d{2}T/.test(val)) return "String"; // or chrono::DateTime<Utc>
    return "String";
  }
  if (Array.isArray(val)) {
    if (!val.length) return "Vec<serde_json::Value>";
    return `Vec<${rustType(val[0], fieldName.replace(/s$/, ""), structs, seen)}>`;
  }
  if (typeof val === "object") {
    if (seen.has(val as object)) return toPascalCase(fieldName);
    seen.add(val as object);
    const structName = toPascalCase(fieldName);
    const fields = Object.entries(val as Record<string, unknown>).map(([k, v]) => {
      const snakeName = toSnakeCase(k);
      const fType = rustType(v, k, structs, seen);
      const nullable = v === null ? `Option<${fType.replace("Option<serde_json::Value>", "serde_json::Value")}>` : fType;
      const rename = snakeName !== k ? `    #[serde(rename = "${k}")]\n` : "";
      return `${rename}    pub ${snakeName}: ${nullable},`;
    });
    const struct = `#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]\npub struct ${structName} {\n${fields.join("\n")}\n}`;
    structs.set(structName, struct);
    return structName;
  }
  return "serde_json::Value";
}

export function jsonToRust(json: unknown, rootName = "Root"): string {
  const structs = new Map<string, string>();
  rustType(json, rootName, structs, new WeakSet());
  return `use serde::{Deserialize, Serialize};\n\n${[...structs.values()].reverse().join("\n\n")}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// JSON → JSON Schema (draft 2020-12)
// ─────────────────────────────────────────────────────────────────────────────

function jsonSchemaFor(val: unknown): object {
  if (val === null) return { type: "null" };
  if (typeof val === "boolean") return { type: "boolean" };
  if (typeof val === "number") return Number.isInteger(val) ? { type: "integer" } : { type: "number" };
  if (typeof val === "string") {
    if (/^\d{4}-\d{2}-\d{2}T/.test(val)) return { type: "string", format: "date-time" };
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return { type: "string", format: "date" };
    if (/^[\w.+-]+@[\w-]+\.\w+$/.test(val)) return { type: "string", format: "email" };
    if (/^https?:\/\//.test(val)) return { type: "string", format: "uri" };
    return { type: "string" };
  }
  if (Array.isArray(val)) {
    if (!val.length) return { type: "array" };
    const itemSchema = jsonSchemaFor(val[0]);
    return { type: "array", items: itemSchema };
  }
  if (typeof val === "object") {
    const properties: Record<string, object> = {};
    const required: string[] = [];
    for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
      properties[k] = jsonSchemaFor(v);
      if (v !== null && v !== undefined) required.push(k);
    }
    return { type: "object", properties, ...(required.length ? { required } : {}) };
  }
  return {};
}

export function jsonToJsonSchema(json: unknown, title = "Schema"): string {
  const schema = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    title,
    ...jsonSchemaFor(json),
  };
  return JSON.stringify(schema, null, 2);
}

// ─────────────────────────────────────────────────────────────────────────────
// JSON → OpenAPI 3.0 (YAML-ish, output as JSON or YAML)
// ─────────────────────────────────────────────────────────────────────────────

function openApiSchemaFor(val: unknown, defs: Map<string, object>, name: string): object {
  if (val === null) return { nullable: true, type: "string" };
  if (typeof val === "boolean") return { type: "boolean" };
  if (typeof val === "number") return Number.isInteger(val) ? { type: "integer", example: val } : { type: "number", example: val };
  if (typeof val === "string") {
    if (/^\d{4}-\d{2}-\d{2}T/.test(val)) return { type: "string", format: "date-time", example: val };
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return { type: "string", format: "date", example: val };
    if (/^[\w.+-]+@[\w-]+\.\w+$/.test(val)) return { type: "string", format: "email", example: val };
    if (/^https?:\/\//.test(val)) return { type: "string", format: "uri", example: val };
    return { type: "string", example: val };
  }
  if (Array.isArray(val)) {
    if (!val.length) return { type: "array", items: {} };
    return { type: "array", items: openApiSchemaFor(val[0], defs, name.replace(/s$/, "")) };
  }
  if (typeof val === "object") {
    const schemaName = toPascalCase(name);
    const properties: Record<string, object> = {};
    const required: string[] = [];
    for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
      properties[k] = openApiSchemaFor(v, defs, k);
      if (v !== null) required.push(k);
    }
    const schema = { type: "object", properties, ...(required.length ? { required } : {}) };
    defs.set(schemaName, schema);
    return { $ref: `#/components/schemas/${schemaName}` };
  }
  return {};
}

// Minimal YAML serializer (no deps needed)
function toYaml(val: unknown, indent = 0): string {
  const pad = "  ".repeat(indent);
  if (val === null) return "null";
  if (typeof val === "boolean") return String(val);
  if (typeof val === "number") return String(val);
  if (typeof val === "string") {
    if (/[:{}\[\],&*#?|<>=!%@`\n]/.test(val) || val.trim() !== val) return JSON.stringify(val);
    return val;
  }
  if (Array.isArray(val)) {
    if (!val.length) return "[]";
    return val.map(item => `\n${pad}- ${toYaml(item, indent + 1)}`).join("");
  }
  if (typeof val === "object") {
    const entries = Object.entries(val as object);
    if (!entries.length) return "{}";
    return entries.map(([k, v]) => {
      const yamlVal = toYaml(v, indent + 1);
      const isBlock = typeof v === "object" && v !== null && !Array.isArray(v) && Object.keys(v).length > 0;
      return `\n${pad}${k}:${isBlock ? yamlVal : ` ${yamlVal}`}`;
    }).join("");
  }
  return String(val);
}

export function jsonToOpenApi(json: unknown, title = "Generated API", asYaml = true): string {
  const defs = new Map<string, object>();
  const rootRef = openApiSchemaFor(json, defs, "Root");
  const schemas: Record<string, object> = {};
  for (const [k, v] of defs) schemas[k] = v;

  const spec = {
    openapi: "3.0.3",
    info: { title, version: "1.0.0", description: "Auto-generated from JSON sample" },
    paths: {
      "/items": {
        get: {
          summary: "Retrieve items",
          operationId: "getItems",
          responses: {
            "200": {
              description: "Successful response",
              content: { "application/json": { schema: rootRef } },
            },
          },
        },
        post: {
          summary: "Create item",
          operationId: "createItem",
          requestBody: {
            required: true,
            content: { "application/json": { schema: rootRef } },
          },
          responses: {
            "201": { description: "Created", content: { "application/json": { schema: rootRef } } },
          },
        },
      },
    },
    components: { schemas },
  };

  if (!asYaml) return JSON.stringify(spec, null, 2);
  return `# OpenAPI 3.0 — generated from JSON\n# Edit title and paths as needed\n${toYaml(spec).slice(1)}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// JSON → SQL (CREATE TABLE + optional INSERT)
// ─────────────────────────────────────────────────────────────────────────────

function sqlColType(val: unknown): string {
  if (val === null) return "TEXT";
  if (typeof val === "boolean") return "BOOLEAN";
  if (typeof val === "number") return Number.isInteger(val) ? "INTEGER" : "REAL";
  if (typeof val === "string") {
    if (/^\d{4}-\d{2}-\d{2}(T|$)/.test(val)) return "TIMESTAMP";
    return val.length > 255 ? "TEXT" : "VARCHAR(255)";
  }
  return "JSONB";
}

function sqlEscape(val: unknown): string {
  if (val === null) return "NULL";
  if (typeof val === "boolean") return val ? "TRUE" : "FALSE";
  if (typeof val === "number") return String(val);
  if (typeof val === "object") return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
  return `'${String(val).replace(/'/g, "''")}'`;
}

function generateTable(
  tableName: string, obj: Record<string, unknown>,
  tables: Array<{ ddl: string; tableName: string; rows: Record<string, unknown>[] }>,
  fk?: string, dataRows?: Record<string, unknown>[]
): void {
  const snakeName = toSnakeCase(tableName);
  const cols: string[] = [`  id SERIAL PRIMARY KEY`];
  if (fk) cols.push(`  ${toSnakeCase(fk)}_id INTEGER REFERENCES ${toSnakeCase(fk)}(id)`);

  const allRows = dataRows ?? [obj];

  for (const [key, value] of Object.entries(obj)) {
    const col = toSnakeCase(key);
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      const childRows = allRows
        .map(r => (r[key] as Record<string, unknown> | null) ?? {})
        .filter(Boolean)
        .slice(0, 10) as Record<string, unknown>[];
      generateTable(`${tableName}_${toPascalCase(key)}`, value as Record<string, unknown>, tables, snakeName, childRows);
      cols.push(`  ${col}_id INTEGER REFERENCES ${toSnakeCase(`${tableName}_${toPascalCase(key)}`)}(id)`);
    } else if (Array.isArray(value)) {
      const first = value[0];
      if (first !== null && typeof first === "object" && !Array.isArray(first)) {
        const childRows: Record<string, unknown>[] = [];
        for (const r of allRows) {
          const arr = (r[key] as unknown[]) || [];
          for (const item of arr) {
            if (item !== null && typeof item === "object" && !Array.isArray(item)) {
              childRows.push(item as Record<string, unknown>);
              if (childRows.length >= 10) break;
            }
          }
          if (childRows.length >= 10) break;
        }
        generateTable(`${tableName}_${toPascalCase(key)}`, first as Record<string, unknown>, tables, snakeName, childRows);
      } else {
        cols.push(`  ${col} JSONB -- array`);
      }
    } else {
      const nullable = value === null ? "" : " NOT NULL";
      cols.push(`  ${col} ${sqlColType(value)}${nullable}`);
    }
  }

  const ddl = `CREATE TABLE IF NOT EXISTS ${snakeName} (\n${cols.join(",\n")}\n);`;
  tables.push({ ddl, tableName: snakeName, rows: allRows });
}

export function jsonToSql(json: unknown, rootName = "table", includeInserts = false): string {
  const tables: Array<{ ddl: string; tableName: string; rows: Record<string, unknown>[] }> = [];

  if (json === null || typeof json !== "object") {
    return `-- Cannot generate schema from a primitive value (${JSON.stringify(json)})`;
  }

  let source: Record<string, unknown>;
  let dataRows: Record<string, unknown>[] = [];

  if (Array.isArray(json)) {
    if (!json.length) return "-- Empty array";
    const first = json[0];
    if (typeof first !== "object" || first === null || Array.isArray(first)) {
      return `CREATE TABLE ${toSnakeCase(rootName)} (\n  id SERIAL PRIMARY KEY,\n  value TEXT NOT NULL\n);`;
    }
    source = first as Record<string, unknown>;
    dataRows = includeInserts ? (json as Record<string, unknown>[]).slice(0, 10) : [];
  } else {
    source = json as Record<string, unknown>;
    dataRows = includeInserts ? [source] : [];
  }

  generateTable(toPascalCase(rootName), source, tables, undefined, dataRows);

  const lines: string[] = [
    `-- Generated SQL Schema`,
    `-- Dialect: PostgreSQL (adjust for MySQL/SQLite)`,
    `-- Generated: ${new Date().toISOString()}`,
    ``,
  ];

  const MAX_INSERTS = 10;
  for (const t of tables.reverse()) {
    lines.push(t.ddl);
    if (includeInserts && t.rows.length > 0) {
      lines.push("");
      // Cap at MAX_INSERTS per table — safe for large datasets
      const sampleRows = t.rows.slice(0, MAX_INSERTS);
      const tableSource = sampleRows[0] ? Object.keys(sampleRows[0]) : [];
      for (const row of sampleRows) {
        const cols = tableSource.filter(k => {
          const v = row[k];
          return !(v !== null && typeof v === "object" && !Array.isArray(v));
        });
        if (!cols.length) continue;
        const colNames = cols.map(toSnakeCase).join(", ");
        const vals = cols.map(k => sqlEscape(row[k])).join(", ");
        lines.push(`INSERT INTO ${t.tableName} (${colNames}) VALUES (${vals});`);
      }
    }
    lines.push("");
  }

  return lines.join("\n");
}

// ─────────────────────────────────────────────────────────────────────────────
// JSON → CSV  (flattens array of objects)
// ─────────────────────────────────────────────────────────────────────────────

function flattenObject(obj: Record<string, unknown>, prefix = ""): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === "object" && !Array.isArray(v)) {
      Object.assign(out, flattenObject(v as Record<string, unknown>, key));
    } else if (Array.isArray(v)) {
      out[key] = JSON.stringify(v);
    } else {
      out[key] = v === null ? "" : String(v);
    }
  }
  return out;
}

function csvEscape(val: string): string {
  if (/[",\n\r]/.test(val)) return `"${val.replace(/"/g, '""')}"`;
  return val;
}

export function jsonToCsv(json: unknown): string {
  const rows: Record<string, unknown>[] = Array.isArray(json)
    ? (json as Record<string, unknown>[])
    : [json as Record<string, unknown>];

  if (!rows.length || typeof rows[0] !== "object" || rows[0] === null) {
    return "value\n" + rows.map(r => csvEscape(String(r))).join("\n");
  }

  const flat = rows.map(r => flattenObject(r as Record<string, unknown>));
  const headers = [...new Set(flat.flatMap(r => Object.keys(r)))];
  const headerLine = headers.map(csvEscape).join(",");
  const dataLines = flat.map(row => headers.map(h => csvEscape(row[h] ?? "")).join(","));
  return [headerLine, ...dataLines].join("\n");
}

// ─────────────────────────────────────────────────────────────────────────────
// JSON → Excel (uses SheetJS, returns Blob URL for download)
// ─────────────────────────────────────────────────────────────────────────────

export async function jsonToExcelBlob(json: unknown): Promise<Blob> {
  // Dynamic import to keep it out of the initial bundle
  const XLSX = await import("xlsx");

  const rows: Record<string, unknown>[] = Array.isArray(json)
    ? (json as Record<string, unknown>[])
    : [json as Record<string, unknown>];

  const flat = rows.map(r =>
    typeof r === "object" && r !== null
      ? flattenObject(r as Record<string, unknown>)
      : { value: r }
  );

  const ws = XLSX.utils.json_to_sheet(flat);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Data");

  // If root is an object with array values, add sub-sheets
  if (!Array.isArray(json) && typeof json === "object" && json !== null) {
    for (const [key, val] of Object.entries(json as Record<string, unknown>)) {
      if (Array.isArray(val) && val.length && typeof val[0] === "object") {
        const subFlat = (val as Record<string, unknown>[]).map(r => flattenObject(r));
        const subWs = XLSX.utils.json_to_sheet(subFlat);
        XLSX.utils.book_append_sheet(wb, subWs, key.slice(0, 31));
      }
    }
  }

  const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  return new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
}
