import { createSignal, onCleanup, onMount } from "solid-js";
import { createJsonWorker } from "~/lib/jsonWorker";
import MonacoEditor from "../MonacoEditor";
import { clientOnly } from "@solidjs/start";

const MonacoEditorClient = clientOnly(() => import("../MonacoEditor"));

export default function JsonValidator() {
  const [jsonInput, setJsonInput] = createSignal('{\n  "hello": "world"\n}');
  const [status, setStatus] = createSignal({ type: 'idle', message: 'Ready to process.' });
  const [isProcessing, setIsProcessing] = createSignal(false);

  let worker: Worker | undefined;

  onMount(() => {
    worker = createJsonWorker();
    worker.onmessage = (e) => {
      const { type, success, error, position, formatted } = e.data;
      setIsProcessing(false);

      if (success) {
        if (type === 'format') {
          setJsonInput(formatted);
          setStatus({ type: 'success', message: '✅ JSON formatted successfully!' });
        } else {
          setStatus({ type: 'success', message: '✅ Valid JSON!' });
        }
      } else {
        let msg = error;
        if (position && !error.toLowerCase().includes('line')) {
          msg += ` at line ${position.line}, column ${position.column}`;
        }
        setStatus({ type: 'error', message: `❌ ${msg}` });
      }
    };
  });

  onCleanup(() => {
    worker?.terminate();
  });

  const handleValidate = () => {
    const input = jsonInput().trim();
    if (!input) {
      setStatus({ type: 'error', message: 'Please enter some JSON' });
      return;
    }
    if (!worker) return;
    setIsProcessing(true);
    setStatus({ type: 'idle', message: 'Validating...' });
    worker.postMessage({ type: 'validate', data: input });
  };

  const handleFormat = () => {
    const input = jsonInput().trim();
    if (!input) {
      setStatus({ type: 'error', message: 'Please enter some JSON' });
      return;
    }
    if (!worker) return;
    setIsProcessing(true);
    setStatus({ type: 'idle', message: 'Formatting...' });
    worker.postMessage({ type: 'format', data: input });
  };

  return (
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div class="flex gap-3">
          <button
            onClick={handleValidate}
            disabled={isProcessing()}
            class="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
          >
            {isProcessing() ? 'Processing...' : 'Validate'}
          </button>
          <button
            onClick={handleFormat}
            disabled={isProcessing()}
            class="px-6 py-2.5 bg-white text-slate-700 border border-slate-300 font-bold rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors shadow-sm"
          >
            Format
          </button>
        </div>
        <div 
          class={`px-4 py-2 rounded-full text-sm font-medium border ${
            status().type === 'success' ? 'bg-green-50 text-green-700 border-green-200' :
            status().type === 'error' ? 'bg-red-50 text-red-700 border-red-200' :
            'bg-slate-100 text-slate-600 border-slate-200'
          }`}
        >
          {status().message}
        </div>
      </div>

      <div class="h-[600px] shadow-lg rounded-xl overflow-hidden bg-white">
        <MonacoEditorClient
          value={jsonInput()}
          onChange={setJsonInput}
          language="json"
        />
      </div>
    </div>
  );
}
