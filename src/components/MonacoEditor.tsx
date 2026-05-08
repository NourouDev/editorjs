import { onMount, onCleanup, createEffect } from "solid-js";
import * as monaco from "monaco-editor";

// Import workers for Monaco
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

// @ts-ignore
self.MonacoEnvironment = {
  getWorker(_: any, label: string) {
    if (label === 'json') {
      return new jsonWorker();
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker();
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new htmlWorker();
    }
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker();
    }
    return new editorWorker();
  },
};

interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
}

export default function MonacoEditor(props: MonacoEditorProps) {
  let editorRef: HTMLDivElement | undefined;
  let editor: monaco.editor.IStandaloneCodeEditor | undefined;

  onMount(() => {
    if (editorRef) {
      editor = monaco.editor.create(editorRef, {
        value: props.value,
        language: props.language || 'json',
        theme: 'vs-light',
        automaticLayout: true,
        minimap: { enabled: false },
        fontSize: 14,
        scrollBeyondLastLine: false,
        lineNumbers: 'on',
        renderLineHighlight: 'all',
        tabSize: 2,
      });

      editor.onDidChangeModelContent(() => {
        const value = editor?.getValue();
        if (value !== undefined && value !== props.value) {
          props.onChange(value);
        }
      });
    }
  });

  createEffect(() => {
    const value = props.value;
    if (editor && value !== editor.getValue()) {
      editor.setValue(value);
    }
  });

  onCleanup(() => {
    editor?.dispose();
  });

  return (
    <div 
      ref={editorRef} 
      class="w-full h-full min-h-[500px] border border-slate-200 rounded-lg overflow-hidden"
    />
  );
}
