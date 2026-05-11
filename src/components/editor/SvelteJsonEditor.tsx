import { onMount, onCleanup, createEffect } from "solid-js";
import { createJSONEditor } from "vanilla-jsoneditor";
import { isDarkMode } from "~/lib/theme";

// Import the themes
import "vanilla-jsoneditor/themes/jse-theme-dark.css";

interface SvelteJsonEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  mode?: "tree" | "text" | "table";
  validationErrors?: any[];
}

export default function SvelteJsonEditor(props: SvelteJsonEditorProps) {
  let containerRef: HTMLDivElement | undefined;
  let editor: any;
  let isInternalUpdate = false;

  onMount(() => {
    if (!containerRef) return;

    editor = createJSONEditor({
      target: containerRef,
      props: {
        content: {
          text: props.value
        },
        mode: props.mode || "tree",
        readOnly: props.readOnly || false,
        mainMenuBar: true,
        navigationBar: true,
        statusBar: true,
        askToFormat: false,
        validationErrors: props.validationErrors || [],
        onChange: (content: any) => {
          if (props.onChange && !isInternalUpdate) {
            const text = content.text !== undefined ? content.text : JSON.stringify(content.json, null, 2);
            isInternalUpdate = true;
            props.onChange(text);
            setTimeout(() => {
              isInternalUpdate = false;
            }, 10);
          }
        }
      }
    });

    onCleanup(() => {
      if (editor) {
        editor.destroy();
      }
    });
  });

  createEffect(() => {
    if (editor && !isInternalUpdate) {
      editor.updateProps({
        content: { text: props.value },
        mode: props.mode || "tree",
        readOnly: props.readOnly || false,
        validationErrors: props.validationErrors || []
      });
    }
  });

  createEffect(() => {
    const dark = isDarkMode();
    if (containerRef) {
      if (dark) {
        containerRef.classList.add("jse-theme-dark");
      } else {
        containerRef.classList.remove("jse-theme-dark");
      }
    }
  });

  return (
    <div 
      ref={containerRef} 
      class="w-full h-full svelte-jsoneditor-container"
      style={{ 
        /* --- Typography & Basics --- */
        "--jse-font-family": "ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Monaco, Consolas, monospace",
        "--jse-font-size": "13px",
        "--jse-main-border": "none",
        
        /* --- Core Colors --- */
        "--jse-theme-color": "#6366f1", // Indigo 500
        "--jse-theme-color-highlight": isDarkMode() ? "rgba(99, 102, 241, 0.15)" : "rgba(99, 102, 241, 0.1)",
        "--jse-background-color": isDarkMode() ? "#0a0e1a" : "#ffffff",
        "--jse-text-color": isDarkMode() ? "#e2e8f0" : "#0f172a",
        
        /* --- Panels (Menu, Navigation, Gutter) --- */
        "--jse-panel-background": isDarkMode() ? "#111827" : "#f8fafc",
        "--jse-panel-border": isDarkMode() ? "1px solid #1f2937" : "1px solid #e2e8f0",
        "--jse-navigation-bar-background": isDarkMode() ? "#1f2937" : "#f1f5f9",
        
        /* --- JSON Syntax Highlighting (Modern Theme) --- */
        "--jse-key-color": isDarkMode() ? "#818cf8" : "#4f46e5",       // Indigo
        "--jse-value-color-string": isDarkMode() ? "#34d399" : "#059669", // Emerald
        "--jse-value-color-number": isDarkMode() ? "#fbbf24" : "#d97706", // Amber
        "--jse-value-color-boolean": isDarkMode() ? "#f472b6" : "#db2777", // Pink
        "--jse-value-color-null": isDarkMode() ? "#94a3b8" : "#64748b",    // Slate
        
        /* --- Selection & Hover --- */
        "--jse-selection-background-color": isDarkMode() ? "rgba(99, 102, 241, 0.3)" : "rgba(99, 102, 241, 0.15)",
        "--jse-hover-background-color": isDarkMode() ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)",
        "--jse-active-line-background-color": isDarkMode() ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)",
        
        /* --- Modals & Context Menus --- */
        "--jse-modal-background": isDarkMode() ? "#1e293b" : "#ffffff",
        "--jse-context-menu-background": isDarkMode() ? "#1e293b" : "#ffffff",
      }}
    />
  );
}

/* 
  Injecting global CSS overrides for internal components that aren't 
  fully covered by CSS variables.
*/
const styleTag = typeof document !== 'undefined' ? document.createElement('style') : null;
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
