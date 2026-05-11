import { createMemo, For } from "solid-js";

export interface DiffLine {
  type: "added" | "removed" | "unchanged";
  content: string;
  oldLineNum?: number;
  newLineNum?: number;
}

export function computeDiff(oldText: string, newText: string): DiffLine[] {
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

interface JsonDiffViewProps {
  original: string;
  modified: string;
}

export default function JsonDiffView(props: JsonDiffViewProps) {
  const diffLines = createMemo(() => computeDiff(props.original, props.modified));
  
  const diffStats = createMemo(() => {
    const lines = diffLines();
    return {
      added: lines.filter(l => l.type === "added").length,
      removed: lines.filter(l => l.type === "removed").length,
    };
  });

  return (
    <div class="flex flex-col h-full bg-white dark:bg-[#0b1120] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      <div class="flex items-center justify-between px-4 py-2 bg-slate-100 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
        <div class="flex items-center gap-4">
          <span class="text-sm font-medium text-slate-700 dark:text-slate-300">Diff View (Unified)</span>
          <div class="flex items-center gap-2 text-xs">
            <span class="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded">Removed (-)</span>
            <span class="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded">Added (+)</span>
          </div>
        </div>
        <div class="flex items-center gap-3 text-xs font-mono">
          <span class="text-emerald-500">+{diffStats().added}</span>
          <span class="text-red-500">-{diffStats().removed}</span>
        </div>
      </div>

      <div class="flex-1 overflow-auto font-mono text-[13px] leading-5">
        <table class="w-full border-collapse">
          <tbody>
            <For each={diffLines()}>
              {(line) => (
                <tr class={
                  line.type === "added" 
                    ? "bg-emerald-50 dark:bg-emerald-900/20" 
                    : line.type === "removed" 
                      ? "bg-red-50 dark:bg-red-900/20" 
                      : ""
                }>
                  {/* Old line number */}
                  <td class="px-2 py-0.5 text-right text-slate-400 dark:text-slate-500 select-none w-10 bg-slate-50 dark:bg-slate-900/50">
                    {line.type === "added" ? "" : line.oldLineNum}
                  </td>
                  {/* New line number */}
                  <td class="px-2 py-0.5 text-right text-slate-400 dark:text-slate-500 select-none w-10 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                    {line.type === "removed" ? "" : line.newLineNum}
                  </td>
                  {/* Indicator */}
                  <td class={`px-2 py-0.5 font-bold select-none w-6 ${
                    line.type === "added" 
                      ? "text-emerald-600 dark:text-emerald-400" 
                      : line.type === "removed" 
                        ? "text-red-600 dark:text-red-400" 
                        : "text-slate-400 dark:text-slate-600"
                  }`}>
                    {line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}
                  </td>
                  {/* Content */}
                  <td class={`px-1 py-0.5 whitespace-pre ${
                    line.type === "added" 
                      ? "text-emerald-700 dark:text-emerald-300" 
                      : line.type === "removed" 
                        ? "text-red-700 dark:text-red-300" 
                        : "text-slate-600 dark:text-slate-400"
                  }`}>
                    {line.content}
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </div>
  );
}
