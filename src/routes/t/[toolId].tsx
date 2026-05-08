import { useParams } from "@solidjs/router";
import { Show, Switch, Match } from "solid-js";
import { TOOLS_REGISTRY } from "~/config/tools.config";
import JsonValidator from "~/components/tools/JsonValidator";
import { Title } from "@solidjs/meta";

export default function ToolPage() {
  const params = useParams();
  const tool = () => TOOLS_REGISTRY[params.toolId];

  return (
    <div class="py-6">
      <Show
        when={tool()}
        fallback={
          <div class="text-center py-20">
            <h1 class="text-2xl font-bold text-slate-900">Tool not found</h1>
            <p class="mt-4 text-slate-600">The tool you are looking for does not exist.</p>
            <a href="/" class="mt-8 inline-block text-indigo-600 font-bold hover:underline">
              Go back home
            </a>
          </div>
        }
      >
        <Title>{tool().name} - ZeroJSON Tools</Title>
        <header class="mb-10">
          <div class="flex items-center gap-4 mb-4">
            <span class="text-4xl">{tool().icon}</span>
            <h1 class="text-3xl font-extrabold text-slate-900">{tool().name}</h1>
          </div>
          <p class="text-lg text-slate-600 max-w-3xl">
            {tool().description}
          </p>
        </header>

        <Switch>
          <Match when={params.toolId === "json-validator" || params.toolId === "json-formatter"}>
            <JsonValidator />
          </Match>
          <Match when={true}>
            <div class="p-12 bg-white rounded-xl border border-slate-200 text-center">
              <p class="text-slate-500">Tool component coming soon...</p>
            </div>
          </Match>
        </Switch>
      </Show>
    </div>
  );
}
