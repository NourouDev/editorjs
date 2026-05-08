import { createSignal, onCleanup, onMount } from "solid-js";
import { createJsonWorker } from "~/lib/jsonWorker";
import CodeMirrorEditor from "../CodeMirrorEditor";

export default function JsonValidator() {
  const [jsonInput, setJsonInput] = createSignal('{\n  "hello": "world"\n}');
  const [status, setStatus] = createSignal<{ type: string; message: string }>({ type: 'idle', message: 'Ready' });
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
          setStatus({ type: 'success', message: 'Formatted' });
        } else {
          setStatus({ type: 'success', message: 'Valid JSON' });
        }
      } else {
        let msg = error;
        if (position && !error.toLowerCase().includes('line')) {
          msg += ` at line ${position.line}, column ${position.column}`;
        }
        setStatus({ type: 'error', message: msg });
      }
    };
  });

  onCleanup(() => {
    worker?.terminate();
  });

  const handleValidate = () => {
    const input = jsonInput().trim();
    if (!input) {
      setStatus({ type: 'error', message: 'Enter JSON to validate' });
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
      setStatus({ type: 'error', message: 'Enter JSON to format' });
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
            class="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {isProcessing() ? 'Processing...' : 'Validate'}
          </button>
          <button
            onClick={handleFormat}
            disabled={isProcessing()}
            class="px-6 py-2.5 bg-white text-slate-700 border border-slate-300 font-medium rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
          >
            Format
          </button>
        </div>
        <div class="flex items-center gap-2">
          {status().type === 'success' && (
            <span class="text-green-600"><CheckIcon /></span>
          )}
          {status().type === 'error' && (
            <span class="text-red-600"><XIcon /></span>
          )}
          <span class={`text-sm font-medium ${
            status().type === 'success' ? 'text-green-700' :
            status().type === 'error' ? 'text-red-700' :
            'text-slate-600'
          }`}>
            {status().message}
          </span>
        </div>
      </div>

      <div class="h-[500px] rounded-xl overflow-hidden border border-slate-700 border-t-0">
        <CodeMirrorEditor
          value={jsonInput()}
          onChange={setJsonInput}
        />
      </div>
    </div>
  );
}
