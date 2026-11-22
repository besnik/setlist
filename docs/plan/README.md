# Planning

All product planning lives here, as plain markdown.

| File / folder | Purpose |
|---|---|
| [roadmap.md](roadmap.md) | Overview of milestones and their status |
| [inbox.md](inbox.md) | Raw ideas, not yet refined into stories |
| [milestones/](milestones/) | One file per milestone: goal, scope, list of stories |
| [stories/](stories/) | One file per user story, based on [the template](stories/_template.md) |

## Story lifecycle

```
proposed ──► approved ──► in-progress ──► done
    │
    └──► rejected
```

| Status | Meaning | Who sets it |
|---|---|---|
| `proposed` | Written, waiting for CEO review | Product lead / GM |
| `approved` | CEO agreed — ready to be worked on | **CEO only** |
| `in-progress` | Being worked on in a branch | GM |
| `done` | Merged to `main`, acceptance criteria met | GM (in the PR) |
| `rejected` | Not going to happen (reason noted in the story) | **CEO only** |

**Only `approved` stories may be worked on.** The CEO approves either in chat or by merging a PR that changes the status.

## Conventions

- Story IDs: `S-001`, `S-002`, … — file name `S-NNN-short-name.md`.
- Milestone IDs: `M0`, `M1`, … — file name `MN-short-name.md`.
- Every story belongs to exactly one milestone.
- When a story's status changes, update its milestone file too.
