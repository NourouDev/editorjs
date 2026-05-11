import { createSignal, createMemo, onCleanup, onMount, Show, For } from "solid-js";
import { createJsonWorker } from "~/lib/jsonWorker";
import ResizableSplitter from "../editor/ResizableSplitter";
import PretextEditor from "../editor/pretext-editor/PretextEditor";
import SideBySideDiff from "../editor/pretext-editor/SideBySideDiff";
import {
  CheckIcon, XIcon, FileIcon, FolderOpenIcon, SaveIcon, CopyIcon,
  FullScreenIcon, CompareIcon
} from "../SvgIcons";

// ────────────────────────────────────────────────────────────
// Diff algorithm (LCS-based)
// ────────────────────────────────────────────────────────────
interface DiffLine {
  type: "added" | "removed" | "unchanged";
  content: string;
  oldLineNum?: number;
  newLineNum?: number;
}

function computeDiff(oldText: string, newText: string): DiffLine[] {
  const a = oldText.split("\n");
  const b = newText.split("\n");
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1]+1 : Math.max(dp[i-1][j], dp[i][j-1]);
  const result: DiffLine[] = [];
  let i = m, j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i-1] === b[j-1]) {
      result.push({ type: "unchanged", content: a[i-1], oldLineNum: i, newLineNum: j });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j-1] >= dp[i-1][j])) {
      result.push({ type: "added", content: b[j-1], newLineNum: j });
      j--;
    } else {
      result.push({ type: "removed", content: a[i-1], oldLineNum: i });
      i--;
    }
  }
  return result.reverse();
}

// ────────────────────────────────────────────────────────────
// Panel Header — toolbar per panel
// ────────────────────────────────────────────────────────────
type ViewMode = "text" | "tree" | "table";

interface PanelHeaderProps {
  label: string;
  side: "left" | "right";
  viewMode: ViewMode;
  onViewMode: (m: ViewMode) => void;
  onFormat: () => void;
  onMinify: () => void;
  onCopyTo: () => void; // copy to other panel
  charCount: number;
}

