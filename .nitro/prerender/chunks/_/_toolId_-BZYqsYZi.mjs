import { ssr, ssrHydrationKey, escape, createComponent, ssrAttribute, ssrStyleProperty } from 'file:///home/ismael/Documents/GitHub/editorjs/node_modules/.pnpm/solid-js@1.9.11/node_modules/solid-js/web/dist/server.js';
import { Show, Switch, Match, createSignal, onMount, onCleanup, createMemo, For, createEffect } from 'file:///home/ismael/Documents/GitHub/editorjs/node_modules/.pnpm/solid-js@1.9.11/node_modules/solid-js/dist/server.js';
import { a as TOOLS_REGISTRY, L as LockIcon, F as FormatIcon, b as FolderOpenIcon, c as FileIcon, S as SaveIcon, C as CompareIcon, d as CheckIcon, X as XIcon, e as CopyIcon, f as FullScreenIcon, g as ChevronRightIcon } from './SvgIcons-BVQzuSjf.mjs';
import { c as useParams, T as Title, i as isDarkMode } from '../virtual/entry.mjs';
import { prepare, layout } from 'file:///home/ismael/Documents/GitHub/editorjs/node_modules/.pnpm/@chenglou+pretext@0.0.7/node_modules/@chenglou/pretext/dist/layout.js';
import 'file:///home/ismael/Documents/GitHub/editorjs/node_modules/.pnpm/h3@1.15.5/node_modules/h3/dist/index.mjs';
import 'file:///home/ismael/Documents/GitHub/editorjs/node_modules/.pnpm/solid-js@1.9.11/node_modules/solid-js/web/storage/dist/storage.js';

