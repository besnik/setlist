# 0001. Agentic operating model and repository harness

- **Status:** accepted — planning part superseded by [0002](0002-knowledge-base-and-planning.md)
- **Date:** 2026-11-22
- **Decided by:** CEO

## Context

Setlist is developed almost entirely by AI agents, directed by a single human owner. Before writing any product code we need a clear, written system for how agents work, who decides what, and how work is planned and reviewed — a "harness".

## Options considered

1. **Ad-hoc prompting** — no written rules. Fast to start, but inconsistent and hard to scale.
2. **Written harness with a virtual company model** — CEO, GM and department leads with explicit decision rights. More upfront work, but predictable and auditable.

## Decision

Adopt option 2:

- **Roles:** CEO (human) → GM (main agent) → five department leads as subagents: product, engineering, QA, design, marketing.
- **Decision rights:** dependencies, architecture, larger refactorings, story approval and anything public are CEO decisions.
- **Core principles:** simplicity first — add complexity only when it is needed (YAGNI); modern, polished UI/UX.
- **Language:** chat with the CEO in Slovak; everything in the repository in English.
- **Workflow:** branch per change, small pull requests, CEO squash-merges. `main` is protected (PR required, no force push, no deletion); branches are auto-deleted after merge.
- **Conventions:** [Conventional Commits](https://www.conventionalcommits.org) for commits, PR titles and branch prefixes.
- **Planning:** markdown files in `docs/plan/` (roadmap, milestones, stories, inbox) instead of GitHub Issues for now — agents can read and edit them freely and changes go through PR review. GitHub Issues may be added later for community feedback.
- **Decisions:** recorded as ADRs in `docs/decisions/`.

## Consequences

- Every session starts from `CLAUDE.md`; rules live in the repository, not in chat history.
- The CEO keeps control through PR review and explicit decisions, without micromanaging.
- Planning has no kanban board UI; acceptable at this scale.
- Rules will evolve — changes to the operating model go through PRs and, if significant, a new ADR.
