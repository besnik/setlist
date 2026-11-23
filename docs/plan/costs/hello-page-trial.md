# Hello page (trial)

- **Description:** static "Hello, Setlist" view: a header, a list of 12 traditional songs and a Spotify-like bottom bar. HTML + CSS only, responsive, with light and dark themes. A throwaway feature, used to test the harness end to end.
- **PR:** [#5](https://github.com/besnik/setlist/pull/5) (closed without merge)
- **Date:** 2026-11-23

## Lead runs

| Step | Who | Model | Tokens | Time | Tool uses | Note |
|---|---|---|---|---|---|---|
| Spec (new-feature step 4) | product-lead | Opus 5.5 | 23,338 | 1:10 | 9 | |
| UX and visual design (step 5) | design-lead | Opus 5.5 | 33,629 | 2:40 | 8 | |
| Implementation (T-006) | engineering-lead | Opus 5.5 | 101,772 | 2:31 | 15 | includes its own Playwright checks and screenshots |
| QA review | qa-lead | Opus 5.5 | 124,055 | 4:11 | 21 | independent rule-by-rule check over 10 viewports |
| **Total** | | | **282,794** | **10:32** | **53** | |

The GM's work (planning, technical impact, tasks, fixes after QA, PR handling) is not measured and not included.

## What drove cost

- Engineering and QA each wrote their own verification scripts from scratch (overflow, scrolling, contrast), because the repository has no test setup. That accounts for most of the ~226k tokens in those two steps.
- For a small feature, the product and design leads added little the GM could not have written itself. QA did find real issues: spec contradictions and narrow-zoom overflow.
