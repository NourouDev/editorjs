import { createSignal, Show, For, createMemo, onCleanup, onMount } from "solid-js";
import { clientOnly } from "@solidjs/start";
import { createJsonWorker } from "~/lib/jsonWorker";
import { CheckIcon, XIcon, CopyIcon } from "~/components/SvgIcons";

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
      <div class="bg-white rounded-xl border border-slate-200 p-3">
        <div class="flex flex-wrap items-center gap-2">
          <button
            onClick={handleFormat}
            disabled={isProcessing()}
            class="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {isProcessing() ? "..." : "Format"}
          </button>

          <button
            onClick={handleMinify}
            class="px-4 py-2 bg-white text-slate-700 border border-slate-300 font-medium rounded-lg hover:bg-slate-50"
          >
            Minify
          </button>

          <div class="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded border border-slate-200">
            <span class="text-xs text-slate-500">Indent</span>
            <select
              value={indentSize()}
              onChange={(e) => setIndentSize(parseInt(e.currentTarget.value))}
              class="bg-transparent text-sm text-slate-700 outline-none"
            >
              <option value="2">2</option>
              <option value="4">4</option>
              <option value="8">8</option>
            </select>
          </div>

          <div class="w-px h-6 bg-slate-200" />

          <div class="inline-flex rounded-lg border border-slate-200 overflow-hidden">
            <button
              onClick={() => setViewMode("split")}
              class={`px-3 py-1.5 text-sm font-medium ${viewMode() === "split" ? "bg-indigo-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}
            >
              Split
            </button>
            <button
              onClick={() => setViewMode("diff")}
              class={`px-3 py-1.5 text-sm font-medium ${viewMode() === "diff" ? "bg-indigo-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}
            >
              Diff
            </button>
          </div>

          <div class="w-px h-6 bg-slate-200" />

          <button
            onClick={handleCopy}
            disabled={!hasFormatted()}
            class="px-3 py-1.5 bg-white text-slate-700 border border-slate-300 font-medium rounded-lg hover:bg-slate-50 disabled:opacity-40 flex items-center gap-1.5"
          >
            <CopyIcon />
            {copied() ? "Copied" : "Copy"}
          </button>

          <div class="ml-auto flex items-center gap-2">
            <Show when={status().type === "success"}>
              <span class="text-green-600"><CheckIcon /></span>
            </Show>
            <Show when={status().type === "error"}>
              <span class="text-red-600"><XIcon /></span>
            </Show>
            <span class={`text-sm font-medium ${status().type === "success" ? "text-green-700" : status().type === "error" ? "text-red-700" : "text-slate-600"}`}>
              {status().message}
            </span>
          </div>
        </div>
      </div>

      {/* Split View */}
      <Show when={viewMode() === "split"}>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div class="flex flex-col">
            <div class="px-4 py-2 bg-slate-800 rounded-t-xl">
              <span class="text-sm font-medium text-slate-300">Original</span>
            </div>
            <div class="h-[450px] rounded-b-xl overflow-hidden border border-slate-700 border-t-0">
              <MonacoEditorClient value={originalInput()} onChange={setOriginalInput} language="json" />
            </div>
          </div>

          <div class="flex flex-col">
            <div class="px-4 py-2 bg-slate-800 rounded-t-xl">
              <span class="text-sm font-medium text-slate-300">Formatted</span>
            </div>
            <div class="h-[450px] rounded-b-xl overflow-hidden border border-slate-700 border-t-0">
              <MonacoEditorClient
                value={formattedOutput() || "// Click Format"}
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
          <div class="flex items-center justify-between px-4 py-2 bg-slate-800 rounded-t-xl">
            <span class="text-sm font-medium text-slate-300">Diff View</span>
            <Show when={hasFormatted()}>
              <div class="flex items-center gap-3 text-xs font-mono">
                <span class="text-emerald-400">+{diffStats().added}</span>
                <span class="text-red-400">-{diffStats().removed}</span>
              </div>
            </Show>
          </div>

          <div class="bg-slate-900 rounded-b-xl overflow-hidden border border-slate-700 border-t-0">
            <Show
              when={hasFormatted()}
              fallback={
                <div class="flex items-center justify-center h-[450px] text-slate-500 text-sm">
                  Click Format to generate diff
                </div>
              }
            >
              <div class="overflow-auto max-h-[450px] font-mono text-sm">
                <table class="w-full">
                  <tbody>
                    <For each={diffLines()}>
                      {(line) => (
                        <tr class={line.type === "added" ? "bg-emerald-950/40" : line.type === "removed" ? "bg-red-950/40" : ""}>
                          <td class="px-3 py-0.5 text-right text-slate-600 select-none w-10 text-xs border-r border-slate-800">
                            {line.type !== "added" ? line.oldLineNum : ""}
                          </td>
                          <td class="px-3 py-0.5 text-right text-slate-600 select-none w-10 text-xs border-r border-slate-800">
                            {line.type !== "removed" ? line.newLineNum : ""}
                          </td>
                          <td class={`px-2 py-0.5 select-none w-6 text-center font-bold ${line.type === "added" ? "text-emerald-400" : line.type === "removed" ? "text-red-400" : "text-slate-700"}`}>
                            {line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}
                          </td>
                          <td class={`px-3 py-0.5 ${line.type === "added" ? "text-emerald-300" : line.type === "removed" ? "text-red-300" : "text-slate-400"}`}>
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
