import { createSignal, createMemo, onCleanup, onMount, Show } from "solid-js";
import { createJsonWorker } from "~/lib/jsonWorker";
import EditorPanel from "../editor/EditorPanel";
import OutputPanel from "../editor/OutputPanel";
import ResizableSplitter from "../editor/ResizableSplitter";
import JsonDiffView, { computeDiff, DiffLine } from "../editor/JsonDiffView";
import { 
  CheckIcon, XIcon, FileIcon, FolderOpenIcon, SaveIcon, CopyIcon, 
  FullScreenIcon, FormatIcon, CompactIcon, SortAscIcon, SortDescIcon, CompareIcon
} from "../SvgIcons";

export default function JsonEditor() {
const defaultJson = '{\n  "name": "ZeroJSON",\n  "version": "1.0.0",\n  "features": ["validate","format","diff"]\n}';
  const [leftInput, setLeftInput] = createSignal(defaultJson);
  const [rightInput, setRightInput] = createSignal(defaultJson);
  const [leftWidth, setLeftWidth] = createSignal(50); // percentage
  const [status, setStatus] = createSignal<{ type: "idle" | "success" | "error"; message: string }>({ type: "idle", message: "Ready" });
  const [isProcessing, setIsProcessing] = createSignal(false);
  const [isDiffMode, setIsDiffMode] = createSignal(false);
  const [isFullscreen, setIsFullscreen] = createSignal(false);
 
  const diffData = createMemo(() => {
    if (!isDiffMode()) return { left: { added: [], removed: [] }, right: { added: [], removed: [] } };
    
    // Treat Left as Current (Modified) and Right as Reference (Original)
    // So additions on Left are highlighted as added (green)
    const diff = computeDiff(rightInput(), leftInput());
    const leftAdded: number[] = [];
    const rightRemoved: number[] = [];
    
    diff.forEach(line => {
      if (line.type === "added" && line.newLineNum) {
        leftAdded.push(line.newLineNum);
      } else if (line.type === "removed" && line.oldLineNum) {
        rightRemoved.push(line.oldLineNum);
      }
    });
    
    return {
      left: { added: leftAdded, removed: [] },
      right: { added: [], removed: rightRemoved }
    };
  });

  let worker: Worker | undefined;
  let containerRef!: HTMLDivElement;

  onMount(() => {
    worker = createJsonWorker();
    worker.onmessage = (event) => {
      const { type, success, error, position, formatted, _reqType } = event.data;
      setIsProcessing(false);

      if (success) {
        if (_reqType === "format_left" || _reqType === "sort_left") setLeftInput(formatted);
        if (_reqType === "format_right" || _reqType === "sort_right") setRightInput(formatted);
        setStatus({ type: "success", message: type === "sort" ? "Sorted" : "Transformed" });
      } else {
        let msg = error;
        if (position && !error.toLowerCase().includes("line")) {
          msg += ` at line ${position.line}, col ${position.column}`;
        }
        setStatus({ type: "error", message: msg });
      }
    };

    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);

    onCleanup(() => {
      worker?.terminate();
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    });
  });

  const handleResize = (deltaX: number) => {
    const containerWidth = window.innerWidth;
    const deltaPct = (deltaX / containerWidth) * 100;
    setLeftWidth((prev) => {
      const next = prev + deltaPct;
      if (next < 10) return 0;
      if (next > 90) return 100;
      return Math.min(Math.max(next, 0), 100);
    });
  };

  const showStatus = (type: "idle" | "success" | "error", msg: string) => {
    setStatus({ type, message: msg });
    if (type === "success") {
      setTimeout(() => setStatus({ type: "idle", message: "Ready" }), 3000);
    }
  };

  // --- Transformations (Left -> Right) ---
  const handleFormat = () => {
    try {
      const parsed = JSON.parse(leftInput());
      setRightInput(JSON.stringify(parsed, null, 2));
      showStatus("success", "Formatted");
      setIsDiffMode(false);
    } catch (err: any) {
      showStatus("error", err.message);
    }
  };

  const handleCompact = () => {
    try {
      const parsed = JSON.parse(leftInput());
      setRightInput(JSON.stringify(parsed));
      showStatus("success", "Compacted");
      setIsDiffMode(false);
    } catch (err: any) {
      showStatus("error", err.message);
    }
  };

  const handleSort = (direction: 'asc' | 'desc') => {
    if (!worker || !leftInput().trim()) return;
    setIsProcessing(true);
    setStatus({ type: "idle", message: "Sorting..." });
    worker.postMessage({ type: 'sort', data: leftInput(), direction, _reqType: 'sort_right' });
    setIsDiffMode(false);
  };

  const handleToggleDiff = () => {
    setIsDiffMode(!isDiffMode());
    if (!isDiffMode()) {
       showStatus("idle", "Ready");
    } else {
       showStatus("success", "Diff mode enabled");
    }
  };

  // --- Top Toolbar Actions ---
  const handleNew = () => {
    setLeftInput('');
    setRightInput('');
    showStatus("success", "Cleared");
  };

  const handleOpen = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        const content = evt.target?.result as string;
        setLeftInput(content);
        showStatus("success", "File opened");
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleSave = () => {
    // Save the output if available, else original
    const contentToSave = rightInput().trim() ? rightInput() : leftInput();
    const blob = new Blob([contentToSave], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showStatus("success", "File saved");
  };

  const handleCopy = () => {
    const contentToCopy = rightInput().trim() ? rightInput() : leftInput();
    navigator.clipboard.writeText(contentToCopy);
    showStatus("success", "Copied to clipboard");
  };

  const handleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.requestFullscreen().catch(err => {
        showStatus("error", `Fullscreen error: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const actionBtnClass = "flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors";
  const iconBtnClass = "p-1.5 rounded-md transition-all duration-150 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 active:scale-95";

  return (
    <div ref={containerRef} class={`flex flex-col w-full ${isFullscreen() ? 'h-screen w-screen fixed inset-0 z-50 bg-slate-50 dark:bg-[#0b1120] p-4 m-0' : 'h-[calc(100vh-67px)]'}`}>
      
      {/* Top Global Toolbar */}
      <div class="flex flex-wrap items-center justify-between px-4 py-2 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm gap-2">
        <div class="flex items-center gap-1">
          <button class={actionBtnClass} onClick={handleNew} title="Clear Editor">
            <FileIcon /> <span class="hidden sm:inline">New</span>
          </button>
          
          <div class="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1" />
          
          <button class={actionBtnClass} onClick={handleOpen} title="Open JSON File">
            <FolderOpenIcon /> <span class="hidden sm:inline">Open</span>
          </button>
        </div>

        {/* Central Transform Actions */}
        <div class="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/50 p-1 rounded-lg border border-slate-100 dark:border-slate-700/50">
          <button class={`${iconBtnClass} ${!isDiffMode() ? 'bg-white dark:bg-slate-700 shadow-sm' : ''}`} onClick={handleFormat} title="Format (pretty print)">
            <FormatIcon /> <span class="sr-only">Format</span>
          </button>
          <button class={iconBtnClass} onClick={handleCompact} title="Compact (minify)">
            <CompactIcon /> <span class="sr-only">Compact</span>
          </button>
          
          <div class="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />
          
          <button class={iconBtnClass} onClick={() => handleSort('asc')} title="Sort keys A→Z">
            <SortAscIcon /> <span class="sr-only">Sort A-Z</span>
          </button>
          <button class={iconBtnClass} onClick={() => handleSort('desc')} title="Sort keys Z→A">
            <SortDescIcon /> <span class="sr-only">Sort Z-A</span>
          </button>

          <div class="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />

          <button 
            class={`${iconBtnClass} flex items-center gap-1.5 px-2.5 ${isDiffMode() ? 'text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-700 shadow-sm border border-indigo-100 dark:border-indigo-900/50' : 'border border-transparent'}`} 
            onClick={handleToggleDiff} 
            title="Compare Original vs Output"
          >
            <CompareIcon /> 
            <span class="text-xs font-semibold">{isDiffMode() ? 'DIFF ON' : 'DIFF OFF'}</span>
          </button>
        </div>

        <div class="flex items-center gap-1">
          <div class="flex items-center gap-2 mr-2">
            <Show when={status().type === "success"}>
              <span class="text-emerald-500"><CheckIcon /></span>
            </Show>
            <Show when={status().type === "error"}>
              <span class="text-red-500"><XIcon /></span>
            </Show>
            <span class={`text-xs font-medium max-w-[150px] truncate ${status().type === "success" ? "text-emerald-600 dark:text-emerald-400" : status().type === "error" ? "text-red-600 dark:text-red-400" : "text-slate-500 dark:text-slate-400"}`}>
              {status().message}
            </span>
          </div>

          <div class="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1" />
          
          <button class={actionBtnClass} onClick={handleSave} title="Download JSON">
            <SaveIcon /> <span class="hidden sm:inline">Download</span>
          </button>
          <button class={actionBtnClass} onClick={handleCopy} title="Copy Output">
            <CopyIcon /> <span class="hidden sm:inline">Copy</span>
          </button>
          
          <div class="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1" />
          
          <button class="p-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" onClick={handleFullScreen} title={isFullscreen() ? "Exit Fullscreen" : "Fullscreen"}>
            <FullScreenIcon />
          </button>
        </div>
      </div>

      {/* Main Layout Area */}
      <div class="flex flex-1 min-h-0 relative bg-slate-50 dark:bg-[#0b1120] border-b border-slate-200 dark:border-slate-800/60">
          {/* Split Pane Mode */}
          {/* Left Panel */}
          <Show when={leftWidth() > 0}>
            <div style={{ width: `calc(${leftWidth()}%)` }} class="h-full flex-shrink-0 transition-all duration-0">
              <EditorPanel 
                value={leftInput()} 
                onChange={setLeftInput}
                diffHighlights={diffData().left}
              />
            </div>
          </Show>

          {/* Button to restore Left if collapsed */}
          <Show when={leftWidth() === 0}>
            <button 
              class="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-white dark:bg-slate-800 p-2 rounded-r-lg shadow-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-center"
              onClick={() => setLeftWidth(50)}
              title="Show Left Panel"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M13 5l7 7-7 7M5 5l7 7-7 7"/>
              </svg>
            </button>
          </Show>

          {/* Spacer / Splitter */}
          <Show when={leftWidth() > 0 && leftWidth() < 100}>
            <div class="relative w-1 px-1 z-10 h-full group cursor-col-resize">
              <ResizableSplitter onResize={handleResize} />
            </div>
          </Show>

          {/* Button to restore Right if collapsed */}
          <Show when={leftWidth() === 100}>
            <button 
              class="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-white dark:bg-slate-800 p-2 rounded-l-lg shadow-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-center"
              onClick={() => setLeftWidth(50)}
              title="Show Right Panel"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 19l-7-7 7-7M19 19l-7-7 7-7"/>
              </svg>
            </button>
          </Show>

          {/* Right Panel */}
          <Show when={leftWidth() < 100}>
            <div class="flex-1 h-full min-w-0">
              <OutputPanel 
                value={rightInput()} 
                onChange={setRightInput} 
                diffHighlights={diffData().right}
              />
            </div>
          </Show>
      </div>
    </div>
  );
}
