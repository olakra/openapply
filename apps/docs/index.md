---
layout: home

hero:
  name: "OpenApply"
  text: "The Open-Source, Privacy-First LinkedIn Copilot"
  tagline: "Filter ghost jobs, generate tailored ATS cover letters using your own API keys, and automatically track state unemployment work-search logs—100% locally."
  image:
    src: /logo.png
    alt: OpenApply Logo
  actions:
    - theme: brand
      text: Install Extension (MV3)
      link: /guide/installation
    - theme: alt
      text: Join Waitlist & Updates
      link: "#waitlist"
    - theme: alt
      text: View GitHub Repo
      link: https://github.com/olakra/openapply

features:
  - icon: 🛡️
    title: 100% Client-Side BYOK Privacy
    details: Bring Your Own Key (OpenAI / Gemini). Zero personal data, credentials, or resume tokens are ever sent to external servers or stored remotely.
  - icon: 🎯
    title: Deceptive Job & Applicant Filtering
    details: Automatically dims promoted listings and positions exceeding applicant limits (e.g. >100 applicants) or containing hidden hybrid clauses.
  - icon: 📝
    title: 1-Click ATS Scorecards & Cover Letters
    details: Instant match scoring through customizable recruiter or hiring manager personas. Generates 3-paragraph tailored cover letters instantly.
  - icon: 📊
    title: Automated State Unemployment Logs
    details: Audit-proof logging with unique SHA-256 confirmation hashes for EDD, TWC, and NY DOL compliance. One-click syncs to personal Google Sheets.
  - icon: 🔐
    title: AES-256 Web Crypto Vault
    details: API tokens and credentials are encrypted client-side using browser Web Crypto AES-256-GCM before saved in browser local storage.
  - icon: ⚡
    title: Manifest V3 Monorepo
    details: Built with React, TypeScript, and clean architecture principles. Modular prompt engines markdown files easily customizable without code edits.
---

<LandingSections />
