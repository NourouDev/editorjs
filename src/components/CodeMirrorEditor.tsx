import { onMount, onCleanup, createEffect, createSignal } from "solid-js";
import { EditorState, StateField, StateEffect } from "@codemirror/state";
import { EditorView, keymap, lineNumbers, highlightActiveLine, Decoration, gutter, GutterMarker } from "@codemirror/view";
import { json } from "@codemirror/lang-json";
import { defaultKeymap, history, historyKeymap, undo, redo } from "@codemirror/commands";
import { syntaxHighlighting, HighlightStyle } from "@codemirror/language";
import { autocompletion, closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
import { tags } from "@lezer/highlight";
import { search, openSearchPanel, searchKeymap } from "@codemirror/search";
import { linter, Diagnostic, lintGutter } from "@codemirror/lint";

// ─── Light theme ───
const lightHighlightStyle = HighlightStyle.define([
  { tag: tags.string, color: "#16a34a" },
  { tag: tags.number, color: "#d97706" },
  { tag: tags.bool, color: "#dc2626" },
  { tag: tags.null, color: "#9333ea" },
  { tag: tags.propertyName, color: "#2563eb" },
  { tag: tags.punctuation, color: "#64748b" },
  { tag: tags.brace, color: "#475569" },
  { tag: tags.squareBracket, color: "#475569" },
  { tag: tags.separator, color: "#64748b" },
  { tag: tags.keyword, color: "#c026d3" },
  { tag: tags.comment, color: "#94a3b8", fontStyle: "italic" },
  { tag: tags.invalid, color: "#ef4444" },
]);

const lightTheme = EditorView.theme({
  "&": {
    height: "100%",
    fontSize: "13px",
    backgroundColor: "#ffffff",
    color: "#1e293b",
  },
  ".cm-scroller": {
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace",
    overflow: "auto",
  },
  ".cm-content": {
    caretColor: "#4f46e5",
    padding: "12px 0",
  },
  ".cm-cursor, .cm-dropCursor": {
    borderLeftColor: "#4f46e5",
    borderLeftWidth: "2px",
  },
  "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": {
    backgroundColor: "rgba(99, 102, 241, 0.15)",
  },
  ".cm-gutters": {
    backgroundColor: "#f8fafc",
    color: "#94a3b8",
    border: "none",
    borderRight: "1px solid #e2e8f0",
    paddingRight: "4px",
  },
  ".cm-lineNumbers .cm-gutterElement": {
    paddingLeft: "12px",
    paddingRight: "8px",
    minWidth: "40px",
  },
  ".cm-activeLine": {
    backgroundColor: "rgba(99, 102, 241, 0.04)",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "rgba(99, 102, 241, 0.04)",
    color: "#64748b",
  },
  ".cm-matchingBracket": {
    backgroundColor: "rgba(99, 102, 241, 0.15)",
    outline: "1px solid rgba(99, 102, 241, 0.3)",
  },
  ".cm-tooltip": {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    color: "#1e293b",
  },
  ".cm-lintRange-error": {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    outline: "1px solid rgba(239, 68, 68, 0.4)",
  },
  ".cm-diff-added": {
    backgroundColor: "rgba(34, 197, 94, 0.15)",
  },
  ".cm-diff-removed": {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
  },
  ".cm-diff-marker-added": {
    color: "#16a34a",
    fontWeight: "bold",
    paddingLeft: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
  },
  ".cm-diff-marker-removed": {
    color: "#dc2626",
    fontWeight: "bold",
    paddingLeft: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
  },
  ".cm-error-marker": {
    color: "#ef4444",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "16px",
    filter: "drop-shadow(0 0 2px rgba(239, 68, 68, 0.3))",
  },
  ".cm-lint-marker-error": {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: "#ef4444",
    border: "1.5px solid #ffffff",
    boxShadow: "0 0 0 1px #ef4444, 0 0 4px rgba(239, 68, 68, 0.4)",
    cursor: "pointer",
    margin: "4px auto",
    display: "block",
  }
}, { dark: false });

// ─── Dark theme ───
const darkHighlightStyle = HighlightStyle.define([
  { tag: tags.string, color: "#a5d6a7" },
  { tag: tags.number, color: "#ffcc80" },
  { tag: tags.bool, color: "#ef9a9a" },
  { tag: tags.null, color: "#ce93d8" },
  { tag: tags.propertyName, color: "#90caf9" },
  { tag: tags.punctuation, color: "#78909c" },
  { tag: tags.brace, color: "#b0bec5" },
  { tag: tags.squareBracket, color: "#b0bec5" },
  { tag: tags.separator, color: "#78909c" },
  { tag: tags.keyword, color: "#f48fb1" },
  { tag: tags.comment, color: "#546e7a", fontStyle: "italic" },
  { tag: tags.invalid, color: "#ff5252" },
]);

const darkTheme = EditorView.theme({
  "&": {
    height: "100%",
    fontSize: "13px",
    backgroundColor: "#0f172a",
    color: "#e2e8f0",
  },
  ".cm-scroller": {
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace",
    overflow: "auto",
  },
  ".cm-content": {
    caretColor: "#818cf8",
    padding: "12px 0",
  },
  ".cm-cursor, .cm-dropCursor": {
    borderLeftColor: "#818cf8",
    borderLeftWidth: "2px",
  },
  "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": {
    backgroundColor: "rgba(99, 102, 241, 0.3)",
  },
  ".cm-gutters": {
    backgroundColor: "#0f172a",
    color: "#475569",
    border: "none",
    borderRight: "1px solid #1e293b",
    paddingRight: "4px",
  },
  ".cm-lineNumbers .cm-gutterElement": {
    paddingLeft: "12px",
    paddingRight: "8px",
    minWidth: "40px",
  },
  ".cm-activeLine": {
    backgroundColor: "rgba(99, 102, 241, 0.06)",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "rgba(99, 102, 241, 0.06)",
    color: "#94a3b8",
  },
  ".cm-matchingBracket": {
    backgroundColor: "rgba(99, 102, 241, 0.2)",
    outline: "1px solid rgba(99, 102, 241, 0.4)",
  },
  ".cm-tooltip": {
    backgroundColor: "#1e293b",
    border: "1px solid #334155",
    color: "#e2e8f0",
  },
  ".cm-lintRange-error": {
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    outline: "1px solid rgba(239, 68, 68, 0.4)",
  },
  ".cm-diff-added": {
    backgroundColor: "rgba(34, 197, 94, 0.2)",
  },
  ".cm-diff-removed": {
    backgroundColor: "rgba(239, 68, 68, 0.2)",
  },
  ".cm-diff-marker-added": {
    color: "#4ade80",
    fontWeight: "bold",
    paddingLeft: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
  },
  ".cm-diff-marker-removed": {
    color: "#f87171",
    fontWeight: "bold",
    paddingLeft: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
  },
  ".cm-error-marker": {
    color: "#f87171",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "16px",
    filter: "drop-shadow(0 0 4px rgba(239, 68, 68, 0.5))",
  },
  ".cm-lint-marker-error": {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: "#f87171",
    border: "1.5px solid #0f172a",
    boxShadow: "0 0 0 1px #ef4444, 0 0 6px rgba(239, 68, 68, 0.6)",
    cursor: "pointer",
    margin: "4px auto",
    display: "block",
  }
}, { dark: true });

const jsonLinter = linter((view) => {
  const diagnostics: Diagnostic[] = [];
  const text = view.state.doc.toString();
  if (!text.trim()) return diagnostics;
  
  try {
    JSON.parse(text);
  } catch (e: any) {
    const posMatch = e.message.match(/position (\d+)/);
    if (posMatch) {
      const pos = parseInt(posMatch[1], 10);
      try {
        const line = view.state.doc.lineAt(Math.min(pos, text.length));
        diagnostics.push({
          from: line.from,
          to: line.to,
          severity: "error",
          message: e.message,
        });
      } catch (lineErr) {
        // Fallback if lineAt fails
        diagnostics.push({
          from: Math.max(0, pos - 1),
          to: Math.min(text.length, pos + 1),
          severity: "error",
          message: e.message,
        });
      }
    } else {
      diagnostics.push({
        from: 0,
        to: text.length,
        severity: "error",
        message: e.message,
      });
    }
  }
  return diagnostics;
});

interface CodeMirrorEditorProps {
  value: string;
  onChange?: (value: string) => void;
  onCursorChange?: (line: number, col: number) => void;
  onPaste?: (text: string) => void;
  readOnly?: boolean;
  theme?: "light" | "dark";
  ref?: (handle: { undo: () => void; redo: () => void; openSearch: () => void }) => void;
  diffHighlights?: { added: number[], removed: number[] };
}

const setDiffHighlights = StateEffect.define<{ added: number[], removed: number[] }>();

const diffField = StateField.define<any>({
  create() { return Decoration.none; },
  update(decorations, tr) {
    decorations = decorations.map(tr.changes);
    for (let e of tr.effects) {
      if (e.is(setDiffHighlights)) {
        let decos = [];
        for (let line of e.value.added) {
          if (line > 0 && line <= tr.state.doc.lines) {
            decos.push(Decoration.line({class: "cm-diff-added"}).range(tr.state.doc.line(line).from));
          }
        }
        for (let line of e.value.removed) {
          if (line > 0 && line <= tr.state.doc.lines) {
            decos.push(Decoration.line({class: "cm-diff-removed"}).range(tr.state.doc.line(line).from));
          }
        }
        decos.sort((a, b) => a.from - b.from);
        return Decoration.set(decos);
      }
    }
    return decorations;
  },
  provide: f => EditorView.decorations.from(f)
});

class Marker extends GutterMarker {
  constructor(readonly text: string, readonly className: string) { super() }
  toDOM() {
    let div = document.createElement("div");
    div.className = this.className;
    div.textContent = this.text;
    return div;
  }
}

const diffGutterInstance = gutter({
  lineMarker(view, line) {
    const decorations = view.state.field(diffField);
    let marker = null;
    decorations.between(line.from, line.from, (_from: number, _to: number, value: any) => {
      if (value.spec.class === "cm-diff-added") {
        marker = new Marker("+", "cm-diff-marker-added");
      } else if (value.spec.class === "cm-diff-removed") {
        marker = new Marker("-", "cm-diff-marker-removed");
      }
    });
    return marker;
  },
  initialSpacer: () => new Marker("+", "cm-diff-marker-added")
});

const errorMarker = new Marker("●", "cm-error-marker");

const errorGutterInstance = lintGutter({
  markerFilter: (d: readonly Diagnostic[]) => {
    return d.filter(diag => diag.severity === "error");
  }
});

export default function CodeMirrorEditor(props: CodeMirrorEditorProps) {
  let containerRef: HTMLDivElement | undefined;
  let editorView: EditorView | undefined;
  const [view, setView] = createSignal<EditorView>();

  const isDark = () => (props.theme ?? "light") === "dark";

  onMount(() => {
    if (!containerRef) return;

    const themeExt = isDark()
      ? [darkTheme, syntaxHighlighting(darkHighlightStyle)]
      : [lightTheme, syntaxHighlighting(lightHighlightStyle)];

    const extensions = [
      lineNumbers(),
      diffGutterInstance,
      errorGutterInstance,
      highlightActiveLine(),
      history(),
      json(),
      jsonLinter,
      diffField,
      ...themeExt,
      search(),
      keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...historyKeymap,
        ...searchKeymap,
      ]),
      EditorView.lineWrapping,
      EditorState.readOnly.of(props.readOnly ?? false),
      closeBrackets(),
      autocompletion({ activateOnTyping: false }),
      EditorView.domEventHandlers({
        paste(event, view) {
          const text = event.clipboardData?.getData('text');
          if (text) props.onPaste?.(text);
          return false;
        }
      })
    ];

    if (props.onChange || props.onCursorChange) {
      extensions.push(
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            props.onChange?.(update.state.doc.toString());
          }
          if (update.selectionSet || update.docChanged) {
            if (props.onCursorChange) {
              const head = update.state.selection.main.head;
              const line = update.state.doc.lineAt(head);
              props.onCursorChange(line.number, head - line.from + 1);
            }
          }
        })
      );
    }

    const state = EditorState.create({
      doc: props.value,
      extensions,
    });

    editorView = new EditorView({
      state,
      parent: containerRef,
    });

    setView(editorView);

    props.ref?.({
      undo: () => undo(editorView!),
      redo: () => redo(editorView!),
      openSearch: () => openSearchPanel(editorView!),
    });
  });

  // Update diff highlights when props change
  createEffect(() => {
    const v = view();
    const highlights = props.diffHighlights;
    if (v && highlights) {
      v.dispatch({
        effects: setDiffHighlights.of(highlights)
      });
    }
  });

  // Recreate editor when theme changes
  createEffect(() => {
    const dark = isDark();
    if (!editorView || !containerRef) return;

    const currentDoc = editorView.state.doc.toString();
    editorView.destroy();

    const themeExt = dark
      ? [darkTheme, syntaxHighlighting(darkHighlightStyle)]
      : [lightTheme, syntaxHighlighting(lightHighlightStyle)];

    const extensions = [
      lineNumbers(),
      diffGutterInstance,
      errorGutterInstance,
      highlightActiveLine(),
      history(),
      json(),
      jsonLinter,
      diffField,
      ...themeExt,
      search(),
      keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...historyKeymap,
        ...searchKeymap,
      ]),
      EditorView.lineWrapping,
      EditorState.readOnly.of(props.readOnly ?? false),
      closeBrackets(),
      autocompletion({ activateOnTyping: false }),
      EditorView.domEventHandlers({
        paste(event, view) {
          const text = event.clipboardData?.getData('text');
          if (text) props.onPaste?.(text);
          return false;
        }
      })
    ];

    if (props.onChange || props.onCursorChange) {
      extensions.push(
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            props.onChange?.(update.state.doc.toString());
          }
          if (update.selectionSet || update.docChanged) {
            if (props.onCursorChange) {
              const head = update.state.selection.main.head;
              const line = update.state.doc.lineAt(head);
              props.onCursorChange(line.number, head - line.from + 1);
            }
          }
        })
      );
    }

    const state = EditorState.create({
      doc: currentDoc,
      extensions,
    });

    editorView = new EditorView({
      state,
      parent: containerRef,
    });

    setView(editorView);
  });

  createEffect(() => {
    const newValue = props.value;
    const v = view();
    if (v && newValue !== v.state.doc.toString()) {
      v.dispatch({
        changes: {
          from: 0,
          to: v.state.doc.length,
          insert: newValue,
        },
      });
    }
  });

  onCleanup(() => {
    editorView?.destroy();
  });

  return (
    <div
      ref={containerRef}
      class="w-full h-full"
    />
  );
}
