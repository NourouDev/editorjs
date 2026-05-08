import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { MetaProvider } from "@solidjs/meta";
import "./app.css";

export default function App() {
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <div class="min-h-screen bg-[#fafafa] text-slate-900 font-sans">
            <nav class="bg-white border-b border-slate-200 py-4 px-6">
              <div class="max-w-7xl mx-auto flex justify-between items-center">
                <a href="/" class="text-xl font-bold text-indigo-600 flex items-center gap-2">
                  <span>ZeroJSON</span>
                </a>
                <div class="flex items-center gap-6">
                  <div class="text-sm font-medium text-slate-600 flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    <span>0 network requests</span>
                  </div>
                </div>
              </div>
            </nav>
            <main class="max-w-7xl mx-auto p-6">
              <Suspense>{props.children}</Suspense>
            </main>
            <footer class="bg-white border-t border-slate-200 py-8 mt-12">
              <div class="max-w-7xl mx-auto px-6 text-center text-slate-500 text-sm">
                <p>ZeroJSON Tools. Privacy First. Performance Always.</p>
              </div>
            </footer>
          </div>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
