# Unemployment Log & Google Drive Sync

Filing state unemployment benefit certifications (e.g. California EDD DE 4581, Texas TWC, New York DOL) requires submitting proof of active job search activities. OpenApply turns job hunting into an automated, audit-proof audit log.

---

## 📋 How It Works

### 1. One-Click Logging

Whenever you apply for a job on LinkedIn, click **"Log Application"** in the OpenApply overlay.

### 2. Deterministic SHA-256 Verification Hash

OpenApply computes an immutable proof hash for each record:

```ts
const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${company}-${title}-${date}-${nonce}`));
```

This cryptographic hash proves that the record was generated at the recorded timestamp and has not been altered after the fact.

### 3. Google Sheets OAuth Auto-Export

When Google Drive Sync is enabled in extension settings:

- OpenApply authenticates via Google OAuth PKCE.
- Appends new records directly into a dedicated spreadsheet in your private Google Drive titled **`OpenApply_Unemployment_Log_2026`**.
- Fields exported include: **Date Applied, Company Name, Job Title, Job Location, Listing URL, Contact Info, ATS Score, and Proof Hash**.
