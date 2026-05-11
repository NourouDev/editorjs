import { useParams } from "@solidjs/router";
import { Show, Switch, Match } from "solid-js";
import { TOOLS_REGISTRY } from "~/config/tools.config";
import JsonValidator from "~/components/tools/JsonValidator";
import JsonEditor from "~/components/tools/JsonEditor";
import { Title } from "@solidjs/meta";
import { LockIcon, FormatIcon } from "~/components/SvgIcons";

const iconMap: Record<string, any> = {
  lock: LockIcon,
  format: FormatIcon,
};

export default function ToolPage() {
  const params = useParams();
  const tool = () => TOOLS_REGISTRY[params.toolId as keyof typeof TOOLS_REGISTRY];
  const IconComponent = () => {
    const iconKey = tool()?.icon || "lock";
    return iconMap[iconKey] || LockIcon;
  };

  return (
    <div class={`flex-grow flex flex-col ${params.toolId === "json-formatter" ? "" : "p-6 max-w-7xl mx-auto w-full"}`}>
      <Show
        when={tool()}
        fallback={
          <div class="text-center py-20">
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Tool not found</h1>
            <p class="mt-4 text-slate-600 dark:text-slate-400">The tool you are looking for does not exist.</p>
            <a href="/" class="mt-8 inline-block text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
              Go back home
            </a>
          </div>
        }
      >
        <Title>{tool().name} - ZeroJSON Tools</Title>
        <Show when={params.toolId !== "json-formatter"}>
          <header class="mb-6">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-10 h-10 bg-indigo-50 dark:bg-indigo-950 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <IconComponent />
              </div>
              <h1 class="text-2xl font-bold text-slate-900 dark:text-white">{tool().name}</h1>
            </div>
            <p class="text-slate-600 dark:text-slate-400 max-w-2xl">
              {tool().description}
            </p>
          </header>
        </Show>

        <div class="flex-grow flex flex-col">
          <Switch>
            <Match when={params.toolId === "json-formatter"}>
              <JsonEditor />
            </Match>
            <Match when={params.toolId === "json-validator"}>
              <JsonValidator />
            </Match>
            <Match when={true}>
              <div class="p-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                <p class="text-slate-500 dark:text-slate-400">Tool coming soon...</p>
              </div>
            </Match>
          </Switch>
        </div>

        {/* Ethical Ad Placeholder */}
        <Show when={params.toolId !== "json-formatter"}>
          <div class="mt-8 p-6 bg-slate-100 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <p class="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1">Advertisement</p>
            <p class="text-slate-500 dark:text-slate-400 text-sm">Ad space - Privacy-respecting ads only</p>
          </div>
        </Show>
      </Show>
    </div>
  );
}
