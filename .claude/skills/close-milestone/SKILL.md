---
name: close-milestone
description: Close a milestone after its last task is merged — architecture review, statuses, carry-over of open tasks, and compaction of the milestone's planning notes in the spec and the milestone file. Use when the CEO asks to close a milestone ("uzavri M5"), and to compact milestones that were closed before this skill existed ("uprac uzavreté milestony").
---

# Close a milestone

Goal: after a milestone, the repository says what is **true now** — not how we got there. Specs keep the rules the app follows; working notes written to build the milestone are removed once the code, the tests and `ARCHITECTURE.md` hold them. Git history and the merged PRs keep everything that is removed.

One session, one PR: `docs: close MN` (branch `docs/close-mN`). Review: none by a lead beyond the architecture review in step 1 (plan-only PR, [Reviews](../../../docs/company/operating-model.md#reviews)).

🛑 = stop and wait for the CEO.

## 0. Check it can close

Every task of the milestone is `done` or `rejected`, or the CEO agrees to carry it over (step 3). An open PR of the milestone → finish it first.

## 1. Architecture review

The Engineering lead (strong tier) answers the [structure questions](../../../docs/company/operating-model.md#structure-questions) over the whole codebase. Short brief: the milestone's files and a look ahead to the next milestone. Its findings: cheap fixes into this PR, the rest into `tech-debt.md` and as proposed cleanup tasks for the next milestone. Record the run in `docs/plan/costs/`.

**Backfill mode** (milestones closed before this skill): skip this step — their reviews were done.

## 2. Statuses

Set everything the milestone finished to its final state. The project's check command enforces the parts a machine can see.

- The milestone file and its row in `roadmap.md`: `done`.
- Every ADR the milestone decided: `accepted` (or `rejected`) — in the ADR file and in the ADR index.
- The spec: no section of this milestone still marked *draft* or *(planned)*; the status line of the spec file and its row in the spec index say the same.
- `tech-debt.md`: entries fixed in the milestone are gone; entries that wait for the next milestone say so.

## 3. Carry over open tasks

Tasks that are still `approved` or `proposed` move as rows into the next milestone (a section *Cleanup carried over* or its task table). The closed milestone keeps one line saying where they went. A done milestone holds only `done` and `rejected` tasks.

## 4. Compact the spec

For the sections of this milestone in its spec file(s):

- **Behavior rules stay** — they are the acceptance criteria and the tests name them. Only remove wording tied to the time of building ("in M4", "until M5" once M5 is done) and merge rules that say the same thing.
- **UX and visual design:** keep the sketch and the principles a later designer needs (what looks like what, what must never happen, CEO choices). Remove exact values that live in the code (sizes, custom properties, line heights, formulas) and the **self-check** tables — they verified the design before it was built; the tests check it now. Add one line saying where the values live.
- **Notes for Design / Engineering:** remove the milestone's block. First move anything still true and not found elsewhere into `ARCHITECTURE.md` or a comment in the code. Leave at most one line pointing to the code or `ARCHITECTURE.md`.
- Out of scope and open questions: remove items the milestone settled; keep the rest.

## 5. Compact the milestone file

Keep:

- goal, *Try it*, scope in a few lines, links to the spec and the ADRs,
- **key decisions** not recorded in an ADR or the spec — one line each, with who and when,
- task rows: two or three sentences each — what the task delivered, how it was tested, any CEO decision. File lists, version bumps and step-by-step details are in the PR,
- the architecture review result in two or three lines.

Remove:

- the analysis history (questions, options, leanings) that an ADR or the spec now records,
- ideas for later → one line each in `inbox.md` (with their content, not a link back to the milestone),
- execution plans `docs/plan/plans/T-NNN-*.md` of done tasks.

## 6. Never remove

ADRs (they are superseded, never deleted), cost records in `docs/plan/costs/`, valid tech-debt entries, CEO decisions and their dates. When unsure whether something is still needed, keep it and ask the CEO in the report.

## 7. Check and ship

Run the check command and the unit tests. Open the PR (`open-pr` skill); in *What*, list per file what was removed or moved and where it lives now, so the CEO can review the compaction quickly. 🛑 The CEO merges.
