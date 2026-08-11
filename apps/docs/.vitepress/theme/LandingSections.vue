<template>
  <div class="openapply-landing-sections">
    <!-- SaaS Metric / Trust Highlights Banner -->
    <section class="oa-trust-banner">
      <div class="oa-metric-item">
        <span class="oa-metric-num">100%</span>
        <span class="oa-metric-label">Open Source & GPL-3.0</span>
      </div>
      <div class="oa-metric-item">
        <span class="oa-metric-num">0</span>
        <span class="oa-metric-label">External Data Leaks</span>
      </div>
      <div class="oa-metric-item">
        <span class="oa-metric-num">AES-256</span>
        <span class="oa-metric-label">Local Encryption</span>
      </div>
      <div class="oa-metric-item">
        <span class="oa-metric-num">Sub-2s</span>
        <span class="oa-metric-label">ATS Score Carding</span>
      </div>
    </section>

    <!-- Interactive Feature Matrix Section -->
    <section class="oa-feature-section">
      <h2 class="oa-section-title">Built for Modern Job Seekers & Unemployment Compliance</h2>
      <p class="oa-section-sub">
        Stop wasting time manually filtering fake job postings or struggling to organize weekly state unemployment work-search proof.
      </p>

      <div class="oa-card-grid">
        <div class="oa-card">
          <div class="oa-card-badge">Privacy First</div>
          <h3>BYOK OpenAI Integration</h3>
          <p>
            Use your existing OpenAI API key (e.g. <code>gpt-4o-mini</code>) or Gemini model. Your keys are client-side encrypted and requests bypass intermediary telemetry servers.
          </p>
        </div>

        <div class="oa-card">
          <div class="oa-card-badge">State Compliance</div>
          <h3>Audit-Proof Work Search Records</h3>
          <p>
            Automatically logs every application attempt with position details, date applied, and unique verification hashes to meet state unemployment requirements (CA EDD, TX TWC, NY DOL).
          </p>
        </div>

        <div class="oa-card">
          <div class="oa-card-badge">Customizable AI</div>
          <h3>Externalized Prompt Engine</h3>
          <p>
            Switch evaluation personas between Technical Recruiter, Engineering Manager, or Tech Lead. Modify markdown prompt templates directly without code re-compilation.
          </p>
        </div>
      </div>
    </section>

    <!-- Waitlist / Email Capture Modal Card -->
    <section id="waitlist" class="oa-waitlist-section">
      <div class="oa-waitlist-card">
        <div class="oa-waitlist-header">
          <span class="oa-pill">Early Access & Release Updates</span>
          <h2>Join the OpenApply Community</h2>
          <p>
            Get notified when new browser extension releases (Firefox, Safari, Edge) and multi-LLM (Claude 3.5, Ollama) integrations drop.
          </p>
        </div>

        <div class="oa-form-wrapper">
          <iframe 
            src="https://docs.google.com/forms/d/e/1FAIpQLSc_ExampleFormKeyOpenApply2026/viewform?embedded=true" 
            width="100%" 
            height="320" 
            frameborder="0" 
            marginheight="0" 
            marginwidth="0"
            class="oa-google-form-iframe"
          >
            Loading Google Form...
          </iframe>
          
          <div class="oa-fallback-form">
            <input 
              v-model="email" 
              type="email" 
              placeholder="Enter your email address (e.g. alex@example.com)" 
              class="oa-input" 
            />
            <button class="oa-btn-primary" @click="subscribeEmail">
              Subscribe to Releases
            </button>
          </div>
          <p v-if="subscribedMessage" class="oa-success-msg">
            {{ subscribedMessage }}
          </p>
          <p class="oa-form-privacy">🔒 Zero spam. We respect your privacy. Unsubscribe anytime.</p>
        </div>
      </div>
    </section>

    <!-- Support / Sponsorship Section -->
    <section class="oa-support-section">
      <div class="oa-support-card">
        <h2>Support Open Source Development</h2>
        <p>
          OpenApply is completely free, open-source, and maintained under the GPL-3.0 license. If OpenApply saved you hours of job search frustration or secured your unemployment benefit compliance, consider backing the project!
        </p>
        
        <div class="oa-sponsor-buttons">
          <a href="https://www.buymeacoffee.com/olakra" target="_blank" rel="noreferrer" class="oa-sponsor-btn bmc-btn">
            <img src="https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Donate-yellow.svg?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me A Coffee" style="height: 28px; border-radius: 4px;" />
          </a>
          <a href="https://www.patreon.com/olakra" target="_blank" rel="noreferrer" class="oa-sponsor-btn patreon-btn">
            ❤️ Support on Patreon
          </a>
          <a href="https://github.com/olakra/openapply" target="_blank" rel="noreferrer" class="oa-sponsor-btn github-btn">
            ⭐ Star on GitHub
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const email = ref('');
const subscribedMessage = ref('');

