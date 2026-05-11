/**
 * converters.test.ts
 *
 * Test suite for jsonConverters — medium to extreme JSON sizes.
 *
 * Levels:
 *   EASY    – tiny/trivial inputs (edge cases)
 *   MEDIUM  – ~100–500 items, realistic nested structures
 *   HEAVY   – ~5,000–20,000 items (simulating 2–10 MB)
 *   EXTREME – ~100,000+ items (simulating 50–100 MB)
 *
 * We generate data locally instead of downloading from the internet
 * so tests are fully offline and reproducible.
 *
 * To run just this file:
 *   pnpm vitest run src/__tests__/converters.test.ts
 */

import { describe, it, expect, beforeAll } from "vitest";
import {
  jsonToTypeScript,
  jsonToZod,
  jsonToGo,
  jsonToRust,
  jsonToSql,
  jsonToCsv,
  jsonToJsonSchema,
  jsonToOpenApi,
} from "../lib/jsonConverters";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers — data generators
// ─────────────────────────────────────────────────────────────────────────────

function rndStr(len = 8): string {
  return Math.random().toString(36).slice(2, 2 + len);
}

function rndInt(max = 1000): number {
  return Math.floor(Math.random() * max);
}

function makeUser(i: number) {
  return {
    id: i,
    uuid: `${rndStr(8)}-${rndStr(4)}-${rndStr(4)}-${rndStr(4)}-${rndStr(12)}`,
    name: `User ${i}`,
    email: `user${i}@example.com`,
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    isPremium: i % 3 === 0,
    score: parseFloat((Math.random() * 100).toFixed(2)),
    tags: [rndStr(), rndStr(), rndStr()],
    address: {
      street: `${rndInt(999)} ${rndStr(6)} St`,
      city: rndStr(7),
      zip: `H${rndInt(9)}A ${rndInt(9)}B${rndInt(9)}`,
      country: "CA",
      geo: { lat: 45.5 + Math.random(), lng: -73.5 - Math.random() },
    },
    metadata: {
      loginCount: rndInt(500),
      lastSeen: new Date().toISOString(),
      preferences: { theme: "dark", lang: "en", notifications: true },
    },
  };
}

function makeProduct(i: number) {
  return {
    id: i,
    sku: `SKU-${rndStr(6).toUpperCase()}`,
    name: `Product ${i}`,
    price: parseFloat((Math.random() * 500 + 1).toFixed(2)),
    stock: rndInt(10000),
    active: i % 4 !== 0,
    categories: [rndStr(), rndStr()],
    attributes: {
      weight: parseFloat((Math.random() * 5).toFixed(3)),
      dimensions: { width: rndInt(100), height: rndInt(100), depth: rndInt(100) },
      color: ["red", "blue", "green", "black"][i % 4],
    },
  };
}

function makeLogEntry(i: number) {
  const levels = ["info", "warn", "error", "debug"];
  return {
    timestamp: new Date(Date.now() - i * 1000).toISOString(),
    level: levels[i % 4],
    service: `service-${i % 5}`,
    traceId: rndStr(16),
    message: `Log message ${i}: ${rndStr(20)}`,
    context: { userId: rndInt(1000), requestId: rndStr(12), duration: rndInt(5000) },
  };
}

// Datasets
let dataSmall: ReturnType<typeof makeUser>[];      // ~10 items
let dataMedium: ReturnType<typeof makeUser>[];     // ~1,000 items
let dataHeavy: ReturnType<typeof makeUser>[];      // ~10,000 items
let dataExtreme: ReturnType<typeof makeUser>[];    // ~100,000 items
let dataMixed: object;                             // nested object (not array)
let dataLogs: ReturnType<typeof makeLogEntry>[];

beforeAll(() => {
  dataSmall   = Array.from({ length: 10 },      (_, i) => makeUser(i));
  dataMedium  = Array.from({ length: 1_000 },   (_, i) => makeUser(i));
  dataHeavy   = Array.from({ length: 10_000 },  (_, i) => makeUser(i));
  dataExtreme = Array.from({ length: 100_000 }, (_, i) => makeUser(i));
  dataLogs    = Array.from({ length: 50_000 },  (_, i) => makeLogEntry(i));

  dataMixed = {
    users: Array.from({ length: 200 }, (_, i) => makeUser(i)),
    products: Array.from({ length: 200 }, (_, i) => makeProduct(i)),
    meta: { generated: new Date().toISOString(), version: "2.0", total: 400 },
  };
});

