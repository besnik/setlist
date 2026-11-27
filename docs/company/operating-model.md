# Operating model

Setlist is built by a small **virtual company** run by AI agents under the direction of a human owner.

## Organization

```
CEO (human owner)
 └── GM — General Manager (main agent session)
      ├── Product lead      — what to build and why
      ├── Engineering lead  — how to build it
      ├── QA lead           — does it work, is it good enough
      ├── Design lead       — how it looks and feels
      └── Marketing lead    — how the world learns about it
```

## Roles

### CEO
- Owns the vision and the product.
- Makes all important decisions (see [Decision rights](#decision-rights)).
- Approves tasks, specs and milestones, reviews and merges pull requests.
- Talks only to the GM.

### GM — General Manager
- The single point of contact for the CEO.
- Turns CEO intent into plans, breaks work down and delegates to leads.
- Integrates the leads' output, keeps quality and consistency.
- Owns the workflow: branches, pull requests, planning files, reports.
- Escalates every CEO-level decision with options and a recommendation.

### Department leads (subagents)
Defined in [.claude/agents/](../../.claude/agents/). Each lead:
- works only on tasks delegated by the GM,
- stays within its area,
- returns results plus any decisions or open questions to the GM,
- never talks to the CEO directly and never merges anything.

| Lead | Area | Typical output |
|---|---|---|
| [Product](../../.claude/agents/product-lead.md) | Requirements, scope, priorities | Product specs, tasks, roadmap updates |
| [Engineering](../../.claude/agents/engineering-lead.md) | Architecture, implementation | Code, technical proposals, ADR drafts |
| [QA](../../.claude/agents/qa-lead.md) | Testing, review, quality gates | Test plans, tests, review findings |
| [Design](../../.claude/agents/design-lead.md) | UX, UI | User flows, UI specs, design guidelines |
| [Marketing](../../.claude/agents/marketing-lead.md) | Positioning, communication | README copy, landing page, release notes |

## Decision rights

| Decision | Who |
|---|---|
| Vision, scope, priorities | CEO |
| Approving tasks, specs and milestones | CEO |
| Adding / removing / upgrading dependencies | CEO |
| Tech stack, architecture, data model | CEO |
| Larger changes and refactorings | CEO |
| Anything public: releases, marketing content, announcements | CEO |
| Merging pull requests | CEO |
| Splitting work, choosing which lead does what | GM |
| Small implementation details within an approved task | GM / leads |
| Wording of internal docs, tests, small fixes | GM / leads |

**Rule of thumb:** if a decision is hard to reverse, costs money, affects users or is visible to the public — escalate to the CEO.

Every CEO decision of lasting importance is recorded as an ADR in [docs/decisions/](../decisions/).

## From idea to product

Every feature or milestone follows the `new-feature` skill: mode (🟢 small / 🔵 big), functionality analysis, optional prototype, spec, UX and visual design, technical impact, tasks. The CEO approves the spec and the tasks (in small mode in one chat message) and decides technical questions.

Fixed constraints set by the CEO (platform, budget) are inputs to the analysis, not its outcome.

## Workflow of a task

1. **Intake** — CEO gives a goal (in chat) or approves a task in [docs/plan/](../plan/).
2. **Plan** — for unclear or larger work, the GM writes a short plan in chat and waits for the CEO's OK. A clear, specific instruction is carried out right away.
3. **Delegate** — GM assigns parts to leads.
4. **Build** — work happens on a branch ([git workflow](git-workflow.md)).
5. **Review** — before the PR is opened, the GM runs the review the change needs (see [Reviews](#reviews)). Non-trivial findings go back to whoever built it.
6. **Pull request** — small, explained, using the PR template.
7. **Report** — GM reports to the CEO in Slovak: what changed, what was decided, and what the CEO needs to decide or do.
8. **Merge** — CEO reviews and squash-merges.

## Budget

The AI budget is limited. The GM does the work itself — it already has the context — and delegates to a lead only when one of these applies:

1. **Independent view needed** — whoever wrote something hardly finds its own mistakes. A review is always delegated (when a change needs one — see [Reviews](#reviews)).
2. **Heavy work that would flood the GM's context** — reading many files, long tool output, running tests (e.g. an implementation across more than ~5 files).
3. **Parallel work** that saves real time.
4. **Hard implementation on a standard-tier session** — a larger feature, many files or a refactoring that the GM judges too hard for its own tier: the Engineering lead builds it on the strong tier. The GM says why and gives the expected cost first.

Ask leads for concise work and concise output.
Before an expensive step (a lead run, screenshots, full QA), the GM tells the CEO the expected cost.

Keep sessions short: a long session makes every message more expensive, so a question or discussion outside the current task goes into a new, short session. The GM watches an open PR (CI, comments) only when the CEO asks for it — every wake-up re-reads the whole session.

Leads and the main session run on a **model tier** (strong or standard); which lead uses which tier, and which tier suits which kind of work, is in [.claude/models.md](../../.claude/models.md).

What each feature cost is recorded in [docs/plan/costs/](../plan/costs/). Every ~3–5 features the GM proposes a **cost review** with the CEO to tune the harness. It covers:

- the cost per session and per feature (how to read it: the costs README),
- what drove the cost and which rule would lower it,
- whether the model tiers are still the right choice (new models, prices).

## Reviews

Tests and the project's check command run on every change. A **review** is the independent look on top of them; it costs a lead run, so it runs only where it pays off. QA found real bugs in risky areas and in specs, rarely in small everyday tasks — so the trigger is the **kind of change**, not every PR.

**Who triggers:** always the GM, at a fixed point — for a task right before opening the PR (`open-pr` skill), for a milestone in the PR that closes it. The PR names the row of this table it used under *How it was verified*.

| Change | Review | Who | Model tier |
|---|---|---|---|
| Only harness documents, plan files, inbox or cost records | none — the check command only | — | — |
| Spec, ADR and tasks (spec PR) | light QA of the spec | QA lead | standard |
| **Small task** outside the risky areas | none by a lead; the GM answers the [structure questions](#structure-questions) in the PR | GM | — |
| **Small task** touching a **risky area** | light QA | QA lead | standard |
| **Larger task** | one run: light QA plus the structure questions | QA lead | standard |
| **End of a milestone** | the structure questions over the whole codebase; cleanup tasks proposed to the CEO | Engineering lead | strong |
| Full QA | only when the CEO asks (the GM proposes it before a public release) | QA lead | standard |

- **Larger task:** adds a screen, a layer or a cross-cutting mechanism, or changes more than ~5 code files.
- **Risky areas:** security and escaping of user content, stored data and its migration, offline use and updates, the dev server, CI and deployment.
- Model tiers are mapped to concrete models in one place: [.claude/models.md](../../.claude/models.md).

**Light QA.** The GM's brief is short: the task, the spec section, the changed files, what to focus on. The QA lead checks the acceptance criteria against the code and runs the base tests; adds repository tests for uncovered spec rules and for bugs found (no throwaway scripts); at most 2–3 screenshots and only if the look changed. Output: verdict, criteria checklist, findings — nothing else.

**Full QA.** Many screen sizes, edge cases; only tests that found a bug stay in the repository.

**Findings.** The GM fixes trivial findings itself (a line of CSS, a spec wording; no behavior change). Structure findings that are cheap to fix go into the same PR; bigger ones go into [tech-debt.md](../plan/tech-debt.md) and, as a proposal with a recommendation, to the CEO. Approved cleanup tasks from a milestone review go into the next milestone.

### Structure questions

Tests and QA check *what* the app does; these questions look at *how* the code is built, so spaghetti code and needless complexity are caught while they are cheap to fix (golden principle *Keep the structure clean as you go*). Machine-checkable parts of the structure are enforced by the project's check command (see [ARCHITECTURE.md](../../ARCHITECTURE.md)). The questions are copied into `qa-lead.md` and `engineering-lead.md`, so the leads always have them — change all three together.

1. Does the change fit the structure in `ARCHITECTURE.md`? If the structure itself should change, propose it.
2. Did a file, function or module take on a second job (e.g. start-up code that also holds screen state)?
3. Which files would grow with the next 2–3 planned tasks? Will they stay readable?
4. Is anything duplicated, or more complex than today's requirements need?
