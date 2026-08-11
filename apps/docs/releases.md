# Release Notes & Changelog

All notable updates to OpenApply are documented here. OpenApply strictly follows [Semantic Versioning](https://semver.org/).

---

## [v0.1.0-alpha] - 2026-08-10

### 🚀 Major Features Introduced

- **Monorepo Architecture**:
  - Restructured codebase into clean TypeScript packages (`@openapply/prompt-engine`, `@openapply/shared-types`).
  - Added full atomic design layout for extension popups and documentation portal.

- **Externalized Prompt Engine**:
  - Prompts moved to dynamic Markdown templates in `/config/prompts/` (`ats_analyzer.md`, `cover_letter_generator.md`, `fake_remote_detector.md`).
  - Added customizable evaluation personas (Technical Recruiter, Engineering Manager, Tech Lead, VP of Engineering).

- **Security & PII Guardrails**:
  - Client-side AES-256 Web Crypto Vault (`CryptoVaultService.ts`) for encrypting BYOK tokens locally.
  - Automatic PII Sanitization (`PIIGuardrailService.ts`) preventing accidental token leaks or sensitive candidate data exposure.

- **LinkedIn Copilot & State Unemployment Log**:
  - Real-time job card overlays on LinkedIn.
  - SHA-256 hash generation for application proof.
  - Direct sync to personal Google Sheets for EDD/TWC compliance audit readiness.

---

### 🔧 Commit Highlights

- `feat(prompt-engine)`: Externalize Markdown prompt templates and add dynamic variable interpolation.
- `feat(security)`: Implement Web Crypto AES-256-GCM vault for API key storage.
- `refactor(ui)`: Apply atomic light/dark contrast theme with Lucide React icons.
- `docs`: Add VitePress SaaS documentation site and GitHub Actions deployment workflow.
