import { Title } from "@solidjs/meta";

export default function PrivacyPolicy() {
  return (
    <div class="max-w-4xl mx-auto px-6 py-12 prose dark:prose-invert prose-indigo">
      <Title>Privacy Policy - ZeroJSON Tools</Title>
      <h1>Privacy Policy</h1>
      <p class="lead">At ZeroJSON Tools, your privacy is not just a feature; it is the fundamental architecture of our platform.</p>
      
      <div class="bg-indigo-50 dark:bg-indigo-900/30 p-6 rounded-lg border border-indigo-100 dark:border-indigo-800 mb-8">
        <h2 class="text-indigo-800 dark:text-indigo-300 mt-0">0 Network Requests Guarantee</h2>
        <p class="mb-0">
          Our tools operate entirely within your browser. When you paste JSON data, upload files, or generate code, <strong>zero data is transmitted to our servers</strong>. We have no backend API that receives your data. What happens on your machine, stays on your machine.
        </p>
      </div>

      <h2>1. Information We Do Not Collect</h2>
      <p>Because of our "offline-first" client-side architecture, we <strong>do not</strong> collect, process, or store:</p>
      <ul>
        <li>Your JSON payloads or code snippets.</li>
        <li>File contents or schema structures.</li>
        <li>Personally identifiable information (PII) from your data.</li>
      </ul>

      <h2>2. Information We Do Collect</h2>
      <p>To keep the site running and understand our general audience, we may use basic, privacy-respecting analytics and ethical advertisements. This may include:</p>
      <ul>
        <li>Basic, anonymized analytics (page views, browser type).</li>
        <li>Non-personalized, ethical advertising metrics that do not track you across the web.</li>
      </ul>

      <h2>3. GDPR Compliance</h2>
      <p>Since we do not process your personal data through our service, the stringent requirements of the GDPR regarding data processing are inherently met by our architecture. Any third-party cookies (if applicable, such as through standard analytics or ads) will be subject to explicit consent via our cookie banner.</p>

      <h2>4. Changes to This Policy</h2>
      <p>We may update this privacy policy from time to time. Any changes will be reflected on this page.</p>

      <p class="text-sm text-slate-500 mt-12">Last updated: May 2026</p>
    </div>
  );
}
