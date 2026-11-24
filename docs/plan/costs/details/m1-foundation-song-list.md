# M1 — Foundation and song list

- **Description:** milestone M1, built as one PR per task (T-012 … T-017).
- **PRs:** T-012 and T-013 — see the task table in [M1](../../milestones/M1-foundation-song-list.md).
- **Date:** 2026-11-24 (started)

## Lead runs

| Step | Who | Model | Tokens | Time | Tool uses | Note |
|---|---|---|---|---|---|---|
| T-013 skeleton, tooling, CI | GM | n/a | n/a | n/a | n/a | not measured |
| T-012 design foundation (first try) | design-lead | Opus 5.5 | 19,217 | 0:31 | 18 | blocked: its worktree was based on a stale `main` |
| T-012 design foundation | design-lead | Opus 5.5 | 41,805 | 3:17 | 30 | guidelines, tokens, components, UX sections of both specs |
| T-012 light QA | qa-lead | Opus 5.5 | 85,096 | 1:02 | 8 | 0 blocking, 10 other — 8 fixed by the GM, 1 raised to the CEO (song count during search), 1 placeholder |
| T-013 light QA | qa-lead | Opus 5.5 | 95,352 | 4:31 | 14 | 1 blocking (malformed request crashed the dev server), 4 other — 3 fixed, 1 recorded as tech debt; added `tests/tools/serve.test.js` |
| **Total so far** | | | **241,470** | **9:21** | **70** | |

## What drove cost

- A stale local `main` cost one wasted design run: the GM must fetch `main` before branching (the clone is shallow and does not update `origin/main` on its own).
- The T-013 QA was worth it: it found a crash of the dev server that the GM's own checks missed.
