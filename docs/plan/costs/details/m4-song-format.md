# M4 — Song format

- **Description:** Implementation of the song format tasks T-033–T-037 (rows for tasks whose PRs used leads).
- **PRs:** [#48](https://github.com/besnik/setlist/pull/48) (T-033), T-034 (this PR)
- **Date:** 2026-11-27

## Lead runs

| Step | Who | Model | Tokens | Time | Tool uses | Note |
|---|---|---|---|---|---|---|
| T-033 implementation and tests | GM | n/a | n/a | n/a | n/a | not measured |
| T-033 light QA | qa-lead | standard | 27,465 | 0:25 | 2 | 0 blocking, 2 other (guidance for T-035 and M5) |
| T-034 implementation and tests | GM | n/a | n/a | n/a | n/a | not measured |
| T-034 light QA | qa-lead | standard | 24,105 | 0:23 | 5 | 1 blocking (directive names like object properties), 0 other |
| **Total** | | | **51,570** | **0:48** | **7** | |

## What drove cost

- T-033: light QA because the change touches the offline file list and the song data shape (risky areas); a short brief with the changed files kept the run small.
- T-034: light QA because the new file goes into the offline file list; it found one real parser bug, so the run paid off.
