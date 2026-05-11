import { createSignal, createMemo, Show } from "solid-js";
import TextView from "../editor/pretext-editor/TextView";

interface ConversionToolProps {
  title: string;
  description: string;
  outputLanguage: string; // "typescript" | "sql"
  convert: (json: unknown) => string;
  placeholder?: string;
}

const defaultJson = `{
  "user": {
    "id": 1,
    "name": "Alice",
    "email": "alice@example.com",
    "createdAt": "2024-01-15T10:30:00Z",
    "isPremium": false,
    "tags": ["admin", "editor"],
    "address": {
      "street": "123 Main St",
      "city": "Montreal",
      "zip": "H1A 1A1"
    }
  }
}`;

export default function ConversionTool(props: ConversionToolProps) {
  const [inputJson, setInputJson] = createSignal(defaultJson);
  const [copied, setCopied] = createSignal(false);

  const parseResult = createMemo<{ ok: true; data: unknown } | { ok: false; error: string }>(() => {
    const raw = inputJson().trim();
    if (!raw) return { ok: false, error: "" };
    try {
      return { ok: true, data: JSON.parse(raw) };
    } catch (e: any) {
      return { ok: false, error: e.message };
    }
  });

  const output = createMemo(() => {
    const r = parseResult();
    if (!r.ok) return r.error ? `// JSON parse error:\n// ${r.error}` : "";
    try {
      return props.convert(r.data);
    } catch (e: any) {
      return `// Conversion error:\n// ${e.message}`;
    }
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(output());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => setInputJson("");

  const handleLoad = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => setInputJson(ev.target?.result as string);
      reader.readAsText(file);
    };
    input.click();
  };

  const handleDownload = () => {
    const ext = props.outputLanguage === "typescript" ? "ts" : "sql";
    const blob = new Blob([output()], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `schema.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const btnCls = "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-150 shadow-sm";
  const primaryBtn = `${btnCls} bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-700`;
  const defaultBtn = `${btnCls} bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400`;

  return (
    <div class="flex flex-col h-full gap-0">
      {/* ── Toolbar ── */}
      <div class="flex items-center gap-2 flex-wrap px-0 pb-3">
        <button class={defaultBtn} onClick={handleLoad}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/>
          </svg>
          Open JSON
        </button>
        <button class={defaultBtn} onClick={handleClear}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3,6 5,6 21,6"/><path d="M19,6l-1,14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5,6"/>
          </svg>
          Clear
        </button>

        <div class="ml-auto flex items-center gap-1.5">
          {/* Status badge */}
          <Show when={parseResult().ok !== undefined && inputJson().trim()}>
            <span class={`px-2 py-1 text-[10px] font-bold rounded-full border ${
              parseResult().ok
                ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                : "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800"
            }`}>
              {parseResult().ok ? "✓ Valid JSON" : "✕ Invalid JSON"}
            </span>
          </Show>
          <button class={defaultBtn} onClick={handleDownload} title="Download result">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download
          </button>
          <button class={copied() ? `${primaryBtn}` : defaultBtn} onClick={handleCopy}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            {copied() ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {/* ── Split editor ── */}
      <div class="flex flex-1 min-h-0 gap-4">
        {/* Input — JSON */}
        <div class="flex flex-col flex-1 min-w-0 min-h-0 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div class="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <span class="w-2 h-2 rounded-full bg-amber-400" />
            <span class="text-[11px] font-bold text-slate-500 uppercase tracking-widest">JSON Input</span>
          </div>
          <div class="flex-1 min-h-0">
            <TextView value={inputJson()} onChange={setInputJson} />
          </div>
        </div>

        {/* Output — TS or SQL */}
        <div class="flex flex-col flex-1 min-w-0 min-h-0 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div class="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <span class={`w-2 h-2 rounded-full ${props.outputLanguage === "typescript" ? "bg-blue-400" : "bg-purple-400"}`} />
            <span class="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
              {props.outputLanguage === "typescript" ? "TypeScript" : "SQL"} Output
            </span>
            <Show when={output()}>
              <span class="ml-auto text-[10px] text-slate-400 font-mono">{output().split("\n").length} lines</span>
            </Show>
          </div>
          <div class="flex-1 min-h-0 overflow-auto bg-slate-950 dark:bg-[#0d1117]">
            <Show
              when={output()}
              fallback={
                <div class="flex items-center justify-center h-full text-slate-500 dark:text-slate-600 text-sm">
                  Paste JSON on the left to generate output
                </div>
              }
            >
              <pre class="p-4 font-mono text-[13px] text-slate-300 leading-[22px] overflow-auto h-full whitespace-pre">{output()}</pre>
            </Show>
          </div>
        </div>
      </div>
    </div>
  );
}
