import { onMount } from "solid-js";

// IMPORTANT: Replace 'your-publisher-id' with the ID you receive from EthicalAds
const PUBLISHER_ID = "your-publisher-id"; 

export default function EthicalAds() {
  onMount(() => {
    // 1. Inject the script if not present
    if (!document.querySelector('script[src*="ethicalads.min.js"]')) {
      const script = document.createElement("script");
      script.src = "https://media.ethicalads.io/media/client/ethicalads.min.js";
      script.async = true;
      document.head.appendChild(script);
    } else {
      // 2. If script already exists (navigation in SPA), tell it to find new ads
      // @ts-ignore
      if (window.ethicalads) {
        // @ts-ignore
        window.ethicalads.load();
      }
    }
  });

  return (
    <div class="py-8 flex justify-center w-full bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
      <div 
        class="horizontal dark adaptive" 
        data-ea-publisher={PUBLISHER_ID} 
        data-ea-type="image" 
        data-ea-manual="true"
        id="ethical-ad"
      />
    </div>
  );
}

