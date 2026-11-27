# Model tiers

The only place in the repository that names AI models. All other documents speak of **tiers**; if the tool or the models change, only this file and the `model:` lines in `.claude/agents/*.md` change.

Aliases (`opus`, `sonnet`) always point to the newest model of their family, so they do not go stale. Whether the choice is still right (new models, prices) is checked at every cost review ([operating model](../docs/company/operating-model.md#budget)).

## Tiers

| Tier | Alias | Use for |
|---|---|---|
| strong | `opus` | analysis, specs, `new-feature`, decisions on architecture, the end-of-milestone review |
| standard | `sonnet` | reviews (light and full QA), implementing approved tasks, small fixes, harness edits |

## Leads

Each lead's `model:` line in `.claude/agents/<lead>.md` must match this table.

| Lead | Tier |
|---|---|
| engineering-lead | strong — also takes hard implementation (larger feature, many files, refactoring) when the main session runs on standard |
| qa-lead | standard |
| product-lead | standard |
| design-lead | standard |
| marketing-lead | standard |

## Main session (GM)

The CEO picks the model when starting a session. Recommended:

- **strong** — a new feature or milestone (`new-feature`), a spec, an open technical question, a milestone end, and "start T-0NN" for a task marked `hard`.
- **standard** — "start T-0NN" for a task marked `standard`, review comments on a PR, harness edits, small topics.

The mark is set when the task is written ([task difficulty](../docs/company/operating-model.md#task-difficulty)); the GM recommends the model strictly by it.
