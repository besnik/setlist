# MVP plan

- **Description:** MVP split into milestones M1–M8 (+ M9 user guide after the MVP), ADR 0004 (tech stack and architecture), ADR 0005 (tooling, tests, CI, deployment), architecture, M1 specs and tasks, prototype reference.
- **PR:** [#14](https://github.com/besnik/setlist/pull/14)
- **Date:** 2026-11-24

## Lead runs

| Step | Who | Model | Tokens | Time | Tool uses | Note |
|---|---|---|---|---|---|---|
| Analysis, questions, plan, specs, ADRs | GM | n/a | n/a | n/a | n/a | not measured; 3 CEO stops in chat |
| Independent review of ADRs, architecture and M1 tasks | engineering-lead | Opus 5.5 | 92,953 | 1:09 | 9 | 2 blocking, 8 should fix, 5 suggestions — all addressed or raised to the CEO |
| **Total** | | | **92,953** | **1:09** | **9** | |

## What drove cost

- The review was worth it: it found the shared-origin storage risk and the missing WebKit browser in the agent environment, both hard to fix later.
