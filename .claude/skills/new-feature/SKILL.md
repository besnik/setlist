---
name: new-feature
description: Take a new feature (or a whole milestone such as the MVP) from an idea to approved, ready-to-build tasks — functionality analysis, optional throwaway prototype, product spec, UX flow, technical impact, tasks. Use whenever the CEO wants to add or change app functionality, before any code is written, and when the CEO brings back a prototype intake package.
---

# New feature: from idea to tasks

**Functionality first:** analyze what the feature must do before designing how to build it.
Scale every step to the size of the feature — for a small one, steps 1–7 can be a few sentences in one PR; for a big one, also create an execution plan in `docs/plan/plans/`.
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

## 3. Prototype (optional)

Explore cheaply outside the harness before building carefully inside it. The CEO builds throwaway prototypes in a separate, clean session; the harness receives only the learnings.

### 3a. Uncertainty check

Is any of these unclear?

| Area | Signal |
|---|---|
| UI / UX | Not clear how it should look or be operated; several reasonable variants |
| Data | New format or unclear data model |
| Technology | A web API or library we have not used yet |
| Integration | An external system, file format or service |
| Performance | Unclear whether it handles the expected volume |

- **Nothing unclear** → skip to step 4.
- **Something unclear** → 🛑 propose a prototype to the CEO: name the area and the one question it should answer. If the CEO declines, carry the uncertainty into the spec as an open question.

### 3b. Kickoff prompt (chat only)

If the CEO agrees, write the kickoff prompt **into the chat** as a single markdown block the CEO can copy. Do **not** write anything to the repository. Use the template at the end of this skill.

The kickoff must be self-contained and must **not** include project rules, roles, architecture or golden principles — only the domain context the prototype needs.

Then stop. The CEO builds 1–3 variants, picks one and combines the best parts in that separate session, and comes back with an intake package: `intake.md` plus the prototype file(s) (one HTML file or a zip).

### 3c. Intake

When the CEO uploads the intake package to the chat:

1. Read `intake.md` and the prototype files (unzip if needed).
2. Treat the prototype **only as a reference for behavior and look. Never copy its code** into the app — the implementation is written from scratch, following the architecture and golden principles.
3. For each point under *Decision* and *Required behavior*, decide: adopt / adapt / reject (with a reason, e.g. conflicts with architecture or offline-first).
4. The prototype files are not stored in the repository and disappear with the session — so everything that matters (behavior, design notes, findings, open questions) must end up in the spec in step 4. In the spec, note that it is based on a prototype and summarize the variants that were rejected and why.

## 4. Write the spec

Create or update a spec in `docs/product-specs/` (template: `_template.md`), status `draft`:
- concrete, testable rules (given / when / then),
- out of scope,
- open questions, each with a recommendation.

Update the spec index. 🛑 **The CEO approves the spec** (status `approved`).

## 5. UX flow (only if screens or navigation change)

Describe screens and transitions in markdown with simple ASCII sketches — in the spec or a linked section. Follow the design principles in `.claude/agents/design-lead.md`.

## 6. Technical impact

Check against `ARCHITECTURE.md` and the golden principles:
- Does it fit the current structure?
- Does it need an ADR, a new dependency or a larger refactoring?

🛑 **If yes, the CEO decides** (use the `new-adr` skill for the proposal).

## 7. Break it into tasks

Add rows `T-NNN` with status `proposed` to the milestone's task table, each linked to a spec section. Small, independently mergeable tasks.
🛑 **The CEO approves the tasks** — only then does implementation start.

## Output

One PR with the spec (and plan, tasks, ADR if any), opened with the `open-pr` skill, and a report to the CEO listing what needs approval.

## Kickoff prompt template

Fill in the `<…>` parts. Keep it short. Write it in English (the CEO may also ask for Slovak).

````markdown
# Prototype: <feature name>

This is a quick, throwaway prototype. Ignore code quality, tests, structure and edge cases — the goal is learnings, not production code.

## Question
<The one question this prototype should answer, e.g. "Which way of transposing chords is most comfortable while playing on stage?">

## Context
<2–5 sentences: what the app is, who uses it and in which situation (e.g. a guitarist on stage, one free hand, dark venue, no internet).>

## Domain
- <term>: <explanation>
- Data format: <e.g. lyrics with inline chords: `[G]Amazing [D]grace`>

## Sample data
```
<a small sample of realistic data>
```

## What to build
- 1–3 clearly different variants, each as a standalone HTML page (vanilla HTML/CSS/JS, no build, no dependencies). Unconventional ideas are welcome.
- Happy path only, no persistence unless the question needs it.

## Combining
After I compare the variants, I will tell you which one is the base and what to take from the others. Then build `final.html` that combines them.

## Intake package
When I say "done", write `intake.md` using this template. Be short and concrete, and include what did NOT work and why.

```markdown
# Prototype intake: <feature name>

## Question
<the question above>

## Decision
- Base: variant <X>
- Taken from other variants: <what, from which>
- Rejected: <what, and why>

## Required behavior
- <testable statements from the user's point of view>

## Design notes
- <layout, sizes, colors, interactions worth keeping>

## Findings
- <surprises, browser or API limits, performance>

## Open questions
- <what the prototype did not answer>

## Reference
`final.html` — reference for behavior and look only; do not copy the code.
```
````
