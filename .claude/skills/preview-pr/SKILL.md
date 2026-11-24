---
name: preview-pr
description: Run a pull request of besnik/setlist on the CEO's own computer so the CEO can try it in a browser (also on a phone in the same network), then clean up. Use when the CEO asks to see, try or preview a PR locally ("ukáž mi PR 25"). Preview only — no edits, commits or pushes.
---

# Preview a pull request locally

The CEO wants to try a PR before merging it. This is **not development work**: change no files, commit nothing, push nothing, and skip the start-of-session routine in `AGENTS.md` beyond reading it.

**Only in a session that runs on the CEO's computer.** A cloud session cannot serve a page the CEO can open. If this session runs in the cloud, say so and offer screenshots of the PR in chat instead (at most a few, with a cost estimate first).

## Steps

1. **PR number.** Take it from the CEO's message; ask if it is missing.
2. **Prerequisites.** Check that Git and the runtime required in [ARCHITECTURE.md](../../../ARCHITECTURE.md) (*Parts and tests*, *Other commands*) are installed in a sufficient version. If not, stop and tell the CEO what to install and from where.
3. **Clean working tree.** If `git status` shows uncommitted changes, stop and ask the CEO what to do with them — never discard them.
4. **Fetch and switch** (works for any PR, no GitHub CLI needed):

   ```bash
   git fetch origin pull/<n>/head:pr-<n> --force
   git checkout pr-<n>
   ```

5. **Dependencies.** Install them with the command from ARCHITECTURE.md when they are missing or the lock file changed compared with `main`.
6. **Start the dev server in the background** (command and address in ARCHITECTURE.md) and confirm the app address answers.
7. **Tell the CEO** (in Slovak):
   - the address on this computer;
   - the address for a phone in the same Wi-Fi: this computer's local IPv4 address (Windows: `ipconfig`) with the same port and path;
   - that on the first run the operating system's firewall may ask for access — allow it for **private networks**, otherwise the phone cannot open the page;
   - in two or three lines, what the PR changes and what to look at (from the PR description or its commits). If it has no visible change, say so.
8. **Wait.** Do nothing else until the CEO says they are done ("hotovo").
9. **Clean up:** stop the dev server, `git checkout main`, `git branch -D pr-<n>`, and confirm it to the CEO.

## First time on a new computer

Skills load only in a session started inside the repository folder. If the CEO has no clone yet, the CEO starts a local session in the parent folder (e.g. `Documents`) with the opener from [docs/ceo-guide.md](../../../docs/ceo-guide.md#previewing-a-pull-request-on-your-computer), which clones the repository first.
