---
name: new-feature
description: Take a new feature (or a whole milestone such as the MVP) from an idea to approved, ready-to-build tasks — mode (small/big), functionality analysis, optional throwaway prototype, product spec, UX and visual design, technical impact, tasks. Use whenever the CEO wants to add or change app functionality, before any code is written, and when the CEO brings back a prototype intake package.
---

# New feature: from idea to tasks

**Functionality first:** analyze what the feature must do before designing how to build it.
Scale every step to the size of the feature.

🛑 = stop and wait for the CEO.

## 0. Choose the mode

The GM proposes a mode in step 1 and the CEO confirms it. The GM switches to big mode (and says so) if the feature turns out bigger than expected.

| | 🟢 Small | 🔵 Big |
|---|---|---|
| When | One task, one screen or a clear change | Several tasks, a new data structure, or real uncertainty |
| Planning | Spec, design and task on the feature branch | Spec, design and tasks in a spec PR |
| CEO approval | **One stop in chat**: spec + design summary + task together | **Merging the spec PR** approves the spec and tasks (the CEO may also say OK in chat) |
| Pull requests | One, opened when the work and QA are done | One for the spec, then one per task |

"One topic = one PR" ([git workflow](../../../docs/company/git-workflow.md)): in small mode the topic is the whole feature; in big mode the spec is one topic and each task is another.

**Who does the work** does not depend on the mode — follow the delegation rule in the [operating model](../../../docs/company/operating-model.md#budget). After every lead run, record its usage in `docs/plan/costs/` (how: its README).

## 1. Clarify the intent (chat, in Slovak)

Ask a few questions at once — not a questionnaire:
- Which problem does it solve?
- In which situation is it used (gig, rehearsal, at home)?
- What is a must-have and what is nice-to-have?
- What should it **not** do?

Skip what the CEO's request already answers. Propose the mode (step 0).

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

Create or update the spec of the functional area in `docs/product-specs/` (template: `_template.md`; one file per area, the feature is a section), status `draft`:
- concrete, testable rules (given / when / then for behavior, plain rules for static content),
- out of scope,
- open questions for the CEO, each with a recommendation.

Update the spec index.

## 5. UX and visual design (only if screens change)

Describe layout, flows and the look in the spec's "UX and visual design" section: ASCII sketches, sizes, colors, typography. Follow the design principles in `.claude/agents/design-lead.md`.
Do not add elements the request did not ask for; offer them as an option in the design summary.
End with a **self-check**: every spec rule still holds with the design's numbers (sizes, counts, contrast) — on every supported screen size, in portrait and landscape.

For the CEO, write a **short design summary in chat** (layout, key decisions, an ASCII sketch), so the CEO never has to read the markdown. A visual preview (screenshot) only when the CEO asks or when the GM proposes it for a new look — always with a cost estimate first.

## 6. Technical impact

Check against `ARCHITECTURE.md` and the golden principles:
- Does it fit the current structure?
- **Where does the code go?** Name the new or changed files or modules and the one job of each (e.g. a new screen module, a new repository). Check that no existing file takes on a second job, and that the next planned tasks have a place too.
- Does it need an ADR, a new dependency or a larger refactoring?

Record the result in the spec's "Notes for Design / Engineering" section. These are working notes for building the milestone; the `close-milestone` skill removes them when it closes, so anything that must stay true long-term belongs in `ARCHITECTURE.md` or an ADR.
🛑 **If an ADR, dependency or larger refactoring is needed, the CEO decides** (use the `new-adr` skill for the proposal).

## 7. Break it into tasks

Add rows `T-NNN` with status `proposed` to the milestone's task table, each linked to a spec section. A task that adds code names the files or modules from the technical impact. Small, independently mergeable tasks.

Mark each task in the *Difficulty* column `hard` or `standard`, with a few words why — by the list in [task difficulty](../../../docs/company/operating-model.md#task-difficulty) (new component or module, shared contract, refactoring, security-sensitive code, open design choice → `hard`; when in doubt, `hard`). The mark picks the model for the session that builds the task.

🛑 **The CEO approves** — in small mode, spec, design and task in one chat message; in big mode, by merging the spec PR. The GM then records the approval: spec status `approved`, task status `approved`.

## Output

- 🟢 Small: the approved spec and task on the feature branch; implementation continues on the same branch, and one PR is opened at the end (`open-pr`).
- 🔵 Big: a spec PR (spec, tasks, ADR if any) opened with `open-pr`; after the merge, each task gets its own branch and PR.

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
