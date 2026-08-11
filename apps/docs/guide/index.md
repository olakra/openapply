# Product Architecture & Privacy Guide

OpenApply is designed from the ground up as a **100% Client-Side, Privacy-First Browser Extension (Manifest V3)**.

---

## 🔒 1. BYOK Security & Web Crypto Encryption

Unlike typical SaaS job copilots that route your resume, personal contact details, and job search history to third-party tracking servers, OpenApply operates under a **Bring Your Own Key (BYOK)** model.

### Web Crypto Vault Architecture
When you save your OpenAI API key (e.g. `sk-proj-...`) in the OpenApply popup:
1. **PBKDF2 Key Derivation**: Uses Web Crypto APIs with 100,000 PBKDF2 iterations and random IVs.
2. **AES-256-GCM Local Storage**: The cipher text is encrypted directly inside your browser storage (`chrome.storage.local`).
3. **Zero Intermediary Proxying**: Requests go directly from your browser extension to `https://api.openai.com/v1/chat/completions`.

```
[ Your Browser (OpenApply Extension) ]
             │
             ├──► Encrypted API Key stored in chrome.storage.local
             │
             └──► Direct HTTPS Fetch (BYOK) ─────────► [ OpenAI / Gemini API ]
```

---

## 🎯 2. LinkedIn Smart Job Filtering

OpenApply overlays clean visual indicators on LinkedIn job lists to help you focus on high-probability opportunities.

### Features:
- **Promoted Job Dimming**: Instantly dims sponsored or promoted listings to prevent recruiter ad fatigue.
- **Applicant Limit Thresholds**: Automatically highlights or dims jobs exceeding your preferred threshold (e.g., >100 applicants).
- **Deceptive "Fake Remote" Warnings**: Analyzes job description text for hidden hybrid clauses (e.g., *"Must reside within 30 miles of office for mandatory weekly hybrid sync"*).

---

## 📊 3. Automated State Unemployment Log Sync

For job seekers receiving State Unemployment Benefits (such as California EDD, Texas TWC, or New York DOL), tracking work-search proof is a critical legal compliance requirement.

### How OpenApply Automates Your Work Search Log:
1. **1-Click Application Logging**: Click **"Log Application"** on any active LinkedIn job card.
2. **Audit-Proof SHA-256 Hashes**: Generates a deterministic confirmation hash for each record:
   ```
   SHA256(Company + JobTitle + AppliedDate + UniqueSessionNonce)
   ```
3. **Google Drive & Sheets Integration**:
   - Uses minimal Google OAuth scope (`https://www.googleapis.com/auth/spreadsheets`).
   - Automatically appends log rows to your personal Google Sheet titled **`OpenApply_Unemployment_Log_2026`**.
   - No data is stored on external servers—your logs remain 100% inside your private Google Drive.

---

## 🛠️ Installation & Setup Steps

### Option A: Unpacked Extension Installation (Developer Mode)
1. Clone the repository: `git clone https://github.com/olakra/openapply.git`
2. Install dependencies & build extension:
   ```bash
   bun install
   bun run build:extension
   ```
3. Open Chrome / Brave / Edge and navigate to `chrome://extensions`.
4. Enable **Developer mode** (top right toggle).
5. Click **Load unpacked** and select the directory: `/apps/extension/dist`.
6. Click the OpenApply shield icon in your browser toolbar to enter your OpenAI API key!
