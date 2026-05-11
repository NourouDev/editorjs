import { createSignal, createMemo, onMount, createEffect, onCleanup, Show } from "solid-js";

interface TextViewProps {
  value: string;
  onChange?: (value: string) => void;
  readonly?: boolean;
}

interface JsonError {
  line: number;
  column: number;
  message: string;
  // Human-readable short label
  label: string;
}

function parseJsonError(text: string): JsonError | null {
  try {
    JSON.parse(text);
    return null;
  } catch (e: any) {
    const msg = e.message as string;

    // Friendlier label extraction
    let label = msg;
    if (msg.includes("Unexpected token")) label = "Unexpected token";
    else if (msg.includes("Unexpected end")) label = "Unexpected end of JSON";
    else if (msg.includes("Expected")) label = msg.split("at")[0].trim();

    // V8: "at line X column Y"
    const lineColMatch = msg.match(/at line (\d+) column (\d+)/);
    if (lineColMatch) {
      return { line: parseInt(lineColMatch[1]), column: parseInt(lineColMatch[2]), message: msg, label };
    }

    // Fallback: position N
    const posMatch = msg.match(/position (\d+)/);
    if (posMatch) {
      const pos = parseInt(posMatch[1]);
      const before = text.slice(0, pos);
      const lines = before.split("\n");
      return { line: lines.length, column: lines[lines.length - 1].length + 1, message: msg, label };
    }

    return { line: 1, column: 1, message: msg, label };
  }
}

