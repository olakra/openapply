# Changelog

All notable changes to OpenApply will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.1] - 2026-08-10

### Added
- **Monorepo Architecture**: Initial release with clean monorepo organization (`/apps/extension`, `/apps/docs`, `/packages/prompt-engine`, `/packages/shared-types`).
- **Manifest V3 Extension**: Client-side LinkedIn copilot extension powered by React 19, TypeScript, Vite, and Tailwind CSS.
- **BYOK AI Integration**: Bring Your Own Key support for OpenAI models (`gpt-4o-mini`, `gpt-4o`) with direct API calls bypassing intermediary backend servers.
- **AES-256 Web Crypto Vault**: Bank-grade client-side encryption using PBKDF2 key derivation and AES-GCM local storage for user API keys.
- **Externalized Prompt Engine**: Markdown prompt templates stored in `/config/prompts/` supporting persona selection (Technical Recruiter, Engineering Manager, Tech Lead).
- **Audit-Proof Unemployment Log**: SHA-256 hash generation for job search activities supporting state unemployment compliance (CA EDD, TX TWC, NY DOL).
- **Google Sheets Integration**: Automated 1-click export of work-search records directly into personal Google Drive spreadsheets.
- **PII Guardrail Service**: Pre-LLM client-side regex sanitization protecting candidate SSNs, phone numbers, and API credentials.
- **VitePress SaaS Documentation**: Production-ready documentation portal in `apps/docs/` with dark mode UI and interactive waitlist/support modules.
- **GitHub Actions Workflows**: Automated GitHub Pages deployment (`deploy-docs.yml`) and semantic release synchronization (`version-release-sync.yml`).
