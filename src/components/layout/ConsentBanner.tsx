import { createSignal, onMount, Show } from "solid-js";

export default function ConsentBanner() {
  const [show, setShow] = createSignal(false);

  onMount(() => {
    const consent = localStorage.getItem("zerojson-consent");
    if (!consent) {
      setShow(true);
    }
  });

  const handleAccept = () => {
    localStorage.setItem("zerojson-consent", "accepted");
    setShow(false);
    window.location.reload(); // Reload to trigger AdSense with consent
  };

  const handleDecline = () => {
    localStorage.setItem("zerojson-consent", "declined");
    setShow(false);
  };

  return (
    <Show when={show()}>
      <div class="fixed bottom-6 left-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-10 duration-500">
        <div class="max-w-4xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6">
          <div class="flex-grow space-y-2 text-center md:text-left">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white flex items-center justify-center md:justify-start gap-2">
              <span class="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
              Respecting your Privacy
            </h3>
            <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              To keep ZeroJSON free and private, we use Google AdSense for minimal monetization. 
              We use cookies to analyze traffic and personalize ads. Your JSON data stays 100% on your machine.
            </p>
          </div>
          <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-shrink-0">
            <button 
              onClick={handleDecline}
              class="px-6 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Decline
            </button>
            <button 
              onClick={handleAccept}
              class="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
            >
              Accept & Support
            </button>
          </div>
        </div>
      </div>
    </Show>
  );
}