export default function TextView(props: TextViewProps) {
  let textareaRef: HTMLTextAreaElement | undefined;
  let gutterRef: HTMLDivElement | undefined;

  const [lineCount, setLineCount] = createSignal(1);
  const [errorPanelOpen, setErrorPanelOpen] = createSignal(false);
  const lineHeight = 22;

  const jsonError = createMemo<JsonError | null>(() => {
    if (!props.value.trim()) return null;
    return parseJsonError(props.value);
  });

  const isValid = createMemo(() => !jsonError() && props.value.trim().length > 0);
  const isEmpty = createMemo(() => !props.value.trim());

  const updateMetrics = () => {
    if (!textareaRef) return;
    const lines = textareaRef.value.split("\n").length;
    setLineCount(Math.max(lines, 1));
  };

  const syncScroll = () => {
    if (textareaRef && gutterRef) {
      gutterRef.scrollTop = textareaRef.scrollTop;
    }
  };

  onMount(() => {
    updateMetrics();
    window.addEventListener("resize", updateMetrics);
    onCleanup(() => window.removeEventListener("resize", updateMetrics));
  });

  createEffect(() => {
    if (textareaRef && textareaRef.value !== props.value) {
      textareaRef.value = props.value;
      updateMetrics();
    }
  });

  // Close error panel when error is fixed
  createEffect(() => {
    if (!jsonError()) setErrorPanelOpen(false);
  });

  const handleInput = (e: InputEvent) => {
    const target = e.currentTarget as HTMLTextAreaElement;
    props.onChange?.(target.value);
    updateMetrics();
  };

  // Jump textarea cursor to error line
  const jumpToError = () => {
    if (!textareaRef || !jsonError()) return;
    const err = jsonError()!;
    const lines = textareaRef.value.split("\n");
    let pos = 0;
    for (let i = 0; i < err.line - 1 && i < lines.length; i++) {
      pos += lines[i].length + 1;
    }
    pos += Math.max(0, err.column - 1);
    textareaRef.focus();
    textareaRef.setSelectionRange(pos, pos);
    // Scroll to error line
    const targetScroll = (err.line - 1) * lineHeight - 60;
    textareaRef.scrollTop = Math.max(0, targetScroll);
  };

  const errorLine = createMemo(() => jsonError()?.line ?? null);

  const borderColor = createMemo(() => {
    if (isEmpty()) return "";
    if (jsonError()) return "ring-1 ring-inset ring-red-400/50 dark:ring-red-500/40";
    return "ring-1 ring-inset ring-emerald-400/40 dark:ring-emerald-500/30";
  });

  return (
    <div class={`relative flex flex-col h-full font-mono text-[13px] bg-slate-50 dark:bg-[#0d1117] overflow-hidden transition-all duration-200 ${borderColor()}`}>

      {/* ── Main editor ── */}
      <div class="flex flex-1 min-h-0 overflow-hidden">
        {/* Gutter */}
        <div
          ref={gutterRef}
          class="flex-shrink-0 w-11 overflow-hidden bg-slate-100/60 dark:bg-slate-900/60 border-r border-slate-200 dark:border-slate-800 select-none"
          style={{ "pointer-events": "none" }}
        >
          <div class="pt-[14px] pb-4">
            {Array.from({ length: lineCount() }).map((_, i) => {
              const lineNum = i + 1;
              const isErr = errorLine() === lineNum;
              return (
                <div
                  class={`text-right pr-2 text-[10px] leading-none flex items-center justify-end transition-colors ${
                    isErr ? "text-red-500 dark:text-red-400 font-bold" : "text-slate-400 dark:text-slate-600"
                  }`}
                  style={{ height: `${lineHeight}px` }}
                >
                  {isErr && <span class="mr-1 text-[8px]">●</span>}
                  {lineNum}
                </div>
              );
            })}
          </div>
        </div>

        {/* Editor area */}
        <div class="relative flex-1 min-w-0 overflow-hidden">
          {/* Error line highlight stripe */}
          <Show when={errorLine() !== null}>
            <div
              class="absolute left-0 right-0 pointer-events-none z-10"
              style={{
                top: `${14 + (errorLine()! - 1) * lineHeight}px`,
                height: `${lineHeight}px`,
                background: "rgba(239, 68, 68, 0.09)",
                "border-top": "1px solid rgba(239, 68, 68, 0.30)",
                "border-bottom": "1px solid rgba(239, 68, 68, 0.30)",
              }}
            />
          </Show>

          <textarea
            ref={textareaRef}
            class="absolute inset-0 w-full h-full bg-transparent pt-[14px] pb-4 pl-4 pr-4 outline-none resize-none text-slate-800 dark:text-slate-200 overflow-auto whitespace-pre caret-indigo-500"
            spellcheck={false}
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            readOnly={props.readonly}
            onInput={handleInput}
            onScroll={syncScroll}
            style={{
              "line-height": `${lineHeight}px`,
              "font-family": "ui-monospace, 'Cascadia Code', Menlo, monospace",
              "tab-size": "2",
            }}
          />
        </div>
      </div>

      {/* ── Error panel (expandable) ── */}
      <Show when={!isEmpty() && errorPanelOpen() && jsonError()}>
        <div class="flex-shrink-0 border-t border-red-300 dark:border-red-700/60 bg-red-50 dark:bg-[#1e0a0a] overflow-auto max-h-40">
          <div class="px-3 py-1.5 flex items-center gap-2 border-b border-red-200 dark:border-red-800/40 sticky top-0 bg-red-50 dark:bg-[#1e0a0a] z-10">
            <span class="text-[10px] font-bold text-red-500 uppercase tracking-widest">Problems</span>
            <span class="ml-auto text-[10px] bg-red-200 dark:bg-red-900 text-red-700 dark:text-red-300 px-1.5 py-0.5 rounded font-bold">1</span>
          </div>
          {/* Error row */}
          <div
            class="flex items-start gap-3 px-3 py-2 hover:bg-red-100/60 dark:hover:bg-red-900/20 cursor-pointer group"
            onClick={jumpToError}
          >
            {/* Error icon */}
            <span class="text-red-500 text-[13px] mt-px flex-shrink-0">✕</span>
            {/* Details */}
            <div class="flex-1 min-w-0">
              <p class="text-[12px] font-semibold text-red-700 dark:text-red-300 truncate">
                {jsonError()!.label}
              </p>
              <p class="text-[10px] text-red-500 dark:text-red-500/80 mt-0.5 truncate">
                {jsonError()!.message}
              </p>
            </div>
            {/* Line/col badge */}
            <span class="flex-shrink-0 text-[10px] font-mono text-red-400 dark:text-red-600 mt-0.5">
              L{jsonError()!.line} C{jsonError()!.column}
            </span>
            {/* Solve button */}
            <button
              class="flex-shrink-0 px-2 py-0.5 text-[11px] font-bold rounded border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 bg-white dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors opacity-0 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                // TODO: implement auto-fix
                alert("Auto-fix coming soon!");
              }}
              title="Auto-fix this error"
            >
              Solve
            </button>
          </div>
        </div>
      </Show>

      {/* ── Status bar ── */}
      <Show when={!isEmpty()}>
        <div
          class={`flex-shrink-0 flex items-center gap-2 px-3 py-1 border-t text-[11px] font-mono transition-all cursor-pointer select-none ${
            jsonError()
              ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20"
              : "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-emerald-600 dark:text-emerald-400"
          }`}
          onClick={() => {
            if (jsonError()) {
              setErrorPanelOpen(o => !o);
              if (!errorPanelOpen()) jumpToError();
            }
          }}
          title={jsonError() ? "Click to view errors" : ""}
        >
          {/* Status icon */}
          <Show when={jsonError()} fallback={
            <>
              <span class="text-emerald-500">✓</span>
              <span>Valid JSON</span>
              <span class="ml-auto text-emerald-400/60">{props.value.length.toLocaleString()} chars</span>
            </>
          }>
            {/* Error status — clickable */}
            <span class="text-red-500">✕</span>
            <span class="font-bold">{jsonError()!.label}</span>
            <span class="text-red-400/70 truncate hidden sm:block">— {jsonError()!.message}</span>
            <span class="ml-auto flex items-center gap-2 flex-shrink-0">
              <span class="font-mono text-[10px] text-red-400">L{jsonError()!.line} C{jsonError()!.column}</span>
              <span class={`text-[10px] px-1.5 py-0.5 rounded border font-bold transition-all ${
                errorPanelOpen()
                  ? "bg-red-200 dark:bg-red-800 text-red-700 dark:text-red-200 border-red-300 dark:border-red-700"
                  : "bg-transparent border-red-300 dark:border-red-700 text-red-400"
              }`}>
                {errorPanelOpen() ? "▲ hide" : "▼ errors"}
              </span>
            </span>
          </Show>
        </div>
      </Show>
    </div>
  );
}
