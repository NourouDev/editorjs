import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, onMount } from "solid-js";
import { MetaProvider } from "@solidjs/meta";
import { isDarkMode, setIsDarkMode } from "./lib/theme";
import "./app.css";

export default function App() {
  onMount(() => {
    const stored = localStorage.getItem("zerojson-theme");
    if (stored === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  });

  const toggleTheme = () => {
    const next = !isDarkMode();
    setIsDarkMode(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("zerojson-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("zerojson-theme", "light");
    }
  };

  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <div class="min-h-screen bg-[#fafafa] dark:bg-[#0a0e1a] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
            <nav class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-4 px-6">
              <div class="max-w-7xl mx-auto flex justify-between items-center">
                <a href="/" class="text-xl font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <span>ZeroJSON</span>
                </a>
                <div class="flex items-center gap-4">
                  <div class="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    <span>0 network requests</span>
                  </div>
                  <button
                    onClick={toggleTheme}
                    class="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    aria-label="Toggle theme"
                    title={isDarkMode() ? "Switch to light mode" : "Switch to dark mode"}
                  >
                    {isDarkMode() ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="5"/>
                        <line x1="12" y1="1" x2="12" y2="3"/>
                        <line x1="12" y1="21" x2="12" y2="23"/>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                        <line x1="1" y1="12" x2="3" y2="12"/>
                        <line x1="21" y1="12" x2="23" y2="12"/>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </nav>
            <main class="max-w-7xl mx-auto p-6">
              <Suspense>{props.children}</Suspense>
            </main>
            <footer class="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 mt-12">
              <div class="max-w-7xl mx-auto px-6 text-center text-slate-500 dark:text-slate-400 text-sm">
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
