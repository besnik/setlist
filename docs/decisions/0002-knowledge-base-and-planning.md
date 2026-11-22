# 0002. Repository knowledge base and lightweight planning

- **Status:** accepted
- **Date:** 2026-11-22
- **Decided by:** CEO
- **Supersedes:** the planning part of [0001](0001-agentic-operating-model.md) (stories)

## Context

Inspired by OpenAI's [Harness engineering](https://openai.com/index/harness-engineering/) article: agents work best when the repository is the system of record and the entry point is a short map, not an encyclopedia. We are a solo developer with a limited AI budget, so we adopt only the parts with the best value for cost.

User stories in separate files would scatter the description of what the app does across many files.

## Options considered

1. **Keep user stories** — familiar, but behavior gets scattered and buried over time.
2. **Product specs + lightweight tasks** — one living spec per functional area as the source of truth; work tracked as task rows in milestones, with execution plans only for bigger tasks.

## Decision

- **`AGENTS.md` is a short router** (~100 lines) pointing into `docs/`. `CLAUDE.md` only imports it, so other agent tools work too.
- **Product specs** in `docs/product-specs/` replace user stories.
- **Tasks** (`T-NNN`) are rows in milestone files; **execution plans** in `docs/plan/plans/` only for bigger tasks.
- **Golden principles** in `docs/golden-principles.md`; **tech debt** tracked in `docs/plan/tech-debt.md`.
- **Skills** in `.claude/skills/` for repeatable workflows (start with `open-pr`, `new-adr`).
- **Feedback becomes rules:** corrections are captured in the repo; recurring ones become mechanical checks.
- **Budget rule:** the GM does small tasks itself and spawns leads only for substantial work.
- `ARCHITECTURE.md` and `SECURITY.md` live at the repository root.

Not adopted for now (cost or no need): observability stack, agent-to-agent review replacing the CEO, auto-merge, recurring background agents, quality grades (later).

## Consequences

- Less context loaded per session; details are read only when needed.
- One place to read what the app does.
- Specs must be kept up to date in every behavior-changing PR.
