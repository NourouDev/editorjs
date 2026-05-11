import { Title } from "@solidjs/meta";

export default function TermsOfService() {
  return (
    <div class="max-w-4xl mx-auto px-6 py-12 prose dark:prose-invert prose-indigo">
      <Title>Terms of Service - ZeroJSON Tools</Title>
      <h1>Terms of Service</h1>
      
      <h2>1. Acceptance of Terms</h2>
      <p>By accessing and using ZeroJSON Tools, you accept and agree to be bound by the terms and provision of this agreement.</p>

      <h2>2. Description of Service</h2>
      <p>ZeroJSON Tools provides client-side utilities for parsing, converting, and generating code from JSON data. The service is provided "as is", without any guarantees of accuracy or fitness for a particular purpose.</p>

      <h2>3. Data Processing & Security</h2>
      <p>Our tools are designed to run 100% locally in your web browser. We do not transmit your input data to any backend servers. However, it is your responsibility to ensure the safety of your environment.</p>

      <h2>4. Intellectual Property</h2>
      <p>The generated code (TypeScript interfaces, Zod schemas, SQL queries, etc.) belongs entirely to you. You may use the output for any personal or commercial project without restriction.</p>

      <h2>5. Limitation of Liability</h2>
      <p>In no event shall ZeroJSON Tools or its creators be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use the service.</p>

      <p class="text-sm text-slate-500 mt-12">Last updated: May 2026</p>
    </div>
  );
}
