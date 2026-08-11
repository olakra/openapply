# OpenApply Repository Branch Protection & Ruleset Guide 🛡️

This document outlines the administrative branch protection rules and security settings required on GitHub under **Settings > Rulesets** (or **Settings > Branches**) for the `olakra/openapply` repository to enforce signed commit security, linear history, and code documentation standards.

---

## 🔒 Target Protection Branches

- `main` (Production release branch)
- `develop` (Active development integration branch)

---

## 📋 Required Branch Ruleset Configuration

### 1. Require Cryptographically Signed Commits

- **Setting**: **Require signed commits** (Enabled)
- **Effect**: Rejects any commit pushed to `main` or `develop` that does not contain a verified GPG or SSH digital signature. Unsigned commits are blocked at the git push level.

### 2. Enforce Linear Commit History & Squash Merging

- **Setting**: **Require linear history** (Enabled)
- **Setting**: **Allow squash merging ONLY** (Enabled under `Settings > General > Pull Requests`)
- **Effect**: Prevents merge commits (dual-parent commits) from being pushed or merged into target branches. Forces all Pull Requests to be combined into 1 single atomic signed commit upon merge.

### 3. Block Force Pushes & Branch Deletions

- **Setting**: **Block force pushes** (Enabled for `main` and `develop`)
- **Setting**: **Prevent branch deletions** (Enabled for `main` and `develop`)
- **Effect**: Ensures historical commits on `main` and `develop` cannot be rewritten or erased by maintainers or automation scripts.

### 4. Required Status Checks Before Merging

- **Setting**: **Require status checks to pass before merging** (Enabled)
- **Status Checks**:
  - `Verify GPG/SSH Commit Signatures` (`.github/workflows/verify-commits.yml`)
  - `Validate PR Title (Conventional Commits)` (`.github/workflows/pr-lint.yml`)
  - `SonarCloud Scan` (`.github/workflows/sonarcloud.yml`)
  - `Build OpenApply Documentation` (`.github/workflows/deploy-docs.yml`)

### 5. Public API Documentation & Code Quality Standards

- **Rule**: All public/exported interfaces, classes, types, enums, and functions in code must be documented with JSDoc headers (`/** ... */`).
- **Rule**: Inline implementation comments (`// ...`) inside function bodies are prohibited to keep code clean and self-documenting.
- **Exemption**: Configuration files (e.g. `.yml`, `.yaml`, `.json`, `.properties`, `*.config.ts`) are exempt from inline comment restrictions.
- **Enforcement**: Validated via `npm run lint:docs` in CI (`.github/workflows/deploy-docs.yml`).

### 6. Require Pull Request Approvals

- **Setting**: **Require a pull request before merging** (Enabled)
- **Required Approvals**: `1` approving review from a code owner / repository maintainer.
- **Dismiss stale pull request approvals when new commits are pushed**: Enabled.
