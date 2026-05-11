import { onMount, onCleanup } from "solid-js";

// TODO: Replace 'your-publisher-id' with your actual EthicalAds publisher ID
const PUBLISHER_ID = "your-publisher-id"; 

export default function EthicalAds() {
  onMount(() => {
    // Only inject script if it hasn't been injected yet
    if (!document.querySelector('script[src*="ethicalads.min.js"]')) {
      const script = document.createElement("script");
      script.src = "https://media.ethicalads.io/media/client/ethicalads.min.js";
      script.async = true;
      document.head.appendChild(script);
    }
  });

  return (
    <div class="my-4 flex justify-center w-full max-w-full overflow-hidden">
      <div 
        class="horizontal" 
        data-ea-publisher={PUBLISHER_ID} 
        data-ea-type="image" 
        id="ethicalads-container"
      />
    </div>
  );
}
