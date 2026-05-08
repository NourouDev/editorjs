import { For } from "solid-js";
import { TOOLS_LIST } from "~/config/tools.config";
import { LockIcon, FormatIcon } from "~/components/SvgIcons";

const iconMap: Record<string, any> = {
  lock: LockIcon,
  format: FormatIcon,
};

export default function Home() {
  return (
    <div class="py-12">
      <div class="text-center mb-16">
        <h1 class="text-4xl font-bold text-slate-900 mb-4">
          JSON Tools, Privately.
        </h1>
        <p class="text-lg text-slate-600 max-w-2xl mx-auto">
          Massive payloads? Sensitive data? Everything stays in your browser.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <For each={TOOLS_LIST}>
          {(tool) => {
            const IconComponent = iconMap[tool.icon] || LockIcon;
            return (
              <a
                href={`/t/${tool.id}`}
                class="group bg-white p-8 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-sm transition-colors"
              >
                <div class="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-6 text-indigo-600">
                  <IconComponent />
                </div>
                <h2 class="text-lg font-semibold text-slate-900 mb-2">{tool.name}</h2>
                <p class="text-slate-600 text-sm leading-relaxed">
                  {tool.description}
                </p>
              </a>
            );
          }}
        </For>
      </div>
    </div>
  );
}
