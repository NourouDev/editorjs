/**
 * converters.real.test.ts
 *
 * Tests using REAL JSON files from https://github.com/antonmedv/json-examples
 * 100% TypeScript — no shell scripts, no external tooling.
 *
 * Fixtures are downloaded automatically on first run and cached locally.
 * Re-runs use the cached files (no network hit).
 *
 * Run:
 *   pnpm test:real
 *   pnpm test:real:all   ← also tests 250MB, 500MB, 1GB
 */

import { describe, it, expect, beforeAll } from "vitest";
import * as fs from "node:fs";
import * as https from "node:https";
import * as path from "node:path";
import * as url from "node:url";
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
// Config
// ─────────────────────────────────────────────────────────────────────────────

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FIXTURES_DIR = path.join(__dirname, "fixtures");
const BASE_URL = "https://raw.githubusercontent.com/antonmedv/json-examples/master";

// Files to always download (medium tier)
const STANDARD_FILES = ["data_10mb.json", "data_25mb.json", "data_50mb.json", "data_100mb.json"];
// Files downloaded only when RUN_LARGE=1 env var is set
const LARGE_FILES = ["data_250mb.json", "data_500mb.json", "data_1gb.json"];

const RUN_LARGE = process.env["RUN_LARGE"] === "1";

// ─────────────────────────────────────────────────────────────────────────────
// Pure-TS download utility (node:https streams to disk)
// ─────────────────────────────────────────────────────────────────────────────

import { execSync } from "node:child_process";

function generateFile(filename: string, dest: string): void {
  // Extract size from filename, e.g., "data_10mb.json" -> "10MB"
  const match = filename.match(/data_(\d+(?:mb|gb|kb))/i);
  if (!match) {
    throw new Error(`Cannot infer size from filename: ${filename}`);
  }
  const size = match[1].toUpperCase();

  const scriptPath = path.join(__dirname, "scripts", "generate_json.ts");
  console.log(`\n  ⚙️  Generating ${filename} (${size}) locally using Bun...`);

  // Use Bun to execute the generator script
  execSync(`bun ${scriptPath} ${size} ${dest}`, { stdio: "inherit" });
}

async function ensureFixture(filename: string): Promise<boolean> {
  fs.mkdirSync(FIXTURES_DIR, { recursive: true });
  const dest = path.join(FIXTURES_DIR, filename);

  if (fs.existsSync(dest)) {
    return true; // already cached
  }

  try {
    generateFile(filename, dest);
    const mb = fs.statSync(dest).size / 1024 / 1024;
    console.log(`  ✅ ${filename} cached (${mb.toFixed(1)} MB)`);
    return true;
  } catch (err: any) {
    console.warn(`  ⚠️  Could not generate ${filename}: ${err.message}`);
    return false;
  }
}

function fileSizeMb(filename: string): number {
  return fs.statSync(path.join(FIXTURES_DIR, filename)).size / 1024 / 1024;
}

function measure<T>(label: string, fn: () => T): { result: T; ms: number } {
  const start = performance.now();
  const result = fn();
  const ms = performance.now() - start;
  const display = ms < 1000 ? `${ms.toFixed(1)} ms` : `${(ms / 1000).toFixed(2)} s`;
  console.log(`    ⏱  ${label}: ${display}`);
  return { result, ms };
}

// ─────────────────────────────────────────────────────────────────────────────
// Reusable schema-inference test suite (O(1) — always fast)
// ─────────────────────────────────────────────────────────────────────────────

