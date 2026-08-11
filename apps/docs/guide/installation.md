# Installation & Extension Setup

Follow this guide to install the OpenApply Manifest V3 browser extension in Chromium-based browsers (Google Chrome, Brave, Microsoft Edge, Opera).

---

## Prerequisites
- **Node.js**: v18.0.0 or higher
- **Bun** or **npm**
- **OpenAI API Key**: (Optional for BYOK real AI analysis; free heuristic mode works without a key).

---

## Step 1: Clone and Build the Monorepo

```bash
# 1. Clone repo
git clone https://github.com/olakra/openapply.git
cd openapply

# 2. Install dependencies
bun install

# 3. Build the extension package
bun run build:extension
```

Upon successful build, compiled extension assets will be generated in `/apps/extension/dist`.

---

## Step 2: Load Extension in Chrome

1. Open Google Chrome or Brave and navigate to:
   ```
   chrome://extensions
   ```
2. Enable **Developer mode** using the toggle switch in the top right corner.
3. Click the **Load unpacked** button in the top left menu.
4. Select the build output directory:
   ```
   /path/to/openapply/apps/extension/dist
   ```
5. You should now see the **OpenApply v1.0 MV3** shield icon in your browser toolbar!

---

## Step 3: Configure Your OpenAI BYOK API Key

1. Click the OpenApply shield icon in your extension menu.
2. Enter your OpenAI API key (starting with `sk-proj-...`).
3. Click **Show** to verify your key if needed.
4. OpenApply will instantly validate and encrypt the key into your local browser Web Crypto Vault.

> 🔒 **Security Confirmation**: OpenApply never transmits your API key to any third party server. All API requests go directly to `api.openai.com`.
