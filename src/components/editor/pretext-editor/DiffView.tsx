import { For, createMemo } from "solid-js";
import { prepare, layout } from "@chenglou/pretext";

interface DiffLine {
  type: "added" | "removed" | "unchanged";
  content: string;
  oldLineNum?: number;
  newLineNum?: number;
}

interface DiffViewProps {
  lines: DiffLine[];
}

export default function DiffView(props: DiffViewProps) {
  const font = "13px ui-monospace, 'Cascadia Code', monospace";
  const lineHeight = 22;

  // Use Pretext to ensure consistent layout even for long lines
  const measuredLines = createMemo(() => {
    return props.lines.map(line => {
      const prepared = prepare(line.content || " ", font);
      // We don't wrap in diff view for now, but we use Pretext for height consistency
      return { ...line, prepared };
    });
  });

  return (
    <div class="h-full overflow-auto font-mono text-sm bg-slate-50 dark:bg-[#0d1117]">
      <table class="w-full border-collapse">
        <tbody style={{ "line-height": `${lineHeight}px` }}>
          <For each={measuredLines()}>
            {(line) => (
              <tr class={`group border-b border-transparent hover:border-slate-100 dark:hover:border-slate-800/50 ${
                line.type === "added" ? "bg-emerald-500/10 dark:bg-emerald-500/10" : 
                line.type === "removed" ? "bg-red-500/10 dark:bg-red-500/10" : ""
              }`}>
                {/* Old line number */}
                <td class="px-3 py-0 text-right text-slate-400 dark:text-slate-600 select-none w-10 text-[10px] border-r border-slate-200 dark:border-slate-800 bg-slate-100/30 dark:bg-slate-900/30">
                  {line.type !== "added" ? line.oldLineNum : ""}
                </td>
                {/* New line number */}
                <td class="px-3 py-0 text-right text-slate-400 dark:text-slate-600 select-none w-10 text-[10px] border-r border-slate-200 dark:border-slate-800 bg-slate-100/30 dark:bg-slate-900/30">
                  {line.type !== "removed" ? line.newLineNum : ""}
                </td>
                {/* Sign */}
                <td class={`px-2 py-0 select-none w-6 text-center font-bold ${
                  line.type === "added" ? "text-emerald-500" : 
                  line.type === "removed" ? "text-red-500" : 
                  "text-slate-300 dark:text-slate-700"
                }`}>
                  {line.type === "added" ? "+" : line.type === "removed" ? "-" : ""}
                </td>
                {/* Content */}
                <td class={`px-4 py-0 whitespace-pre font-mono text-[13px] ${
                  line.type === "added" ? "text-emerald-700 dark:text-emerald-300" : 
                  line.type === "removed" ? "text-red-700 dark:text-red-300" : 
                  "text-slate-600 dark:text-slate-400"
                }`}>
                  {line.content || " "}
                </td>
              </tr>
            )}
          </For>
        </tbody>
      </table>
      
      {/* Pretext Badge */}
      <div class="sticky bottom-3 right-4 flex justify-end p-2 pointer-events-none">
        <div class="px-2 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-md">
          <span class="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Pretext Diff Engine</span>
        </div>
      </div>
    </div>
  );
}
