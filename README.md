<p align="center">
  <img src="assets/logo.png" width="160" alt="OpenApply Logo" />
</p>

<h1 align="center">OpenApply 🛡️</h1>

<p align="center">
  <strong>The Free, Open-Source, Privacy-First LinkedIn Copilot & State Unemployment Work-Search Engine</strong>
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-GPLv3-blue.svg" alt="License: GPL v3" /></a>
  <a href="apps/extension"><img src="https://img.shields.io/badge/Chrome_Extension-Manifest_V3-green.svg" alt="Manifest V3" /></a>
  <a href="https://sonarcloud.io/summary/new_code?id=olakra_openapply"><img src="https://sonarcloud.io/api/project_badges/measure?project=olakra_openapply&metric=alert_status" alt="SonarCloud Quality Gate" /></a>
  <a href="https://sonarcloud.io/summary/new_code?id=olakra_openapply"><img src="https://sonarcloud.io/api/project_badges/measure?project=olakra_openapply&metric=security_rating" alt="SonarCloud Security Rating" /></a>
  <a href="https://github.com/olakra/openapply/actions/workflows/sonarcloud.yml"><img src="https://github.com/olakra/openapply/actions/workflows/sonarcloud.yml/badge.svg" alt="SonarCloud CI Status" /></a>
  <a href="https://github.com/olakra/openapply/actions/workflows/version-release-sync.yml"><img src="https://github.com/olakra/openapply/actions/workflows/version-release-sync.yml/badge.svg" alt="Release Sync Status" /></a>
  <a href="package.json"><img src="https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript" alt="TypeScript 5.x" /></a>
  <a href="https://www.buymeacoffee.com/olakra"><img src="https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Donate-orange.svg?logo=buy-me-a-coffee" alt="Buy Me A Coffee" /></a>
</p>

---

## 🎯 Value Proposition & Core Features

OpenApply is a 100% open-source, client-side Chromium extension built for modern job seekers. It eliminates LinkedIn noise, calculates ATS resume fit scores, generates custom 3-paragraph cover letters using your own LLM provider keys, and logs audit-proof job search records directly into your personal Google Sheet for state unemployment compliance (CA EDD, TX TWC, NY DOL).

- **🔒 100% Client-Side Privacy**: Your resume, personal contact details, API keys, and job application history are processed entirely in-browser. Zero personal data ever hits remote servers or central tracking databases.
- **⚡ Zero Compute Markup (BYOK)**: Connect your own OpenAI or Gemini API key directly. Pay raw API pricing fractions of a cent per application without subscription markups.
- **🚫 Deceptive & Ghost Job Filtering**: Injects DOM filters directly into `linkedin.com/jobs/*` to dim promoted listings, flag positions exceeding applicant limits (>100 applicants), and highlight hidden hybrid/onsite requirements.
- **📊 State Unemployment Compliance Engine**: Automatically computes cryptographic SHA-256 confirmation hashes per application and appends formatted audit rows to a private Google Sheet (`OpenApply_Unemployment_Log_2026`).

---

## 🔒 Trust, Security & Engineering Quality

We maintain enterprise-grade security standards to ensure full transparency and complete trust for external contributors and users alike.

### 🛡️ Privacy & Local Secret Protection
- **AES-256 Web Crypto Vault**: All sensitive credentials (`sk-...` keys and Google OAuth tokens) are derived with PBKDF2 (100,000 hashing iterations) and encrypted locally in browser `chrome.storage.local`.
- **Zero Central Telemetry**: OpenApply does not maintain any backend API proxy or data collection servers. All network calls execute directly from your client browser to official endpoints (`api.openai.com` or `googleapis.com`).

### 🧪 Automated Code Quality & Vulnerability Scanning
- **SonarCloud Analysis**: Continuous static code analysis monitors for XSS vulnerabilities, cognitive code complexity, security hotspots, and zero code smells across all monorepo workspaces.
- **Secret & Dependency Scanning**: Repositories are scanned automatically with TruffleHog and GitHub Dependabot to prevent API key leaks and vulnerable package inclusions.
- **Signed Commits & Git Flow**: All commits across release branches are cryptographically signed using GPG (`git commit -S`) and verified against GitHub maintainer identities.

---

## 📁 Monorepo Workspace Structure

```
openapply/
├── apps/
│   ├── extension/            # Chromium Manifest V3 React 19 Extension
│   │   ├── src/
│   │   │   ├── background/   # MV3 Service Worker for BYOK & OAuth listeners
│   │   │   ├── content/      # LinkedIn DOM parser & visual overlay filter
│   │   │   └── popup/        # Real-time Extension popup settings UI
│   │   └── manifest.json     # Chrome Extension MV3 Manifest
│   └── docs/                 # VitePress documentation portal & marketing site
├── packages/
│   ├── shared-types/         # Common TypeScript interfaces & schemas
│   └── prompt-engine/        # Markdown ATS & cover letter prompt interpolator
├── .github/
│   ├── workflows/            # GitHub Actions (SonarCloud, Docs Deploy, Releases)
│   └── FUNDING.yml           # Open-source sponsorship config
├── sonar-project.properties  # SonarCloud static analysis rules & path scoping
└── package.json              # Monorepo root configuration & scripts
```

---

## 🚀 Local Development Quickstart

### Prerequisites
- Node.js `^20.0.0` or `^22.0.0`
- `npm` `^10.0.0`

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/olakra/openapply.git
cd openapply
npm install
```

### 2. Run Local Development Web Sandbox
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to interact with the simulated LinkedIn DOM overlay engine and Extension Popup UI workbench.

### 3. Build & Test Extension Package
```bash
# Build Manifest V3 extension bundle
npm run build:extension

# Run workspace linters & type checks
npm run lint

# Run unit tests with coverage report
npm run test:coverage
```

### 4. Load Unpacked Extension into Chrome / Brave / Edge
1. Open your browser and navigate to `chrome://extensions/`
2. Enable **Developer mode** in the top right corner.
3. Click **Load unpacked** and select the directory `apps/extension/dist` (or `apps/extension`).
4. Navigate to `https://www.linkedin.com/jobs/` to see OpenApply's floating action bar.

---

## 🤝 Community, Contributing & Sponsorship

We welcome contributions from open-source maintainers, frontend engineers, and security auditors!

- **Git Flow Standard**: Create feature branches off `develop` (`feature/your-feature-name`) and ensure commits are signed (`git commit -S`).
- **Issues & Discussions**: Submit bug reports, feature requests, or security disclosures on our [GitHub Issues](https://github.com/olakra/openapply/issues) page.
- **Sponsor OpenApply**: Support our independent open-source maintenance:
  - ☕ **Buy Me A Coffee**: [buymeacoffee.com/olakra](https://www.buymeacoffee.com/olakra)
  - 💖 **Patreon**: [patreon.com/olakra](https://www.patreon.com/olakra)

---

## 📄 License

This project is licensed under the **GNU General Public License v3.0 (GPL-3.0)** - see the [LICENSE](LICENSE) file for details.

<p align="center">
  <sub>Made with ❤️ in Seattle for job seekers everywhere.</sub>
</p>
