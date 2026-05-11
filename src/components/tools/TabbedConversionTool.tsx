import { createSignal, createMemo, Show, For } from "solid-js";
import TextView from "../editor/pretext-editor/TextView";

export interface ConversionTab {
  id: string;
  label: string;
  lang: string;                                // for output panel label
  convert: (json: unknown, opts: Record<string, boolean>) => string | Promise<string>;
  options?: Array<{ id: string; label: string; default?: boolean }>;
  downloadExt?: string;
  binaryDownload?: (json: unknown) => Promise<Blob>; // for Excel
}

interface Props {
  tabs: ConversionTab[];
  defaultJson?: string;
}

const DEFAULT_JSON = `{
  "user": {
    "id": 1,
    "name": "Alice",
    "email": "alice@example.com",
    "createdAt": "2024-01-15T10:30:00Z",
    "isPremium": false,
    "score": 98.5,
    "tags": ["admin", "editor"],
    "address": {
      "street": "123 Main St",
      "city": "Montreal",
      "zip": "H1A 1A1"
    }
  }
}`;

export default function TabbedConversionTool(props: Props) {
  const [inputJson, setInputJson] = createSignal(props.defaultJson ?? DEFAULT_JSON);
  const [activeTab, setActiveTab] = createSignal(props.tabs[0]?.id ?? "");
  const [opts, setOpts] = createSignal<Record<string, boolean>>({});
  const [copied, setCopied] = createSignal(false);
  const [output, setOutput] = createSignal("");
  const [converting, setConverting] = createSignal(false);

  const currentTab = createMemo(() => props.tabs.find(t => t.id === activeTab()));

  const parseResult = createMemo<{ ok: true; data: unknown } | { ok: false; error: string }>(() => {
    const raw = inputJson().trim();
    if (!raw) return { ok: false, error: "" };
    try { return { ok: true, data: JSON.parse(raw) }; }
    catch (e: any) { return { ok: false, error: e.message }; }
  });

  // Re-run conversion when tab, opts, or input changes
  const runConvert = async () => {
    const tab = currentTab();
    const parsed = parseResult();
    if (!tab || !parsed.ok) {
      setOutput(parsed.ok ? "" : parsed.error ? `// JSON error:\n// ${parsed.error}` : "");
      return;
    }
    setConverting(true);
    try {
      const result = await tab.convert(parsed.data, opts());
      setOutput(typeof result === "string" ? result : "");
    } catch (e: any) {
      setOutput(`// Conversion error:\n// ${e.message}`);
    } finally {
      setConverting(false);
    }
  };

  // Watch changes — using createEffect-like pattern with createMemo side effect
  createMemo(() => {
    // Track dependencies
    activeTab();
    inputJson();
    JSON.stringify(opts()); // track opts object changes
    runConvert();
  });

  const getOpt = (id: string) => {
    const tab = currentTab();
    const def = tab?.options?.find(o => o.id === id)?.default ?? false;
    return opts()[id] ?? def;
  };

  const toggleOpt = (id: string) => {
    setOpts(prev => ({ ...prev, [id]: !getOpt(id) }));
  };

  const switchTab = (id: string) => {
    setActiveTab(id);
    // Reset opts to defaults for new tab
    const tab = props.tabs.find(t => t.id === id);
    const defaults: Record<string, boolean> = {};
    for (const o of tab?.options ?? []) defaults[o.id] = o.default ?? false;
    setOpts(defaults);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

  const handleDownload = async () => {
    const tab = currentTab();
    const parsed = parseResult();
    if (!tab) return;

    // Excel binary download
    if (tab.binaryDownload && parsed.ok) {
      const blob = await tab.binaryDownload(parsed.data);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "export.xlsx";
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(url);
      return;
    }

    const ext = tab.downloadExt ?? "txt";
    const blob = new Blob([output()], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `output.${ext}`;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  // ── Styles ──
  const btn = (active = false, color = "default") => {
    const base = "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-150 shadow-sm";
    if (color === "primary") return `${base} bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-700`;
    if (active) return `${base} bg-indigo-600 text-white border-indigo-700`;
    return `${base} bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:text-indigo-600`;
  };

  const tabCls = (id: string) =>
    `px-4 py-2 text-[12px] font-semibold border-b-2 transition-colors cursor-pointer select-none ${
      activeTab() === id
        ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
        : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
    }`;

  const langColor: Record<string, string> = {
    typescript: "bg-blue-400", zod: "bg-indigo-400", go: "bg-cyan-400", rust: "bg-orange-400",
    sql: "bg-purple-400", csv: "bg-green-400", excel: "bg-emerald-400",
    "json-schema": "bg-yellow-400", openapi: "bg-pink-400",
  };

  return (
    <div class="flex flex-col h-full gap-0 min-h-0">
      {/* ── Top bar ── */}
      <div class="flex items-center gap-2 flex-wrap pb-3">
        <button class={btn()} onClick={handleLoad}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>
          Open JSON
        </button>
        <button class={btn()} onClick={() => setInputJson("")}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3,6 5,6 21,6"/><path d="M19,6l-1,14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5,6"/></svg>
          Clear
        </button>

        {/* Options for current tab */}
        <For each={currentTab()?.options ?? []}>
          {(opt) => (
            <label class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border cursor-pointer select-none transition-all bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-300">
              <input
                type="checkbox"
                checked={getOpt(opt.id)}
                onChange={() => toggleOpt(opt.id)}
                class="accent-indigo-500 w-3.5 h-3.5"
              />
              {opt.label}
            </label>
          )}
        </For>

        <div class="ml-auto flex items-center gap-1.5">
          <Show when={inputJson().trim()}>
            <span class={`px-2 py-1 text-[10px] font-bold rounded-full border ${
              parseResult().ok
                ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 border-emerald-200 dark:border-emerald-800"
                : "bg-red-50 dark:bg-red-950/30 text-red-600 border-red-200 dark:border-red-800"
            }`}>
              {parseResult().ok ? "✓ Valid JSON" : "✕ Invalid JSON"}
            </span>
          </Show>
          <button class={btn()} onClick={handleDownload}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download
          </button>
          <button class={copied() ? btn(true, "primary") : btn()} onClick={handleCopy}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            {copied() ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div class="flex border-b border-slate-200 dark:border-slate-800 mb-3 gap-1">
        <For each={props.tabs}>
          {(tab) => (
            <button class={tabCls(tab.id)} onClick={() => switchTab(tab.id)}>
              {tab.label}
            </button>
          )}
        </For>
      </div>

      {/* ── Editor split ── */}
      <div class="flex flex-1 min-h-0 gap-4">
        {/* JSON Input */}
        <div class="flex flex-col flex-1 min-w-0 min-h-0 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div class="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <span class="w-2 h-2 rounded-full bg-amber-400" />
            <span class="text-[11px] font-bold text-slate-500 uppercase tracking-widest">JSON Input</span>
          </div>
          <div class="flex-1 min-h-0">
            <TextView value={inputJson()} onChange={setInputJson} />
          </div>
        </div>

        {/* Output */}
        <div class="flex flex-col flex-1 min-w-0 min-h-0 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div class="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <span class={`w-2 h-2 rounded-full ${langColor[currentTab()?.lang ?? ""] ?? "bg-slate-400"}`} />
            <span class="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
              {currentTab()?.label} Output
            </span>
            <Show when={output()}>
              <span class="ml-auto text-[10px] text-slate-400 font-mono">
                {converting() ? "⟳ converting…" : `${output().split("\n").length} lines`}
              </span>
            </Show>
          </div>
          <div class="flex-1 min-h-0 overflow-auto bg-[#0d1117]">
            <Show
              when={output()}
              fallback={
                <div class="flex items-center justify-center h-full text-slate-600 text-sm">
                  {parseResult().ok ? "Loading…" : "Paste valid JSON on the left"}
                </div>
              }
            >
              <pre class="p-4 font-mono text-[13px] text-slate-300 leading-[22px] whitespace-pre overflow-auto h-full">{output()}</pre>
            </Show>
          </div>
        </div>
      </div>
    </div>
  );
}
