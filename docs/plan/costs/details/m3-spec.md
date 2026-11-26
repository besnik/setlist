# M3 spec — Song view

- **Description:** Spec of the song view (songs.md: open and close, content, provisional chord lines, font size, screen stays on), its stage design, tasks T-024–T-027.
- **PR:** [#36](https://github.com/besnik/setlist/pull/36)
- **Date:** 2026-11-26

## Lead runs

| Step | Who | Model | Tokens | Time | Tool uses | Note |
|---|---|---|---|---|---|---|
| Analysis, spec, design, tasks | GM | n/a | n/a | n/a | n/a | not measured; 1 CEO stop (five questions answered at once) |
| Light QA of the spec | qa-lead | inherited | 95,312 | 1:36 | 4 | 1 blocking, 8 other — all addressed |
| **Total** | | | **95,312** | **1:36** | **4** | |

## What drove cost

- The QA review read the spec, the guidelines, the sample songs and the check tool; the blocking finding was an under-specified chord grammar (sequence of extensions, bass accidentals, whitespace) that would have left the T-025 unit tests to guesswork.