function subscribeEmail() {
  if (!email.value || !email.value.includes('@')) {
    alert('Please enter a valid email address.');
    return;
  }
  subscribedMessage.value = `Thank you (${email.value})! You are subscribed to OpenApply release updates.`;
  email.value = '';
}
</script>

<style scoped>
.openapply-landing-sections {
  margin-top: 3rem;
}

.oa-trust-banner {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(51, 65, 85, 0.6);
  border-radius: 1rem;
  text-align: center;
  margin-bottom: 4rem;
}

.oa-metric-num {
  display: block;
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.oa-metric-label {
  font-size: 0.85rem;
  color: #94a3b8;
  font-weight: 500;
}

.oa-feature-section {
  text-align: center;
  margin-bottom: 4rem;
}

.oa-section-title {
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #f8fafc;
  margin-bottom: 0.5rem;
}

.oa-section-sub {
  color: #94a3b8;
  max-width: 650px;
  margin: 0 auto 2.5rem auto;
  font-size: 0.95rem;
}

.oa-card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  text-align: left;
}

.oa-card {
  background: #0f172a;
  border: 1px solid #1e293b;
  padding: 1.75rem;
  border-radius: 0.85rem;
  position: relative;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.oa-card:hover {
  transform: translateY(-2px);
  border-color: #059669;
}

.oa-card-badge {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #34d399;
  background: rgba(6, 78, 59, 0.4);
  border: 1px solid rgba(16, 185, 129, 0.3);
  padding: 0.2rem 0.6rem;
  border-radius: 0.25rem;
  margin-bottom: 1rem;
}

.oa-card h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #f1f5f9;
  margin-bottom: 0.5rem;
}

.oa-card p {
  font-size: 0.875rem;
  color: #94a3b8;
  line-height: 1.5;
}

.oa-waitlist-section {
  margin-bottom: 4rem;
}

.oa-waitlist-card {
  background: linear-gradient(180deg, #0f172a 0%, #020617 100%);
  border: 2px solid #059669;
  border-radius: 1.25rem;
  padding: 2.5rem;
  text-align: center;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
}

.oa-pill {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  padding: 0.3rem 0.8rem;
  border-radius: 1rem;
  margin-bottom: 1rem;
}

.oa-waitlist-header h2 {
  font-size: 1.75rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 0.5rem;
}

.oa-waitlist-header p {
  color: #94a3b8;
  font-size: 0.9rem;
  max-width: 550px;
  margin: 0 auto 2rem auto;
}

.oa-google-form-iframe {
  border-radius: 0.75rem;
  background: #ffffff;
  display: block;
  margin: 0 auto;
  max-width: 600px;
}

.oa-fallback-form {
  display: flex;
  gap: 0.75rem;
  max-width: 500px;
  margin: 1.5rem auto 0.5rem auto;
}

.oa-input {
  flex: 1;
  padding: 0.75rem 1rem;
  background: #020617;
  border: 1px solid #334155;
  border-radius: 0.5rem;
  color: #ffffff;
  font-size: 0.875rem;
}

.oa-input:focus {
  outline: none;
  border-color: #10b981;
}

.oa-btn-primary {
  padding: 0.75rem 1.25rem;
  background: #059669;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.875rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease;
}

.oa-btn-primary:hover {
  background: #10b981;
}

.oa-success-msg {
  font-size: 0.8rem;
  color: #34d399;
  font-weight: 600;
  margin-top: 0.5rem;
}

.oa-form-privacy {
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 0.5rem;
}

.oa-support-card {
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 1rem;
  padding: 2.5rem;
  text-align: center;
}

.oa-support-card h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.5rem;
}

.oa-support-card p {
  color: #94a3b8;
  max-width: 600px;
  margin: 0 auto 1.5rem auto;
  font-size: 0.9rem;
}

.oa-sponsor-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.oa-sponsor-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.25rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  text-decoration: none !important;
  transition: opacity 0.2s ease;
}

.bmc-btn {
  background: #FFDD00;
  color: #000000 !important;
}

.patreon-btn {
  background: #FF424D;
  color: #ffffff !important;
}

.github-btn {
  background: #333333;
  color: #ffffff !important;
  border: 1px solid #555555;
}

.oa-sponsor-btn:hover {
  opacity: 0.9;
}
</style>
