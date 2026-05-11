import { createSignal, For, Show, createMemo } from "solid-js";
import { prepare, layout } from "@chenglou/pretext";
import { ChevronRightIcon } from "../../SvgIcons";

interface TreeViewProps {
  data: any;
  label?: string;
  depth: number;
}

export default function TreeView(props: TreeViewProps) {
  const [isExpanded, setIsExpanded] = createSignal(true);
  
  const isObject = (val: any) => val !== null && typeof val === "object";
  const isArray = (val: any) => Array.isArray(val);
  
  // Use Pretext for measuring text (demonstration of the library)
  const font = "14px ui-monospace, monospace";
  
  const labelMetrics = createMemo(() => {
    if (!props.label) return null;
    const prepared = prepare(props.label, font);
    return layout(prepared, 500, 20);
  });

  const valuePreview = createMemo(() => {
    if (isObject(props.data)) {
      return isArray(props.data) ? `Array[${props.data.length}]` : `Object{${Object.keys(props.data).length}}`;
    }
    const valStr = String(props.data);
    const prepared = prepare(valStr, font);
    return { text: valStr, metrics: layout(prepared, 500, 20) };
  });

  const toggleExpand = (e: MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded());
  };

  return (
    <div class="select-none transition-all duration-200" style={{ "margin-left": `${props.depth > 0 ? 1.25 : 0}rem` }}>
      <div 
        class="flex items-start gap-2 py-1 px-2 rounded-lg hover:bg-slate-100/80 dark:hover:bg-slate-800/40 cursor-pointer group transition-colors"
        onClick={toggleExpand}
      >
        {/* Toggle Arrow */}
        <div class="flex-shrink-0 w-4 h-5 flex items-center justify-center mt-0.5">
          <Show when={isObject(props.data)}>
            <span class={`transition-transform duration-200 ${isExpanded() ? 'rotate-90' : ''} text-slate-400 group-hover:text-indigo-500`}>
              <ChevronRightIcon />
            </span>
          </Show>
        </div>
        
        <div class="flex flex-wrap items-baseline gap-x-2 min-w-0 flex-1">
          {/* Key Label */}
          <Show when={props.label}>
            <span class="text-slate-500 dark:text-slate-400 font-medium shrink-0">
              {props.label}
              <span class="ml-0.5 text-slate-300 dark:text-slate-600">:</span>
            </span>
          </Show>

          {/* Value or Preview */}
          <Show 
            when={!isObject(props.data) || !isExpanded()} 
            fallback={null}
          >
            <div 
              class={`min-w-0 break-words ${isObject(props.data) ? 'text-slate-400 italic text-xs' : typeof props.data === 'string' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400 font-medium'}`}
              style={{
                height: typeof valuePreview() === 'object' && (valuePreview() as any).metrics ? `${(valuePreview() as any).metrics.height}px` : 'auto'
              }}
            >
              <Show when={typeof props.data === 'string' && !isObject(props.data)} fallback={
                <span>{typeof valuePreview() === 'string' ? valuePreview() : (valuePreview() as any).text}</span>
              }>
                <span class="opacity-70">"</span>
                <span>{(valuePreview() as any).text}</span>
                <span class="opacity-70">"</span>
              </Show>
            </div>
          </Show>
        </div>
      </div>

      {/* Children Nodes */}
      <Show when={isObject(props.data) && isExpanded()}>
        <div class="border-l border-slate-200 dark:border-slate-800 ml-1.5 pl-1 mt-0.5">
          <For each={Object.entries(props.data)}>
            {([key, value]) => (
              <TreeView data={value} label={key} depth={props.depth + 1} />
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}
