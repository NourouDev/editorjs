import { useParams } from "@solidjs/router";
import { Show, Switch, Match } from "solid-js";
import { TOOLS_REGISTRY } from "~/config/tools.config";
import JsonValidator from "~/components/tools/JsonValidator";
import JsonEditor from "~/components/tools/JsonEditor";
import TabbedConversionTool from "~/components/tools/TabbedConversionTool";
import {
  jsonToTypeScript, jsonToZod, jsonToGo, jsonToRust,
  jsonToSql, jsonToCsv, jsonToExcelBlob,
  jsonToJsonSchema, jsonToOpenApi,
} from "~/lib/jsonConverters";
import { Title } from "@solidjs/meta";
import { LockIcon, FormatIcon } from "~/components/SvgIcons";

const iconMap: Record<string, any> = {
  lock: LockIcon, format: FormatIcon, code: FormatIcon, database: LockIcon, file: LockIcon,
};

const FULLBLEED = new Set(["json-formatter"]);

// ── Tab definitions ────────────────────────────────────────────────────────────

const CODE_TABS = [
  {
    id: "typescript", label: "TypeScript", lang: "typescript", downloadExt: "ts",
    convert: (json: unknown) => jsonToTypeScript(json, "Root"),
  },
  {
    id: "zod", label: "Zod", lang: "zod", downloadExt: "ts",
    convert: (json: unknown) => jsonToZod(json, "Root"),
  },
  {
    id: "go", label: "Go", lang: "go", downloadExt: "go",
    convert: (json: unknown) => jsonToGo(json, "Root", "main"),
  },
  {
    id: "rust", label: "Rust", lang: "rust", downloadExt: "rs",
    convert: (json: unknown) => jsonToRust(json, "Root"),
  },
];

const DATA_TABS = [
  {
    id: "sql", label: "SQL", lang: "sql", downloadExt: "sql",
    options: [
      { id: "inserts", label: "Include INSERT statements", default: false },
    ],
    convert: (json: unknown, opts: Record<string, boolean>) =>
      jsonToSql(json, "table", opts["inserts"] ?? false),
  },
  {
    id: "csv", label: "CSV", lang: "csv", downloadExt: "csv",
    convert: (json: unknown) => jsonToCsv(json),
  },
  {
    id: "excel", label: "Excel", lang: "excel", downloadExt: "xlsx",
    convert: (_: unknown) => "-- Excel: use the Download button to get the .xlsx file",
    binaryDownload: (json: unknown) => jsonToExcelBlob(json),
  },
];

const SPEC_TABS = [
  {
    id: "jsonschema", label: "JSON Schema", lang: "json-schema", downloadExt: "json",
    convert: (json: unknown) => jsonToJsonSchema(json, "Schema"),
  },
  {
    id: "openapi", label: "OpenAPI 3.0", lang: "openapi", downloadExt: "yaml",
    options: [
      { id: "json", label: "Output as JSON instead of YAML", default: false },
    ],
    convert: (json: unknown, opts: Record<string, boolean>) =>
      jsonToOpenApi(json, "Generated API", !(opts["json"] ?? false)),
  },
];

// ── Route component ────────────────────────────────────────────────────────────

export default function ToolPage() {
  const params = useParams();
  const tool = () => TOOLS_REGISTRY[params.toolId as keyof typeof TOOLS_REGISTRY];
  const isFullBleed = () => FULLBLEED.has(params.toolId ?? "");
  const IconComponent = () => iconMap[tool()?.icon ?? "lock"] ?? LockIcon;

  return (
    <div class={`flex-grow flex flex-col ${isFullBleed() ? "" : "p-6 max-w-7xl mx-auto w-full"}`}>
      <Show
        when={tool()}
        fallback={
          <div class="text-center py-20">
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Tool not found</h1>
            <p class="mt-4 text-slate-600 dark:text-slate-400">The tool you are looking for does not exist.</p>
            <a href="/" class="mt-8 inline-block text-indigo-600 dark:text-indigo-400 font-medium hover:underline">Go back home</a>
          </div>
        }
      >
        <Title>{tool().name} — ZeroJSON</Title>

        <Show when={!isFullBleed()}>
          <header class="mb-6">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-10 h-10 bg-indigo-50 dark:bg-indigo-950 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <IconComponent />
              </div>
              <h1 class="text-2xl font-bold text-slate-900 dark:text-white">{tool().name}</h1>
            </div>
            <p class="text-slate-600 dark:text-slate-400 max-w-2xl">{tool().description}</p>
          </header>
        </Show>

        <div class="flex-grow flex flex-col min-h-0">
          <Switch>
            <Match when={params.toolId === "json-formatter"}>
              <JsonEditor />
            </Match>
            <Match when={params.toolId === "json-validator"}>
              <JsonValidator />
            </Match>
            <Match when={params.toolId === "json-to-code"}>
              <TabbedConversionTool tabs={CODE_TABS} />
            </Match>
            <Match when={params.toolId === "json-to-data"}>
              <TabbedConversionTool tabs={DATA_TABS} />
            </Match>
            <Match when={params.toolId === "json-to-spec"}>
              <TabbedConversionTool tabs={SPEC_TABS} />
            </Match>
            <Match when={true}>
              <div class="p-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                <p class="text-slate-500 dark:text-slate-400">Tool coming soon…</p>
              </div>
            </Match>
          </Switch>
        </div>

        <Show when={!isFullBleed()}>
          <div class="mt-8 p-6 bg-slate-100 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <p class="text-xs text-slate-400 uppercase tracking-wide mb-1">Advertisement</p>
            <p class="text-slate-500 text-sm">Ad space — privacy-respecting ads only</p>
          </div>
        </Show>
      </Show>
    </div>
  );
}
