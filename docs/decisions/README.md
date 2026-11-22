# Decision records

Important decisions are recorded here as short **ADRs** (Architecture Decision Records), so we always know *what* was decided, *why*, and *what else* was considered.

## When to write one

- Every decision that belongs to the CEO (see [operating model](../company/operating-model.md#decision-rights)) and has lasting impact: tech stack, dependencies, architecture, data model, workflow changes.
- Not needed for small implementation details.

## How

1. Copy [0000-template.md](0000-template.md) to `NNNN-short-title.md` (next free number).
2. Fill it in with status `proposed` and open it in a pull request.
3. When the CEO decides, set the status to `accepted` or `rejected`.
4. ADRs are never deleted. If a decision changes, write a new ADR and mark the old one `superseded by NNNN`.

## Index

| # | Title | Status |
|---|---|---|
| [0001](0001-agentic-operating-model.md) | Agentic operating model and repository harness | accepted (planning part superseded by 0002) |
| [0002](0002-knowledge-base-and-planning.md) | Repository knowledge base and lightweight planning | accepted |
| [0003](0003-layered-architecture.md) | Layered architecture for domains and UI | accepted |
