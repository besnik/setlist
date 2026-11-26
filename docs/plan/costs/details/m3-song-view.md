# M3 — Song view

- **Description:** Implementation of the song view tasks T-024–T-027 (rows for tasks whose PRs used leads).
- **PRs:** [#41](https://github.com/besnik/setlist/pull/41) (T-026), [#42](https://github.com/besnik/setlist/pull/42) (T-027)
- **Date:** 2026-11-26

## Lead runs

| Step | Who | Model | Tokens | Time | Tool uses | Note |
|---|---|---|---|---|---|---|
| T-026 implementation and tests | GM | n/a | n/a | n/a | n/a | not measured |
| T-026 architecture check | engineering-lead | inherited | 83,225 | 0:23 | 2 | 0 blocking, 3 other (2 fixed, 1 guidance for T-027) |
| T-027 implementation and tests | GM | n/a | n/a | n/a | n/a | not measured |
| T-027 architecture check | engineering-lead | inherited | 78,340 | 0:45 | 4 | 0 blocking, 3 other (2 fixed, 1 to tech debt) |
| T-027 light QA | qa-lead | inherited | 84,647 | 0:34 | 4 | 0 blocking, 2 other (both already handled) |
| **Total** | | | **246,212** | **1:42** | **10** | |

## What drove cost

- The architecture check read the whole diff and the architecture docs; it is required for every task that adds a module, even a small one.
