import { createSignal, Show } from "solid-js";
import { isDarkMode } from "~/lib/theme";
import CodeMirrorEditor from "../CodeMirrorEditor";
import {
  SearchIcon, UndoIcon, RedoIcon, TextIcon, TreeIcon, TableIcon
} from "../SvgIcons";
import JsonTreeView from "./JsonTreeView";
import JsonTableView from "./JsonTableView";

type ViewMode = "text" | "tree" | "table";

interface EditorPanelProps {
  value: string;
  onChange: (value: string) => void;
  cursorInfo?: { line: number; col: number };
  diffHighlights?: { added: number[], removed: number[] };
}

export default function EditorPanel(props: EditorPanelProps) {
  const [viewMode, setViewMode] = createSignal<ViewMode>("text");
  const [cursorPos, setCursorPos] = createSignal({ line: 1, col: 1 });
  const [globalExpanded, setGlobalExpanded] = createSignal(true);
  let editorHandle: { undo: () => void; redo: () => void; openSearch: () => void } | undefined;

  const toolbarBtnClass = "p-1.5 rounded-md transition-all duration-150 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 active:scale-95";

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
      </div>

      {/* Editor content */}
      <div class="flex-1 min-h-0 relative">
        <Show when={viewMode() === "text"}>
          <div class="absolute inset-0">
            <CodeMirrorEditor
              value={props.value}
              onChange={props.onChange}
              theme={isDarkMode() ? "dark" : "light"}
              onCursorChange={(line, col) => setCursorPos({ line, col })}
              ref={(handle) => editorHandle = handle}
              diffHighlights={props.diffHighlights}
            />
          </div>
        </Show>
        <Show when={viewMode() === "tree"}>
          <div class="absolute inset-0 overflow-auto">
            <JsonTreeView value={props.value} defaultExpanded={globalExpanded()} />
          </div>
        </Show>
        <Show when={viewMode() === "table"}>
          <div class="absolute inset-0 overflow-auto">
            <JsonTableView value={props.value} />
          </div>
        </Show>
      </div>

      {/* Status bar */}
      <div class="flex items-center justify-between px-3 py-1 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-xs text-slate-400 dark:text-slate-500 font-mono">
        <span>Line: {cursorPos().line}  Column: {cursorPos().col}</span>
        <span>{props.value.length} chars</span>
      </div>
    </div>
  );
}
