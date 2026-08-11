# BYOK Security & PII Privacy Guide

OpenApply is engineered to meet strict global data protection standards, including **GDPR (General Data Protection Regulation)** and **CCPA (California Consumer Privacy Act)**.

---

## 🛡️ Core Security Architecture

### 1. AES-256 Web Crypto Vault

API keys are never stored in plaintext inside browser storage. When you enter your key:

- OpenApply uses the browser's native `window.crypto.subtle` Web Crypto API.
- Derives a 256-bit encryption key using `PBKDF2` with 100,000 hashing iterations.
- Encrypts your API key using `AES-GCM` with a unique Initialization Vector (IV).

### 2. PII Sanitization Guardrails (`PIIGuardrailService`)

Before any job description or candidate resume snippet is passed to the AI model:

- `PIIGuardrailService` scans the payload using pre-hook regular expressions.
- Automatically redacts Social Security Numbers (`[REDACTED_SSN]`), Credit Cards (`[REDACTED_CREDIT_CARD]`), Phone Numbers (`[REDACTED_PHONE]`), and API Tokens (`[REDACTED_API_KEY]`).

### 3. Pre-Commit Hooks

Our build system incorporates automated pre-commit scanning to guarantee that no internal developer keys, credentials, or personal identity details are accidentally committed into the git repository.

---

## 🔒 GDPR Compliance Checklist

| GDPR Requirement                             | How OpenApply Complies                                                                                                                     |
| :------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------- |
| **Right to Erasure (Right to be Forgotten)** | 100% of data is stored in your local browser storage. Clearing browser cache or clicking **Wipe All Data** completely deletes every trace. |
| **Data Minimization**                        | OpenApply requests only minimal permissions required to inspect job cards and sync to your private Google Sheet.                           |
| **No Third-Party Telemetry**                 | No Google Analytics tracking inside extension popups or content scripts. Zero external tracking pixels.                                    |
| **User Access & Portability**                | One-click **Export All Data** feature downloads your complete application log and saved settings as a JSON file.                           |
