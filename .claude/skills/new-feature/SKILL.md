---
name: new-feature
description: Take a new feature (or a whole milestone such as the MVP) from an idea to approved, ready-to-build tasks — functionality analysis, product spec, UX flow, technical impact, tasks. Use whenever the CEO wants to add or change app functionality, before any code is written.
---

# New feature: from idea to tasks

**Functionality first:** analyze what the feature must do before designing how to build it.
Scale every step to the size of the feature — for a small one, steps 1–6 can be a few sentences in one PR; for a big one, also create an execution plan in `docs/plan/plans/`.
Involve leads (product, design, engineering) only for bigger features (budget rule in `AGENTS.md`).

🛑 = stop and wait for the CEO.

## 1. Clarify the intent (chat, in Slovak)

Ask a few questions at once — not a questionnaire:
- Which problem does it solve?
- In which situation is it used (gig, rehearsal, at home)?
- What is a must-have and what is nice-to-have?
- What should it **not** do?

## 2. Check existing specs

Read `docs/product-specs/index.md` and related specs. Look for overlap or conflicts and raise them.

## 3. Write the spec

Create or update a spec in `docs/product-specs/` (template: `_template.md`), status `draft`:
- concrete, testable rules (given / when / then),
- out of scope,
- open questions, each with a recommendation.

Update the spec index. 🛑 **The CEO approves the spec** (status `approved`).

## 4. UX flow (only if screens or navigation change)

Describe screens and transitions in markdown with simple ASCII sketches — in the spec or a linked section. Follow the design principles in `.claude/agents/design-lead.md`.

## 5. Technical impact

Check against `ARCHITECTURE.md` and the golden principles:
- Does it fit the current structure?
- Does it need an ADR, a new dependency or a larger refactoring?

🛑 **If yes, the CEO decides** (use the `new-adr` skill for the proposal).

## 6. Break it into tasks

Add rows `T-NNN` with status `proposed` to the milestone's task table, each linked to a spec section. Small, independently mergeable tasks.
🛑 **The CEO approves the tasks** — only then does implementation start.

## Output

One PR with the spec (and plan, tasks, ADR if any), opened with the `open-pr` skill, and a report to the CEO listing what needs approval.
