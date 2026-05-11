import { onMount } from 'solid-js';

// IMPORTANT: Replace with your actual AdSense Publisher ID
const PUBLISHER_ID = 'ca-pub-3447606468251376';

export default function GoogleAdSense() {
    onMount(() => {
        // 1. Inject the AdSense script
        if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
            const script = document.createElement('script');
            script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${PUBLISHER_ID}`;
            script.async = true;
            script.crossOrigin = 'anonymous';
            document.head.appendChild(script);
        }

        // 2. Initialize the ad unit
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
