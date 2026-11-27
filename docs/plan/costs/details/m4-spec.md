# M4 spec — Song format

- **Description:** ADR 0008 (stored formats `plain` and `chordpro`, notation tag, source fields), the song format spec in songs.md (ChordPro subset, source line, two Slovak sample songs), its design, tasks T-033–T-037.
- **PR:** [#47](https://github.com/besnik/setlist/pull/47)
- **Date:** 2026-11-27

## Lead runs

| Step | Who | Model | Tokens | Time | Tool uses | Note |
|---|---|---|---|---|---|---|
| Analysis, spec, design, tasks | GM | n/a | n/a | n/a | n/a | not measured; 4 CEO stops (questions, input scope, sample songs) |
| Light QA of the spec | qa-lead | standard | 36,033 | 0:46 | 6 | 2 blocking, 6 other — all addressed |
| **Total** | | | **36,033** | **0:46** | **6** | |

## What drove cost

- The blocking findings were in the source line: its visible text for every combination of name and link, and a link check that must parse the address instead of comparing a prefix.
