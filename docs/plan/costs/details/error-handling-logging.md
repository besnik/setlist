# Error handling and logging

- **Description:** General rules for errors and logging (golden principle 20, ADR 0007), the app's log module, every `catch` narrowed, check rules against swallowed errors (T-031).
- **PR:** [#44](https://github.com/besnik/setlist/pull/44)
- **Date:** 2026-11-26

## Lead runs

| Step | Who | Model | Tokens | Time | Tool uses | Note |
|---|---|---|---|---|---|---|
| Analysis, plan, implementation and tests | GM | n/a | n/a | n/a | n/a | not measured |
| Light QA | qa-lead | inherited | 100,357 | 1:29 | 11 | 1 blocking (dev server 500 on `%00`, fixed, test added), 4 other (2 fixed, 2 noted) |
| **Total** | | | **100,357** | **1:29** | **11** | |

## What drove cost

- QA checked every narrowed `catch` against its old behavior, by hand on the dev server too — that found the one regression.
