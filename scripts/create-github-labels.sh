#!/usr/bin/env bash

# OpenApply (olakra/openapply) GitHub Label Initialization Script
# Run this script using `gh` CLI authenticated against olakra/openapply:
# bash scripts/create-github-labels.sh

set -e

REPO="olakra/openapply"

echo "🎨 Creating v0.0.1 repository labels for $REPO..."

gh label create "mvp1" --repo "$REPO" --color "0e8a16" --description "Core MVP 1 v0.0.1 release scope" --force
gh label create "extension" --repo "$REPO" --color "7057ff" --description "Chromium MV3 Extension frontend code" --force
gh label create "security" --repo "$REPO" --color "d93f0b" --description "Security, encryption, and BYOK vault logic" --force
gh label create "byok" --repo "$REPO" --color "fbca04" --description "Bring Your Own Key LLM provider features" --force
gh label create "content-script" --repo "$REPO" --color "1d76db" --description "LinkedIn content script DOM overlays" --force
gh label create "integration" --repo "$REPO" --color "d4c5f9" --description "Google OAuth, Sheets & Drive API integrations" --force
gh label create "unemployment-log" --repo "$REPO" --color "0052cc" --description "Audit-proof state unemployment log features" --force
gh label create "documentation" --repo "$REPO" --color "0075ca" --description "VitePress docs & developer guides" --force
gh label create "ci-cd" --repo "$REPO" --color "e99695" --description "GitHub Actions CI/CD workflows" --force
gh label create "devops" --repo "$REPO" --color "bfd4f2" --description "Repository configuration, release sync & metadata" --force
gh label create "release-automation" --repo "$REPO" --color "5319e7" --description "Automated semantic tagging & GitHub Releases" --force
gh label create "enhancement" --repo "$REPO" --color "a2eeef" --description "New feature or request" --force

echo "✅ All repository labels created successfully for $REPO!"