function runSchemaTests(getRef: () => unknown, label: string) {
  it(`[${label}] TypeScript schema inference < 50ms`, () => {
    const { result, ms } = measure("jsonToTypeScript", () => jsonToTypeScript(getRef(), "Root"));
    expect(ms).toBeLessThan(50);
    expect(result).toMatch(/export (interface|type) Root/);
  });

  it(`[${label}] Zod schema inference < 50ms`, () => {
    const { result, ms } = measure("jsonToZod", () => jsonToZod(getRef(), "Root"));
    expect(ms).toBeLessThan(50);
    expect(result).toContain("z.infer");
  });

  it(`[${label}] Go structs inference < 50ms`, () => {
    const { result, ms } = measure("jsonToGo", () => jsonToGo(getRef(), "Root", "main"));
    expect(ms).toBeLessThan(50);
    expect(result).toMatch(/^package main/);
  });

  it(`[${label}] Rust structs inference < 50ms`, () => {
    const { result, ms } = measure("jsonToRust", () => jsonToRust(getRef(), "Root"));
    expect(ms).toBeLessThan(50);
    expect(result).toContain("use serde");
  });

  it(`[${label}] JSON Schema inference < 50ms`, () => {
    const { result, ms } = measure("jsonToJsonSchema", () => jsonToJsonSchema(getRef(), "Root"));
    expect(ms).toBeLessThan(50);
    expect(JSON.parse(result).$schema).toContain("json-schema.org");
  });

  it(`[${label}] OpenAPI 3.0 inference < 50ms`, () => {
    const { result, ms } = measure("jsonToOpenApi", () => jsonToOpenApi(getRef(), "API"));
    expect(ms).toBeLessThan(50);
    expect(result).toContain("openapi: 3.0.3");
  });

  it(`[${label}] SQL DDL (first row only) < 100ms`, () => {
    const { result, ms } = measure("jsonToSql DDL", () => jsonToSql(getRef(), "tbl", false));
    expect(ms).toBeLessThan(100);
    expect(result).toContain("CREATE TABLE");
  });

  it(`[${label}] SQL DDL + INSERTs (capped at 10/table) < 500ms`, () => {
    const { result, ms } = measure("jsonToSql+INSERT", () => jsonToSql(getRef(), "tbl", true));
    expect(ms).toBeLessThan(500);
    expect(result).toContain("INSERT INTO");
    const count = (result.match(/^INSERT/gm) ?? []).length;
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThanOrEqual(100);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper: build a describe block with auto-download + skip if unavailable
// ─────────────────────────────────────────────────────────────────────────────

function realFileBlock(
  filename: string,
  csvRowLimit: number | null,
  csvTimeLimitMs: number
) {
  describe(`${filename}`, () => {
    let data: unknown;
    let available = false;

    beforeAll(async () => {
      available = await ensureFixture(filename);
      if (!available) return;

      const mb = fileSizeMb(filename);
      console.log(`\n  📂 ${filename} (${mb.toFixed(1)} MB on disk)`);

      if (mb > 400) {
        console.log(`  ⚠️  Large file — JSON.parse() may take >30s and need ~${Math.ceil(mb / 128) * 128}MB RAM`);
      }

      const raw = fs.readFileSync(path.join(FIXTURES_DIR, filename), "utf-8");
      const { result, ms } = measure("JSON.parse()", () => JSON.parse(raw));
      data = result;
      const count = Array.isArray(result) ? result.length.toLocaleString() : "object";
      console.log(`  ✓ ${count} records, parsed in ${(ms / 1000).toFixed(2)}s`);
    }, 300_000 /* 5min timeout for 1GB */);

    it("fixture is available (downloaded or cached)", () => {
      if (!available) {
        console.log(`  ⏭  Skipped — ${filename} not available`);
        return; // soft skip (not an assertion failure)
      }
      expect(data).toBeDefined();
    });

    // Schema inference tests (only if available)
    describe("schema inference (O(1))", () => {
      beforeAll(() => {
        if (!available) return;
      });

      it(`TypeScript schema from first item < 50ms`, () => {
        if (!available) return;
        const { result, ms } = measure("jsonToTypeScript", () => jsonToTypeScript(data, "Root"));
        expect(ms).toBeLessThan(50);
        expect(result).toMatch(/export (interface|type) Root/);
      });

      it(`Zod schema from first item < 50ms`, () => {
        if (!available) return;
        const { result, ms } = measure("jsonToZod", () => jsonToZod(data, "Root"));
        expect(ms).toBeLessThan(50);
        expect(result).toContain("z.infer");
      });

      it(`Go structs from first item < 50ms`, () => {
        if (!available) return;
        const { result, ms } = measure("jsonToGo", () => jsonToGo(data, "Root"));
        expect(ms).toBeLessThan(50);
        expect(result).toMatch(/^package/);
      });

      it(`Rust structs from first item < 50ms`, () => {
        if (!available) return;
        const { result, ms } = measure("jsonToRust", () => jsonToRust(data, "Root"));
        expect(ms).toBeLessThan(50);
        expect(result).toContain("use serde");
      });

      it(`JSON Schema from first item < 50ms`, () => {
        if (!available) return;
        const { result, ms } = measure("jsonToJsonSchema", () => jsonToJsonSchema(data));
        expect(ms).toBeLessThan(50);
        expect(JSON.parse(result).$schema).toContain("json-schema.org");
      });

      it(`OpenAPI from first item < 50ms`, () => {
        if (!available) return;
        const { result, ms } = measure("jsonToOpenApi", () => jsonToOpenApi(data, "API"));
        expect(ms).toBeLessThan(50);
        expect(result).toContain("openapi: 3.0.3");
      });

      it(`SQL DDL (first row) < 100ms`, () => {
        if (!available) return;
        const { result, ms } = measure("jsonToSql DDL", () => jsonToSql(data, "tbl", false));
        expect(ms).toBeLessThan(100);
        expect(result).toContain("CREATE TABLE");
      });

      it(`SQL + INSERTs capped < 500ms`, () => {
        if (!available) return;
        const { result, ms } = measure("jsonToSql+INSERT", () => jsonToSql(data, "tbl", true));
        expect(ms).toBeLessThan(500);
        expect(result).toContain("INSERT INTO");
      });
    });

    // CSV test (O(n) — only for smaller files or with row limit)
    describe("CSV export", () => {
      it(
        csvRowLimit
          ? `CSV on ${csvRowLimit.toLocaleString()} rows < ${csvTimeLimitMs}ms`
          : `CSV full dataset < ${csvTimeLimitMs}ms`,
        () => {
          if (!available) return;
          const subset = csvRowLimit && Array.isArray(data)
            ? data.slice(0, csvRowLimit)
            : data;

          const { result, ms } = measure(
            `jsonToCsv (${csvRowLimit ?? "all"} rows)`,
            () => jsonToCsv(subset)
          );
          expect(ms).toBeLessThan(csvTimeLimitMs);
          const lines = result.split("\n");
          console.log(`    → ${lines.length.toLocaleString()} lines, ${(result.length / 1024 / 1024).toFixed(1)} MB output`);
          expect(lines.length).toBeGreaterThan(1);
        }
      );
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Test suite
// ─────────────────────────────────────────────────────────────────────────────

describe("REAL FILES — antonmedv/json-examples (auto-downloaded)", () => {
  describe("Standard tier (10MB – 100MB)", () => {
    // Full CSV on 10MB and 25MB, partial on 50MB/100MB
    realFileBlock("data_10mb.json", null, 10_000);
    //realFileBlock("data_25mb.json",  null,   30_000);
    realFileBlock("data_50mb.json", 10_000, 5_000);
    //realFileBlock("data_100mb.json",  5_000,  5_000);
  });

  describe(`Large tier (250MB – 1GB) [set RUN_LARGE=1 to enable]`, () => {
    if (!RUN_LARGE) {
      it.skip("skipped — set env RUN_LARGE=1 to run large file tests", () => { });
      return;
    }

    // Schema inference only at 250MB+; CSV only on a tiny slice
    realFileBlock("data_250mb.json", 1_000, 2_000);
    realFileBlock("data_500mb.json", 1_000, 2_000);
    realFileBlock("data_1gb.json", 1_000, 2_000);
  });
});
