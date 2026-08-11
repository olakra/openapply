# OpenApply Git Flow & Rebase Workflow Guide 🛠️

This guide outlines OpenApply's Git Flow standards to maintain a 100% linear, atomic, and verified commit history across `main` and `develop`.

---

## 📐 Git Flow Branching Strategy

| Branch Type | Naming Convention | Base Branch | Target Merge Branch |
|---|---|---|---|
| **Feature** | `feature/issue-<num>-<short-name>` | `develop` | `develop` |
| **Bug Fix** | `fix/issue-<num>-<short-name>` | `develop` | `develop` |
| **Documentation** | `docs/issue-<num>-<short-name>` | `develop` | `develop` |
| **CI / DevOps** | `ci/issue-<num>-<short-name>` | `develop` | `develop` |
| **OPEX / Refactor** | `opex/issue-<num>-<short-name>` | `develop` | `develop` |

---

## 🔄 Local Rebase & Squash Workflow

Before submitting a Pull Request, ensure your feature branch is rebased on top of `origin/develop` and your commits are squashed cleanly into single logical units.

### 1. Fetch Latest Remote Tracking References
```bash
git fetch origin
```

### 2. Rebase Feature Branch onto `origin/develop`
Rebase your feature branch directly on top of the target branch:
```bash
git checkout feature/issue-26-linear-git-history
git rebase origin/develop
```
> **Note**: If merge conflicts occur, resolve them in your code editor, stage the files with `git add <file>`, and continue the rebase with `git rebase --continue`.

### 3. GPG / SSH Local Key Setup & Automatic Signing
Configure Git to automatically sign all commits locally using your GPG or SSH key:
```bash
# 1. List GPG keys to get your Key ID
gpg --list-secret-keys --keyid-format=long

# 2. Configure Git signing key ID
git config --global user.signingkey <YOUR_KEY_ID>

# 3. Enable automatic commit signing globally
git config --global commit.gpgsign true
```

### 4. Signed Interactive Rebase & Squash (`git rebase -i -S`)
To combine multiple local WIP commits into one clean, verified commit while preserving signature verification:
```bash
# Rebase interactively onto origin/develop with signature enforcement (-S)
git rebase -i -S origin/develop
```
In your editor, mark the first commit as `pick` and subsequent commits as `squash` (or `s`):
```text
pick 1a2b3c4 feat(extension): initial implementation
squash 5d6e7f8 fix typo in storage engine
squash 9a0b1c2 update unit tests
```

### 5. Single Signed Commit (`git commit -S`)
All commits merged into `develop` or `main` MUST be cryptographically signed (`-S`):
```bash
git commit -S -m "feat(extension): implement Manifest V3 sidepanel listener (Closes #27)"
```

### 5. Safe Force Push (`--force-with-lease`)
When updating a feature branch that was previously pushed to remote, ALWAYS use `--force-with-lease` instead of `-f`. This prevents overwriting commits if a team member pushed changes to the remote branch:
```bash
git push origin feature/issue-26-linear-git-history --force-with-lease
```

---

## 🏷️ Conventional Commits Title Convention

All Pull Request titles are validated automatically by GitHub Actions (`.github/workflows/pr-lint.yml`). Ensure your PR title follows the structure:

```text
<type>(<scope>): <short description> (Closes #<issue_number>)
```

### Accepted Types:
- `feat`: New feature or user-facing capability
- `fix`: Bug fix
- `docs`: Documentation updates
- `ci`: CI/CD workflow configuration
- `chore`: Dependency updates or build tooling
- `refactor`: Code restructuring without behavioral change
- `perf`: Performance improvements
- `test`: Unit or integration test additions
- `opex`: Operational excellence & infrastructure optimization
- `design`: UI/UX design & brand asset updates

---

## 🔒 GitHub Pull Request & Merge Policy

- Pull Requests are merged using **Squash and Merge**.
- GitHub automatically combines all PR commits into **1 single atomic commit** on `develop` or `main`.
- The merged commit title defaults to the validated Conventional Commit PR Title and includes the issue closure keyword (`Closes #<issue_number>`).
