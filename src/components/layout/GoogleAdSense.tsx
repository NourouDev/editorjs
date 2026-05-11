import { onMount } from 'solid-js';

// IMPORTANT: Replace with your actual AdSense Publisher ID
const PUBLISHER_ID = 'ca-pub-9009321896588169';

export default function GoogleAdSense() {
    onMount(() => {
        // Initialize the ad unit if the script is already loaded
        try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error('AdSense error:', e);
        }
    });

    return (
        <div class="py-8 flex justify-center w-full bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
            <ins
                class="adsbygoogle"
                style="display:block"
                data-ad-client={PUBLISHER_ID}
                data-ad-slot="YOUR_AD_SLOT_ID"
                data-ad-format="auto"
                data-full-width-responsive="true"
            ></ins>
        </div>
    );
}
