import { onMount, onCleanup, createEffect } from "solid-js";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers, highlightActiveLine } from "@codemirror/view";
import { json } from "@codemirror/lang-json";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { syntaxHighlighting, HighlightStyle } from "@codemirror/language";
import { autocompletion, closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
import { tags } from "@lezer/highlight";

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
}, { dark: true });

interface CodeMirrorEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  theme?: "light" | "dark";
}

export default function CodeMirrorEditor(props: CodeMirrorEditorProps) {
  let containerRef: HTMLDivElement | undefined;
  let editorView: EditorView | undefined;

  const isDark = () => (props.theme ?? "light") === "dark";

  onMount(() => {
    if (!containerRef) return;

    const themeExt = isDark()
      ? [darkTheme, syntaxHighlighting(darkHighlightStyle)]
      : [lightTheme, syntaxHighlighting(lightHighlightStyle)];

    const extensions = [
      lineNumbers(),
      highlightActiveLine(),
      history(),
      json(),
      ...themeExt,
      keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...historyKeymap,
      ]),
      EditorView.lineWrapping,
      EditorState.readOnly.of(props.readOnly ?? false),
      closeBrackets(),
      autocompletion({ activateOnTyping: false }),
    ];

    if (props.onChange) {
      extensions.push(
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            props.onChange?.(update.state.doc.toString());
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
      highlightActiveLine(),
      history(),
      json(),
      ...themeExt,
      keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...historyKeymap,
      ]),
      EditorView.lineWrapping,
      EditorState.readOnly.of(props.readOnly ?? false),
      closeBrackets(),
      autocompletion({ activateOnTyping: false }),
    ];

    if (props.onChange) {
      extensions.push(
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            props.onChange?.(update.state.doc.toString());
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
  });

  createEffect(() => {
    const newValue = props.value;
    if (editorView && newValue !== editorView.state.doc.toString()) {
      editorView.dispatch({
        changes: {
          from: 0,
          to: editorView.state.doc.length,
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
