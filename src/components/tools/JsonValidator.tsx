import { createSignal, onCleanup, onMount, Show } from "solid-js";
import { createJsonWorker } from "~/lib/jsonWorker";
import SvelteJsonEditor from "../editor/SvelteJsonEditor";
import { CheckIcon, XIcon } from "~/components/SvgIcons";
import { isDarkMode } from "~/lib/theme";

export default function JsonValidator() {
  const [jsonInput, setJsonInput] = createSignal('{\n  "hello": "world"\n}');
  const [status, setStatus] = createSignal<{ type: string; message: string }>({ type: 'idle', message: 'Ready' });
  const [isProcessing, setIsProcessing] = createSignal(false);
  const [validationErrors, setValidationErrors] = createSignal<any[]>([]);

  let worker: Worker | undefined;

  onMount(() => {
    worker = createJsonWorker();
    worker.onmessage = (e) => {
      const { type, success, error, position, formatted } = e.data;
      setIsProcessing(false);

      if (success) {
        setValidationErrors([]);
        if (type === 'format' || type === 'repair') {
          setJsonInput(formatted);
          setStatus({ type: 'success', message: type === 'format' ? 'Formatted' : 'Repaired' });
        } else {
          setStatus({ type: 'success', message: 'Valid JSON' });
        }
      } else {
        let msg = error;
        if (position) {
          if (!error.toLowerCase().includes('line')) {
            msg += ` at line ${position.line}, column ${position.column}`;
          }
          setValidationErrors([{
            path: [],
            message: error,
            severity: 'error',
            range: {
              start: { line: position.line - 1, column: position.column - 1 },
              end: { line: position.line - 1, column: position.column + 10 } // Highlight a bit of the line
            }
          }]);
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

  const handleSolve = () => {
    const input = jsonInput().trim();
    if (!input) return;
    if (!worker) return;
    setIsProcessing(true);
    setStatus({ type: 'idle', message: 'Repairing...' });
    worker.postMessage({ type: 'repair', data: input });
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
            class="px-6 py-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
          >
            Format
          </button>
          <Show when={status().type === 'error'}>
            <button
              onClick={handleSolve}
              disabled={isProcessing()}
              class="px-6 py-2.5 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 disabled:opacity-50 transition-all animate-in fade-in slide-in-from-left-2"
            >
              Solve
            </button>
          </Show>
        </div>
        <div class="flex items-center gap-2">
          {status().type === 'success' && (
            <span class="text-green-600 dark:text-green-400"><CheckIcon /></span>
          )}
          {status().type === 'error' && (
            <span class="text-red-600 dark:text-red-400"><XIcon /></span>
          )}
          <span class={`text-sm font-medium ${
            status().type === 'success' ? 'text-green-700 dark:text-green-400' :
            status().type === 'error' ? 'text-red-700 dark:text-red-400' :
            'text-slate-600 dark:text-slate-400'
          }`}>
            {status().message}
          </span>
        </div>
      </div>

      <div class="h-[500px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
        <SvelteJsonEditor
          value={jsonInput()}
          onChange={setJsonInput}
          mode="text"
          validationErrors={validationErrors()}
        />
      </div>
    </div>
  );
}
