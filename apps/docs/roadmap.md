# OpenApply Feature Roadmap

Our mission is to build the ultimate open-source, privacy-preserving job application copilot. Below is our active development roadmap.

---

## 🚀 MVP 1: Chromium Extension Core (In Progress - v0.1.0-alpha)

- [x] **Manifest V3 Architecture**: Monorepo structure using React 19, TypeScript, Vite, and Tailwind CSS.
- [x] **Client-Side BYOK Engine**: Support for OpenAI API keys (`gpt-4o-mini`, `gpt-4o`) with AES-256 Web Crypto encryption.
- [x] **Externalized Prompt Engine**: Customizable Markdown prompt templates (`/config/prompts/`) with persona selection (Recruiter, Engineering Manager, Tech Lead).
- [x] **LinkedIn Content Script Overlays**: Real-time ATS match scoring, fake remote detection, and applicant threshold dimming.
- [x] **Audit-Proof Unemployment Log**: SHA-256 confirmation hashes and direct Google Sheets OAuth auto-export.

---

## 🔮 MVP 2: Multi-LLM BYOK & Cross-Browser Support (Planned - Q3 2026)

- [ ] **Firefox & Safari Extension Builds**: Packaging for Mozilla Add-ons and Apple Safari Web Extension store.
- [ ] **Multi-Model BYOK Integration**:
  - Google Gemini 2.5 Flash / Pro
  - Anthropic Claude 3.5 Sonnet
  - Local Ollama / Llama3 models for 100% offline local inference without API keys.
- [ ] **Multi-Platform Support**: Overlay injection for Indeed, Glassdoor, and Lever/Greenhouse application boards.
- [ ] **Custom Resume Vault**: Save multiple resume variants (e.g., Frontend Engineer vs. Full-Stack Lead) with quick-switch toggles.

---

## 🌐 MVP 3: Multi-State Compliance & Localized Prompt Fine-Tuning (Future - Q4 2026)

- [ ] **1-Click Multi-State Unemployment Exports**:
  - Direct PDF export formatted for California EDD Form DE 4581.
  - Formatted CSV export for Texas Workforce Commission (TWC) and New York DOL.
- [ ] **Community Prompt Marketplace**: Open-source repository of specialized Markdown prompts tailored for niche industries (Designers, Data Scientists, Product Managers).
- [ ] **Interactive Interview Preparation**: Generate top 5 likely technical interview questions based on company job description gaps.
