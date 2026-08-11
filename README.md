# OpenApply 🛡️

> **The Open-Source, Privacy-First LinkedIn Copilot & Automated State Unemployment Work-Search Engine**

[![Version](https://img.shields.io/badge/version-0.0.1-emerald.svg)](VERSION)
[![License: GPL-3.0](https://img.shields.io/badge/License-GPL--3.0-blue.svg)](LICENSE)
[![Manifest V3](https://img.shields.io/badge/Extension-Manifest%20V3-purple.svg)](apps/extension)
[![Documentation](https://img.shields.io/badge/Docs-VitePress-green.svg)](apps/docs)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Donate-yellow.svg?logo=buy-me-a-coffee)](https://www.buymeacoffee.com/olakra)

OpenApply is a client-side browser extension designed for modern job seekers. It filters deceptive LinkedIn job listings, scores ATS resume matches using customizable recruiter personas, generates tailored 3-paragraph cover letters using your own API keys, and automatically logs audit-proof work-search proof for state unemployment benefits (CA EDD, TX TWC, NY DOL) directly into your private Google Sheets.

---

## 🔒 Privacy-First BYOK Architecture

OpenApply operates under a strict **Bring Your Own Key (BYOK)** model. 

* **Zero Data Retention**: Your resume, personal contact information, API keys, and job search history are **never** transmitted to remote tracking servers or stored externally.
* **AES-256 Web Crypto Vault**: Your OpenAI or Gemini API keys are encrypted locally inside your browser (`chrome.storage.local`) using PBKDF2 key derivation and AES-256-GCM encryption.
* **Direct Provider Fetch**: LLM requests travel directly from your extension to `https://api.openai.com/v1/chat/completions`.
* **PII Guardrails**: `PIIGuardrailService` automatically redacts SSNs, credit cards, phone numbers, and API tokens client-side before sending payloads to LLMs.

---

## ✨ Core Feature Highlights

### 🎯 Deceptive Job & Applicant Filtering
* **Promoted Listing Dimming**: Visual opacity reduction on sponsored LinkedIn job listings.
* **Applicant Threshold Warnings**: Custom limit toggles (e.g., >50 applicants) to visually flag saturated job postings.
* **Fake Remote Detection**: Regex and AI analysis flagging hidden hybrid clauses (e.g., *"Must reside within 30 miles of office"*).

### 📝 1-Click ATS Fit Scorecards & Cover Letters
* **Multi-Persona Evaluation**: Toggle evaluation perspectives between Technical Recruiter, Engineering Manager, Tech Lead, or VP of Engineering.
* **Externalized Prompt Templates**: Prompt files are stored as plain Markdown in `/config/prompts/` and can be edited without code re-compilation.
* **High-Impact Cover Letters**: Generates crisp, 3-paragraph tailored cover letters adhering to strict 250-word bounds.

### 📊 Automated State Unemployment Compliance Log
* **Cryptographic Audit Hashes**: Generates unique SHA-256 confirmation hashes for every logged application to prevent record tampering.
* **Direct Google Sheets OAuth Export**: Uses minimal Google OAuth scopes to append work-search records directly into a private spreadsheet (`OpenApply_Unemployment_Log_2026`) in your Google Drive.

---

## 📁 Monorepo Directory Layout

```
openapply/
├── VERSION                         # Plain text semantic version (e.g. 0.0.1)
├── CHANGELOG.md                    # Keep a Changelog standards log
├── README.md                       # Main repository documentation
├── config/
│   └── prompts/                    # Externalized Markdown prompt templates
│       ├── ats_analyzer.md
│       ├── cover_letter_generator.md
│       └── fake_remote_detector.md
├── apps/
│   ├── extension/                  # Chromium Manifest V3 React/Vite extension
│   │   ├── src/
│   │   ├── manifest.json
│   │   └── vite.config.ts
│   └── docs/                       # VitePress SaaS marketing & documentation portal
│       ├── .vitepress/
│       ├── index.md
│       ├── roadmap.md
│       ├── releases.md
│       └── guide/
├── packages/
│   ├── prompt-engine/              # Shared prompt parsing & interpolation logic
│   └── shared-types/               # Global TypeScript interfaces & schemas
└── .github/
    └── workflows/
        ├── deploy-docs.yml         # Deploy documentation to GitHub Pages
        └── version-release-sync.yml # Auto-tag and publish GitHub releases
```

---

## 🛠️ Local Setup & Development

### Prerequisites
* **Node.js**: `v20.0.0` or higher
* **Package Manager**: `npm` or `bun`

### Installation Steps

```bash
# 1. Clone the repository
git clone https://github.com/olakra/openapply.git
cd openapply

# 2. Install workspace dependencies
npm install

# 3. Build all workspace packages
npm run build

# 4. Run Vite dev server for web preview
npm run dev
```

### Loading Extension in Chrome / Brave / Edge

1. Build the extension package:
   ```bash
   npm run build:extension
   ```
2. Open Chrome and navigate to `chrome://extensions`.
3. Enable **Developer mode** in the top right corner.
4. Click **Load unpacked** and select the directory `/apps/extension/dist`.
5. Open the OpenApply toolbar icon and input your OpenAI API key!

---

## 🌿 Git Flow Guidelines

OpenApply adheres to standard Git Flow branch naming and pull request workflows:

* `main`: Production-ready, stable releases.
* `feature/<short-description>`: New features or enhancement PRs.
* `fix/<short-description>`: Bug fixes and security patches.
* `docs/<short-description>`: Documentation additions and guide updates.

### Submitting a Pull Request
1. Fork the repo and create your feature branch from `main`.
2. Run `npm run lint` and verify all TypeScript checks pass cleanly.
3. Keep commit messages clear and imperative (e.g., `feat(prompt-engine): add Claude 3.5 support`).

---

## 💖 Sponsor & Support

OpenApply is 100% free, privacy-first, and community-funded software licensed under GPL-3.0. If OpenApply saved you hours of job search frustration or kept your unemployment benefits compliant, consider backing the maintainers:

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Donate-yellow.svg?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/olakra)

* ☕ **Buy Me a Coffee**: [buymeacoffee.com/olakra](https://www.buymeacoffee.com/olakra)
* ❤️ **Patreon**: [patreon.com/olakra](https://www.patreon.com/olakra)
* ⭐ **GitHub Repository**: [olakra/openapply](https://github.com/olakra/openapply)

---

## 📄 License

OpenApply is licensed under the **GNU General Public License v3.0 (GPL-3.0)**.
