import { onMount, onCleanup, createEffect } from "solid-js";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers, highlightActiveLine } from "@codemirror/view";
import { json } from "@codemirror/lang-json";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { syntaxHighlighting, defaultHighlightStyle } from "@codemirror/language";
import { autocompletion, completionKeymap, closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";

// Disable autocomplete entirely
const basicSetup = EditorView.theme({
  "&": {
    height: "100%",
    fontSize: "13px",
  },
  ".cm-scroller": {
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
    overflow: "auto",
  },
  ".cm-content": {
    caretColor: "#6366f1",
  },
  ".cm-gutters": {
    backgroundColor: "#1e293b",
    color: "#64748b",
    border: "none",
    paddingRight: "8px",
  },
  ".cm-lineNumbers .cm-gutterElement": {
    paddingLeft: "8px",
    minWidth: "40px",
  },
  ".cm-activeLine": {
    backgroundColor: "rgba(99, 102, 241, 0.1)",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "rgba(99, 102, 241, 0.15)",
  },
});

interface CodeMirrorEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: string;
  readOnly?: boolean;
}

export default function CodeMirrorEditor(props: CodeMirrorEditorProps) {
  let containerRef: HTMLDivElement | undefined;
  let editorView: EditorView | undefined;

  onMount(() => {
    if (!containerRef) return;

    const extensions = [
      lineNumbers(),
      highlightActiveLine(),
      history(),
      json(),
      syntaxHighlighting(defaultHighlightStyle),
      basicSetup,
      keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...historyKeymap,
      ]),
      EditorView.lineWrapping,
      EditorState.readOnly.of(props.readOnly ?? false),
    ];

    // Disable autocomplete completely
    extensions.push(autocompletion({ defaultKeymap: [], closeBrackets: closeBrackets() }));

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

  // Update editor content when value prop changes externally
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
      class="w-full h-full bg-slate-900"
    />
  );
}