function PanelHeader(props: PanelHeaderProps) {
  const modeBtnCls = (m: ViewMode) =>
    `px-2.5 py-1 text-[11px] font-semibold rounded transition-all duration-150 ${
      props.viewMode === m
        ? "bg-indigo-600 text-white shadow shadow-indigo-500/25"
        : "text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
    }`;
  const actionCls = "px-2.5 py-1 text-[11px] font-semibold rounded border transition-all duration-150 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400";

  return (
    <div class="flex items-center gap-2 px-2 py-1.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex-shrink-0">
      {/* Label */}
      <span class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider w-10">
        {props.label}
      </span>

      {/* View modes */}
      <div class="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md">
        <button class={modeBtnCls("text")} onClick={() => props.onViewMode("text")}>Text</button>
        <button class={modeBtnCls("tree")} onClick={() => props.onViewMode("tree")}>Tree</button>
        <button class={modeBtnCls("table")} onClick={() => props.onViewMode("table")}>Table</button>
      </div>

      {/* Actions */}
      <div class="flex items-center gap-1">
        <button class={actionCls} onClick={props.onFormat} title="Format (pretty-print)">Format</button>
        <button class={actionCls} onClick={props.onMinify} title="Minify (compact)">Minify</button>
      </div>

      {/* Copy to other panel */}
      <button
        class="ml-auto flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
        onClick={props.onCopyTo}
        title={props.side === "left" ? "Copy to Right →" : "← Copy to Left"}
      >
        {props.side === "left" ? "→ Copy" : "← Copy"}
      </button>

      {/* Char count */}
      <span class="text-[10px] text-slate-400 dark:text-slate-600 font-mono ml-1">
        {props.charCount.toLocaleString()}
      </span>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Main JsonEditor
// ────────────────────────────────────────────────────────────
const defaultJson = '{\n  "name": "ZeroJSON",\n  "version": "1.0.0",\n  "features": ["validate", "format", "diff"]\n}';

export default function JsonEditor() {
  const [leftInput,  setLeftInput]  = createSignal(defaultJson);
  const [rightInput, setRightInput] = createSignal("");
  const [leftViewMode,  setLeftViewMode]  = createSignal<ViewMode>("text");
  const [rightViewMode, setRightViewMode] = createSignal<ViewMode>("text");
  const [leftWidth, setLeftWidth] = createSignal(50);
  const [isDiffMode, setIsDiffMode] = createSignal(false);
  const [isFullscreen, setIsFullscreen] = createSignal(false);
  const [statusMsg, setStatusMsg] = createSignal<{ ok: boolean; text: string } | null>(null);

  let worker: Worker | undefined;
  let containerRef!: HTMLDivElement;

  const showStatus = (ok: boolean, text: string) => {
    setStatusMsg({ ok, text });
    setTimeout(() => setStatusMsg(null), 3500);
  };

  onMount(() => {
    worker = createJsonWorker();
    worker.onmessage = (ev) => {
      const { success, formatted, error, _reqType } = ev.data;
      if (success) {
        if (_reqType === "left")  setLeftInput(formatted);
        if (_reqType === "right") setRightInput(formatted);
        showStatus(true, _reqType === "left" ? "Left panel formatted" : "Right panel formatted");
      } else {
        showStatus(false, error);
      }
    };
    const fsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", fsChange);
    onCleanup(() => {
      worker?.terminate();
      document.removeEventListener("fullscreenchange", fsChange);
    });
  });

  // ── Per-panel actions ──
  const formatPanel = (side: "left" | "right") => {
    const data = side === "left" ? leftInput() : rightInput();
    if (!data.trim()) return;
    worker?.postMessage({ type: "format", data, _reqType: side });
  };

  const minifyPanel = (side: "left" | "right") => {
    const data = side === "left" ? leftInput() : rightInput();
    if (!data.trim()) return;
    worker?.postMessage({ type: "minify", data, _reqType: side });
  };

  // ── Global actions ──
  const handleOpen = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const content = ev.target?.result as string;
        setLeftInput(content);
        showStatus(true, `Opened ${file.name}`);
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleSave = (side: "left" | "right") => {
    const content = side === "left" ? leftInput() : rightInput();
    if (!content.trim()) return;
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "data.json";
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
    showStatus(true, "Saved");
  };

  const handleCopyText = (side: "left" | "right") => {
    const content = side === "left" ? leftInput() : rightInput();
    navigator.clipboard.writeText(content);
    showStatus(true, "Copied to clipboard");
  };

  const handleFullScreen = () => {
    if (!document.fullscreenElement) containerRef.requestFullscreen();
    else document.exitFullscreen();
  };

  const handleResize = (deltaX: number) => {
    setLeftWidth((prev) => Math.min(90, Math.max(10, prev + (deltaX / window.innerWidth) * 100)));
  };

  // ── Diff ──
  const diffLines = createMemo(() => {
    if (!isDiffMode()) return [];
    return computeDiff(leftInput(), rightInput());
  });
  const diffStats = createMemo(() => ({
    added: diffLines().filter(l => l.type === "added").length,
    removed: diffLines().filter(l => l.type === "removed").length,
  }));

  // ── UI class helpers ──
  const toolbarBtnCls = "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm";
  const iconBtnCls = "p-1.5 rounded-lg border border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:text-slate-700 dark:hover:text-slate-200 transition-all";

  return (
    <div
      ref={containerRef}
      class={`flex flex-col w-full bg-slate-50 dark:bg-[#0b1120] ${isFullscreen() ? "h-screen fixed inset-0 z-50" : "h-[calc(100vh-67px)]"}`}
    >
      {/* ── Global Toolbar ── */}
      <div class="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm flex-shrink-0">
        {/* Left side */}
        <div class="flex items-center gap-1.5">
          <button class={toolbarBtnCls} onClick={handleOpen} title="Open JSON file">
            <FolderOpenIcon /> Open
          </button>
          <button class={toolbarBtnCls} onClick={() => { setLeftInput(""); setRightInput(""); }} title="Clear both panels">
            <FileIcon /> New
          </button>
        </div>

        <div class="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1" />

        {/* Save / Copy (active panel hint) */}
        <div class="flex items-center gap-1.5">
          <button class={toolbarBtnCls} onClick={() => handleSave("left")} title="Download left panel">
            <SaveIcon /> Save L
          </button>
          <button class={toolbarBtnCls} onClick={() => handleSave("right")} title="Download right panel">
            <SaveIcon /> Save R
          </button>
        </div>

        <div class="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1" />

        {/* Diff toggle */}
        <button
          class={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-all shadow-sm ${
            isDiffMode()
              ? "bg-amber-500 text-white border-amber-600"
              : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-amber-400 hover:text-amber-600"
          }`}
          onClick={() => setIsDiffMode(!isDiffMode())}
        >
          <CompareIcon />
          {isDiffMode() ? "Diff ON" : "Diff"}
          <Show when={isDiffMode()}>
            <span class="ml-1 text-emerald-200">+{diffStats().added}</span>
            <span class="text-red-200">-{diffStats().removed}</span>
          </Show>
        </button>

        {/* Status */}
        <Show when={statusMsg()}>
          <div class={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium ml-2 ${
            statusMsg()!.ok
              ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
              : "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800"
          }`}>
            {statusMsg()!.ok ? <CheckIcon /> : <XIcon />}
            <span class="max-w-[240px] truncate">{statusMsg()!.text}</span>
          </div>
        </Show>

        <div class="flex items-center gap-1 ml-auto">
          <button class={iconBtnCls} onClick={() => handleCopyText("left")} title="Copy left to clipboard"><CopyIcon /></button>
          <button class={iconBtnCls} onClick={() => handleCopyText("right")} title="Copy right to clipboard"><CopyIcon /></button>
          <button class={iconBtnCls} onClick={handleFullScreen} title={isFullscreen() ? "Exit fullscreen" : "Fullscreen"}><FullScreenIcon /></button>
        </div>
      </div>

      {/* ── Diff Banner ── */}
      <Show when={isDiffMode()}>
        <div class="flex items-center gap-4 px-4 py-2 bg-amber-50 dark:bg-amber-900/10 border-b border-amber-200 dark:border-amber-800/40 text-xs font-medium text-amber-700 dark:text-amber-400 flex-shrink-0">
          <span class="font-bold uppercase tracking-wider">Diff Mode</span>
          <span>Left vs Right panel comparison</span>
          <span class="ml-auto flex gap-3">
            <span class="text-emerald-600 dark:text-emerald-400">+{diffStats().added} added</span>
            <span class="text-red-600 dark:text-red-400">-{diffStats().removed} removed</span>
          </span>
        </div>
      </Show>

      {/* ── Editor Area: Diff mode takes full width, normal mode = side by side ── */}
      <Show
        when={isDiffMode()}
        fallback={
          <div class="flex flex-1 min-h-0 overflow-hidden">
            {/* LEFT PANEL */}
            <div style={{ width: `${leftWidth()}%` }} class="flex flex-col h-full min-w-0 flex-shrink-0">
              <PanelHeader
                label="Left"
                side="left"
                viewMode={leftViewMode()}
                onViewMode={setLeftViewMode}
                onFormat={() => formatPanel("left")}
                onMinify={() => minifyPanel("left")}
                onCopyTo={() => setRightInput(leftInput())}
                charCount={leftInput().length}
              />
              <div class="flex-1 min-h-0 overflow-hidden">
                <PretextEditor
                  value={leftInput()}
                  onChange={setLeftInput}
                  mode={leftViewMode()}
                />
              </div>
            </div>

            {/* SPLITTER */}
            <ResizableSplitter onResize={handleResize} />

            {/* RIGHT PANEL */}
            <div class="flex flex-col h-full flex-1 min-w-0">
              <PanelHeader
                label="Right"
                side="right"
                viewMode={rightViewMode()}
                onViewMode={setRightViewMode}
                onFormat={() => formatPanel("right")}
                onMinify={() => minifyPanel("right")}
                onCopyTo={() => setLeftInput(rightInput())}
                charCount={rightInput().length}
              />
              <div class="flex-1 min-h-0 overflow-hidden">
                <PretextEditor
                  value={rightInput()}
                  onChange={setRightInput}
                  mode={rightViewMode()}
                />
              </div>
            </div>
          </div>
        }
      >
        {/* DIFF MODE: full-width side-by-side view */}
        <div class="flex-1 min-h-0 overflow-hidden">
          <SideBySideDiff lines={diffLines()} />
        </div>
      </Show>
    </div>
  );
}
