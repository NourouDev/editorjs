import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { createSignal, onMount, Suspense, Show } from "solid-js";
import { MetaProvider, Title, Meta, Link } from "@solidjs/meta";
import { isDarkMode, setIsDarkMode } from "./lib/theme";
import GoogleAdSense from "./components/layout/GoogleAdSense";
import ConsentBanner from "./components/layout/ConsentBanner";
import "./app.css";

export default function App() {
  const [hasConsent, setHasConsent] = createSignal(false);

  onMount(() => {
    const stored = localStorage.getItem("zerojson-theme");
    if (stored === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }

    const consent = localStorage.getItem("zerojson-consent");
    if (consent === "accepted") {
      setHasConsent(true);
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
          <Title>ZeroJSON Tools - 100% Secure, 0 Network Requests</Title>
          <Meta name="description" content="Convert JSON to TypeScript, Zod, Go, Rust, SQL, and CSV directly in your browser. 0 network requests, 100% private and offline-capable." />
          <Meta property="og:title" content="ZeroJSON Tools - 100% Secure JSON Converter" />
          <Meta property="og:description" content="Convert massive JSON files in your browser. 0 network requests. Ultra-fast performance." />
          <Meta property="og:url" content="https://editorjs.pages.dev/" />
          <Meta property="og:type" content="website" />
          <Meta name="twitter:card" content="summary_large_image" />
          <Link rel="canonical" href="https://editorjs.pages.dev/" />
          <div class="min-h-screen flex flex-col bg-[#fafafa] dark:bg-[#0a0e1a] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
            <nav class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-4 px-6 flex-shrink-0">
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
            <main class="flex-grow flex flex-col min-h-0">
              <Suspense>{props.children}</Suspense>
            </main>
            <Show when={hasConsent()}>
              <GoogleAdSense />
            </Show>
            <ConsentBanner />
            <footer class="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 w-full flex-shrink-0">
              <div class="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500 dark:text-slate-400 text-xs">
                <p>&copy; {new Date().getFullYear()} ZeroJSON Tools. Privacy First. Performance Always.</p>
                <div class="flex gap-4">
                  <a href="/privacy-policy" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy Policy</a>
                  <a href="/terms" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms of Service</a>
                </div>
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
