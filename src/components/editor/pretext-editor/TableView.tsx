import { For, createMemo, Show } from "solid-js";
import { prepare, layout } from "@chenglou/pretext";

interface TableViewProps {
  data: any;
}

export default function TableView(props: TableViewProps) {
  // Ensure we are dealing with an array of objects
  const tableData = createMemo(() => {
    if (!Array.isArray(props.data)) return [];
    return props.data.filter(item => item !== null && typeof item === "object");
  });

  const columns = createMemo(() => {
    const cols = new Set<string>();
    tableData().forEach(item => {
      Object.keys(item).forEach(key => cols.add(key));
    });
    return Array.from(cols);
  });

  const font = "13px ui-monospace, monospace";

  // Use Pretext to calculate optimal column widths (demonstration)
  const columnWidths = createMemo(() => {
    const widths: Record<string, number> = {};
    columns().forEach(col => {
      const prepared = prepare(col, "bold " + font);
      const { height } = layout(prepared, 1000, 20); // Get width by checking how it fits
      widths[col] = 120; // Default base width
    });
    return widths;
  });

  const renderValue = (val: any) => {
    if (val === null) return <span class="text-slate-400">null</span>;
    if (typeof val === "boolean") return <span class="text-amber-600 dark:text-amber-400">{String(val)}</span>;
    if (typeof val === "number") return <span class="text-amber-600 dark:text-amber-400">{val}</span>;
    if (typeof val === "object") return <span class="text-slate-400 italic text-xs">{Array.isArray(val) ? "Array" : "Object"}</span>;
    
    // For strings, use Pretext to check layout if needed, here we just style it
    return <span class="text-emerald-600 dark:text-emerald-400">"{String(val)}"</span>;
  };

  return (
    <div class="w-full overflow-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm">
      <Show when={tableData().length > 0} fallback={
        <div class="p-8 text-center text-slate-500 italic text-sm">
          No tabular data found. Table mode requires an array of objects.
        </div>
      }>
        <table class="w-full border-collapse text-left text-xs font-mono">
          <thead>
            <tr class="bg-slate-50/80 dark:bg-slate-800/50 sticky top-0 z-10 backdrop-blur-sm">
              <th class="p-3 border-b border-slate-200 dark:border-slate-700 text-slate-400 font-bold uppercase tracking-wider w-10 text-center">#</th>
              <For each={columns()}>
                {(col) => (
                  <th 
                    class="p-3 border-b border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider"
                    style={{ "min-width": `${columnWidths()[col]}px` }}
                  >
                    {col}
                  </th>
                )}
              </For>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800/50">
            <For each={tableData()}>
              {(row, index) => (
                <tr class="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors group">
                  <td class="p-3 text-slate-300 dark:text-slate-600 text-center border-r border-slate-100 dark:border-slate-800/50">
                    {index() + 1}
                  </td>
                  <For each={columns()}>
                    {(col) => (
                      <td class="p-3 align-top max-w-[300px] truncate group-hover:whitespace-normal group-hover:overflow-visible group-hover:bg-white dark:group-hover:bg-slate-800 group-hover:shadow-lg transition-all duration-200">
                        {renderValue(row[col])}
                      </td>
                    )}
                  </For>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </Show>
    </div>
  );
}
