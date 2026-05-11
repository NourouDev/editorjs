import { createSignal, Show, For, createMemo, createEffect } from "solid-js";
import { ChevronRightIcon, ChevronDownIcon } from "../SvgIcons";

interface JsonTreeViewProps {
  value: string;
  defaultExpanded?: boolean;
}

type JsonType = "object" | "array" | "string" | "number" | "boolean" | "null";

function getType(val: any): JsonType {
  if (val === null) return "null";
  if (Array.isArray(val)) return "array";
  if (typeof val === "object") return "object";
  return typeof val as JsonType;
}

const ValueNode = (props: { value: any; type: JsonType }) => {
  return (
    <span
      class={`font-mono text-sm ${
        props.type === "string"
          ? "text-green-600 dark:text-emerald-400"
          : props.type === "number"
          ? "text-orange-500 dark:text-orange-400"
          : props.type === "boolean"
          ? "text-blue-500 dark:text-blue-400"
          : "text-slate-400 dark:text-slate-500"
      }`}
    >
      {props.type === "string" ? `"${props.value}"` : String(props.value)}
    </span>
  );
};

const TreeNode = (props: { name: string | null; value: any; isLast: boolean; defaultExpanded?: boolean }) => {
  const [expanded, setExpanded] = createSignal(props.defaultExpanded ?? true);
  const type = createMemo(() => getType(props.value));
  
  createEffect(() => {
    if (props.defaultExpanded !== undefined) {
      setExpanded(props.defaultExpanded);
    }
  });
  
  const isComplex = () => type() === "object" || type() === "array";
  const isEmpty = () => 
    (type() === "object" && Object.keys(props.value).length === 0) || 
    (type() === "array" && props.value.length === 0);

  const toggle = () => setExpanded(!expanded());

  const renderContent = () => {
    if (!isComplex()) {
      return (
        <div class="flex items-start">
          <Show when={props.name !== null}>
            <span class="text-indigo-600 dark:text-indigo-400 font-medium mr-1">"{props.name}"</span>
            <span class="text-slate-500 dark:text-slate-400 mr-1">:</span>
          </Show>
          <ValueNode value={props.value} type={type()} />
          <Show when={!props.isLast}>
            <span class="text-slate-500 dark:text-slate-400">,</span>
          </Show>
        </div>
      );
    }

    const isArray = type() === "array";
    const openBracket = isArray ? "[" : "{";
    const closeBracket = isArray ? "]" : "}";
    const keys = isArray ? props.value : Object.keys(props.value);
    const length = isArray ? props.value.length : keys.length;

    if (isEmpty()) {
      return (
        <div class="flex items-start">
          <Show when={props.name !== null}>
            <span class="text-indigo-600 dark:text-indigo-400 font-medium mr-1">"{props.name}"</span>
            <span class="text-slate-500 dark:text-slate-400 mr-1">:</span>
          </Show>
          <span class="text-slate-500 dark:text-slate-400">{openBracket}{closeBracket}</span>
          <Show when={!props.isLast}>
            <span class="text-slate-500 dark:text-slate-400">,</span>
          </Show>
        </div>
      );
    }

    return (
      <div class="flex flex-col">
        <div class="flex items-start cursor-pointer select-none group" onClick={toggle}>
          <button class="w-4 h-4 mt-0.5 flex items-center justify-center text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300 transition-colors">
            <Show when={expanded()} fallback={<ChevronRightIcon />}>
              <ChevronDownIcon />
            </Show>
          </button>
          <Show when={props.name !== null}>
            <span class="text-indigo-600 dark:text-indigo-400 font-medium mr-1">"{props.name}"</span>
            <span class="text-slate-500 dark:text-slate-400 mr-1">:</span>
          </Show>
          <span class="text-slate-500 dark:text-slate-400">{openBracket}</span>
          <Show when={!expanded()}>
            <span class="text-slate-400 dark:text-slate-500 mx-1 text-xs px-1 bg-slate-100 dark:bg-slate-800 rounded">
              {length} {length === 1 ? "item" : "items"}
            </span>
            <span class="text-slate-500 dark:text-slate-400">{closeBracket}</span>
            <Show when={!props.isLast}>
              <span class="text-slate-500 dark:text-slate-400">,</span>
            </Show>
          </Show>
        </div>
        
        <Show when={expanded()}>
          <div class="pl-4 ml-2 border-l border-slate-200 dark:border-slate-800 flex flex-col gap-0.5 mt-0.5">
            <For each={isArray ? props.value : Object.keys(props.value)}>
              {(item, index) => {
                const isLastItem = index() === length - 1;
                const val = isArray ? item : props.value[item as string];
                const keyName = isArray ? null : (item as string);
                
                return <TreeNode name={keyName} value={val} isLast={isLastItem} defaultExpanded={props.defaultExpanded} />;
              }}
            </For>
          </div>
          <div class="flex items-start pl-2">
            <span class="text-slate-500 dark:text-slate-400">{closeBracket}</span>
            <Show when={!props.isLast}>
              <span class="text-slate-500 dark:text-slate-400">,</span>
            </Show>
          </div>
        </Show>
      </div>
    );
  };

  return <div class="font-mono text-[13px] leading-5">{renderContent()}</div>;
};

export default function JsonTreeView(props: JsonTreeViewProps) {
  const parsedData = createMemo(() => {
    try {
      const parsed = JSON.parse(props.value);
      return { success: true, data: parsed };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

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
        <TreeNode name={null} value={parsedData().data} isLast={true} defaultExpanded={props.defaultExpanded ?? true} />
      </Show>
    </div>
  );
}
