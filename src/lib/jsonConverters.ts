// ─────────────────────────────────────────────────────────────────────────────
// JSON → TypeScript Interfaces
// ─────────────────────────────────────────────────────────────────────────────

function tsType(value: unknown, indent: number, seen: WeakSet<object>): string {
  if (value === null) return "null";
  if (Array.isArray(value)) {
    if (value.length === 0) return "unknown[]";
    // Union all item types
    const types = [...new Set(value.map(item => tsType(item, indent, seen)))];
    const inner = types.length === 1 ? types[0] : `(${types.join(" | ")})`;
    return `${inner}[]`;
  }
  if (typeof value === "object") {
    if (seen.has(value as object)) return "unknown"; // circular
    seen.add(value as object);
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return "Record<string, unknown>";
    const pad = "  ".repeat(indent + 1);
    const fields = entries
      .map(([k, v]) => {
        const safe = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : `"${k}"`;
        return `${pad}${safe}: ${tsType(v, indent + 1, seen)};`;
      })
      .join("\n");
    return `{\n${fields}\n${"  ".repeat(indent)}}`;
  }
  return typeof value;
}

function collectInterfaces(
  name: string,
  value: unknown,
  interfaces: Map<string, string>,
  seen: WeakSet<object>
): string {
  if (value === null || typeof value !== "object") return tsType(value, 0, seen);

  if (Array.isArray(value)) {
    if (value.length === 0) return "unknown[]";
    const first = value[0];
    if (first !== null && typeof first === "object" && !Array.isArray(first)) {
      const childName = toPascalCase(name.replace(/s$/, ""));
      collectInterfaces(childName, first, interfaces, seen);
      return `${childName}[]`;
    }
    const types = [...new Set(value.map(item => tsType(item, 0, seen)))];
    return types.length === 1 ? `${types[0]}[]` : `(${types.join(" | ")})[]`;
  }

  // Object — emit interface
  if (seen.has(value as object)) return name;
  seen.add(value as object);

  const entries = Object.entries(value as Record<string, unknown>);
  const fields: string[] = [];

  for (const [k, v] of entries) {
    const safe = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : `"${k}"`;
    const childName = toPascalCase(k);
    const childType =
      v !== null && typeof v === "object"
        ? collectInterfaces(childName, v, interfaces, seen)
        : tsType(v, 1, new WeakSet());
    fields.push(`  ${safe}: ${childType};`);
  }

  const body = `export interface ${name} {\n${fields.join("\n")}\n}`;
  interfaces.set(name, body);
  return name;
}

function toPascalCase(s: string): string {
  return s.replace(/(^|[-_ ])(.)/g, (_, __, c) => c.toUpperCase()).replace(/[^a-zA-Z0-9]/g, "");
}

export function jsonToTypeScript(json: unknown, rootName = "Root"): string {
  const interfaces = new Map<string, string>();
  const seen = new WeakSet<object>();
  collectInterfaces(toPascalCase(rootName), json, interfaces, seen);
  if (interfaces.size === 0) {
    // Primitive or simple array
    return `export type ${toPascalCase(rootName)} = ${tsType(json, 0, new WeakSet())};`;
  }
  // Return in order: root last so dependencies appear first
  const values = [...interfaces.values()];
  return values.join("\n\n");
}

// ─────────────────────────────────────────────────────────────────────────────
// JSON → SQL Schema
// ─────────────────────────────────────────────────────────────────────────────

function sqlType(value: unknown): string {
  if (value === null) return "TEXT";
  if (typeof value === "boolean") return "BOOLEAN";
  if (typeof value === "number") {
    return Number.isInteger(value) ? "INTEGER" : "REAL";
  }
  if (typeof value === "string") {
    if (/^\d{4}-\d{2}-\d{2}(T|$)/.test(value)) return "TIMESTAMP";
    return value.length > 255 ? "TEXT" : "VARCHAR(255)";
  }
  if (typeof value === "object") return "JSONB";
  return "TEXT";
}

function toSnakeCase(s: string): string {
  return s
    .replace(/([A-Z])/g, "_$1")
    .toLowerCase()
    .replace(/^_/, "")
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/__+/g, "_");
}

function generateTable(
  tableName: string,
  obj: Record<string, unknown>,
  tables: string[],
  fk?: string
): void {
  const snakeName = toSnakeCase(tableName);
  const cols: string[] = [`  id SERIAL PRIMARY KEY`];
  if (fk) cols.push(`  ${toSnakeCase(fk)}_id INTEGER REFERENCES ${toSnakeCase(fk)}(id)`);

  for (const [key, value] of Object.entries(obj)) {
    const col = toSnakeCase(key);
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      // Nested object → separate table
      generateTable(`${tableName}_${toPascalCase(key)}`, value as Record<string, unknown>, tables, snakeName);
      cols.push(`  ${col}_id INTEGER REFERENCES ${toSnakeCase(`${tableName}_${toPascalCase(key)}`)}(id) -- nested`);
    } else if (Array.isArray(value)) {
      const first = value[0];
      if (first !== null && typeof first === "object" && !Array.isArray(first)) {
        // Array of objects → junction table
        generateTable(
          `${tableName}_${toPascalCase(key)}`,
          first as Record<string, unknown>,
          tables,
          snakeName
        );
      } else {
        cols.push(`  ${col} JSONB -- array of ${typeof first}`);
      }
    } else {
      const nullable = value === null ? "" : " NOT NULL";
      const def = value !== null && typeof value !== "boolean"
        ? ` DEFAULT ${JSON.stringify(value)}`
        : "";
      cols.push(`  ${col} ${sqlType(value)}${nullable}`);
    }
  }

  const create =
    `CREATE TABLE ${snakeName} (\n${cols.join(",\n")}\n);`;
  tables.push(create);
}

export function jsonToSql(json: unknown, rootName = "table"): string {
  const tables: string[] = [];

  if (json === null || typeof json !== "object") {
    return `-- Cannot generate schema from a primitive value\n-- Value: ${JSON.stringify(json)}`;
  }

  let source: Record<string, unknown>;
  if (Array.isArray(json)) {
    if (json.length === 0) return "-- Empty array, cannot infer schema";
    const first = json[0];
    if (typeof first !== "object" || first === null || Array.isArray(first)) {
      return `-- Array of primitives\nCREATE TABLE ${toSnakeCase(rootName)} (\n  id SERIAL PRIMARY KEY,\n  value TEXT NOT NULL\n);`;
    }
    source = first as Record<string, unknown>;
  } else {
    source = json as Record<string, unknown>;
  }

  generateTable(toPascalCase(rootName), source, tables);

  return [
    `-- Generated SQL Schema from JSON`,
    `-- Generated at ${new Date().toISOString()}`,
    `-- Dialect: PostgreSQL (adjust types for MySQL/SQLite as needed)`,
    ``,
    ...tables.reverse(), // dependencies first
  ].join("\n");
}
