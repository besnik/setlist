# M5 spec — Manage songs

- **Description:** ADR 0009 (songs in IndexedDB), the Manage songs spec in songs.md (storage, song form, help, add, edit, delete, unsaved changes, failures, another tab, security), its design and the M5 components in the guidelines, tasks T-039–T-047.
- **PR:** [#57](https://github.com/besnik/setlist/pull/57)
- **Date:** 2026-11-28

## Lead runs

| Step | Who | Model | Tokens | Time | Tool uses | Note |
|---|---|---|---|---|---|---|
| Analysis, spec, design, tasks | GM | n/a | n/a | n/a | n/a | not measured; 0 CEO stops (scope agreed earlier) |
| Light QA of the spec | qa-lead | standard | 53,583 | 1:25 | 12 | 2 blocking, 9 other — all addressed except the ADR wording (kept as in the template) |
| **Total** | | | **53,583** | **1:25** | **12** | |

## What drove cost

- Both blocking findings were about browser history: the form must not stay in the history after Save, and the unsaved-changes question must undo a Back that already happened. The spec now names the technique (history state with an index and `from`, `replace()`, `history.go()`), which future screens with forms (M6) reuse.
