#!/usr/bin/env bash

# OpenApply (olakra/openapply) GitHub Issue Initialization Script
# Run this script using `gh` CLI authenticated against olakra/openapply:
# bash scripts/create-github-issues.sh

set -e

REPO="olakra/openapply"

echo "🚀 Creating v0.0.1 tracking issues for $REPO..."

# Issue 1: Monorepo & Manifest V3 Core Extension Setup
gh issue create --repo "$REPO" \
  --title "feat(extension): Monorepo & Manifest V3 Core Extension Setup" \
  --label "enhancement,mvp1,extension" \
  --body "### Summary
Establish the foundational monorepo workspace layout and Chromium Manifest V3 browser extension architecture.

### Scope & Technical Specifications
- **Workspace Layout**:
  - \`apps/extension\`: React 19, TypeScript, Vite extension build.
  - \`apps/docs\`: VitePress marketing and documentation portal.
  - \`packages/prompt-engine\`: Externalized Markdown prompt interpolation module.
  - \`packages/shared-types\`: Common TypeScript interfaces for LinkedIn jobs, resume profiles, and scorecards.
- **Manifest V3 Configuration**:
  - Permissions: \`storage\`, \`activeTab\`, \`scripting\`, \`identity\`.
  - Host Permissions: \`https://*.linkedin.com/*\`.
  - Background Service Worker: \`background.ts\` handling extension lifecycle and sidepanel listeners.

### Acceptance Criteria
- [x] Extension builds cleanly via \`npm run build:extension\`.
- [x] Extension loads unpacked in Chrome/Brave/Edge without Manifest V3 validation warnings.
- [x] Background service worker receives and responds to message events."

# Issue 2: BYOK OpenAI Integration & Storage Security
gh issue create --repo "$REPO" \
  --title "feat(security): BYOK OpenAI Integration & AES-256 Web Crypto Storage Vault" \
  --label "security,byok,mvp1" \
  --body "### Summary
Implement client-side Bring Your Own Key (BYOK) OpenAI integration using Web Crypto AES-256 encryption for user API credentials.

### Scope & Technical Specifications
- **Client-Side Key Encryption (\`CryptoVaultService.ts\`)**:
  - Derive 256-bit AES-GCM keys using PBKDF2 with 100,000 hashing iterations.
  - Store cipher text safely inside browser \`chrome.storage.local\`.
- **Zero Intermediary Server Architecture**:
  - Directly fetch from \`https://api.openai.com/v1/chat/completions\` using standard fetch strategies.
  - Provide local fallback heuristic analysis if no API key is set.
- **PII Guardrail Pre-Check (\`PIIGuardrailService.ts\`)**:
  - Pre-scan resume and job descriptions to sanitize SSNs, credit cards, phone numbers, and credentials before LLM dispatch.

### Acceptance Criteria
- [x] User API key saved in popup is encrypted with AES-256-GCM.
- [x] OpenAI requests bypass central servers and execute directly client-side.
- [x] PII guardrail automatically redacts sensitive candidate data before API dispatch."

# Issue 3: In-Page LinkedIn DOM Filtering Script
gh issue create --repo "$REPO" \
  --title "feat(content-script): In-Page LinkedIn DOM Filtering & Deceptive Remote Detector" \
  --label "enhancement,content-script,mvp1" \
  --body "### Summary
Build a high-performance content script that injects smart overlay controls and visual filters directly into LinkedIn job feeds (\`linkedin.com/jobs/*\`).

### Scope & Technical Specifications
- **Promoted Job Dimming**:
  - Detect \`Promoted\` badge nodes and apply visual opacity filtering.
- **Applicant Count Thresholds**:
  - Flag job cards exceeding configured applicant limits (e.g. >100 applicants) with custom warning badges.
- **Deceptive 'Fake Remote' Detection**:
  - Scan job descriptions for hidden hybrid/onsite requirements (e.g., *'Must reside within 30 miles of office for weekly sync'*).
- **Overlay Action Buttons**:
  - Inject 1-Click ATS Scorecard, Cover Letter Generator, and Unemployment Log triggers on active job cards.

### Acceptance Criteria
- [x] Content script executes reliably on dynamic DOM updates via MutationObserver.
- [x] Promoted and high-applicant listings are visually dimmed.
- [x] Fake remote warning badges highlight hidden hybrid clauses with clickable citations."

# Issue 4: Google Drive OAuth & EDD/DOL Unemployment Logger Schema
gh issue create --repo "$REPO" \
  --title "feat(integration): Google Drive OAuth & Audit-Proof Unemployment Logger Schema" \
  --label "integration,unemployment-log,mvp1" \
  --body "### Summary
Implement Google Drive OAuth2 integration and an audit-proof work-search logging engine for state unemployment benefit compliance (CA EDD, TX TWC, NY DOL).

### Scope & Technical Specifications
- **Google OAuth2 PKCE Flow**:
  - Request minimal scope (\`https://www.googleapis.com/auth/spreadsheets\`).
- **Cryptographic Audit Proof**:
  - Compute deterministic SHA-256 confirmation hashes for each application log entry (\`Company + Title + Date + Nonce\`).
- **Automated Spreadsheet Export**:
  - Auto-create and append application rows directly into the user's private Google Sheet titled \`OpenApply_Unemployment_Log_2026\`.

### Acceptance Criteria
- [x] Single-click application logging creates audit-proof SHA-256 records.
- [x] Work search logs sync directly to personal Google Drive without intermediary storage.
- [x] Google Sheets spreadsheet automatically appends application metadata."

# Issue 5: VitePress Documentation Landing Page & GitHub Pages Deployment
gh issue create --repo "$REPO" \
  --title "docs(site): VitePress SaaS Documentation Landing Page & GitHub Pages CI/CD" \
  --label "documentation,ci-cd,mvp1" \
  --body "### Summary
Build a high-converting venture-backed B2B SaaS marketing & documentation portal using VitePress and Tailwind CSS, deployed via GitHub Actions.

### Scope & Technical Specifications
- **Landing Page (\`apps/docs/index.md\` & Vue Components)**:
  - High-converting dark mode design with gradient typography, trust metrics banner, interactive feature cards, and support callouts.
  - Embeddable Google Form waitlist capture module.
- **Documentation Guide & Guides**:
  - Installation, BYOK Security, Job Filtering, ATS Scorecards, Cover Letters, and Support guide pages.
- **GitHub Actions Workflow (\`.github/workflows/deploy-docs.yml\`)**:
  - Build VitePress static assets on push to \`main\` and deploy to GitHub Pages (\`gh-pages\` branch).

### Acceptance Criteria
- [x] \`npm run build:docs\` executes cleanly and produces optimized static bundle.
- [x] GitHub Pages deployment workflow triggers automatically on push to \`main\`.
- [x] Landing page includes working Buy Me a Coffee and Patreon support callout buttons."

# Issue 6: Git Flow Release Sync Automation & Funding Configuration
gh issue create --repo "$REPO" \
  --title "devops(release): Git Flow Release Sync Automation & Funding Configuration" \
  --label "devops,release-automation,mvp1" \
  --body "### Summary
Automate GitHub release generation, repository metadata, and open-source funding configuration.

### Scope & Technical Specifications
- **Version Tracking**:
  - Plaintext \`VERSION\` file set to \`0.0.1\`.
  - Keep a Changelog compliant \`CHANGELOG.md\`.
  - Thorough monorepo \`README.md\` with architecture diagrams, badges, and local quickstart steps.
- **GitHub Release Automation (\`.github/workflows/version-release-sync.yml\`)**:
  - Read \`VERSION\` on push to \`main\`, verify \`CHANGELOG.md\` entry, create git tag \`vX.X.X\`, and publish a GitHub Release with extracted notes.
- **Funding Configuration (\`.github/FUNDING.yml\`)**:
  - Configure \`buy_me_a_coffee: olakra\`, \`patreon: olakra\`, and custom repository funding URL.

### Acceptance Criteria
- [x] \`VERSION\`, \`CHANGELOG.md\`, and \`README.md\` are synchronized.
- [x] \`.github/FUNDING.yml\` is validated and renders sponsorship buttons on GitHub repository page.
- [x] Push to \`main\` with updated \`VERSION\` triggers automated GitHub Release generation."

echo "✅ All 6 tracking issues generated successfully for $REPO!"