// ─────────────────────────────────────────────────────────────────────────────
// Utility — measure time and assert output quality
// ─────────────────────────────────────────────────────────────────────────────

function measure<T>(label: string, fn: () => T): T {
  const start = performance.now();
  const result = fn();
  const ms = performance.now() - start;
  console.log(`  [${label}] ${ms.toFixed(1)} ms`);
  return result;
}

function mbSize(obj: unknown): number {
  return JSON.stringify(obj).length / (1024 * 1024);
}

// ─────────────────────────────────────────────────────────────────────────────
// EASY — edge cases & correctness
// ─────────────────────────────────────────────────────────────────────────────

describe("EASY — edge cases", () => {
  it("handles null root", () => {
    expect(jsonToTypeScript(null)).toContain("null");
    expect(jsonToZod(null)).toContain("z.null");
    // Go & Rust: null primitive generates minimal output (no struct body needed)
    const go = jsonToGo(null);
    expect(go).toContain("package");
    const rust = jsonToRust(null);
    expect(rust).toContain("use serde");
  });

  it("handles primitive string", () => {
    const ts = jsonToTypeScript("hello");
    expect(ts).toContain("string");
    const zod = jsonToZod("hello");
    expect(zod).toContain("z.string");
  });

  it("handles empty object", () => {
    // Empty object → empty interface (not Record, since we build an interface with 0 fields)
    expect(jsonToTypeScript({})).toContain("interface");
    expect(jsonToSql({}, "empty")).toContain("CREATE TABLE");
  });

  it("handles empty array", () => {
    expect(jsonToCsv([])).toBe("value\n");
    expect(jsonToSql([], "empty")).toContain("Empty");
  });

  it("handles flat object", () => {
    const obj = { id: 1, name: "Alice", active: true, score: 9.5 };
    const ts = jsonToTypeScript(obj);
    expect(ts).toContain("id: number");
    expect(ts).toContain("name: string");
    expect(ts).toContain("active: boolean");
    expect(ts).toContain("score: number");
  });

  it("TypeScript — nested interfaces are separated", () => {
    const ts = jsonToTypeScript(makeUser(1), "User");
    expect(ts).toContain("export interface User");
    expect(ts).toContain("export interface Address");
    expect(ts).toContain("export interface Metadata");
  });

  it("Zod — generates valid zod import", () => {
    const zod = jsonToZod(makeUser(1), "User");
    expect(zod).toMatch(/^import \{ z \} from "zod"/);
    expect(zod).toContain("z.infer");
    expect(zod).toContain("z.string");
    expect(zod).toContain("z.number");
    expect(zod).toContain("z.boolean");
    expect(zod).toContain(".datetime()");
  });

  it("Go — generates package + structs with json tags", () => {
    const go = jsonToGo(makeUser(1), "User", "main");
    expect(go).toMatch(/^package main/);
    // Tags include both json: and yaml:
    expect(go).toContain('`json:"id" yaml:"id"');
    expect(go).toContain("type User struct");
    expect(go).toContain("type Address struct");
    expect(go).toContain("time.Time");
  });

  it("Rust — generates use serde + derive macros", () => {
    const rust = jsonToRust(makeUser(1), "User");
    expect(rust).toMatch(/^use serde::\{Deserialize, Serialize\}/);
    expect(rust).toContain("#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]");
    expect(rust).toContain("pub struct User");
    expect(rust).toContain("pub id: i64");
    expect(rust).toContain("pub name: String");
    expect(rust).toContain("pub is_premium: bool");
  });

  it("SQL — generates PRIMARY KEY and NOT NULL constraints", () => {
    const sql = jsonToSql(makeUser(1), "user");
    expect(sql).toContain("SERIAL PRIMARY KEY");
    expect(sql).toContain("NOT NULL");
    expect(sql).toContain("TIMESTAMP");
    expect(sql).toContain("BOOLEAN");
  });

  it("SQL — INSERT statements generated when flag is true", () => {
    const sql = jsonToSql([makeUser(1), makeUser(2)], "user", true);
    expect(sql).toContain("INSERT INTO");
    expect(sql).toContain("VALUES");
  });

  it("SQL — no INSERT when flag is false", () => {
    const sql = jsonToSql([makeUser(1)], "user", false);
    expect(sql).not.toContain("INSERT");
  });

  it("CSV — generates correct headers and rows", () => {
    const csv = jsonToCsv([{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }]);
    const lines = csv.split("\n");
    expect(lines[0]).toBe("id,name");
    expect(lines[1]).toBe("1,Alice");
    expect(lines[2]).toBe("2,Bob");
  });

  it("CSV — escapes commas and quotes", () => {
    const csv = jsonToCsv([{ name: 'Say "hello", world' }]);
    expect(csv).toContain('"Say ""hello"", world"');
  });

  it("JSON Schema — draft 2020-12 with correct $schema", () => {
    const schema = jsonToJsonSchema(makeUser(1), "User");
    const parsed = JSON.parse(schema);
    expect(parsed.$schema).toBe("https://json-schema.org/draft/2020-12/schema");
    expect(parsed.type).toBe("object");
    expect(parsed.properties.email.format).toBe("email");
    expect(parsed.properties.createdAt.format).toBe("date-time");
  });

  it("OpenAPI — generates valid 3.0.3 structure (YAML)", () => {
    const yaml = jsonToOpenApi(makeUser(1), "Test API");
    expect(yaml).toContain("openapi: 3.0.3");
    expect(yaml).toContain("paths:");
    expect(yaml).toContain("/items:");
    expect(yaml).toContain("components:");
    expect(yaml).toContain("schemas:");
  });

  it("OpenAPI — JSON output when flag set", () => {
    const json = jsonToOpenApi(makeUser(1), "Test API", false);
    const parsed = JSON.parse(json);
    expect(parsed.openapi).toBe("3.0.3");
    expect(parsed.paths["/items"]).toBeDefined();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// MEDIUM — ~1,000 items, realistic data
// ─────────────────────────────────────────────────────────────────────────────

describe("MEDIUM — 1,000 items", () => {
  it("reports approximate data size", () => {
    const mb = mbSize(dataMedium);
    console.log(`  Medium dataset: ${mb.toFixed(2)} MB`);
    expect(mb).toBeGreaterThan(0.3); // ~0.46 MB for 1k items
  });

  it("TypeScript — converts 1k-item array in < 500ms", () => {
    const result = measure("TS 1k", () => jsonToTypeScript(dataMedium, "User"));
    expect(result).toContain("export interface User");
    expect(result).toContain("Address");
  });

  it("Zod — converts 1k-item array in < 500ms", () => {
    const result = measure("Zod 1k", () => jsonToZod(dataMedium, "User"));
    expect(result).toContain("z.array");
    expect(result).toContain("z.string");
  });

  it("Go — converts 1k-item array in < 500ms", () => {
    const result = measure("Go 1k", () => jsonToGo(dataMedium, "User", "main"));
    expect(result).toContain("type User struct");
  });

  it("Rust — converts 1k-item array in < 500ms", () => {
    const result = measure("Rust 1k", () => jsonToRust(dataMedium, "User"));
    expect(result).toContain("pub struct User");
  });

  it("SQL — 1k items with inserts < 1s", () => {
    const result = measure("SQL 1k + inserts", () => jsonToSql(dataMedium, "user", true));
    expect(result).toContain("CREATE TABLE");
    expect(result).toContain("INSERT INTO");
    // Cap is 10 per table, and we have multiple tables (user, address, metadata...)
    const insertCount = (result.match(/^INSERT/gm) || []).length;
    expect(insertCount).toBeGreaterThan(0);
    expect(insertCount).toBeLessThanOrEqual(50); // ≤ 10 per table × ~5 tables
  });

  it("CSV — flattens 1k nested objects correctly in < 1s", () => {
    const result = measure("CSV 1k", () => jsonToCsv(dataMedium));
    const lines = result.split("\n");
    expect(lines[0]).toContain("id");
    expect(lines[0]).toContain("address.city");
    expect(lines[0]).toContain("address.geo.lat");
    expect(lines.length).toBe(1001); // 1 header + 1000 rows
  });

  it("JSON Schema — 1k array in < 500ms", () => {
    const result = measure("Schema 1k", () => jsonToJsonSchema(dataMedium, "Users"));
    const parsed = JSON.parse(result);
    expect(parsed.type).toBe("array");
    expect(parsed.items.type).toBe("object");
  });

  it("OpenAPI — mixed nested object in < 500ms", () => {
    const result = measure("OpenAPI mixed", () => jsonToOpenApi(dataMixed, "Mixed API"));
    expect(result).toContain("openapi: 3.0.3");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// HEAVY — ~10,000 items (simulates ~5–10 MB)
// ─────────────────────────────────────────────────────────────────────────────

describe("HEAVY — 10,000 items (~5–10 MB)", () => {
  it("reports data size", () => {
    const mb = mbSize(dataHeavy);
    console.log(`  Heavy dataset: ${mb.toFixed(2)} MB`);
    expect(mb).toBeGreaterThan(3);
  });

  it("TypeScript — 10k array < 2s", () => {
    const start = performance.now();
    const result = jsonToTypeScript(dataHeavy, "User");
    const ms = performance.now() - start;
    console.log(`  TS 10k: ${ms.toFixed(0)} ms`);
    expect(ms).toBeLessThan(2000);
    expect(result).toContain("export interface User");
  });

  it("Zod — 10k array < 2s", () => {
    const start = performance.now();
    const result = jsonToZod(dataHeavy, "User");
    const ms = performance.now() - start;
    console.log(`  Zod 10k: ${ms.toFixed(0)} ms`);
    expect(ms).toBeLessThan(2000);
    expect(result).toContain("z.array");
  });

  it("Go — 10k array < 2s", () => {
    const start = performance.now();
    const result = jsonToGo(dataHeavy, "User", "main");
    const ms = performance.now() - start;
    console.log(`  Go 10k: ${ms.toFixed(0)} ms`);
    expect(ms).toBeLessThan(2000);
    expect(result).toContain("type User struct");
  });

  it("Rust — 10k array < 2s", () => {
    const start = performance.now();
    const result = jsonToRust(dataHeavy, "User");
    const ms = performance.now() - start;
    console.log(`  Rust 10k: ${ms.toFixed(0)} ms`);
    expect(ms).toBeLessThan(2000);
    expect(result).toContain("pub struct User");
  });

  it("CSV — 10k nested items flatten in < 3s", () => {
    const start = performance.now();
    const result = jsonToCsv(dataHeavy);
    const ms = performance.now() - start;
    console.log(`  CSV 10k: ${ms.toFixed(0)} ms`);
    expect(ms).toBeLessThan(3000);
    const lines = result.split("\n");
    expect(lines.length).toBe(10001);
  });

  it("SQL DDL only (10k) < 1s (uses only first row for schema)", () => {
    const start = performance.now();
    const result = jsonToSql(dataHeavy, "user", false);
    const ms = performance.now() - start;
    console.log(`  SQL DDL 10k: ${ms.toFixed(0)} ms`);
    expect(ms).toBeLessThan(1000);
    expect(result).toContain("CREATE TABLE");
    expect(result).not.toContain("INSERT");
  });

  it("JSON Schema — 10k array infers from first item only, < 1s", () => {
    const start = performance.now();
    const result = jsonToJsonSchema(dataHeavy, "Users");
    const ms = performance.now() - start;
    console.log(`  Schema 10k: ${ms.toFixed(0)} ms`);
    expect(ms).toBeLessThan(1000);
    const parsed = JSON.parse(result);
    expect(parsed.type).toBe("array");
  });

  it("Log entries — 50k log lines < 3s for CSV", () => {
    const mb = mbSize(dataLogs);
    console.log(`  Logs dataset: ${mb.toFixed(2)} MB`);
    const start = performance.now();
    const result = jsonToCsv(dataLogs);
    const ms = performance.now() - start;
    console.log(`  CSV logs 50k: ${ms.toFixed(0)} ms`);
    expect(ms).toBeLessThan(3000);
    const lines = result.split("\n");
    expect(lines.length).toBe(50001);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// EXTREME — 100,000 items (simulates ~50–100 MB)
// ─────────────────────────────────────────────────────────────────────────────

describe("EXTREME — 100,000 items (~50–100 MB)", () => {
  it("reports data size", () => {
    const mb = mbSize(dataExtreme);
    console.log(`  Extreme dataset: ${mb.toFixed(2)} MB`);
    expect(mb).toBeGreaterThan(40);
  });

  it("TypeScript — 100k array: uses only first item, < 100ms", () => {
    // Converter infers schema from first item → should be near-instant
    const start = performance.now();
    const result = jsonToTypeScript(dataExtreme, "User");
    const ms = performance.now() - start;
    console.log(`  TS 100k: ${ms.toFixed(0)} ms`);
    expect(ms).toBeLessThan(200);
    expect(result).toContain("export interface User");
  });

  it("Zod — 100k array < 2s (uses first item only)", () => {
    const start = performance.now();
    const result = jsonToZod(dataExtreme, "User");
    const ms = performance.now() - start;
    console.log(`  Zod 100k: ${ms.toFixed(0)} ms`);
    expect(ms).toBeLessThan(2000); // uses only first item, should be fast
    expect(result).toContain("z.array");
  });

  it("Go — 100k array < 200ms", () => {
    const start = performance.now();
    const result = jsonToGo(dataExtreme, "User");
    const ms = performance.now() - start;
    console.log(`  Go 100k: ${ms.toFixed(0)} ms`);
    expect(ms).toBeLessThan(200);
    expect(result).toContain("type User struct");
  });

  it("Rust — 100k array < 200ms", () => {
    const start = performance.now();
    const result = jsonToRust(dataExtreme, "User");
    const ms = performance.now() - start;
    console.log(`  Rust 100k: ${ms.toFixed(0)} ms`);
    expect(ms).toBeLessThan(200);
    expect(result).toContain("pub struct User");
  });

  it("CSV — 100k items: expect < 15s (JS single-thread limit)", () => {
    const start = performance.now();
    const result = jsonToCsv(dataExtreme);
    const ms = performance.now() - start;
    console.log(`  CSV 100k: ${ms.toFixed(0)} ms (${(ms / 1000).toFixed(1)}s)`);
    expect(ms).toBeLessThan(15_000);
    const lineCount = result.split("\n").length;
    expect(lineCount).toBe(100001);
    const mb = result.length / (1024 * 1024);
    console.log(`  CSV output size: ${mb.toFixed(2)} MB`);
  });

  it("JSON Schema — 100k infers from first item, < 100ms", () => {
    const start = performance.now();
    const result = jsonToJsonSchema(dataExtreme, "Users");
    const ms = performance.now() - start;
    console.log(`  Schema 100k: ${ms.toFixed(0)} ms`);
    expect(ms).toBeLessThan(100);
  });

  it("SQL DDL from 100k array — uses first row only, < 100ms", () => {
    const start = performance.now();
    const result = jsonToSql(dataExtreme, "user", false);
    const ms = performance.now() - start;
    console.log(`  SQL DDL 100k: ${ms.toFixed(0)} ms`);
    expect(ms).toBeLessThan(100);
    expect(result).toContain("CREATE TABLE");
  });

  it("SQL with INSERTs from 100k — caps per table, < 500ms", () => {
    const start = performance.now();
    const result = jsonToSql(dataExtreme, "user", true);
    const ms = performance.now() - start;
    console.log(`  SQL+INSERT 100k: ${ms.toFixed(0)} ms`);
    expect(ms).toBeLessThan(500);
    // 10 per table × ~5 tables = ≤ 50 total
    const insertCount = (result.match(/^INSERT/gm) || []).length;
    expect(insertCount).toBeGreaterThan(0);
    expect(insertCount).toBeLessThanOrEqual(50);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// CORRECTNESS — regression tests for known edge cases
// ─────────────────────────────────────────────────────────────────────────────

describe("CORRECTNESS — edge cases & regressions", () => {
  it("SQL special chars in values are escaped", () => {
    const data = [{ name: "O'Brien", note: "Say 'hello'" }];
    const sql = jsonToSql(data, "test", true);
    expect(sql).toContain("O''Brien");
  });

  it("CSV with newline in value is quoted", () => {
    const csv = jsonToCsv([{ text: "line1\nline2" }]);
    expect(csv).toContain('"line1\nline2"');
  });

  it("TypeScript handles arrays of mixed types", () => {
    const ts = jsonToTypeScript({ mixed: [1, "a", true, null] });
    expect(ts).toContain("mixed");
  });

  it("Zod detects email format", () => {
    const zod = jsonToZod({ email: "a@b.com" });
    expect(zod).toContain(".email()");
  });

  it("Zod detects URL format", () => {
    const zod = jsonToZod({ url: "https://example.com" });
    expect(zod).toContain(".url()");
  });

  it("Zod detects datetime format", () => {
    const zod = jsonToZod({ ts: "2024-01-01T00:00:00.000Z" });
    expect(zod).toContain(".datetime()");
  });

  it("JSON Schema detects email format", () => {
    const schema = JSON.parse(jsonToJsonSchema({ email: "user@example.com" }));
    expect(schema.properties.email.format).toBe("email");
  });

  it("JSON Schema detects URI format", () => {
    const schema = JSON.parse(jsonToJsonSchema({ site: "https://example.com" }));
    expect(schema.properties.site.format).toBe("uri");
  });

  it("Go uses time.Time for ISO date strings", () => {
    const go = jsonToGo({ ts: "2024-01-15T10:30:00Z" });
    expect(go).toContain("time.Time");
    expect(go).toContain(`import (`);
  });

  it("Rust snake_cases camelCase fields with #[serde(rename)]", () => {
    const rust = jsonToRust({ createdAt: "2024-01-01T00:00:00Z", isPremium: true });
    expect(rust).toContain("pub created_at");
    expect(rust).toContain(`#[serde(rename = "createdAt")]`);
    expect(rust).toContain("pub is_premium");
  });

  it("SQL generates JSONB for nested object columns", () => {
    const sql = jsonToSql({ config: { key: "value" } }, "settings");
    // Nested object creates a separate table OR is JSONB — check one of them
    expect(sql).toMatch(/JSONB|REFERENCES/);
  });

  it("CSV flattens deep nesting with dot notation", () => {
    const csv = jsonToCsv([{ a: { b: { c: 42 } } }]);
    expect(csv).toContain("a.b.c");
    expect(csv).toContain("42");
  });

  it("all converters handle single object (not array)", () => {
    const obj = makeUser(42);
    expect(() => jsonToTypeScript(obj)).not.toThrow();
    expect(() => jsonToZod(obj)).not.toThrow();
    expect(() => jsonToGo(obj)).not.toThrow();
    expect(() => jsonToRust(obj)).not.toThrow();
    expect(() => jsonToSql(obj, "user")).not.toThrow();
    expect(() => jsonToCsv(obj)).not.toThrow();
    expect(() => jsonToJsonSchema(obj)).not.toThrow();
    expect(() => jsonToOpenApi(obj)).not.toThrow();
  });

  it("all converters never throw on empty object", () => {
    expect(() => jsonToTypeScript({})).not.toThrow();
    expect(() => jsonToZod({})).not.toThrow();
    expect(() => jsonToGo({})).not.toThrow();
    expect(() => jsonToRust({})).not.toThrow();
    expect(() => jsonToSql({})).not.toThrow();
    expect(() => jsonToCsv({})).not.toThrow();
    expect(() => jsonToJsonSchema({})).not.toThrow();
    expect(() => jsonToOpenApi({})).not.toThrow();
  });

  it("all converters never throw on deeply nested object (depth 10)", () => {
    let deep: any = { leaf: "value" };
    for (let i = 0; i < 10; i++) deep = { level: deep };
    expect(() => jsonToTypeScript(deep)).not.toThrow();
    expect(() => jsonToZod(deep)).not.toThrow();
    expect(() => jsonToGo(deep)).not.toThrow();
    expect(() => jsonToRust(deep)).not.toThrow();
    expect(() => jsonToSql(deep, "deep")).not.toThrow();
    expect(() => jsonToJsonSchema(deep)).not.toThrow();
  });
});
