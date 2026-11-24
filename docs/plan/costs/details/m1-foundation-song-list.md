# M1 — Foundation and song list

- **Description:** milestone M1, built as one PR per task (T-012 … T-017).
- **PRs:** T-012 … T-017 — see the task table in [M1](../../milestones/M1-foundation-song-list.md).
- **Date:** 2026-11-24

## Lead runs

| Step | Who | Model | Tokens | Time | Tool uses | Note |
|---|---|---|---|---|---|---|
| T-013 skeleton, tooling, CI | GM | n/a | n/a | n/a | n/a | not measured |
| T-012 design foundation (first try) | design-lead | Opus 5.5 | 19,217 | 0:31 | 18 | blocked: its worktree was based on a stale `main` |
| T-012 design foundation | design-lead | Opus 5.5 | 41,805 | 3:17 | 30 | guidelines, tokens, components, UX sections of both specs |
| T-012 light QA | qa-lead | Opus 5.5 | 85,096 | 1:02 | 8 | 0 blocking, 10 other — 8 fixed by the GM, 1 raised to the CEO (song count during search), 1 placeholder |
| T-013 light QA | qa-lead | Opus 5.5 | 95,352 | 4:31 | 14 | 1 blocking (malformed request crashed the dev server), 4 other — 3 fixed, 1 recorded as tech debt; added `tests/tools/serve.test.js` |
| T-014 deployment to GitHub Pages | GM | n/a | n/a | n/a | n/a | not measured |
| T-014 light QA | qa-lead | Opus 5.5 | 88,843 | 1:00 | 5 | 0 blocking, 3 other — newer action versions and folder redirects in the dev server fixed, 1 note for the PR description |
| T-015 app shell | GM | n/a | n/a | n/a | n/a | not measured |
| T-015 light QA | qa-lead | Opus 5.5 | 93,985 | 1:09 | 10 | 0 blocking, 4 other — 2 fixed in the check, 1 recorded as tech debt, 1 plan update; added 2 e2e tests (gutter, Central European letters) |
| T-016 safe rendering | GM | n/a | n/a | n/a | n/a | not measured |
| T-016 light QA | qa-lead | Opus 5.5 | 104,345 | 2:58 | 13 | 2 blocking (boolean attribute after a quoted one threw; `javascript:` URL through whitespace or a static start), 3 other — escaping fixes done by the GM, 1 product note; added 3 unit tests |
| T-017 song list and search | GM | n/a | n/a | n/a | n/a | not measured |
| T-017 light QA | qa-lead | Opus 5.5 | 96,915 | 1:38 | 13 | 0 blocking, 3 other — Safari search field style fixed, 1 recorded as tech debt, 1 plan update; added 1 unit test (unknown artist, no chip, escaping) |
| **Total** | | | **625,558** | **16:06** | **111** | |

## What drove cost

- A stale local `main` cost one wasted design run: the GM must fetch `main` before branching (the clone is shallow and does not update `origin/main` on its own).
- The T-013 QA was worth it: it found a crash of the dev server that the GM's own checks missed.
- The T-016 QA was worth it too: it broke the escaping in ways the GM's tests missed (the dangerous value placed after ordinary markup, not first).
