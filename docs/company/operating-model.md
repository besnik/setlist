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
5. **Review** — the QA lead reviews before the PR is opened (see [QA levels](#qa-levels)). The GM fixes trivial findings itself (a line of CSS, a spec wording; no behavior change); everything else goes back to the lead who built it.
6. **Pull request** — small, explained, using the PR template.
7. **Report** — GM reports to the CEO in Slovak: what changed, what was decided, and what the CEO needs to decide or do.
8. **Merge** — CEO reviews and squash-merges.

## Budget

The AI budget is limited. The GM does the work itself — it already has the context — and delegates to a lead only when one of these applies:

1. **Independent view needed** — whoever wrote something hardly finds its own mistakes. QA review is always delegated.
2. **Heavy work that would flood the GM's context** — reading many files, long tool output, running tests (e.g. an implementation across more than ~5 files).
3. **Parallel work** that saves real time.

Give every lead a token budget in its prompt (e.g. "aim for under 40k tokens; if you need more, stop and report") and ask for concise output.
Before an expensive step (a lead run, screenshots, full QA), the GM tells the CEO the expected cost.

What each lead used is recorded per feature in [docs/plan/costs/](../plan/costs/). Every ~3–5 features the GM proposes a cost review with the CEO to tune the harness.

## QA levels

| Level | When | What |
|---|---|---|
| **Base** | Every task, automatically | The project's test command (golden principle *A lean test base in the repository*) |
| **Light QA** | Every PR | The QA lead checks acceptance criteria against the code and runs the base tests; adds repository tests for uncovered spec rules and for bugs found (no throwaway scripts); at most 2–3 screenshots and only if the look changed |
| **Full QA** | Only when the CEO asks (the GM proposes it before a public release) | Many screen sizes, accessibility, edge cases; only tests that found a bug stay in the repository |
