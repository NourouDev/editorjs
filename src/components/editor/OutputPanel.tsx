import { createSignal, Show } from "solid-js";
import { isDarkMode } from "~/lib/theme";
import { TextIcon, TreeIcon, TableIcon } from "../SvgIcons";
import SvelteJsonEditor from "./SvelteJsonEditor";

type ViewMode = "text" | "tree" | "table";

interface OutputPanelProps {
  value: string;
  onChange?: (value: string) => void;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  cursorInfo?: { line: number; col: number };
  onFormat?: () => void;
  onCompact?: () => void;
  diffHighlights?: { added: number[], removed: number[] };
}

export default function OutputPanel(props: OutputPanelProps) {
  const [internalViewMode, setInternalViewMode] = createSignal<ViewMode>("text");
  const viewMode = () => props.viewMode ?? internalViewMode();
  const setViewMode = (mode: ViewMode) => {
    if (props.onViewModeChange) props.onViewModeChange(mode);
    else setInternalViewMode(mode);
  };
  const [cursorPos, setCursorPos] = createSignal({ line: 1, col: 1 });

  const viewBtnClass = (mode: ViewMode) =>
    `px-2.5 py-1 text-xs font-semibold rounded transition-all duration-150 ${
      viewMode() === mode
        ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/25"
        : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
    }`;

  const handleEmptyObject = () => {
    props.onChange?.("{}");
  };

  const handleEmptyArray = () => {
    props.onChange?.("[]");
  };

  return (
    <div class="flex flex-col h-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      {/* View mode toggle + Toolbar */}
      <div class="flex items-center gap-1 px-2 py-1.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div class="flex items-center gap-0.5 mr-2 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <button class={viewBtnClass("text")} onClick={() => setViewMode("text")}>
            <span class="flex items-center gap-1"><TextIcon /> text</span>
          </button>
          <button class={viewBtnClass("tree")} onClick={() => setViewMode("tree")}>
            <span class="flex items-center gap-1"><TreeIcon /> tree</span>
          </button>
         
        </div>
      </div>

      {/* Editor content or Empty State */}
      <div class="flex-1 min-h-0 relative">
        <Show 
          when={props.value.trim().length > 0} 
          fallback={
            <div class="absolute inset-0 flex flex-col items-center justify-center p-6 text-center overflow-auto">
              <div class="w-16 h-16 mb-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-800/50">
                <TextIcon />
              </div>
              <h3 class="text-base font-semibold text-slate-900 dark:text-white mb-2">
                Empty document
              </h3>
              <p class="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-[250px]">
                Paste your data here, drag and drop a file, or create a new:
              </p>
              <div class="flex items-center gap-3">
                <button 
                  onClick={handleEmptyObject}
                  class="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors shadow-sm"
                >
                  {"{}"} Object
                </button>
                <button 
                  onClick={handleEmptyArray}
                  class="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors shadow-sm"
                >
                  {"[]"} Array
                </button>
              </div>
            </div>
          }
        >
          <div class="absolute inset-0">
            <SvelteJsonEditor 
              value={props.value} 
              onChange={props.onChange} 
              mode={viewMode()} 
              readOnly={true}
            />
          </div>
        </Show>
      </div>

      {/* Status bar */}
      <Show when={props.value.trim().length > 0}>
        <div class="flex items-center justify-between px-3 py-1 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-xs text-slate-400 dark:text-slate-500 font-mono">
          <span>Line: {cursorPos().line}  Column: {cursorPos().col}</span>
          <span>{props.value.length} chars</span>
        </div>
      </Show>
    </div>
  );
}
