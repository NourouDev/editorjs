import { For } from "solid-js";
import { TOOLS_LIST } from "~/config/tools.config";

export default function Home() {
  return (
    <div class="py-12">
      <div class="text-center mb-16">
        <h1 class="text-4xl font-extrabold text-slate-900 mb-4 sm:text-5xl">
          JSON Tools, Privately.
        </h1>
        <p class="text-xl text-slate-600 max-w-2xl mx-auto">
          Massive payloads? Sensitive data? No problem. Everything stays in your browser, forever.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <For each={TOOLS_LIST}>
          {(tool) => (
            <a
              href={`/t/${tool.id}`}
              class="group bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all"
            >
              <div class="text-4xl mb-6 group-hover:scale-110 transition-transform origin-left">
                {tool.icon}
              </div>
              <h2 class="text-xl font-bold text-slate-900 mb-3">{tool.name}</h2>
              <p class="text-slate-600 leading-relaxed">
                {tool.description}
              </p>
            </a>
          )}
        </For>
      </div>
    </div>
  );
}