const workerCode = `
self.onmessage = (e) => {
  const { type, data } = e.data;

  if (type === 'validate') {
    try {
      JSON.parse(data);
      self.postMessage({ type: 'validate', success: true });
    } catch (error) {
      self.postMessage({
        type: 'validate',
        success: false,
        error: error.message,
        position: getErrorPosition(error, data)
      });
    }
  } else if (type === 'format') {
    try {
      const jsonStr = data || e.data.json;
      if (!jsonStr) throw new Error("No JSON data provided");
      const obj = JSON.parse(jsonStr);
      const formatted = JSON.stringify(obj, null, 2);
      self.postMessage({ type: 'format', success: true, formatted, _reqType: e.data._reqType });
    } catch (error) {
      self.postMessage({
        type: 'format',
        success: false,
        error: error.message,
        position: getErrorPosition(error, data || e.data.json),
        _reqType: e.data._reqType
      });
    }
  } else if (type === 'minify') {
    try {
      const jsonStr = data || e.data.json;
      if (!jsonStr) throw new Error("No JSON data provided");
      const obj = JSON.parse(jsonStr);
      const formatted = JSON.stringify(obj);
      self.postMessage({ type: 'format', success: true, formatted, _reqType: e.data._reqType });
    } catch (error) {
      self.postMessage({
        type: 'format',
        success: false,
        error: error.message,
        position: getErrorPosition(error, data || e.data.json),
        _reqType: e.data._reqType
      });
    }
  } else if (type === 'sort') {
    try {
      const obj = JSON.parse(data);
      const direction = e.data.direction || 'asc';
      const sortedObj = sortJson(obj, direction);
      const formatted = JSON.stringify(sortedObj, null, 2);
      self.postMessage({ type: 'sort', success: true, formatted, _reqType: e.data._reqType });
    } catch (error) {
      self.postMessage({
        type: 'sort',
        success: false,
        error: error.message,
        position: getErrorPosition(error, data),
        _reqType: e.data._reqType
      });
    }
  }
};

function sortJson(obj, direction) {
  if (Array.isArray(obj)) {
    return obj.map(item => sortJson(item, direction));
  } else if (obj !== null && typeof obj === 'object') {
    const keys = Object.keys(obj);
    keys.sort((a, b) => {
      if (direction === 'asc') return a.localeCompare(b);
      return b.localeCompare(a);
    });
    
    const sorted = {};
    for (const key of keys) {
      sorted[key] = sortJson(obj[key], direction);
    }
    return sorted;
  }
  return obj;
}

function getErrorPosition(error, text) {
  const positionMatch = error.message.match(/at position (\\d+)/);
  if (positionMatch) {
    const position = parseInt(positionMatch[1], 10);
    const lines = text.slice(0, position).split('\\n');
    return {
      line: lines.length,
      column: lines[lines.length - 1].length + 1
    };
  }
  return null;
}
`;
const createJsonWorker = () => {
  const blob = new Blob([workerCode], {
    type: "application/javascript"
  });
  return new Worker(URL.createObjectURL(blob));
};
var _tmpl$$b = ["<div", ' class="w-full h-full svelte-jsoneditor-container" style="', '"></div>'];
function SvelteJsonEditor(props) {
  onMount(() => {
    return;
  });
  createEffect(() => {
  });
  createEffect(() => {
    isDarkMode();
  });
  return ssr(_tmpl$$b, ssrHydrationKey(), ssrStyleProperty("--jse-font-family:", "ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Monaco, Consolas, monospace") + ssrStyleProperty(";--jse-font-size:", "13px") + ssrStyleProperty(";--jse-main-border:", "none") + ssrStyleProperty(";--jse-theme-color:", "#6366f1") + ssrStyleProperty(";--jse-theme-color-highlight:", isDarkMode() ? "rgba(99, 102, 241, 0.15)" : "rgba(99, 102, 241, 0.1)") + ssrStyleProperty(";--jse-background-color:", isDarkMode() ? "#0a0e1a" : "#ffffff") + ssrStyleProperty(";--jse-text-color:", isDarkMode() ? "#e2e8f0" : "#0f172a") + ssrStyleProperty(";--jse-panel-background:", isDarkMode() ? "#111827" : "#f8fafc") + ssrStyleProperty(";--jse-panel-border:", isDarkMode() ? "1px solid #1f2937" : "1px solid #e2e8f0") + ssrStyleProperty(";--jse-navigation-bar-background:", isDarkMode() ? "#1f2937" : "#f1f5f9") + ssrStyleProperty(";--jse-key-color:", isDarkMode() ? "#818cf8" : "#4f46e5") + ssrStyleProperty(";--jse-value-color-string:", isDarkMode() ? "#34d399" : "#059669") + ssrStyleProperty(";--jse-value-color-number:", isDarkMode() ? "#fbbf24" : "#d97706") + ssrStyleProperty(";--jse-value-color-boolean:", isDarkMode() ? "#f472b6" : "#db2777") + ssrStyleProperty(";--jse-value-color-null:", isDarkMode() ? "#94a3b8" : "#64748b") + ssrStyleProperty(";--jse-selection-background-color:", isDarkMode() ? "rgba(99, 102, 241, 0.3)" : "rgba(99, 102, 241, 0.15)") + ssrStyleProperty(";--jse-hover-background-color:", isDarkMode() ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)") + ssrStyleProperty(";--jse-active-line-background-color:", isDarkMode() ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)") + ssrStyleProperty(";--jse-modal-background:", isDarkMode() ? "#1e293b" : "#ffffff") + ssrStyleProperty(";--jse-context-menu-background:", isDarkMode() ? "#1e293b" : "#ffffff"));
}
const styleTag = typeof document !== "undefined" ? document.createElement("style") : null;
if (styleTag) {
  styleTag.textContent = `
    .svelte-jsoneditor-container .jse-main {
      border-radius: 0.75rem;
      overflow: hidden;
      border: 1px solid var(--jse-panel-border) !important;
    }
    
    .svelte-jsoneditor-container .jse-menu {
      padding: 0.75rem !important;
      background: var(--jse-panel-background) !important;
      border-bottom: 1px solid var(--jse-panel-border) !important;
      backdrop-filter: blur(12px);
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
    
    .svelte-jsoneditor-container .jse-menu button {
      border-radius: 0.5rem !important;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
      background: transparent !important;
      color: var(--jse-text-color) !important;
      opacity: 0.8;
      padding: 4px !important;
      width: 32px !important;
      height: 32px !important;
    }
    
    .svelte-jsoneditor-container .jse-menu button:hover {
      background: var(--jse-theme-color-highlight) !important;
      color: var(--jse-theme-color) !important;
      opacity: 1;
      transform: translateY(-1px);
    }
    
    .svelte-jsoneditor-container .jse-menu button.jse-active {
      background: var(--jse-theme-color) !important;
      color: white !important;
      opacity: 1;
    }
    
    .svelte-jsoneditor-container .jse-search {
      background: var(--jse-panel-background) !important;
      border-radius: 0.75rem !important;
      margin: 0.75rem !important;
      border: 1px solid var(--jse-panel-border) !important;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
      overflow: hidden;
    }
    
    .svelte-jsoneditor-container .jse-search input {
      background: transparent !important;
      padding: 0.5rem 0.75rem !important;
      outline: none !important;
    }
    
    .svelte-jsoneditor-container .jse-contents {
      padding: 0.5rem !important;
      background: var(--jse-background-color) !important;
    }
    
    .svelte-jsoneditor-container .jse-status-bar {
      border-top: 1px solid var(--jse-panel-border) !important;
      padding: 0.5rem 1rem !important;
      font-size: 11px !important;
      background: var(--jse-panel-background) !important;
      color: var(--jse-text-color) !important;
      opacity: 0.7;
    }
    
    /* Table Mode Styling */
    .svelte-jsoneditor-container .jse-table {
      border-collapse: separate !important;
      border-spacing: 0 !important;
    }
    
    .svelte-jsoneditor-container .jse-table-header {
      background: var(--jse-panel-background) !important;
      font-weight: 600 !important;
      text-transform: uppercase !important;
      letter-spacing: 0.05em !important;
      font-size: 10px !important;
      color: var(--jse-theme-color) !important;
      border-bottom: 2px solid var(--jse-panel-border) !important;
    }
    
    .svelte-jsoneditor-container .jse-table-cell {
      border: 1px solid var(--jse-panel-border) !important;
      padding: 0.5rem !important;
    }
    
    /* Tree Mode refinement */
    .svelte-jsoneditor-container .jse-key {
      font-weight: 600 !important;
    }
    
    .svelte-jsoneditor-container .jse-value {
      font-family: var(--jse-font-family) !important;
    }

    /* Modern Scrollbars */
    .svelte-jsoneditor-container ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    .svelte-jsoneditor-container ::-webkit-scrollbar-track {
      background: transparent;
    }
    .svelte-jsoneditor-container ::-webkit-scrollbar-thumb {
      background: var(--jse-panel-border);
      border-radius: 10px;
    }
    .svelte-jsoneditor-container ::-webkit-scrollbar-thumb:hover {
      background: var(--jse-theme-color);
    }
  `;
  document.head.appendChild(styleTag);
}
var _tmpl$$a = ["<div", ' class="space-y-6"><div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"><div class="flex gap-3"><button', ' class="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors">', "</button><button", ' class="px-6 py-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors">Format</button></div><div class="flex items-center gap-2"><!--$-->', "<!--/--><!--$-->", '<!--/--><span class="', '">', '</span></div></div><div class="h-[500px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">', "</div></div>"], _tmpl$2$9 = ["<span", ' class="text-green-600 dark:text-green-400">', "</span>"], _tmpl$3$8 = ["<span", ' class="text-red-600 dark:text-red-400">', "</span>"];
function JsonValidator() {
  const [jsonInput, setJsonInput] = createSignal('{\n  "hello": "world"\n}');
  const [status, setStatus] = createSignal({
    type: "idle",
    message: "Ready"
  });
  const [isProcessing, setIsProcessing] = createSignal(false);
  let worker;
  onMount(() => {
    worker = createJsonWorker();
    worker.onmessage = (e) => {
      const {
        type,
        success,
        error,
        position,
        formatted
      } = e.data;
      setIsProcessing(false);
      if (success) {
        if (type === "format") {
          setJsonInput(formatted);
          setStatus({
            type: "success",
            message: "Formatted"
          });
        } else {
          setStatus({
            type: "success",
            message: "Valid JSON"
          });
        }
      } else {
        let msg = error;
        if (position && !error.toLowerCase().includes("line")) {
          msg += ` at line ${position.line}, column ${position.column}`;
        }
        setStatus({
          type: "error",
          message: msg
        });
      }
    };
  });
  onCleanup(() => {
    worker == null ? void 0 : worker.terminate();
  });
  return ssr(_tmpl$$a, ssrHydrationKey(), ssrAttribute("disabled", isProcessing(), true), isProcessing() ? "Processing..." : "Validate", ssrAttribute("disabled", isProcessing(), true), status().type === "success" && ssr(_tmpl$2$9, ssrHydrationKey(), escape(createComponent(CheckIcon, {}))), status().type === "error" && ssr(_tmpl$3$8, ssrHydrationKey(), escape(createComponent(XIcon, {}))), `text-sm font-medium ${status().type === "success" ? "text-green-700 dark:text-green-400" : status().type === "error" ? "text-red-700 dark:text-red-400" : "text-slate-600 dark:text-slate-400"}`, escape(status().message), escape(createComponent(SvelteJsonEditor, {
    get value() {
      return jsonInput();
    },
    onChange: setJsonInput,
    mode: "text"
  })));
}
var _tmpl$$9 = ["<div", ' class="flex-shrink-0 w-2 h-full relative group cursor-col-resize"><div class="', '"></div><div class="', '"></div></div>'];
function ResizableSplitter(props) {
  const [isDragging, setIsDragging] = createSignal(false);
  onCleanup(() => {
    if (typeof document !== "undefined") {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
  });
  return ssr(_tmpl$$9, ssrHydrationKey(), `absolute inset-y-0 -left-2 w-6 transition-colors ${isDragging() ? "bg-indigo-500/20" : "hover:bg-indigo-500/10"}`, `absolute inset-y-0 left-0.5 w-1 transition-colors ${isDragging() ? "bg-indigo-500" : "bg-slate-200 dark:bg-slate-700 group-hover:bg-indigo-400"}`);
}
var _tmpl$$8 = ["<span", ' class="text-slate-400">null</span>'], _tmpl$2$8 = ["<span", ' class="text-amber-600 dark:text-amber-400">', "</span>"], _tmpl$3$7 = ["<span", ' class="text-slate-400 italic text-xs">', "</span>"], _tmpl$4$7 = ["<span", ' class="text-emerald-600 dark:text-emerald-400">"<!--$-->', '<!--/-->"</span>'], _tmpl$5$6 = ["<table", ' class="w-full border-collapse text-left text-xs font-mono"><thead><tr class="bg-slate-50/80 dark:bg-slate-800/50 sticky top-0 z-10 backdrop-blur-sm"><th class="p-3 border-b border-slate-200 dark:border-slate-700 text-slate-400 font-bold uppercase tracking-wider w-10 text-center">#</th><!--$-->', '<!--/--></tr></thead><tbody class="divide-y divide-slate-100 dark:divide-slate-800/50">', "</tbody></table>"], _tmpl$6$6 = ["<div", ' class="w-full overflow-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm">', "</div>"], _tmpl$7$5 = ["<div", ' class="p-8 text-center text-slate-500 italic text-sm">No tabular data found. Table mode requires an array of objects.</div>'], _tmpl$8$2 = ["<th", ' class="p-3 border-b border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider" style="', '">', "</th>"], _tmpl$9$1 = ["<tr", ' class="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors group"><td class="p-3 text-slate-300 dark:text-slate-600 text-center border-r border-slate-100 dark:border-slate-800/50">', "</td><!--$-->", "<!--/--></tr>"], _tmpl$0$1 = ["<td", ' class="p-3 align-top max-w-[300px] truncate group-hover:whitespace-normal group-hover:overflow-visible group-hover:bg-white dark:group-hover:bg-slate-800 group-hover:shadow-lg transition-all duration-200">', "</td>"];
function TableView(props) {
  const tableData = createMemo(() => {
    if (!Array.isArray(props.data)) return [];
    return props.data.filter((item) => item !== null && typeof item === "object");
  });
  const columns = createMemo(() => {
    const cols = /* @__PURE__ */ new Set();
    tableData().forEach((item) => {
      Object.keys(item).forEach((key) => cols.add(key));
    });
    return Array.from(cols);
  });
  const font = "13px ui-monospace, monospace";
  const columnWidths = createMemo(() => {
    const widths = {};
    columns().forEach((col) => {
      const prepared = prepare(col, "bold " + font);
      const {
        height
      } = layout(prepared, 1e3, 20);
      widths[col] = 120;
    });
    return widths;
  });
  const renderValue = (val) => {
    if (val === null) return ssr(_tmpl$$8, ssrHydrationKey());
    if (typeof val === "boolean") return ssr(_tmpl$2$8, ssrHydrationKey(), escape(String(val)));
    if (typeof val === "number") return ssr(_tmpl$2$8, ssrHydrationKey(), escape(val));
    if (typeof val === "object") return ssr(_tmpl$3$7, ssrHydrationKey(), Array.isArray(val) ? "Array" : "Object");
    return ssr(_tmpl$4$7, ssrHydrationKey(), escape(String(val)));
  };
  return ssr(_tmpl$6$6, ssrHydrationKey(), escape(createComponent(Show, {
    get when() {
      return tableData().length > 0;
    },
    get fallback() {
      return ssr(_tmpl$7$5, ssrHydrationKey());
    },
    get children() {
      return ssr(_tmpl$5$6, ssrHydrationKey(), escape(createComponent(For, {
        get each() {
          return columns();
        },
        children: (col) => ssr(_tmpl$8$2, ssrHydrationKey(), ssrStyleProperty("min-width:", `${escape(columnWidths()[col], true)}px`), escape(col))
      })), escape(createComponent(For, {
        get each() {
          return tableData();
        },
        children: (row, index) => ssr(_tmpl$9$1, ssrHydrationKey(), escape(index()) + 1, escape(createComponent(For, {
          get each() {
            return columns();
          },
          children: (col) => ssr(_tmpl$0$1, ssrHydrationKey(), escape(renderValue(row[col])))
        })))
      })));
    }
  })));
}
var _tmpl$$7 = ["<div", ' class="absolute left-0 right-0 pointer-events-none z-10" style="', '"></div>'], _tmpl$2$7 = ["<div", ' class="flex-shrink-0 border-t border-red-300 dark:border-red-700/60 bg-red-50 dark:bg-[#1e0a0a] overflow-auto max-h-40"><div class="px-3 py-1.5 flex items-center gap-2 border-b border-red-200 dark:border-red-800/40 sticky top-0 bg-red-50 dark:bg-[#1e0a0a] z-10"><span class="text-[10px] font-bold text-red-500 uppercase tracking-widest">Problems</span><span class="ml-auto text-[10px] bg-red-200 dark:bg-red-900 text-red-700 dark:text-red-300 px-1.5 py-0.5 rounded font-bold">1</span></div><div class="flex items-start gap-3 px-3 py-2 hover:bg-red-100/60 dark:hover:bg-red-900/20 cursor-pointer group"><span class="text-red-500 text-[13px] mt-px flex-shrink-0">\u2715</span><div class="flex-1 min-w-0"><p class="text-[12px] font-semibold text-red-700 dark:text-red-300 truncate">', '</p><p class="text-[10px] text-red-500 dark:text-red-500/80 mt-0.5 truncate">', '</p></div><span class="flex-shrink-0 text-[10px] font-mono text-red-400 dark:text-red-600 mt-0.5">L<!--$-->', "<!--/--> C<!--$-->", '<!--/--></span><button class="flex-shrink-0 px-2 py-0.5 text-[11px] font-bold rounded border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 bg-white dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors opacity-0 group-hover:opacity-100" title="Auto-fix this error">Solve</button></div></div>'], _tmpl$3$6 = ["<span", ' class="text-red-500">\u2715</span>'], _tmpl$4$6 = ["<span", ' class="font-bold">', "</span>"], _tmpl$5$5 = ["<span", ' class="text-red-400/70 truncate hidden sm:block">\u2014 <!--$-->', "<!--/--></span>"], _tmpl$6$5 = ["<span", ' class="ml-auto flex items-center gap-2 flex-shrink-0"><span class="font-mono text-[10px] text-red-400">L<!--$-->', "<!--/--> C<!--$-->", '<!--/--></span><span class="', '">', "</span></span>"], _tmpl$7$4 = ["<div", ' class="', '"', ">", "</div>"], _tmpl$8$1 = ["<div", ' class="', '"><div class="flex flex-1 min-h-0 overflow-hidden"><div class="flex-shrink-0 w-11 overflow-hidden bg-slate-100/60 dark:bg-slate-900/60 border-r border-slate-200 dark:border-slate-800 select-none" style="', '"><div class="pt-[14px] pb-4">', '</div></div><div class="relative flex-1 min-w-0 overflow-hidden"><!--$-->', '<!--/--><textarea class="absolute inset-0 w-full h-full bg-transparent pt-[14px] pb-4 pl-4 pr-4 outline-none resize-none text-slate-800 dark:text-slate-200 overflow-auto whitespace-pre caret-indigo-500" spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="off"', ' style="', '"></textarea></div></div><!--$-->', "<!--/--><!--$-->", "<!--/--></div>"], _tmpl$9 = ["<div", ' class="', '" style="', '"><!--$-->', "<!--/--><!--$-->", "<!--/--></div>"], _tmpl$0 = ["<span", ' class="mr-1 text-[8px]">\u25CF</span>'], _tmpl$1 = ["<span", ' class="text-emerald-500">\u2713</span>'], _tmpl$10 = ["<span", ">Valid JSON</span>"], _tmpl$11 = ["<span", ' class="ml-auto text-emerald-400/60"><!--$-->', "<!--/--> chars</span>"];
function parseJsonError(text) {
  try {
    JSON.parse(text);
    return null;
  } catch (e) {
    const msg = e.message;
    let label = msg;
    if (msg.includes("Unexpected token")) label = "Unexpected token";
    else if (msg.includes("Unexpected end")) label = "Unexpected end of JSON";
    else if (msg.includes("Expected")) label = msg.split("at")[0].trim();
    const lineColMatch = msg.match(/at line (\d+) column (\d+)/);
    if (lineColMatch) {
      return {
        line: parseInt(lineColMatch[1]),
        column: parseInt(lineColMatch[2]),
        message: msg,
        label
      };
    }
    const posMatch = msg.match(/position (\d+)/);
    if (posMatch) {
      const pos = parseInt(posMatch[1]);
      const before = text.slice(0, pos);
      const lines = before.split("\n");
      return {
        line: lines.length,
        column: lines[lines.length - 1].length + 1,
        message: msg,
        label
      };
    }
    return {
      line: 1,
      column: 1,
      message: msg,
      label
    };
  }
}
function TextView(props) {
  const [lineCount, setLineCount] = createSignal(1);
  const [errorPanelOpen, setErrorPanelOpen] = createSignal(false);
  const lineHeight = 22;
  const jsonError = createMemo(() => {
    if (!props.value.trim()) return null;
    return parseJsonError(props.value);
  });
  createMemo(() => !jsonError() && props.value.trim().length > 0);
  const isEmpty = createMemo(() => !props.value.trim());
  const updateMetrics = () => {
    return;
  };
  onMount(() => {
    window.addEventListener("resize", updateMetrics);
    onCleanup(() => window.removeEventListener("resize", updateMetrics));
  });
  createEffect(() => {
  });
  createEffect(() => {
    if (!jsonError()) setErrorPanelOpen(false);
  });
  const errorLine = createMemo(() => {
    var _a, _b;
    return (_b = (_a = jsonError()) == null ? void 0 : _a.line) != null ? _b : null;
  });
  const borderColor = createMemo(() => {
    if (isEmpty()) return "";
    if (jsonError()) return "ring-1 ring-inset ring-red-400/50 dark:ring-red-500/40";
    return "ring-1 ring-inset ring-emerald-400/40 dark:ring-emerald-500/30";
  });
  return ssr(_tmpl$8$1, ssrHydrationKey(), `relative flex flex-col h-full font-mono text-[13px] bg-slate-50 dark:bg-[#0d1117] overflow-hidden transition-all duration-200 ${escape(borderColor(), true)}`, ssrStyleProperty("pointer-events:", "none"), escape(Array.from({
    length: lineCount()
  }).map((_, i) => {
    const lineNum = i + 1;
    const isErr = errorLine() === lineNum;
    return ssr(_tmpl$9, ssrHydrationKey(), `text-right pr-2 text-[10px] leading-none flex items-center justify-end transition-colors ${isErr ? "text-red-500 dark:text-red-400 font-bold" : "text-slate-400 dark:text-slate-600"}`, ssrStyleProperty("height:", "22px"), isErr && _tmpl$0[0] + ssrHydrationKey() + _tmpl$0[1], escape(lineNum));
  })), escape(createComponent(Show, {
    get when() {
      return errorLine() !== null;
    },
    get children() {
      return ssr(_tmpl$$7, ssrHydrationKey(), ssrStyleProperty("top:", `${14 + (escape(errorLine(), true) - 1) * escape(lineHeight, true)}px`) + ssrStyleProperty(";height:", "22px") + ssrStyleProperty(";background:", "rgba(239, 68, 68, 0.09)") + ssrStyleProperty(";border-top:", "1px solid rgba(239, 68, 68, 0.30)") + ssrStyleProperty(";border-bottom:", "1px solid rgba(239, 68, 68, 0.30)"));
    }
  })), ssrAttribute("readonly", escape(props.readonly, true), false), ssrStyleProperty("line-height:", "22px") + ssrStyleProperty(";font-family:", "ui-monospace, 'Cascadia Code', Menlo, monospace") + ssrStyleProperty(";tab-size:", "2"), escape(createComponent(Show, {
    get when() {
      return !isEmpty() && errorPanelOpen() && jsonError();
    },
    get children() {
      return ssr(_tmpl$2$7, ssrHydrationKey(), escape(jsonError().label), escape(jsonError().message), escape(jsonError().line), escape(jsonError().column));
    }
  })), escape(createComponent(Show, {
    get when() {
      return !isEmpty();
    },
    get children() {
      return ssr(_tmpl$7$4, ssrHydrationKey(), `flex-shrink-0 flex items-center gap-2 px-3 py-1 border-t text-[11px] font-mono transition-all cursor-pointer select-none ${jsonError() ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20" : "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-emerald-600 dark:text-emerald-400"}`, ssrAttribute("title", jsonError() ? "Click to view errors" : "", false), escape(createComponent(Show, {
        get when() {
          return jsonError();
        },
        get fallback() {
          return [ssr(_tmpl$1, ssrHydrationKey()), ssr(_tmpl$10, ssrHydrationKey()), ssr(_tmpl$11, ssrHydrationKey(), escape(props.value.length.toLocaleString()))];
        },
        get children() {
          return [ssr(_tmpl$3$6, ssrHydrationKey()), ssr(_tmpl$4$6, ssrHydrationKey(), escape(jsonError().label)), ssr(_tmpl$5$5, ssrHydrationKey(), escape(jsonError().message)), ssr(_tmpl$6$5, ssrHydrationKey(), escape(jsonError().line), escape(jsonError().column), `text-[10px] px-1.5 py-0.5 rounded border font-bold transition-all ${errorPanelOpen() ? "bg-red-200 dark:bg-red-800 text-red-700 dark:text-red-200 border-red-300 dark:border-red-700" : "bg-transparent border-red-300 dark:border-red-700 text-red-400"}`, errorPanelOpen() ? "\u25B2 hide" : "\u25BC errors")];
        }
      })));
    }
  })));
}
var _tmpl$$6 = ["<div", ' class="h-full overflow-auto font-mono text-sm bg-slate-50 dark:bg-[#0d1117]"><table class="w-full border-collapse"><tbody style="', '">', '</tbody></table><div class="sticky bottom-3 right-4 flex justify-end p-2 pointer-events-none"><div class="px-2 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-md"><span class="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Pretext Diff Engine</span></div></div></div>'], _tmpl$2$6 = ["<tr", ' class="', '"><td class="px-3 py-0 text-right text-slate-400 dark:text-slate-600 select-none w-10 text-[10px] border-r border-slate-200 dark:border-slate-800 bg-slate-100/30 dark:bg-slate-900/30">', '</td><td class="px-3 py-0 text-right text-slate-400 dark:text-slate-600 select-none w-10 text-[10px] border-r border-slate-200 dark:border-slate-800 bg-slate-100/30 dark:bg-slate-900/30">', '</td><td class="', '">', '</td><td class="', '">', "</td></tr>"];
function DiffView(props) {
  const font = "13px ui-monospace, 'Cascadia Code', monospace";
  const measuredLines = createMemo(() => {
    return props.lines.map((line) => {
      const prepared = prepare(line.content || " ", font);
      return {
        ...line,
        prepared
      };
    });
  });
  return ssr(_tmpl$$6, ssrHydrationKey(), ssrStyleProperty("line-height:", "22px"), escape(createComponent(For, {
    get each() {
      return measuredLines();
    },
    children: (line) => ssr(_tmpl$2$6, ssrHydrationKey(), `group border-b border-transparent hover:border-slate-100 dark:hover:border-slate-800/50 ${line.type === "added" ? "bg-emerald-500/10 dark:bg-emerald-500/10" : line.type === "removed" ? "bg-red-500/10 dark:bg-red-500/10" : ""}`, line.type !== "added" ? escape(line.oldLineNum) : "", line.type !== "removed" ? escape(line.newLineNum) : "", `px-2 py-0 select-none w-6 text-center font-bold ${line.type === "added" ? "text-emerald-500" : line.type === "removed" ? "text-red-500" : "text-slate-300 dark:text-slate-700"}`, line.type === "added" ? "+" : line.type === "removed" ? "-" : "", `px-4 py-0 whitespace-pre font-mono text-[13px] ${line.type === "added" ? "text-emerald-700 dark:text-emerald-300" : line.type === "removed" ? "text-red-700 dark:text-red-300" : "text-slate-600 dark:text-slate-400"}`, escape(line.content) || " ")
  })));
}
var _tmpl$$5 = ["<span", ' class="', '">', "</span>"], _tmpl$2$5 = ["<span", ' class="text-slate-500 dark:text-slate-400 font-medium shrink-0"><!--$-->', '<!--/--><span class="ml-0.5 text-slate-300 dark:text-slate-600">:</span></span>'], _tmpl$3$5 = ["<span", ' class="opacity-70">"</span>'], _tmpl$4$5 = ["<span", ">", "</span>"], _tmpl$5$4 = ["<div", ' class="', '" style="', '">', "</div>"], _tmpl$6$4 = ["<div", ' class="border-l border-slate-200 dark:border-slate-800 ml-1.5 pl-1 mt-0.5">', "</div>"], _tmpl$7$3 = ["<div", ' class="select-none transition-all duration-200" style="', '"><div class="flex items-start gap-2 py-1 px-2 rounded-lg hover:bg-slate-100/80 dark:hover:bg-slate-800/40 cursor-pointer group transition-colors"><div class="flex-shrink-0 w-4 h-5 flex items-center justify-center mt-0.5">', '</div><div class="flex flex-wrap items-baseline gap-x-2 min-w-0 flex-1"><!--$-->', "<!--/--><!--$-->", "<!--/--></div></div><!--$-->", "<!--/--></div>"];
function TreeView(props) {
  const [isExpanded, setIsExpanded] = createSignal(true);
  const isObject = (val) => val !== null && typeof val === "object";
  const isArray = (val) => Array.isArray(val);
  const font = "14px ui-monospace, monospace";
  createMemo(() => {
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
    return {
      text: valStr,
      metrics: layout(prepared, 500, 20)
    };
  });
  return ssr(_tmpl$7$3, ssrHydrationKey(), ssrStyleProperty("margin-left:", `${props.depth > 0 ? 1.25 : 0}rem`), escape(createComponent(Show, {
    get when() {
      return isObject(props.data);
    },
    get children() {
      return ssr(_tmpl$$5, ssrHydrationKey(), `transition-transform duration-200 ${isExpanded() ? "rotate-90" : ""} text-slate-400 group-hover:text-indigo-500`, escape(createComponent(ChevronRightIcon, {})));
    }
  })), escape(createComponent(Show, {
    get when() {
      return props.label;
    },
    get children() {
      return ssr(_tmpl$2$5, ssrHydrationKey(), escape(props.label));
    }
  })), escape(createComponent(Show, {
    get when() {
      return !isObject(props.data) || !isExpanded();
    },
    fallback: null,
    get children() {
      return ssr(_tmpl$5$4, ssrHydrationKey(), `min-w-0 break-words ${isObject(props.data) ? "text-slate-400 italic text-xs" : typeof props.data === "string" ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400 font-medium"}`, ssrStyleProperty("height:", typeof valuePreview() === "object" && valuePreview().metrics ? `${escape(valuePreview().metrics.height, true)}px` : "auto"), escape(createComponent(Show, {
        get when() {
          return typeof props.data === "string" && !isObject(props.data);
        },
        get fallback() {
          return ssr(_tmpl$4$5, ssrHydrationKey(), typeof valuePreview() === "string" ? escape(valuePreview()) : escape(valuePreview().text));
        },
        get children() {
          return [ssr(_tmpl$3$5, ssrHydrationKey()), ssr(_tmpl$4$5, ssrHydrationKey(), escape(valuePreview().text)), ssr(_tmpl$3$5, ssrHydrationKey())];
        }
      })));
    }
  })), escape(createComponent(Show, {
    get when() {
      return isObject(props.data) && isExpanded();
    },
    get children() {
      return ssr(_tmpl$6$4, ssrHydrationKey(), escape(createComponent(For, {
        get each() {
          return Object.entries(props.data);
        },
        children: ([key, value]) => createComponent(TreeView, {
          data: value,
          label: key,
          get depth() {
            return props.depth + 1;
          }
        })
      })));
    }
  })));
}
var _tmpl$$4 = ["<div", ' class="flex-1 overflow-auto p-4 font-mono text-sm">', "</div>"], _tmpl$2$4 = ["<div", ' class="flex-1 overflow-auto p-4">', "</div>"], _tmpl$3$4 = ["<div", ' class="flex-1 min-h-0 overflow-hidden">', "</div>"], _tmpl$4$4 = ["<div", ' class="flex-1 overflow-auto">', "</div>"], _tmpl$5$3 = ["<div", ' class="w-full h-full flex flex-col overflow-hidden bg-slate-50 dark:bg-[#0d1117]"><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--></div>"], _tmpl$6$3 = ["<div", ' class="flex items-center gap-2 text-red-500 text-xs font-mono"><span>\u2715</span><span>Invalid JSON \u2014 switch to Text mode to fix</span></div>'], _tmpl$7$2 = ["<div", ' class="flex items-center gap-2 text-red-500 text-xs font-mono p-4"><span>\u2715</span><span>Invalid JSON \u2014 switch to Text mode to fix</span></div>'];
function PretextEditor(props) {
  const jsonData = createMemo(() => {
    try {
      return JSON.parse(props.value || "{}");
    } catch {
      return null;
    }
  });
  const isValidJson = createMemo(() => jsonData() !== null);
  return ssr(_tmpl$5$3, ssrHydrationKey(), escape(createComponent(Show, {
    get when() {
      return props.mode === "tree";
    },
    get children() {
      return ssr(_tmpl$$4, ssrHydrationKey(), escape(createComponent(Show, {
        get when() {
          return isValidJson();
        },
        get fallback() {
          return ssr(_tmpl$6$3, ssrHydrationKey());
        },
        get children() {
          return createComponent(TreeView, {
            get data() {
              return jsonData();
            },
            depth: 0
          });
        }
      })));
    }
  })), escape(createComponent(Show, {
    get when() {
      return props.mode === "table";
    },
    get children() {
      return ssr(_tmpl$2$4, ssrHydrationKey(), escape(createComponent(Show, {
        get when() {
          return isValidJson();
        },
        get fallback() {
          return ssr(_tmpl$7$2, ssrHydrationKey());
        },
        get children() {
          return createComponent(TableView, {
            get data() {
              return jsonData();
            }
          });
        }
      })));
    }
  })), escape(createComponent(Show, {
    get when() {
      return props.mode === "text";
    },
    get children() {
      return ssr(_tmpl$3$4, ssrHydrationKey(), escape(createComponent(TextView, {
        get value() {
          return props.value;
        },
        get onChange() {
          return props.onChange;
        },
        get readonly() {
          return props.readonly;
        }
      })));
    }
  })), escape(createComponent(Show, {
    get when() {
      return props.mode === "diff";
    },
    get children() {
      return ssr(_tmpl$4$4, ssrHydrationKey(), escape(createComponent(DiffView, {
        get lines() {
          return props.diffLines || [];
        }
      })));
    }
  })));
}
var _tmpl$$3 = ["<span", ">", "</span>"], _tmpl$2$3 = ["<tr", ' class="', '" style="', '"><td class="', '" style="', '">', '</td><td class="', '" style="', '">', '</td><td class="', '" style="', '">', "</td></tr>"], _tmpl$3$3 = ["<span", ' class="opacity-0">\xB7</span>'], _tmpl$4$3 = ["<div", ' class="flex h-full overflow-hidden select-text bg-white dark:bg-[#0d1117]"><div class="flex-1 min-w-0 overflow-auto border-r-2 border-slate-200 dark:border-slate-700"><div class="sticky top-0 z-10 flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800/90 backdrop-blur border-b border-slate-200 dark:border-slate-700 select-none"><span class="w-2 h-2 rounded-full bg-red-400 flex-shrink-0"></span><span class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Original</span></div><table class="w-full border-collapse"><tbody>', '</tbody></table></div><div class="flex-1 min-w-0 overflow-auto"><div class="sticky top-0 z-10 flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800/90 backdrop-blur border-b border-slate-200 dark:border-slate-700 select-none"><span class="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"></span><span class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Modified</span></div><table class="w-full border-collapse"><tbody>', "</tbody></table></div></div>"];
function charDiff(oldStr, newStr) {
  const tokenize = (s) => s.split(/(\s+|[{}[\],:"]+)/g).filter((t) => t.length > 0);
  const a = tokenize(oldStr);
  const b = tokenize(newStr);
  const m = a.length, n = b.length;
  const dp = Array.from({
    length: m + 1
  }, () => new Array(n + 1).fill(0));
  for (let i2 = 1; i2 <= m; i2++) for (let j2 = 1; j2 <= n; j2++) dp[i2][j2] = a[i2 - 1] === b[j2 - 1] ? dp[i2 - 1][j2 - 1] + 1 : Math.max(dp[i2 - 1][j2], dp[i2][j2 - 1]);
  const oldSpans = [];
  const newSpans = [];
  let i = m, j = n;
  const ops = [];
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      ops.unshift({
        type: "same",
        text: a[i - 1]
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      ops.unshift({
        type: "ins",
        text: b[j - 1]
      });
      j--;
    } else {
      ops.unshift({
        type: "del",
        text: a[i - 1]
      });
      i--;
    }
  }
  for (const op of ops) {
    if (op.type === "same") {
      oldSpans.push({
        text: op.text,
        changed: false
      });
      newSpans.push({
        text: op.text,
        changed: false
      });
    } else if (op.type === "del") {
      oldSpans.push({
        text: op.text,
        changed: true
      });
    } else {
      newSpans.push({
        text: op.text,
        changed: true
      });
    }
  }
  return {
    oldSpans,
    newSpans
  };
}
function alignDiff(lines) {
  const rows = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.type === "unchanged") {
      rows.push({
        left: {
          content: line.content,
          lineNum: line.oldLineNum,
          type: "unchanged"
        },
        right: {
          content: line.content,
          lineNum: line.newLineNum,
          type: "unchanged"
        }
      });
      i++;
      continue;
    }
    const removed = [];
    const added = [];
    while (i < lines.length && lines[i].type !== "unchanged") {
      if (lines[i].type === "removed") removed.push(lines[i]);
      else added.push(lines[i]);
      i++;
    }
    const maxLen = Math.max(removed.length, added.length);
    for (let k = 0; k < maxLen; k++) {
      const rem = removed[k];
      const add = added[k];
      let oldSpans;
      let newSpans;
      if (rem && add) {
        const d = charDiff(rem.content, add.content);
        oldSpans = d.oldSpans;
        newSpans = d.newSpans;
      }
      rows.push({
        left: rem ? {
          content: rem.content,
          lineNum: rem.oldLineNum,
          type: "removed",
          charSpans: oldSpans
        } : null,
        right: add ? {
          content: add.content,
          lineNum: add.newLineNum,
          type: "added",
          charSpans: newSpans
        } : null
      });
    }
  }
  return rows;
}
function SpannedLine(props) {
  return ssr(_tmpl$$3, ssrHydrationKey(), escape(createComponent(For, {
    get each() {
      return props.spans;
    },
    children: (span) => ssr(_tmpl$$3, ssrHydrationKey() + ssrAttribute("class", span.changed ? props.side === "left" ? "bg-red-300/50 dark:bg-red-500/30 rounded-sm" : "bg-emerald-300/50 dark:bg-emerald-500/30 rounded-sm" : "", false), escape(span.text))
  })));
}
function SideBySideDiff(props) {
  let leftRef;
  let rightRef;
  let syncL = false, syncR = false;
  const rows = createMemo(() => alignDiff(props.lines));
  const onLeftScroll = () => {
    if (syncR) return;
    syncL = true;
    rightRef.scrollTop = leftRef.scrollTop;
    rightRef.scrollLeft = leftRef.scrollLeft;
    syncL = false;
  };
  const onRightScroll = () => {
    if (syncL) return;
    syncR = true;
    leftRef.scrollTop = rightRef.scrollTop;
    leftRef.scrollLeft = rightRef.scrollLeft;
    syncR = false;
  };
  onMount(() => {
    leftRef.addEventListener("scroll", onLeftScroll, {
      passive: true
    });
    rightRef.addEventListener("scroll", onRightScroll, {
      passive: true
    });
    onCleanup(() => {
      leftRef.removeEventListener("scroll", onLeftScroll);
      rightRef.removeEventListener("scroll", onRightScroll);
    });
  });
  const rowBg = (type) => type === "removed" ? "bg-red-50 dark:bg-[#3d1515]" : type === "added" ? "bg-emerald-50 dark:bg-[#122318]" : "";
  const gutterBg = (type) => type === "removed" ? "bg-red-100/80 dark:bg-red-900/30" : type === "added" ? "bg-emerald-100/80 dark:bg-emerald-900/30" : "bg-slate-100/60 dark:bg-slate-900/50";
  const gutterText = (type) => type === "removed" ? "text-red-400 dark:text-red-500" : type === "added" ? "text-emerald-500 dark:text-emerald-400" : "text-slate-400 dark:text-slate-600";
  const signChar = (type) => type === "removed" ? "\u2212" : type === "added" ? "+" : "";
  const signColor = (type) => type === "removed" ? "text-red-400 dark:text-red-500 font-bold" : type === "added" ? "text-emerald-500 dark:text-emerald-400 font-bold" : "";
  const textColor = (type) => type === "removed" ? "text-slate-800 dark:text-red-100" : type === "added" ? "text-slate-800 dark:text-emerald-100" : "text-slate-700 dark:text-slate-300";
  const PanelCol = (side) => (row) => {
    var _a;
    const cell = side === "left" ? row.left : row.right;
    const type = cell == null ? void 0 : cell.type;
    return ssr(
      _tmpl$2$3,
      ssrHydrationKey(),
      `border-b border-slate-100/80 dark:border-slate-800/50 ${escape(rowBg(type), true)}`,
      ssrStyleProperty("height:", "22px"),
      `${escape(gutterBg(type), true)} ${escape(gutterText(type), true)} select-none text-right pr-2 pl-2 text-[11px] font-mono border-r border-slate-200 dark:border-slate-700/60 w-10 whitespace-nowrap`,
      ssrStyleProperty("min-width:", "2.5rem") + ssrStyleProperty(";height:", "22px") + ssrStyleProperty(";line-height:", "22px"),
      (_a = escape(cell == null ? void 0 : cell.lineNum)) != null ? _a : "",
      `${escape(gutterBg(type), true)} ${escape(signColor(type), true)} select-none text-center w-5 border-r border-slate-200 dark:border-slate-700/60 text-[12px]`,
      ssrStyleProperty("width:", "1.25rem") + ssrStyleProperty(";height:", "22px") + ssrStyleProperty(";line-height:", "22px"),
      escape(signChar(type)),
      `${escape(textColor(type), true)} pl-4 pr-6 font-mono text-[13px] whitespace-pre overflow-hidden`,
      ssrStyleProperty("height:", "22px") + ssrStyleProperty(";line-height:", "22px"),
      cell ? cell.charSpans ? escape(createComponent(SpannedLine, {
        get spans() {
          return cell.charSpans;
        },
        side
      })) : escape(cell.content) || " " : _tmpl$3$3[0] + ssrHydrationKey() + _tmpl$3$3[1]
      /* placeholder row */
    );
  };
  return ssr(_tmpl$4$3, ssrHydrationKey(), escape(createComponent(For, {
    get each() {
      return rows();
    },
    get children() {
      return PanelCol("left");
    }
  })), escape(createComponent(For, {
    get each() {
      return rows();
    },
    get children() {
      return PanelCol("right");
    }
  })));
}
var _tmpl$$2 = ["<div", ' class="flex items-center gap-2 px-2 py-1.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex-shrink-0"><span class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider w-10">', '</span><div class="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md"><button', ">Text</button><button", ">Tree</button><button", '>Table</button></div><div class="flex items-center gap-1"><button class="px-2.5 py-1 text-[11px] font-semibold rounded border transition-all duration-150 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400" title="Format (pretty-print)">Format</button><button class="px-2.5 py-1 text-[11px] font-semibold rounded border transition-all duration-150 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400" title="Minify (compact)">Minify</button></div><button class="ml-auto flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"', ">", '</button><span class="text-[10px] text-slate-400 dark:text-slate-600 font-mono ml-1">', "</span></div>"], _tmpl$2$2 = ["<span", ' class="ml-1 text-emerald-200">+<!--$-->', "<!--/--></span>"], _tmpl$3$2 = ["<span", ' class="text-red-200">-<!--$-->', "<!--/--></span>"], _tmpl$4$2 = ["<div", ' class="', '"><!--$-->', '<!--/--><span class="max-w-[240px] truncate">', "</span></div>"], _tmpl$5$2 = ["<div", ' class="flex items-center gap-4 px-4 py-2 bg-amber-50 dark:bg-amber-900/10 border-b border-amber-200 dark:border-amber-800/40 text-xs font-medium text-amber-700 dark:text-amber-400 flex-shrink-0"><span class="font-bold uppercase tracking-wider">Diff Mode</span><span>Left vs Right panel comparison</span><span class="ml-auto flex gap-3"><span class="text-emerald-600 dark:text-emerald-400">+<!--$-->', '<!--/--> added</span><span class="text-red-600 dark:text-red-400">-<!--$-->', "<!--/--> removed</span></span></div>"], _tmpl$6$2 = ["<div", ' class="flex-1 min-h-0 overflow-hidden">', "</div>"], _tmpl$7$1 = ["<div", ' class="', '"><div class="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm flex-shrink-0"><div class="flex items-center gap-1.5"><button class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm" title="Open JSON file"><!--$-->', '<!--/--> Open</button><button class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm" title="Clear both panels"><!--$-->', '<!--/--> New</button></div><div class="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1"></div><div class="flex items-center gap-1.5"><button class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm" title="Download left panel"><!--$-->', '<!--/--> Save L</button><button class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm" title="Download right panel"><!--$-->', '<!--/--> Save R</button></div><div class="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1"></div><button class="', '"><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--></button><!--$-->", '<!--/--><div class="flex items-center gap-1 ml-auto"><button class="p-1.5 rounded-lg border border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:text-slate-700 dark:hover:text-slate-200 transition-all" title="Copy left to clipboard">', '</button><button class="p-1.5 rounded-lg border border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:text-slate-700 dark:hover:text-slate-200 transition-all" title="Copy right to clipboard">', '</button><button class="p-1.5 rounded-lg border border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:text-slate-700 dark:hover:text-slate-200 transition-all"', ">", "</button></div></div><!--$-->", "<!--/--><!--$-->", "<!--/--></div>"], _tmpl$8 = ["<div", ' class="flex flex-1 min-h-0 overflow-hidden"><div style="', '" class="flex flex-col h-full min-w-0 flex-shrink-0"><!--$-->', '<!--/--><div class="flex-1 min-h-0 overflow-hidden">', "</div></div><!--$-->", '<!--/--><div class="flex flex-col h-full flex-1 min-w-0"><!--$-->', '<!--/--><div class="flex-1 min-h-0 overflow-hidden">', "</div></div></div>"];
function computeDiff(oldText, newText) {
  const a = oldText.split("\n");
  const b = newText.split("\n");
  const m = a.length, n = b.length;
  const dp = Array.from({
    length: m + 1
  }, () => new Array(n + 1).fill(0));
  for (let i2 = 1; i2 <= m; i2++) for (let j2 = 1; j2 <= n; j2++) dp[i2][j2] = a[i2 - 1] === b[j2 - 1] ? dp[i2 - 1][j2 - 1] + 1 : Math.max(dp[i2 - 1][j2], dp[i2][j2 - 1]);
  const result = [];
  let i = m, j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      result.push({
        type: "unchanged",
        content: a[i - 1],
        oldLineNum: i,
        newLineNum: j
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.push({
        type: "added",
        content: b[j - 1],
        newLineNum: j
      });
      j--;
    } else {
      result.push({
        type: "removed",
        content: a[i - 1],
        oldLineNum: i
      });
      i--;
    }
  }
  return result.reverse();
}
function PanelHeader(props) {
  const modeBtnCls = (m) => `px-2.5 py-1 text-[11px] font-semibold rounded transition-all duration-150 ${props.viewMode === m ? "bg-indigo-600 text-white shadow shadow-indigo-500/25" : "text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"}`;
  return ssr(_tmpl$$2, ssrHydrationKey(), escape(props.label), ssrAttribute("class", escape(modeBtnCls("text"), true), false), ssrAttribute("class", escape(modeBtnCls("tree"), true), false), ssrAttribute("class", escape(modeBtnCls("table"), true), false), ssrAttribute("title", props.side === "left" ? "Copy to Right \u2192" : "\u2190 Copy to Left", false), props.side === "left" ? "\u2192 Copy" : "\u2190 Copy", escape(props.charCount.toLocaleString()));
}
const defaultJson = '{\n  "name": "ZeroJSON",\n  "version": "1.0.0",\n  "features": ["validate", "format", "diff"]\n}';
function JsonEditor() {
  const [leftInput, setLeftInput] = createSignal(defaultJson);
  const [rightInput, setRightInput] = createSignal("");
  const [leftViewMode, setLeftViewMode] = createSignal("text");
  const [rightViewMode, setRightViewMode] = createSignal("text");
  const [leftWidth, setLeftWidth] = createSignal(50);
  const [isDiffMode, setIsDiffMode] = createSignal(false);
  const [isFullscreen, setIsFullscreen] = createSignal(false);
  const [statusMsg, setStatusMsg] = createSignal(null);
  let worker;
  const showStatus = (ok, text) => {
    setStatusMsg({
      ok,
      text
    });
    setTimeout(() => setStatusMsg(null), 3500);
  };
  onMount(() => {
    worker = createJsonWorker();
    worker.onmessage = (ev) => {
      const {
        success,
        formatted,
        error,
        _reqType
      } = ev.data;
      if (success) {
        if (_reqType === "left") setLeftInput(formatted);
        if (_reqType === "right") setRightInput(formatted);
        showStatus(true, _reqType === "left" ? "Left panel formatted" : "Right panel formatted");
      } else {
        showStatus(false, error);
      }
    };
    const fsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", fsChange);
    onCleanup(() => {
      worker == null ? void 0 : worker.terminate();
      document.removeEventListener("fullscreenchange", fsChange);
    });
  });
  const formatPanel = (side) => {
    const data = side === "left" ? leftInput() : rightInput();
    if (!data.trim()) return;
    worker == null ? void 0 : worker.postMessage({
      type: "format",
      data,
      _reqType: side
    });
  };
  const minifyPanel = (side) => {
    const data = side === "left" ? leftInput() : rightInput();
    if (!data.trim()) return;
    worker == null ? void 0 : worker.postMessage({
      type: "minify",
      data,
      _reqType: side
    });
  };
  const handleResize = (deltaX) => {
    setLeftWidth((prev) => Math.min(90, Math.max(10, prev + deltaX / window.innerWidth * 100)));
  };
  const diffLines = createMemo(() => {
    if (!isDiffMode()) return [];
    return computeDiff(leftInput(), rightInput());
  });
  const diffStats = createMemo(() => ({
    added: diffLines().filter((l) => l.type === "added").length,
    removed: diffLines().filter((l) => l.type === "removed").length
  }));
  return ssr(_tmpl$7$1, ssrHydrationKey(), `flex flex-col w-full bg-slate-50 dark:bg-[#0b1120] ${isFullscreen() ? "h-screen fixed inset-0 z-50" : "h-[calc(100vh-67px)]"}`, escape(createComponent(FolderOpenIcon, {})), escape(createComponent(FileIcon, {})), escape(createComponent(SaveIcon, {})), escape(createComponent(SaveIcon, {})), `flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-all shadow-sm ${isDiffMode() ? "bg-amber-500 text-white border-amber-600" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-amber-400 hover:text-amber-600"}`, escape(createComponent(CompareIcon, {})), isDiffMode() ? "Diff ON" : "Diff", escape(createComponent(Show, {
    get when() {
      return isDiffMode();
    },
    get children() {
      return [ssr(_tmpl$2$2, ssrHydrationKey(), escape(diffStats().added)), ssr(_tmpl$3$2, ssrHydrationKey(), escape(diffStats().removed))];
    }
  })), escape(createComponent(Show, {
    get when() {
      return statusMsg();
    },
    get children() {
      return ssr(_tmpl$4$2, ssrHydrationKey(), `flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium ml-2 ${statusMsg().ok ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800" : "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800"}`, statusMsg().ok ? escape(createComponent(CheckIcon, {})) : escape(createComponent(XIcon, {})), escape(statusMsg().text));
    }
  })), escape(createComponent(CopyIcon, {})), escape(createComponent(CopyIcon, {})), ssrAttribute("title", isFullscreen() ? "Exit fullscreen" : "Fullscreen", false), escape(createComponent(FullScreenIcon, {})), escape(createComponent(Show, {
    get when() {
      return isDiffMode();
    },
    get children() {
      return ssr(_tmpl$5$2, ssrHydrationKey(), escape(diffStats().added), escape(diffStats().removed));
    }
  })), escape(createComponent(Show, {
    get when() {
      return isDiffMode();
    },
    get fallback() {
      return ssr(_tmpl$8, ssrHydrationKey(), ssrStyleProperty("width:", `${escape(leftWidth(), true)}%`), escape(createComponent(PanelHeader, {
        label: "Left",
        side: "left",
        get viewMode() {
          return leftViewMode();
        },
        onViewMode: setLeftViewMode,
        onFormat: () => formatPanel("left"),
        onMinify: () => minifyPanel("left"),
        onCopyTo: () => setRightInput(leftInput()),
        get charCount() {
          return leftInput().length;
        }
      })), escape(createComponent(PretextEditor, {
        get value() {
          return leftInput();
        },
        onChange: setLeftInput,
        get mode() {
          return leftViewMode();
        }
      })), escape(createComponent(ResizableSplitter, {
        onResize: handleResize
      })), escape(createComponent(PanelHeader, {
        label: "Right",
        side: "right",
        get viewMode() {
          return rightViewMode();
        },
        onViewMode: setRightViewMode,
        onFormat: () => formatPanel("right"),
        onMinify: () => minifyPanel("right"),
        onCopyTo: () => setLeftInput(rightInput()),
        get charCount() {
          return rightInput().length;
        }
      })), escape(createComponent(PretextEditor, {
        get value() {
          return rightInput();
        },
        onChange: setRightInput,
        get mode() {
          return rightViewMode();
        }
      })));
    },
    get children() {
      return ssr(_tmpl$6$2, ssrHydrationKey(), escape(createComponent(SideBySideDiff, {
        get lines() {
          return diffLines();
        }
      })));
    }
  })));
}
var _tmpl$$1 = ["<span", ' class="', '">', "</span>"], _tmpl$2$1 = ["<span", ' class="ml-auto text-[10px] text-slate-400 font-mono">', "</span>"], _tmpl$3$1 = ["<pre", ' class="p-4 font-mono text-[13px] text-slate-300 leading-[22px] whitespace-pre overflow-auto h-full">', "</pre>"], _tmpl$4$1 = ["<div", ' class="flex flex-col h-full gap-0 min-h-0"><div class="flex items-center gap-2 flex-wrap pb-3"><button', '><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14,2 14,8 20,8"></polyline></svg>Open JSON</button><button', '><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3,6 5,6 21,6"></polyline><path d="M19,6l-1,14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5,6"></path></svg>Clear</button><!--$-->', '<!--/--><div class="ml-auto flex items-center gap-1.5"><!--$-->', "<!--/--><button", '><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7,10 12,15 17,10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>Download</button><button', '><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg><!--$-->', '<!--/--></button></div></div><div class="flex border-b border-slate-200 dark:border-slate-800 mb-3 gap-1">', '</div><div class="flex flex-1 min-h-0 gap-4"><div class="flex flex-col flex-1 min-w-0 min-h-0 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm"><div class="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800"><span class="w-2 h-2 rounded-full bg-amber-400"></span><span class="text-[11px] font-bold text-slate-500 uppercase tracking-widest">JSON Input</span></div><div class="flex-1 min-h-0">', '</div></div><div class="flex flex-col flex-1 min-w-0 min-h-0 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm"><div class="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800"><span class="', '"></span><span class="text-[11px] font-bold text-slate-500 uppercase tracking-widest"><!--$-->', "<!--/--> Output</span><!--$-->", '<!--/--></div><div class="flex-1 min-h-0 overflow-auto bg-[#0d1117]">', "</div></div></div></div>"], _tmpl$5$1 = ["<label", ' class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border cursor-pointer select-none transition-all bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-300"><input type="checkbox"', ' class="accent-indigo-500 w-3.5 h-3.5"><!--$-->', "<!--/--></label>"], _tmpl$6$1 = ["<button", ">", "</button>"], _tmpl$7 = ["<div", ' class="flex items-center justify-center h-full text-slate-600 text-sm">', "</div>"];
const DEFAULT_JSON = `{
  "user": {
    "id": 1,
    "name": "Alice",
    "email": "alice@example.com",
    "createdAt": "2024-01-15T10:30:00Z",
    "isPremium": false,
    "score": 98.5,
    "tags": ["admin", "editor"],
    "address": {
      "street": "123 Main St",
      "city": "Montreal",
      "zip": "H1A 1A1"
    }
  }
}`;
function TabbedConversionTool(props) {
  var _a, _b, _c, _d, _e, _f, _g;
  const [inputJson, setInputJson] = createSignal((_a = props.defaultJson) != null ? _a : DEFAULT_JSON);
  const [activeTab, setActiveTab] = createSignal((_c = (_b = props.tabs[0]) == null ? void 0 : _b.id) != null ? _c : "");
  const [opts, setOpts] = createSignal({});
  const [copied, setCopied] = createSignal(false);
  const [output, setOutput] = createSignal("");
  const [converting, setConverting] = createSignal(false);
  const currentTab = createMemo(() => props.tabs.find((t) => t.id === activeTab()));
  const parseResult = createMemo(() => {
    const raw = inputJson().trim();
    if (!raw) return {
      ok: false,
      error: ""
    };
    try {
      return {
        ok: true,
        data: JSON.parse(raw)
      };
    } catch (e) {
      return {
        ok: false,
        error: e.message
      };
    }
  });
  const runConvert = async () => {
    const tab = currentTab();
    const parsed = parseResult();
    if (!tab || !parsed.ok) {
      setOutput(parsed.ok ? "" : parsed.error ? `// JSON error:
// ${parsed.error}` : "");
      return;
    }
    setConverting(true);
    try {
      const result = await tab.convert(parsed.data, opts());
      setOutput(typeof result === "string" ? result : "");
    } catch (e) {
      setOutput(`// Conversion error:
// ${e.message}`);
    } finally {
      setConverting(false);
    }
  };
  createMemo(() => {
    activeTab();
    inputJson();
    JSON.stringify(opts());
    runConvert();
  });
  const getOpt = (id) => {
    var _a2, _b2, _c2, _d2;
    const tab = currentTab();
    const def = (_c2 = (_b2 = (_a2 = tab == null ? void 0 : tab.options) == null ? void 0 : _a2.find((o) => o.id === id)) == null ? void 0 : _b2.default) != null ? _c2 : false;
    return (_d2 = opts()[id]) != null ? _d2 : def;
  };
  const btn = (active = false, color = "default") => {
    const base = "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-150 shadow-sm";
    if (color === "primary") return `${base} bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-700`;
    if (active) return `${base} bg-indigo-600 text-white border-indigo-700`;
    return `${base} bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:text-indigo-600`;
  };
  const tabCls = (id) => `px-4 py-2 text-[12px] font-semibold border-b-2 transition-colors cursor-pointer select-none ${activeTab() === id ? "border-indigo-500 text-indigo-600 dark:text-indigo-400" : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`;
  const langColor = {
    typescript: "bg-blue-400",
    zod: "bg-indigo-400",
    go: "bg-cyan-400",
    rust: "bg-orange-400",
    sql: "bg-purple-400",
    csv: "bg-green-400",
    excel: "bg-emerald-400",
    "json-schema": "bg-yellow-400",
    openapi: "bg-pink-400"
  };
  return ssr(_tmpl$4$1, ssrHydrationKey(), ssrAttribute("class", escape(btn(), true), false), ssrAttribute("class", escape(btn(), true), false), escape(createComponent(For, {
    get each() {
      var _a2, _b2;
      return (_b2 = (_a2 = currentTab()) == null ? void 0 : _a2.options) != null ? _b2 : [];
    },
    children: (opt) => ssr(_tmpl$5$1, ssrHydrationKey(), ssrAttribute("checked", getOpt(opt.id), true), escape(opt.label))
  })), escape(createComponent(Show, {
    get when() {
      return inputJson().trim();
    },
    get children() {
      return ssr(_tmpl$$1, ssrHydrationKey(), `px-2 py-1 text-[10px] font-bold rounded-full border ${parseResult().ok ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 border-emerald-200 dark:border-emerald-800" : "bg-red-50 dark:bg-red-950/30 text-red-600 border-red-200 dark:border-red-800"}`, parseResult().ok ? "\u2713 Valid JSON" : "\u2715 Invalid JSON");
    }
  })), ssrAttribute("class", escape(btn(), true), false), ssrAttribute("class", copied() ? escape(btn(true, "primary"), true) : escape(btn(), true), false), copied() ? "Copied!" : "Copy", escape(createComponent(For, {
    get each() {
      return props.tabs;
    },
    children: (tab) => ssr(_tmpl$6$1, ssrHydrationKey() + ssrAttribute("class", escape(tabCls(tab.id), true), false), escape(tab.label))
  })), escape(createComponent(TextView, {
    get value() {
      return inputJson();
    },
    onChange: setInputJson
  })), `w-2 h-2 rounded-full ${(_f = escape(langColor[(_e = (_d = currentTab()) == null ? void 0 : _d.lang) != null ? _e : ""], true)) != null ? _f : "bg-slate-400"}`, escape((_g = currentTab()) == null ? void 0 : _g.label), escape(createComponent(Show, {
    get when() {
      return output();
    },
    get children() {
      return ssr(_tmpl$2$1, ssrHydrationKey(), converting() ? "\u27F3 converting\u2026" : `${escape(output().split("\n").length)} lines`);
    }
  })), escape(createComponent(Show, {
    get when() {
      return output();
    },
    get fallback() {
      return ssr(_tmpl$7, ssrHydrationKey(), parseResult().ok ? "Loading\u2026" : "Paste valid JSON on the left");
    },
    get children() {
      return ssr(_tmpl$3$1, ssrHydrationKey(), escape(output()));
    }
  })));
}
function toPascalCase(s) {
  return s.replace(/(^|[-_ ])(.)/g, (_, __, c) => c.toUpperCase()).replace(/[^a-zA-Z0-9]/g, "") || "Root";
}
function toCamelCase(s) {
  const p = toPascalCase(s);
  return p.charAt(0).toLowerCase() + p.slice(1);
}
function toSnakeCase(s) {
  return s.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "").replace(/[^a-z0-9_]/g, "_").replace(/__+/g, "_");
}
function collectTsInterfaces(name, value, interfaces, seen) {
  if (value === null || typeof value !== "object") return inferTsPrimitive(value);
  if (Array.isArray(value)) {
    if (!value.length) return "unknown[]";
    const first = value[0];
    if (first !== null && typeof first === "object" && !Array.isArray(first)) {
      const childName = toPascalCase(name.replace(/s$/, ""));
      collectTsInterfaces(childName, first, interfaces, seen);
      return `${childName}[]`;
    }
    const types = [...new Set(value.map((i) => inferTsPrimitive(i)))];
    return types.length === 1 ? `${types[0]}[]` : `(${types.join(" | ")})[]`;
  }
  if (seen.has(value)) return name;
  seen.add(value);
  const fields = Object.entries(value).map(([k, v]) => {
    const safe = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : `"${k}"`;
    return `  ${safe}: ${collectTsInterfaces(toPascalCase(k), v, interfaces, seen)};`;
  });
  interfaces.set(name, `export interface ${name} {
${fields.join("\n")}
}`);
  return name;
}
function inferTsPrimitive(v) {
  if (v === null) return "null";
  if (typeof v === "boolean") return "boolean";
  if (typeof v === "number") return "number";
  if (typeof v === "string") return "string";
  return "unknown";
}
function jsonToTypeScript(json, rootName = "Root") {
  const interfaces = /* @__PURE__ */ new Map();
  collectTsInterfaces(toPascalCase(rootName), json, interfaces, /* @__PURE__ */ new WeakSet());
  if (!interfaces.size) return `export type ${toPascalCase(rootName)} = ${inferTsPrimitive(json)};`;
  return [...interfaces.values()].join("\n\n");
}
function zodExpr(val, depth, schemas, name) {
  if (val === null) return "z.null()";
  if (typeof val === "boolean") return "z.boolean()";
  if (typeof val === "number") return Number.isInteger(val) ? "z.number().int()" : "z.number()";
  if (typeof val === "string") {
    if (/^\d{4}-\d{2}-\d{2}T/.test(val)) return "z.string().datetime()";
    if (/^[\w.+-]+@[\w-]+\.\w+$/.test(val)) return "z.string().email()";
    if (/^https?:\/\//.test(val)) return "z.string().url()";
    return "z.string()";
  }
  if (Array.isArray(val)) {
    if (!val.length) return "z.array(z.unknown())";
    const first = zodExpr(val[0], depth, schemas, name.replace(/s$/, ""));
    return `z.array(${first})`;
  }
  if (typeof val === "object") {
    const schemaName = `${toCamelCase(name)}Schema`;
    const pad = "  ".repeat(depth + 1);
    const fields = Object.entries(val).map(([k, v]) => `${pad}${k}: ${zodExpr(v, depth + 1, schemas, k)}`).join(",\n");
    const expr = `z.object({
${fields}
${"  ".repeat(depth)}})`;
    schemas.set(schemaName, `export const ${schemaName} = ${expr};`);
    return schemaName;
  }
  return "z.unknown()";
}
function jsonToZod(json, rootName = "Root") {
  const schemas = /* @__PURE__ */ new Map();
  const rootSchemaName = `${toCamelCase(rootName)}Schema`;
  const rootExpr = zodExpr(json, 0, schemas, rootName);
  const typeExport = `export type ${toPascalCase(rootName)} = z.infer<typeof ${rootSchemaName}>;`;
  const header = `import { z } from "zod";
`;
  if (!schemas.has(rootSchemaName)) {
    return `${header}
export const ${rootSchemaName} = ${rootExpr};

${typeExport}`;
  }
  return `${header}
${[...schemas.values()].join("\n\n")}

${typeExport}`;
}
function goType(val, fieldName, structs, seen) {
  if (val === null) return "interface{}";
  if (typeof val === "boolean") return "bool";
  if (typeof val === "number") return Number.isInteger(val) ? "int64" : "float64";
  if (typeof val === "string") {
    if (/^\d{4}-\d{2}-\d{2}/.test(val)) return "time.Time";
    return "string";
  }
  if (Array.isArray(val)) {
    if (!val.length) return "[]interface{}";
    return `[]${goType(val[0], fieldName.replace(/s$/, ""), structs, seen)}`;
  }
  if (typeof val === "object") {
    if (seen.has(val)) return toPascalCase(fieldName);
    seen.add(val);
    const structName = toPascalCase(fieldName);
    const fields = Object.entries(val).map(([k, v]) => {
      const fName = toPascalCase(k);
      const fType = goType(v, k, structs, seen);
      return `	${fName} ${fType} \`json:"${k}" yaml:"${k}"\``;
    });
    structs.set(structName, `type ${structName} struct {
${fields.join("\n")}
}`);
    return structName;
  }
  return "interface{}";
}
function jsonToGo(json, rootName = "Root", pkgName = "main") {
  const structs = /* @__PURE__ */ new Map();
  goType(json, rootName, structs, /* @__PURE__ */ new WeakSet());
  const needsTime = [...structs.values()].some((s) => s.includes("time.Time"));
  const imports = needsTime ? `import (
	"time"
)

` : "";
  return `package ${pkgName}

${imports}${[...structs.values()].reverse().join("\n\n")}`;
}
function rustType(val, fieldName, structs, seen) {
  if (val === null) return "Option<serde_json::Value>";
  if (typeof val === "boolean") return "bool";
  if (typeof val === "number") return Number.isInteger(val) ? "i64" : "f64";
  if (typeof val === "string") {
    if (/^\d{4}-\d{2}-\d{2}T/.test(val)) return "String";
    return "String";
  }
  if (Array.isArray(val)) {
    if (!val.length) return "Vec<serde_json::Value>";
    return `Vec<${rustType(val[0], fieldName.replace(/s$/, ""), structs, seen)}>`;
  }
  if (typeof val === "object") {
    if (seen.has(val)) return toPascalCase(fieldName);
    seen.add(val);
    const structName = toPascalCase(fieldName);
    const fields = Object.entries(val).map(([k, v]) => {
      const snakeName = toSnakeCase(k);
      const fType = rustType(v, k, structs, seen);
      const nullable = v === null ? `Option<${fType.replace("Option<serde_json::Value>", "serde_json::Value")}>` : fType;
      const rename = snakeName !== k ? `    #[serde(rename = "${k}")]
` : "";
      return `${rename}    pub ${snakeName}: ${nullable},`;
    });
    const struct = `#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ${structName} {
${fields.join("\n")}
}`;
    structs.set(structName, struct);
    return structName;
  }
  return "serde_json::Value";
}
function jsonToRust(json, rootName = "Root") {
  const structs = /* @__PURE__ */ new Map();
  rustType(json, rootName, structs, /* @__PURE__ */ new WeakSet());
  return `use serde::{Deserialize, Serialize};

${[...structs.values()].reverse().join("\n\n")}`;
}
function jsonSchemaFor(val) {
  if (val === null) return {
    type: "null"
  };
  if (typeof val === "boolean") return {
    type: "boolean"
  };
  if (typeof val === "number") return Number.isInteger(val) ? {
    type: "integer"
  } : {
    type: "number"
  };
  if (typeof val === "string") {
    if (/^\d{4}-\d{2}-\d{2}T/.test(val)) return {
      type: "string",
      format: "date-time"
    };
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return {
      type: "string",
      format: "date"
    };
    if (/^[\w.+-]+@[\w-]+\.\w+$/.test(val)) return {
      type: "string",
      format: "email"
    };
    if (/^https?:\/\//.test(val)) return {
      type: "string",
      format: "uri"
    };
    return {
      type: "string"
    };
  }
  if (Array.isArray(val)) {
    if (!val.length) return {
      type: "array"
    };
    const itemSchema = jsonSchemaFor(val[0]);
    return {
      type: "array",
      items: itemSchema
    };
  }
  if (typeof val === "object") {
    const properties = {};
    const required = [];
    for (const [k, v] of Object.entries(val)) {
      properties[k] = jsonSchemaFor(v);
      if (v !== null && v !== void 0) required.push(k);
    }
    return {
      type: "object",
      properties,
      ...required.length ? {
        required
      } : {}
    };
  }
  return {};
}
function jsonToJsonSchema(json, title = "Schema") {
  const schema = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    title,
    ...jsonSchemaFor(json)
  };
  return JSON.stringify(schema, null, 2);
}
function openApiSchemaFor(val, defs, name) {
  if (val === null) return {
    nullable: true,
    type: "string"
  };
  if (typeof val === "boolean") return {
    type: "boolean"
  };
  if (typeof val === "number") return Number.isInteger(val) ? {
    type: "integer",
    example: val
  } : {
    type: "number",
    example: val
  };
  if (typeof val === "string") {
    if (/^\d{4}-\d{2}-\d{2}T/.test(val)) return {
      type: "string",
      format: "date-time",
      example: val
    };
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return {
      type: "string",
      format: "date",
      example: val
    };
    if (/^[\w.+-]+@[\w-]+\.\w+$/.test(val)) return {
      type: "string",
      format: "email",
      example: val
    };
    if (/^https?:\/\//.test(val)) return {
      type: "string",
      format: "uri",
      example: val
    };
    return {
      type: "string",
      example: val
    };
  }
  if (Array.isArray(val)) {
    if (!val.length) return {
      type: "array",
      items: {}
    };
    return {
      type: "array",
      items: openApiSchemaFor(val[0], defs, name.replace(/s$/, ""))
    };
  }
  if (typeof val === "object") {
    const schemaName = toPascalCase(name);
    const properties = {};
    const required = [];
    for (const [k, v] of Object.entries(val)) {
      properties[k] = openApiSchemaFor(v, defs, k);
      if (v !== null) required.push(k);
    }
    const schema = {
      type: "object",
      properties,
      ...required.length ? {
        required
      } : {}
    };
    defs.set(schemaName, schema);
    return {
      $ref: `#/components/schemas/${schemaName}`
    };
  }
  return {};
}
function toYaml(val, indent = 0) {
  const pad = "  ".repeat(indent);
  if (val === null) return "null";
  if (typeof val === "boolean") return String(val);
  if (typeof val === "number") return String(val);
  if (typeof val === "string") {
    if (/[:{}\[\],&*#?|<>=!%@`\n]/.test(val) || val.trim() !== val) return JSON.stringify(val);
    return val;
  }
  if (Array.isArray(val)) {
    if (!val.length) return "[]";
    return val.map((item) => `
${pad}- ${toYaml(item, indent + 1)}`).join("");
  }
  if (typeof val === "object") {
    const entries = Object.entries(val);
    if (!entries.length) return "{}";
    return entries.map(([k, v]) => {
      const yamlVal = toYaml(v, indent + 1);
      const isBlock = typeof v === "object" && v !== null && !Array.isArray(v) && Object.keys(v).length > 0;
      return `
${pad}${k}:${isBlock ? yamlVal : ` ${yamlVal}`}`;
    }).join("");
  }
  return String(val);
}
function jsonToOpenApi(json, title = "Generated API", asYaml = true) {
  const defs = /* @__PURE__ */ new Map();
  const rootRef = openApiSchemaFor(json, defs, "Root");
  const schemas = {};
  for (const [k, v] of defs) schemas[k] = v;
  const spec = {
    openapi: "3.0.3",
    info: {
      title,
      version: "1.0.0",
      description: "Auto-generated from JSON sample"
    },
    paths: {
      "/items": {
        get: {
          summary: "Retrieve items",
          operationId: "getItems",
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: rootRef
                }
              }
            }
          }
        },
        post: {
          summary: "Create item",
          operationId: "createItem",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: rootRef
              }
            }
          },
          responses: {
            "201": {
              description: "Created",
              content: {
                "application/json": {
                  schema: rootRef
                }
              }
            }
          }
        }
      }
    },
    components: {
      schemas
    }
  };
  if (!asYaml) return JSON.stringify(spec, null, 2);
  return `# OpenAPI 3.0 \u2014 generated from JSON
# Edit title and paths as needed
${toYaml(spec).slice(1)}`;
}
function sqlColType(val) {
  if (val === null) return "TEXT";
  if (typeof val === "boolean") return "BOOLEAN";
  if (typeof val === "number") return Number.isInteger(val) ? "INTEGER" : "REAL";
  if (typeof val === "string") {
    if (/^\d{4}-\d{2}-\d{2}(T|$)/.test(val)) return "TIMESTAMP";
    return val.length > 255 ? "TEXT" : "VARCHAR(255)";
  }
  return "JSONB";
}
function sqlEscape(val) {
  if (val === null) return "NULL";
  if (typeof val === "boolean") return val ? "TRUE" : "FALSE";
  if (typeof val === "number") return String(val);
  if (typeof val === "object") return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
  return `'${String(val).replace(/'/g, "''")}'`;
}
function generateTable(tableName, obj, tables, fk, dataRows) {
  const snakeName = toSnakeCase(tableName);
  const cols = [`  id SERIAL PRIMARY KEY`];
  if (fk) cols.push(`  ${toSnakeCase(fk)}_id INTEGER REFERENCES ${toSnakeCase(fk)}(id)`);
  const allRows = dataRows != null ? dataRows : [obj];
  for (const [key, value] of Object.entries(obj)) {
    const col = toSnakeCase(key);
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      const childRows = allRows.map((r) => {
        var _a;
        return (_a = r[key]) != null ? _a : {};
      }).filter(Boolean).slice(0, 10);
      generateTable(`${tableName}_${toPascalCase(key)}`, value, tables, snakeName, childRows);
      cols.push(`  ${col}_id INTEGER REFERENCES ${toSnakeCase(`${tableName}_${toPascalCase(key)}`)}(id)`);
    } else if (Array.isArray(value)) {
      const first = value[0];
      if (first !== null && typeof first === "object" && !Array.isArray(first)) {
        const childRows = [];
        for (const r of allRows) {
          const arr = r[key] || [];
          for (const item of arr) {
            if (item !== null && typeof item === "object" && !Array.isArray(item)) {
              childRows.push(item);
              if (childRows.length >= 10) break;
            }
          }
          if (childRows.length >= 10) break;
        }
        generateTable(`${tableName}_${toPascalCase(key)}`, first, tables, snakeName, childRows);
      } else {
        cols.push(`  ${col} JSONB -- array`);
      }
    } else {
      const nullable = value === null ? "" : " NOT NULL";
      cols.push(`  ${col} ${sqlColType(value)}${nullable}`);
    }
  }
  const ddl = `CREATE TABLE IF NOT EXISTS ${snakeName} (
${cols.join(",\n")}
);`;
  tables.push({
    ddl,
    tableName: snakeName,
    rows: allRows
  });
}
function jsonToSql(json, rootName = "table", includeInserts = false) {
  const tables = [];
  if (json === null || typeof json !== "object") {
    return `-- Cannot generate schema from a primitive value (${JSON.stringify(json)})`;
  }
  let source;
  let dataRows = [];
  if (Array.isArray(json)) {
    if (!json.length) return "-- Empty array";
    const first = json[0];
    if (typeof first !== "object" || first === null || Array.isArray(first)) {
      return `CREATE TABLE ${toSnakeCase(rootName)} (
  id SERIAL PRIMARY KEY,
  value TEXT NOT NULL
);`;
    }
    source = first;
    dataRows = includeInserts ? json.slice(0, 10) : [];
  } else {
    source = json;
    dataRows = includeInserts ? [source] : [];
  }
  generateTable(toPascalCase(rootName), source, tables, void 0, dataRows);
  const lines = [`-- Generated SQL Schema`, `-- Dialect: PostgreSQL (adjust for MySQL/SQLite)`, `-- Generated: ${(/* @__PURE__ */ new Date()).toISOString()}`, ``];
  const MAX_INSERTS = 10;
  for (const t of tables.reverse()) {
    lines.push(t.ddl);
    if (includeInserts && t.rows.length > 0) {
      lines.push("");
      const sampleRows = t.rows.slice(0, MAX_INSERTS);
      const tableSource = sampleRows[0] ? Object.keys(sampleRows[0]) : [];
      for (const row of sampleRows) {
        const cols = tableSource.filter((k) => {
          const v = row[k];
          return !(v !== null && typeof v === "object" && !Array.isArray(v));
        });
        if (!cols.length) continue;
        const colNames = cols.map(toSnakeCase).join(", ");
        const vals = cols.map((k) => sqlEscape(row[k])).join(", ");
        lines.push(`INSERT INTO ${t.tableName} (${colNames}) VALUES (${vals});`);
      }
    }
    lines.push("");
  }
  return lines.join("\n");
}
function flattenObject(obj, prefix = "") {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === "object" && !Array.isArray(v)) {
      Object.assign(out, flattenObject(v, key));
    } else if (Array.isArray(v)) {
      out[key] = JSON.stringify(v);
    } else {
      out[key] = v === null ? "" : String(v);
    }
  }
  return out;
}
function csvEscape(val) {
  if (/[",\n\r]/.test(val)) return `"${val.replace(/"/g, '""')}"`;
  return val;
}
function jsonToCsv(json) {
  const rows = Array.isArray(json) ? json : [json];
  if (!rows.length || typeof rows[0] !== "object" || rows[0] === null) {
    return "value\n" + rows.map((r) => csvEscape(String(r))).join("\n");
  }
  const flat = rows.map((r) => flattenObject(r));
  const headers = [...new Set(flat.flatMap((r) => Object.keys(r)))];
  const headerLine = headers.map(csvEscape).join(",");
  const dataLines = flat.map((row) => headers.map((h) => {
    var _a;
    return csvEscape((_a = row[h]) != null ? _a : "");
  }).join(","));
  return [headerLine, ...dataLines].join("\n");
}
async function jsonToExcelBlob(json) {
  const XLSX = await import('./xlsx.mjs').then(function (n) { return n.x; });
  const rows = Array.isArray(json) ? json : [json];
  const flat = rows.map((r) => typeof r === "object" && r !== null ? flattenObject(r) : {
    value: r
  });
  const ws = XLSX.utils.json_to_sheet(flat);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Data");
  if (!Array.isArray(json) && typeof json === "object" && json !== null) {
    for (const [key, val] of Object.entries(json)) {
      if (Array.isArray(val) && val.length && typeof val[0] === "object") {
        const subFlat = val.map((r) => flattenObject(r));
        const subWs = XLSX.utils.json_to_sheet(subFlat);
        XLSX.utils.book_append_sheet(wb, subWs, key.slice(0, 31));
      }
    }
  }
  const buffer = XLSX.write(wb, {
    bookType: "xlsx",
    type: "array"
  });
  return new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });
}
var _tmpl$ = ["<header", ' class="mb-6"><div class="flex items-center gap-3 mb-2"><div class="w-10 h-10 bg-indigo-50 dark:bg-indigo-950 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400">', '</div><h1 class="text-2xl font-bold text-slate-900 dark:text-white">', '</h1></div><p class="text-slate-600 dark:text-slate-400 max-w-2xl">', "</p></header>"], _tmpl$2 = ["<div", ' class="p-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-center"><p class="text-slate-500 dark:text-slate-400">Tool coming soon\u2026</p></div>'], _tmpl$3 = ["<div", ' class="flex-grow flex flex-col min-h-0">', "</div>"], _tmpl$4 = ["<div", ' class="mt-8 p-6 bg-slate-100 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 text-center"><p class="text-xs text-slate-400 uppercase tracking-wide mb-1">Advertisement</p><p class="text-slate-500 text-sm">Ad space \u2014 privacy-respecting ads only</p></div>'], _tmpl$5 = ["<div", ' class="', '">', "</div>"], _tmpl$6 = ["<div", ' class="text-center py-20"><h1 class="text-2xl font-bold text-slate-900 dark:text-white">Tool not found</h1><p class="mt-4 text-slate-600 dark:text-slate-400">The tool you are looking for does not exist.</p><a href="/" class="mt-8 inline-block text-indigo-600 dark:text-indigo-400 font-medium hover:underline">Go back home</a></div>'];
const id$$ = "src/routes/t/[toolId].tsx?pick=default&pick=$css";
const iconMap = {
  lock: LockIcon,
  format: FormatIcon,
  code: FormatIcon,
  database: LockIcon,
  file: LockIcon
};
const FULLBLEED = /* @__PURE__ */ new Set(["json-formatter"]);
const CODE_TABS = [{
  id: "typescript",
  label: "TypeScript",
  lang: "typescript",
  downloadExt: "ts",
  convert: (json) => jsonToTypeScript(json, "Root")
}, {
  id: "zod",
  label: "Zod",
  lang: "zod",
  downloadExt: "ts",
  convert: (json) => jsonToZod(json, "Root")
}, {
  id: "go",
  label: "Go",
  lang: "go",
  downloadExt: "go",
  convert: (json) => jsonToGo(json, "Root", "main")
}, {
  id: "rust",
  label: "Rust",
  lang: "rust",
  downloadExt: "rs",
  convert: (json) => jsonToRust(json, "Root")
}];
const DATA_TABS = [{
  id: "sql",
  label: "SQL",
  lang: "sql",
  downloadExt: "sql",
  options: [{
    id: "inserts",
    label: "Include INSERT statements",
    default: false
  }],
  convert: (json, opts) => {
    var _a;
    return jsonToSql(json, "table", (_a = opts["inserts"]) != null ? _a : false);
  }
}, {
  id: "csv",
  label: "CSV",
  lang: "csv",
  downloadExt: "csv",
  convert: (json) => jsonToCsv(json)
}, {
  id: "excel",
  label: "Excel",
  lang: "excel",
  downloadExt: "xlsx",
  convert: (_) => "-- Excel: use the Download button to get the .xlsx file",
  binaryDownload: (json) => jsonToExcelBlob(json)
}];
const SPEC_TABS = [{
  id: "jsonschema",
  label: "JSON Schema",
  lang: "json-schema",
  downloadExt: "json",
  convert: (json) => jsonToJsonSchema(json, "Schema")
}, {
  id: "openapi",
  label: "OpenAPI 3.0",
  lang: "openapi",
  downloadExt: "yaml",
  options: [{
    id: "json",
    label: "Output as JSON instead of YAML",
    default: false
  }],
  convert: (json, opts) => {
    var _a;
    return jsonToOpenApi(json, "Generated API", !((_a = opts["json"]) != null ? _a : false));
  }
}];
function ToolPage() {
  const params = useParams();
  const tool = () => TOOLS_REGISTRY[params.toolId];
  const isFullBleed = () => {
    var _a;
    return FULLBLEED.has((_a = params.toolId) != null ? _a : "");
  };
  const IconComponent = () => {
    var _a, _b, _c;
    return (_c = iconMap[(_b = (_a = tool()) == null ? void 0 : _a.icon) != null ? _b : "lock"]) != null ? _c : LockIcon;
  };
  return ssr(_tmpl$5, ssrHydrationKey(), `flex-grow flex flex-col ${isFullBleed() ? "" : "p-6 max-w-7xl mx-auto w-full"}`, escape(createComponent(Show, {
    get when() {
      return tool();
    },
    get fallback() {
      return ssr(_tmpl$6, ssrHydrationKey());
    },
    get children() {
      return [createComponent(Title, {
        get children() {
          return [tool().name, " \u2014 ZeroJSON"];
        }
      }), createComponent(Show, {
        get when() {
          return !isFullBleed();
        },
        get children() {
          return ssr(_tmpl$, ssrHydrationKey(), escape(createComponent(IconComponent, {})), escape(tool().name), escape(tool().description));
        }
      }), ssr(_tmpl$3, ssrHydrationKey(), escape(createComponent(Switch, {
        get children() {
          return [createComponent(Match, {
            get when() {
              return params.toolId === "json-formatter";
            },
            get children() {
              return createComponent(JsonEditor, {});
            }
          }), createComponent(Match, {
            get when() {
              return params.toolId === "json-validator";
            },
            get children() {
              return createComponent(JsonValidator, {});
            }
          }), createComponent(Match, {
            get when() {
              return params.toolId === "json-to-code";
            },
            get children() {
              return createComponent(TabbedConversionTool, {
                tabs: CODE_TABS
              });
            }
          }), createComponent(Match, {
            get when() {
              return params.toolId === "json-to-data";
            },
            get children() {
              return createComponent(TabbedConversionTool, {
                tabs: DATA_TABS
              });
            }
          }), createComponent(Match, {
            get when() {
              return params.toolId === "json-to-spec";
            },
            get children() {
              return createComponent(TabbedConversionTool, {
                tabs: SPEC_TABS
              });
            }
          }), createComponent(Match, {
            when: true,
            get children() {
              return ssr(_tmpl$2, ssrHydrationKey());
            }
          })];
        }
      }))), createComponent(Show, {
        get when() {
          return !isFullBleed();
        },
        get children() {
          return ssr(_tmpl$4, ssrHydrationKey());
        }
      })];
    }
  })));
}

export { ToolPage as default, id$$ };
//# sourceMappingURL=_toolId_-BZYqsYZi.mjs.map
