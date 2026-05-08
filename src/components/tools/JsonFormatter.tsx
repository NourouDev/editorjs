import { createSignal, Show, For, createMemo, onCleanup, onMount } from "solid-js";
import { clientOnly } from "@solidjs/start";
import { createJsonWorker } from "~/lib/jsonWorker";

const MonacoEditorClient = clientOnly(() => import("../MonacoEditor"));

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

  // LCS-based diff
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

  const result: DiffLine[] = [];
  let i = oldLines.length;
  let j = newLines.length;

  const stack: DiffLine[] = [];
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      stack.push({ type: "unchanged", content: oldLines[i - 1], oldLineNum: i, newLineNum: j });
      i--;
      j--;
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
  const [originalInput, setOriginalInput] = createSignal('{\n  "name": "ZeroJSON",\n  "version": "1.0.0",\n  "features": ["validate","format","diff"],\n  "config": {"indent": 2, "sortKeys": false}\n}');
  const [formattedOutput, setFormattedOutput] = createSignal("");
  const [status, setStatus] = createSignal<{ type: string; message: string }>({ type: "idle", message: "Paste your JSON and hit Format" });
  const [isProcessing, setIsProcessing] = createSignal(false);
  const [viewMode, setViewMode] = createSignal<ViewMode>("split");
  const [copied, setCopied] = createSignal(false);
  const [indentSize, setIndentSize] = createSignal(2);
  const [hasFormatted, setHasFormatted] = createSignal(false);
  const [formatTimeMs, setFormatTimeMs] = createSignal(0);

  let worker: Worker | undefined;

  onMount(() => {
    worker = createJsonWorker();
    worker.onmessage = (event) => {
      const { type, success, error, position, formatted } = event.data;
      setIsProcessing(false);

      if (success) {
        if (type === "format") {
          setFormattedOutput(formatted);
          setHasFormatted(true);
          setStatus({ type: "success", message: "Formatted" });
        } else {
          setStatus({ type: "success", message: "Valid JSON" });
        }
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
      setStatus({ type: "error", message: "Please enter some JSON" });
      return;
    }
    if (!worker) return;
    setIsProcessing(true);
    setStatus({ type: "idle", message: "Formatting..." });
    const start = performance.now();

    // Use custom indent
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, indentSize());
      setFormattedOutput(formatted);
      setHasFormatted(true);
      setFormatTimeMs(Math.round(performance.now() - start));
      setStatus({ type: "success", message: "Formatted" });
      setIsProcessing(false);
    } catch (err: any) {
      setStatus({ type: "error", message: err.message });
      setFormattedOutput("");
      setHasFormatted(false);
      setIsProcessing(false);
    }
  };

  const handleMinify = () => {
    const input = originalInput().trim();
    if (!input) {
      setStatus({ type: "error", message: "Please enter some JSON" });
      return;
    }
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setFormattedOutput(minified);
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
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = output;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
    const added = lines.filter((l) => l.type === "added").length;
    const removed = lines.filter((l) => l.type === "removed").length;
    return { added, removed };
  });

  return (
    <div class="space-y-5">
      {/* Toolbar */}
      <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div class="flex flex-wrap items-center gap-3">
          {/* Format Actions */}
          <button
            onClick={handleFormat}
            disabled={isProcessing()}
            id="btn-format"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 active:scale-[0.97] disabled:opacity-50 transition-all shadow-sm"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
            {isProcessing() ? "..." : "Format"}
          </button>

          <button
            onClick={handleMinify}
            disabled={isProcessing()}
            id="btn-minify"
            class="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-slate-700 border border-slate-300 font-semibold rounded-lg hover:bg-slate-50 active:scale-[0.97] disabled:opacity-50 transition-all"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
            Minify
          </button>

          {/* Indent Control */}
          <div class="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200">
            <span class="text-xs text-slate-500 font-medium">Indent</span>
            <select
              value={indentSize()}
              onChange={(e) => setIndentSize(parseInt(e.currentTarget.value))}
              class="bg-transparent text-sm font-semibold text-slate-700 outline-none cursor-pointer"
            >
              <option value="2">2</option>
              <option value="4">4</option>
              <option value="8">8</option>
            </select>
          </div>

          {/* Separator */}
          <div class="w-px h-8 bg-slate-200 mx-1" />

          {/* View Toggle */}
          <div class="inline-flex rounded-lg border border-slate-200 overflow-hidden">
            <button
              onClick={() => setViewMode("split")}
              id="btn-split-view"
              class={`px-4 py-2 text-sm font-semibold transition-colors ${
                viewMode() === "split"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span class="flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v18m0 0H5a2 2 0 01-2-2V5a2 2 0 012-2h4m0 18h10a2 2 0 002-2V5a2 2 0 00-2-2H9" /></svg>
                Split
              </span>
            </button>
            <button
              onClick={() => setViewMode("diff")}
              id="btn-diff-view"
              class={`px-4 py-2 text-sm font-semibold transition-colors ${
                viewMode() === "diff"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span class="flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                Diff
              </span>
            </button>
          </div>

          {/* Separator */}
          <div class="w-px h-8 bg-slate-200 mx-1" />

          {/* Output Actions */}
          <button
            onClick={handleCopy}
            disabled={!hasFormatted()}
            id="btn-copy"
            class="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-slate-700 border border-slate-300 font-semibold rounded-lg hover:bg-slate-50 active:scale-[0.97] disabled:opacity-40 transition-all"
          >
            <Show when={copied()} fallback={
              <>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                Copy
              </>
            }>
              <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
              <span class="text-green-600">Copied!</span>
            </Show>
          </button>

          <button
            onClick={handleDownload}
            disabled={!hasFormatted()}
            id="btn-download"
            class="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-slate-700 border border-slate-300 font-semibold rounded-lg hover:bg-slate-50 active:scale-[0.97] disabled:opacity-40 transition-all"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Download
          </button>

          {/* Spacer + Status */}
          <div class="ml-auto flex items-center gap-3">
            <Show when={formatTimeMs() > 0 && hasFormatted()}>
              <span class="text-xs text-slate-400 font-mono">{formatTimeMs()}ms</span>
            </Show>
            <div
              class={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                status().type === "success"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : status().type === "error"
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-slate-50 text-slate-500 border-slate-200"
              }`}
            >
              {status().type === "success" ? "✓ " : status().type === "error" ? "✕ " : ""}
              {status().message}
            </div>
          </div>
        </div>
      </div>

      {/* Split View */}
      <Show when={viewMode() === "split"}>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left - Original */}
          <div class="flex flex-col">
            <div class="flex items-center justify-between px-4 py-2.5 bg-slate-800 rounded-t-xl">
              <span class="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-amber-400" />
                Original
              </span>
              <span class="text-xs text-slate-500 font-mono">
                {originalInput().length.toLocaleString()} chars
              </span>
            </div>
            <div class="h-[550px] shadow-lg rounded-b-xl overflow-hidden border border-slate-700 border-t-0">
              <MonacoEditorClient
                value={originalInput()}
                onChange={setOriginalInput}
                language="json"
              />
            </div>
          </div>

          {/* Right - Formatted */}
          <div class="flex flex-col">
            <div class="flex items-center justify-between px-4 py-2.5 bg-slate-800 rounded-t-xl">
              <span class="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-emerald-400" />
                Formatted
              </span>
              <span class="text-xs text-slate-500 font-mono">
                {formattedOutput().length.toLocaleString()} chars
              </span>
            </div>
            <div class="h-[550px] shadow-lg rounded-b-xl overflow-hidden border border-slate-700 border-t-0">
              <MonacoEditorClient
                value={formattedOutput() || "// Click Format to see the result"}
                onChange={() => {}}
                language="json"
              />
            </div>
          </div>
        </div>
      </Show>

      {/* Diff View */}
      <Show when={viewMode() === "diff"}>
        <div class="flex flex-col">
          {/* Diff Header */}
          <div class="flex items-center justify-between px-4 py-2.5 bg-slate-800 rounded-t-xl">
            <span class="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
              Diff View
            </span>
            <Show when={hasFormatted()}>
              <div class="flex items-center gap-3 text-xs font-mono">
                <span class="text-emerald-400">+{diffStats().added}</span>
                <span class="text-red-400">-{diffStats().removed}</span>
              </div>
            </Show>
          </div>

          <div class="bg-slate-900 rounded-b-xl overflow-hidden border border-slate-700 border-t-0 shadow-lg">
            <Show
              when={hasFormatted()}
              fallback={
                <div class="flex items-center justify-center h-[550px] text-slate-500 text-sm">
                  <p>Click <strong class="text-indigo-400">Format</strong> to generate a diff</p>
                </div>
              }
            >
              <div class="overflow-auto max-h-[550px] font-mono text-sm" id="diff-container">
                <table class="w-full border-collapse">
                  <tbody>
                    <For each={diffLines()}>
                      {(line) => (
                        <tr
                          class={
                            line.type === "added"
                              ? "bg-emerald-950/40"
                              : line.type === "removed"
                              ? "bg-red-950/40"
                              : ""
                          }
                        >
                          {/* Old line number */}
                          <td class="px-3 py-0.5 text-right text-slate-600 select-none w-12 text-xs border-r border-slate-800">
                            {line.type !== "added" ? line.oldLineNum : ""}
                          </td>
                          {/* New line number */}
                          <td class="px-3 py-0.5 text-right text-slate-600 select-none w-12 text-xs border-r border-slate-800">
                            {line.type !== "removed" ? line.newLineNum : ""}
                          </td>
                          {/* Sign */}
                          <td
                            class={`px-2 py-0.5 select-none w-6 text-center font-bold ${
                              line.type === "added"
                                ? "text-emerald-400"
                                : line.type === "removed"
                                ? "text-red-400"
                                : "text-slate-700"
                            }`}
                          >
                            {line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}
                          </td>
                          {/* Content */}
                          <td
                            class={`px-3 py-0.5 whitespace-pre ${
                              line.type === "added"
                                ? "text-emerald-300"
                                : line.type === "removed"
                                ? "text-red-300"
                                : "text-slate-400"
                            }`}
                          >
                            {line.content}
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
