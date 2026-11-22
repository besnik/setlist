---
name: new-adr
description: Record an important decision as an ADR in docs/decisions/. Use when the CEO makes a decision with lasting impact (tech stack, dependency, architecture, workflow) or when proposing one for the CEO to decide.
---

# Record a decision (ADR)

1. Find the next free number in `docs/decisions/` (`NNNN`, four digits).
2. Copy `docs/decisions/0000-template.md` to `docs/decisions/NNNN-short-title.md`.
3. Fill in context, options considered (with pros and cons), decision and consequences. Keep it short — one screen is ideal.
4. Status:
   - `proposed` when the CEO has not decided yet — put your recommendation in the options and ask in chat.
   - `accepted` / `rejected` only after the CEO decided.
5. If it replaces an older decision, set the old ADR's status to `superseded by NNNN` (never delete ADRs).
6. Add a row to the index in `docs/decisions/README.md`.
7. Update any docs the decision affects (`ARCHITECTURE.md`, golden principles, specs) in the same PR.
