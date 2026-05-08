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
          <div class="min-h-screen bg-slate-50 text-slate-900 font-sans">
            <nav class="bg-white border-b border-slate-200 py-4 px-6 sticky top-0 z-10">
              <div class="max-w-7xl mx-auto flex justify-between items-center">
                <a href="/" class="text-xl font-bold text-indigo-600 flex items-center gap-2">
                  <span>ZeroJSON</span>
                  <span class="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">Tools</span>
                </a>
                <div class="flex items-center gap-6">
                  <div class="text-sm font-medium text-green-600 flex items-center gap-1">
                    <span>🔒</span>
                    <span>0 network requests made</span>
                  </div>
                </div>
              </div>
            </nav>
            <main class="max-w-7xl mx-auto p-6">
              <Suspense>{props.children}</Suspense>
            </main>
            <footer class="bg-white border-t border-slate-200 py-8 mt-12">
              <div class="max-w-7xl mx-auto px-6 text-center text-slate-500 text-sm">
                <p>&copy; 2024 ZeroJSON Tools. Privacy First. Performance Always.</p>
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
