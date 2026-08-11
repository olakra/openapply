# OpenApply GitHub Repository Merge & Branch Settings

This document specifies the required repository configuration under **Settings > General > Pull Requests** for `olakra/openapply` to enforce a clean, linear commit history across `main` and `develop` branches.

## 🔀 Pull Request Merge Strategy Configuration

| Setting | Status | Configuration Detail |
|---|---|---|
| **Allow squash merging** | ✅ **ENABLED** | Set as the default merge method for all Pull Requests. |
| **Squash commit title** | 📌 **PR_TITLE** | Default commit title to the validated PR Title. |
| **Squash commit description** | 📝 **PR_TITLE_AND_DESCRIPTION** | Default commit body to the PR title and description summary. |
| **Allow merge commits** | ❌ **DISABLED** | Prevents non-linear dual-parent merge commits on `main` and `develop`. |
| **Allow rebase merging** | ❌ **DISABLED** | Forces all PRs into 1 single, clean, verified atomic commit upon merge. |
| **Automatically delete head branches** | ✅ **ENABLED** | Automatically cleans up feature branches on GitHub after PR merge. |

---

## 🛡️ Branch Protection Rules (`main` & `develop`)

Under **Settings > Branches > Branch Protection Rules**:

- [x] **Require a pull request before merging**: Required approving reviews: `1`.
- [x] **Require status checks to pass before merging**:
  - `SonarCloud Scan`
  - `Validate PR Title (Conventional Commits)`
  - `Build OpenApply Documentation`
- [x] **Require linear history**: Prevent merge commits from being pushed to `main` or `develop`.
- [x] **Require signed commits**: All commits must be cryptographically signed via GPG/SSH (`git commit -S`).
