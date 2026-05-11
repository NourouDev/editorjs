import { createSignal, Show } from "solid-js";
import { isDarkMode } from "~/lib/theme";
import { SearchIcon, UndoIcon, RedoIcon, TextIcon, TreeIcon, TableIcon } from "../SvgIcons";
import PretextEditor from "./pretext-editor/PretextEditor";

type ViewMode = "text" | "tree" | "table";

interface EditorPanelProps {
  value: string;
  onChange: (value: string) => void;
  onPaste?: (text: string) => void;
  cursorInfo?: { line: number; col: number };
  onFormat?: () => void;
  onMinify?: () => void;
  onToggleDiff?: () => void;
  isDiffMode?: boolean;
  diffHighlights?: { added: number[], removed: number[] };
}

export default function EditorPanel(props: EditorPanelProps) {
  const [viewMode, setViewMode] = createSignal<ViewMode>("text");
  const [cursorPos, setCursorPos] = createSignal({ line: 1, col: 1 });
  const [globalExpanded, setGlobalExpanded] = createSignal(true);
  let editorHandle: { undo: () => void; redo: () => void; openSearch: () => void } | undefined;

  const toolbarBtnClass = "p-1.5 rounded-md transition-all duration-150 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200";

  const viewBtnClass = (mode: ViewMode) =>
    `px-2.5 py-1 text-xs font-semibold rounded transition-all duration-150 ${
      viewMode() === mode
        ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/25"
        : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
    }`;

  return (
    <div class="flex flex-col h-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      {/* View mode toggle + Toolbar */}
      <div class="flex items-center gap-1 px-2 py-1.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        {/* View toggle */}
        <div class="flex items-center gap-0.5 mr-2 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <button class={viewBtnClass("text")} onClick={() => setViewMode("text")}>
            <span class="flex items-center gap-1"><TextIcon /> text</span>
          </button>
          <button class={viewBtnClass("tree")} onClick={() => setViewMode("tree")}>
            <span class="flex items-center gap-1"><TreeIcon /> tree</span>
          </button>
          <Show when={viewMode() === "tree"}>
            <button class="px-2.5 py-1 text-xs font-semibold rounded transition-all duration-150 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200" onClick={() => setGlobalExpanded(true)}>
              <span>expand</span>
            </button>
            <button class="px-2.5 py-1 text-xs font-semibold rounded transition-all duration-150 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200" onClick={() => setGlobalExpanded(false)}>
              <span>collapse</span>
            </button>
          </Show>
        </div>

        {/* Separator */}
        <div class="w-px h-5 bg-slate-200 dark:bg-slate-700" />

        {/* Toolbar icons */}
        <div class="flex items-center gap-0.5 ml-1">
          <button class={toolbarBtnClass} title="Search" onClick={() => editorHandle?.openSearch()}>
            <SearchIcon />
          </button>

          <div class="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-0.5" />

          <button class={toolbarBtnClass} title="Undo" onClick={() => editorHandle?.undo()}>
            <UndoIcon />
          </button>
          <button class={toolbarBtnClass} title="Redo" onClick={() => editorHandle?.redo()}>
            <RedoIcon />
          </button>
        </div>

        {/* Action Buttons */}
        <div class="flex items-center gap-1.5 ml-auto mr-2">
          <button 
            onClick={() => props.onFormat?.()}
            class="px-3 py-1 text-xs font-bold bg-indigo-600/10 hover:bg-indigo-600 text-indigo-600 hover:text-white border border-indigo-600/20 rounded-lg transition-all duration-200"
          >
            Format
          </button>
          <button 
            onClick={() => props.onMinify?.()}
            class="px-3 py-1 text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg transition-all duration-200"
          >
            Minify
          </button>
          <button 
            onClick={() => props.onToggleDiff?.()}
            class={`px-3 py-1 text-xs font-bold border rounded-lg transition-all duration-200 ${props.isDiffMode ? 'bg-amber-500 text-white border-amber-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'}`}
          >
            Diff
          </button>
        </div>
      </div>

      {/* Editor content */}
      <div class="flex-1 min-h-0 relative">
        <div class="absolute inset-0">
          <PretextEditor 
            value={props.value} 
            onChange={props.onChange} 
            mode={viewMode()} 
          />
        </div>
      </div>

      {/* Status bar */}
      <div class="flex items-center justify-between px-3 py-1 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-xs text-slate-400 dark:text-slate-500 font-mono">
        <span>Line: {cursorPos().line}  Column: {cursorPos().col}</span>
        <span>{props.value.length} chars</span>
      </div>
    </div>
  );
}
