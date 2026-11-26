# M2 spec — Install and offline

- **Description:** Spec of install, offline and updates (section of app-shell.md), provisional icon, tasks T-021–T-023.
- **PR:** — (to be added)
- **Date:** 2026-11-26

## Lead runs

| Step | Who | Model | Tokens | Time | Tool uses | Note |
|---|---|---|---|---|---|---|
| Analysis, spec, design, tasks | GM | n/a | n/a | n/a | n/a | not measured; 0 CEO stops before the PR |
| Light QA of the spec | qa-lead | inherited | 94,316 | 1:34 | 3 | 2 blocking, 10 other — all addressed |
| **Total** | | | **94,316** | **1:34** | **3** | |

## What drove cost

- The QA review read the whole spec, ADRs and the check tool; it found two service-worker facts that would have failed the CEO's hand test (reload does not switch versions, install can cache stale files).
