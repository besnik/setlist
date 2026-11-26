# Planning

What we are doing now and next. *What the app does* lives in [product specs](../product-specs/); this folder tracks the work.

| File / folder | Purpose |
|---|---|
| [roadmap.md](roadmap.md) | Overview of milestones and their status |
| [milestones/](milestones/) | One file per milestone: goal, scope and its **task table** |
| [inbox.md](inbox.md) | Raw ideas, not yet turned into tasks |
| [tech-debt.md](tech-debt.md) | Known shortcuts and issues to clean up later |
| [costs/](costs/) | Tokens and time spent by leads, per feature and step |
| `plans/` | Execution plans for bigger tasks — created when the first one is needed |

## Tasks

A task is one row in a milestone's task table:

| ID | Task | Spec | Status | PR |
|---|---|---|---|---|
| T-042 | Reorder songs in a setlist | `setlists.md#reorder` *(example)* | approved | — |

- IDs are global and sequential: `T-001`, `T-002`, … Use them in branch names, commits and PRs.
- Acceptance criteria come from the linked spec section (plus anything written in the task row or plan).
- **Bigger tasks** (several PRs, open design questions) get an execution plan `plans/T-NNN-short-name.md` with steps, progress and a decision log. Small tasks need nothing more than the row.

## Task lifecycle

```
proposed ──► approved ──► in-progress ──► done
    │
    └──► rejected
```

| Status | Meaning | Who sets it |
|---|---|---|
| `proposed` | Written, waiting for CEO review | GM / leads |
| `approved` | CEO agreed — ready to be worked on | **CEO only** |
| `in-progress` | Being worked on in a branch | GM |
| `done` | Merged to `main` | GM (in the PR) |
| `rejected` | Not going to happen | **CEO only** |

**Only `approved` tasks may be worked on.** The CEO approves in chat or by merging a PR that changes the status. An explicit instruction from the CEO in chat counts as approval — the GM records the task row in the same PR.

## Milestones

- IDs `M0`, `M1`, … — file name `MN-short-name.md`.
- Every task belongs to exactly one milestone.
- A milestone becomes `done` only after its [architecture review](../company/operating-model.md#architecture-checks) of the whole codebase; approved cleanup tasks from it go into the next milestone.
