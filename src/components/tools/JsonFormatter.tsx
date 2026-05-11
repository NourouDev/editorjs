import { createSignal, Show, For, createMemo, onCleanup, onMount } from "solid-js";
import { createJsonWorker } from "~/lib/jsonWorker";
import { CopyIcon, CheckIcon, XIcon } from "~/components/SvgIcons";
import PretextEditor from "../editor/pretext-editor/PretextEditor";
import { isDarkMode } from "~/lib/theme";

type ViewMode = "split" | "diff";

interface DiffLine {
  type: "added" | "removed" | "unchanged";
  content: string;
  oldLineNum?: number;
  newLineNum?: number;
}

function computeDiff(oldText: string, newText: string): DiffLine[] {
  const oldLines = oldText.split("\n");
  const newLines = newText.split("\n");

  const lcsMatrix: number[][] = [];
  for (let i = 0; i <= oldLines.length; i++) {
    lcsMatrix[i] = [];
    for (let j = 0; j <= newLines.length; j++) {
      if (i === 0 || j === 0) {
        lcsMatrix[i][j] = 0;
      } else if (oldLines[i - 1] === newLines[j - 1]) {
        lcsMatrix[i][j] = lcsMatrix[i - 1][j - 1] + 1;
      } else {
        lcsMatrix[i][j] = Math.max(lcsMatrix[i - 1][j], lcsMatrix[i][j - 1]);
      }
    }
  }

  const stack: DiffLine[] = [];
  let i = oldLines.length;
  let j = newLines.length;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      stack.push({ type: "unchanged", content: oldLines[i - 1], oldLineNum: i, newLineNum: j });
      i--; j--;
    } else if (j > 0 && (i === 0 || lcsMatrix[i][j - 1] >= lcsMatrix[i - 1][j])) {
      stack.push({ type: "added", content: newLines[j - 1], newLineNum: j });
      j--;
    } else {
      stack.push({ type: "removed", content: oldLines[i - 1], oldLineNum: i });
      i--;
    }
  }
  stack.reverse();
  return stack;
}

