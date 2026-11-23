# Gig mode (trial)

- **Description:** static "Gig mode" stage screen: current song (title, key, duration), next song, progress `3 / 12` and visual-only Previous / Next buttons. HTML + CSS only, always dark, sample data. A throwaway feature, used to test the harness after the hello-page improvements.
- **PR:** [#10](https://github.com/besnik/setlist/pull/10) (closed without merge)
- **Date:** 2026-11-23

## Lead runs

| Step | Who | Model | Tokens | Time | Tool uses | Note |
|---|---|---|---|---|---|---|
| Spec, design, tech impact, task (steps 1–7) | GM | n/a | n/a | n/a | n/a | not measured |
| Implementation (T-010) | GM | n/a | n/a | n/a | n/a | two files; own overflow check and 2 screenshots |
| Light QA | qa-lead | Opus 5.5 | 83,112 | 0:49 | 6 | 0 blocking, 4 other (1 CSS, 3 spec wording) |
| **Total** | | | **83,112** | **0:49** | **6** | |

## What drove cost

- Only QA was delegated (small-mode budget rule), so lead cost fell from ~283k (hello page) to ~83k tokens.
- QA still wrote its verification script from scratch (no test tooling) — the remaining main cost driver.
