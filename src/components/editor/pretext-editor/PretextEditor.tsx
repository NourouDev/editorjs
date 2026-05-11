import { createMemo, Show } from 'solid-js';
import TableView from './TableView';
import TextView from './TextView';
import DiffView from './DiffView';
import TreeView from './TreeView';

interface PretextEditorProps {
    value: string;
    onChange?: (value: string) => void;
    mode?: 'tree' | 'text' | 'table' | 'diff';
    diffLines?: any[];
    readonly?: boolean;
}

export default function PretextEditor(props: PretextEditorProps) {
    const jsonData = createMemo(() => {
        try {
            return JSON.parse(props.value || '{}');
        } catch {
            return null;
        }
    });

    const isValidJson = createMemo(() => jsonData() !== null);

    return (
        <div class="w-full h-full flex flex-col overflow-hidden bg-slate-50 dark:bg-[#0d1117]">
            {/* Tree mode */}
            <Show when={props.mode === 'tree'}>
                <div class="flex-1 overflow-auto p-4 font-mono text-sm">
                    <Show
                        when={isValidJson()}
                        fallback={
                            <div class="flex items-center gap-2 text-red-500 text-xs font-mono">
                                <span>✕</span>
                                <span>
                                    Invalid JSON — switch to Text mode to fix
                                </span>
                            </div>
                        }
                    >
                        <TreeView data={jsonData()} depth={0} />
                    </Show>
                </div>
            </Show>

            {/* Table mode */}
            <Show when={props.mode === 'table'}>
                <div class="flex-1 overflow-auto p-4">
                    <Show
                        when={isValidJson()}
                        fallback={
                            <div class="flex items-center gap-2 text-red-500 text-xs font-mono p-4">
                                <span>✕</span>
                                <span>
                                    Invalid JSON — switch to Text mode to fix
                                </span>
                            </div>
                        }
                    >
                        <TableView data={jsonData()} />
                    </Show>
                </div>
            </Show>

            {/* Text mode — full height, error highlighting */}
            <Show when={props.mode === 'text'}>
                <div class="flex-1 min-h-0 overflow-hidden">
                    <TextView
                        value={props.value}
                        onChange={props.onChange}
                        readonly={props.readonly}
                    />
                </div>
            </Show>

            {/* Diff mode */}
            <Show when={props.mode === 'diff'}>
                <div class="flex-1 overflow-auto">
                    <DiffView lines={props.diffLines || []} />
                </div>
            </Show>
        </div>
    );
}