export default function JsonFormatter() {
  const [originalInput, setOriginalInput] = createSignal('{\n  "name": "ZeroJSON",\n  "version": "1.0.0",\n  "features": ["validate","format","diff"]\n}');
  const [formattedOutput, setFormattedOutput] = createSignal("");
  const [status, setStatus] = createSignal<{ type: string; message: string }>({ type: "idle", message: "Ready" });
  const [isProcessing, setIsProcessing] = createSignal(false);
  const [viewMode, setViewMode] = createSignal<ViewMode>("split");
  const [copied, setCopied] = createSignal(false);
  const [indentSize, setIndentSize] = createSignal(2);
  const [hasFormatted, setHasFormatted] = createSignal(false);

  let worker: Worker | undefined;

  onMount(() => {
    worker = createJsonWorker();
    worker.onmessage = (event) => {
      const { success, error, position, formatted } = event.data;
      setIsProcessing(false);

      if (success) {
        setFormattedOutput(formatted);
        setHasFormatted(true);
        setStatus({ type: "success", message: "Formatted" });
      } else {
        let msg = error;
        if (position && !error.toLowerCase().includes("line")) {
          msg += ` at line ${position.line}, column ${position.column}`;
        }
        setStatus({ type: "error", message: msg });
        setFormattedOutput("");
        setHasFormatted(false);
      }
    };
  });

  onCleanup(() => {
    worker?.terminate();
  });

  const handleFormat = () => {
    const input = originalInput().trim();
    if (!input) {
      setStatus({ type: "error", message: "Enter JSON" });
      return;
    }
    if (!worker) return;
    setIsProcessing(true);
    setStatus({ type: "idle", message: "Formatting..." });
    worker.postMessage({ type: 'format', data: input });
  };

  const handleMinify = () => {
    const input = originalInput().trim();
    if (!input) {
      setStatus({ type: "error", message: "Enter JSON" });
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setFormattedOutput(JSON.stringify(parsed));
      setHasFormatted(true);
      setStatus({ type: "success", message: "Minified" });
    } catch (err: any) {
      setStatus({ type: "error", message: err.message });
    }
  };

  const handleCopy = async () => {
    const output = formattedOutput();
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleDownload = () => {
    const output = formattedOutput();
    if (!output) return;
    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "formatted.json";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  const diffLines = createMemo(() => {
    if (!hasFormatted()) return [];
    return computeDiff(originalInput(), formattedOutput());
  });

  const diffStats = createMemo(() => {
    const lines = diffLines();
    return {
      added: lines.filter((l) => l.type === "added").length,
      removed: lines.filter((l) => l.type === "removed").length,
    };
  });

  return (
    <div class="space-y-4">
      {/* Toolbar */}
      <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3">
        <div class="flex flex-wrap items-center gap-2">
          <button
            onClick={handleFormat}
            disabled={isProcessing()}
            class="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {isProcessing() ? "..." : "Format"}
          </button>

          <button
            onClick={handleMinify}
            class="px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Minify
          </button>

          <div class="flex items-center gap-1.5 px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
            <span class="text-xs text-slate-500 dark:text-slate-400">Indent</span>
            <select
              value={indentSize()}
              onChange={(e) => setIndentSize(parseInt(e.currentTarget.value))}
              class="bg-transparent text-sm text-slate-700 dark:text-slate-300 outline-none"
            >
              <option value="2">2</option>
              <option value="4">4</option>
              <option value="8">8</option>
            </select>
          </div>

          <div class="w-px h-6 bg-slate-200 dark:bg-slate-700" />

          <div class="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <button
              onClick={() => setViewMode("split")}
              class={`px-3 py-1.5 text-sm font-medium transition-colors ${viewMode() === "split" ? "bg-indigo-600 text-white" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"}`}
            >
              Split
            </button>
            <button
              onClick={() => setViewMode("diff")}
              class={`px-3 py-1.5 text-sm font-medium transition-colors ${viewMode() === "diff" ? "bg-indigo-600 text-white" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"}`}
            >
              Diff
            </button>
          </div>

          <div class="w-px h-6 bg-slate-200 dark:bg-slate-700" />

          <button
            onClick={handleCopy}
            disabled={!hasFormatted()}
            class="px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 flex items-center gap-1.5 transition-colors"
          >
            <CopyIcon />
            {copied() ? "Copied" : "Copy"}
          </button>

          <button
            onClick={handleDownload}
            disabled={!hasFormatted()}
            class="px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 flex items-center gap-1.5 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download
          </button>

          <div class="ml-auto flex items-center gap-2">
            <Show when={status().type === "success"}>
              <span class="text-green-600 dark:text-green-400"><CheckIcon /></span>
            </Show>
            <Show when={status().type === "error"}>
              <span class="text-red-600 dark:text-red-400"><XIcon /></span>
            </Show>
            <span class={`text-sm font-medium ${status().type === "success" ? "text-green-700 dark:text-green-400" : status().type === "error" ? "text-red-700 dark:text-red-400" : "text-slate-600 dark:text-slate-400"}`}>
              {status().message}
            </span>
          </div>
        </div>
      </div>

      {/* Split View */}
      <Show when={viewMode() === "split"}>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div class="flex flex-col">
            <div class="px-4 py-2 bg-slate-100 dark:bg-slate-950 rounded-t-xl flex items-center justify-between border border-b-0 border-slate-200 dark:border-slate-800">
              <span class="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400" />
                Original
              </span>
              <span class="text-xs text-slate-400 dark:text-slate-500 font-mono">{originalInput().length} chars</span>
            </div>
            <div class="h-[500px] rounded-b-xl overflow-hidden border border-slate-200 dark:border-slate-800 border-t-0">
              <PretextEditor value={originalInput()} onChange={setOriginalInput} mode="text" />
            </div>
          </div>

          <div class="flex flex-col">
            <div class="px-4 py-2 bg-slate-100 dark:bg-slate-950 rounded-t-xl flex items-center justify-between border border-b-0 border-slate-200 dark:border-slate-800">
              <span class="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                Formatted
              </span>
              <span class="text-xs text-slate-400 dark:text-slate-500 font-mono">{formattedOutput().length} chars</span>
            </div>
            <div class="h-[450px] rounded-b-xl overflow-hidden border border-slate-200 dark:border-slate-800 border-t-0">
              <PretextEditor
                value={formattedOutput() || "// Click Format"}
                mode="text"
              />
            </div>
          </div>
        </div>
      </Show>

      {/* Diff View */}
      <Show when={viewMode() === "diff"}>
        <div class="flex flex-col">
          <div class="flex items-center justify-between px-4 py-2 bg-slate-100 dark:bg-slate-950 rounded-t-xl border border-b-0 border-slate-200 dark:border-slate-800">
            <span class="text-sm font-medium text-slate-700 dark:text-slate-300">Diff View</span>
            <Show when={hasFormatted()}>
              <div class="flex items-center gap-3 text-xs font-mono">
                <span class="text-emerald-400">+{diffStats().added}</span>
                <span class="text-red-400">-{diffStats().removed}</span>
              </div>
            </Show>
          </div>

          <div class="bg-white dark:bg-[#0f172a] rounded-b-xl overflow-hidden border border-slate-200 dark:border-slate-800 border-t-0">
            <Show
              when={hasFormatted()}
              fallback={
                <div class="flex items-center justify-center h-[450px] text-slate-500 text-sm">
                  Click Format to generate diff
                </div>
              }
            >
              <div class="overflow-auto max-h-[500px] font-mono text-sm bg-slate-50 dark:bg-[#0b1120]">
                <table class="w-full border-collapse">
                  <tbody style={{ "line-height": "22px" }}>
                    <For each={diffLines()}>
                      {(line) => (
                        <tr class={`group border-b border-transparent hover:border-slate-100 dark:hover:border-slate-800/50 ${line.type === "added" ? "bg-emerald-50/50 dark:bg-emerald-950/20" : line.type === "removed" ? "bg-red-50/50 dark:bg-red-950/20" : ""}`}>
                          <td class="px-3 py-0 text-right text-slate-400 dark:text-slate-600 select-none w-10 text-[10px] border-r border-slate-200 dark:border-slate-800 bg-slate-100/30 dark:bg-slate-900/30">
                            {line.type !== "added" ? line.oldLineNum : ""}
                          </td>
                          <td class="px-3 py-0 text-right text-slate-400 dark:text-slate-600 select-none w-10 text-[10px] border-r border-slate-200 dark:border-slate-800 bg-slate-100/30 dark:bg-slate-900/30">
                            {line.type !== "removed" ? line.newLineNum : ""}
                          </td>
                          <td class={`px-2 py-0 select-none w-6 text-center font-bold ${line.type === "added" ? "text-emerald-500" : line.type === "removed" ? "text-red-500" : "text-slate-300 dark:text-slate-700"}`}>
                            {line.type === "added" ? "+" : line.type === "removed" ? "-" : ""}
                          </td>
                          <td class={`px-4 py-0 whitespace-pre font-mono text-[13px] ${line.type === "added" ? "text-emerald-700 dark:text-emerald-300" : line.type === "removed" ? "text-red-700 dark:text-red-300" : "text-slate-600 dark:text-slate-400"}`}>
                            {line.content || " "}
                          </td>
                        </tr>
                      )}
                    </For>
                  </tbody>
                </table>
              </div>
            </Show>
          </div>
        </div>
      </Show>
    </div>
  );
}
