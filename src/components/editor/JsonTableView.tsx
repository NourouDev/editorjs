import { createSignal, Show, For, createMemo } from "solid-js";

interface JsonTableViewProps {
  value: string;
}

const renderCell = (val: any) => {
  if (val === null) return <span class="text-slate-400 italic">null</span>;
  if (typeof val === "boolean") return <span class="text-blue-500">{val ? "true" : "false"}</span>;
  if (typeof val === "number") return <span class="text-orange-500">{val}</span>;
  if (typeof val === "string") return <span class="text-green-600">"{val}"</span>;
  if (Array.isArray(val)) return <span class="text-slate-500 text-xs">[{val.length} items]</span>;
  if (typeof val === "object") return <span class="text-slate-500 text-xs">{`{...}`}</span>;
  return <span>{String(val)}</span>;
};

export default function JsonTableView(props: JsonTableViewProps) {
  const parsedData = createMemo(() => {
    try {
      const parsed = JSON.parse(props.value);
      return { success: true, data: parsed };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  const getColumns = (data: any[]) => {
    const keys = new Set<string>();
    data.forEach(item => {
      if (item && typeof item === "object" && !Array.isArray(item)) {
        Object.keys(item).forEach(k => keys.add(k));
      }
    });
    return Array.from(keys);
  };

  return (
    <div class="h-full overflow-auto p-4 bg-white dark:bg-[#0b1120]">
      <Show 
        when={parsedData().success} 
        fallback={
          <div class="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400">
            <div class="text-red-500 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <p class="font-medium">Invalid JSON</p>
            <p class="text-xs mt-1 max-w-[300px] text-center">{parsedData().error}</p>
          </div>
        }
      >
        <div class="w-full">
          {(() => {
            const data = parsedData().data;

            if (Array.isArray(data)) {
              if (data.length === 0) {
                return <div class="text-slate-500 text-sm">Empty Array</div>;
              }
              // Check if it's an array of objects
              const isArrayOfObjects = data.every(item => item && typeof item === "object" && !Array.isArray(item));
              
              if (isArrayOfObjects) {
                const columns = getColumns(data);
                return (
                  <table class="w-full text-sm text-left font-mono border-collapse">
                    <thead class="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-800 dark:text-slate-300">
                      <tr>
                        <th class="px-4 py-2 border border-slate-200 dark:border-slate-700 w-10 text-center">#</th>
                        <For each={columns}>
                          {col => <th class="px-4 py-2 border border-slate-200 dark:border-slate-700">{col}</th>}
                        </For>
                      </tr>
                    </thead>
                    <tbody>
                      <For each={data}>
                        {(row, idx) => (
                          <tr class="bg-white border-b dark:bg-slate-900 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <td class="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-400 text-center">{idx()}</td>
                            <For each={columns}>
                              {col => <td class="px-4 py-2 border border-slate-200 dark:border-slate-700">{renderCell(row[col])}</td>}
                            </For>
                          </tr>
                        )}
                      </For>
                    </tbody>
                  </table>
                );
              } else {
                // Array of primitives
                return (
                  <table class="w-full text-sm text-left font-mono border-collapse max-w-lg">
                    <thead class="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-800 dark:text-slate-300">
                      <tr>
                        <th class="px-4 py-2 border border-slate-200 dark:border-slate-700 w-10 text-center">#</th>
                        <th class="px-4 py-2 border border-slate-200 dark:border-slate-700">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <For each={data}>
                        {(row, idx) => (
                          <tr class="bg-white border-b dark:bg-slate-900 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <td class="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-400 text-center">{idx()}</td>
                            <td class="px-4 py-2 border border-slate-200 dark:border-slate-700">{renderCell(row)}</td>
                          </tr>
                        )}
                      </For>
                    </tbody>
                  </table>
                );
              }
            } else if (data && typeof data === "object") {
              const keys = Object.keys(data);
              if (keys.length === 0) {
                return <div class="text-slate-500 text-sm">Empty Object</div>;
              }
              return (
                <table class="w-full text-sm text-left font-mono border-collapse max-w-2xl">
                  <thead class="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-800 dark:text-slate-300">
                    <tr>
                      <th class="px-4 py-2 border border-slate-200 dark:border-slate-700 w-1/3">Key</th>
                      <th class="px-4 py-2 border border-slate-200 dark:border-slate-700 w-2/3">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <For each={keys}>
                      {key => (
                        <tr class="bg-white border-b dark:bg-slate-900 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td class="px-4 py-2 border border-slate-200 dark:border-slate-700 font-medium text-indigo-600 dark:text-indigo-400">{key}</td>
                          <td class="px-4 py-2 border border-slate-200 dark:border-slate-700">{renderCell(data[key])}</td>
                        </tr>
                      )}
                    </For>
                  </tbody>
                </table>
              );
            } else {
              return (
                <div class="p-4 bg-slate-50 dark:bg-slate-800 rounded font-mono text-sm">
                  {renderCell(data)}
                </div>
              );
            }
          })()}
        </div>
      </Show>
    </div>
  );
}
