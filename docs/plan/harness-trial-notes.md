# Harness trial notes (throwaway)

Live log from the harness trial on a hello-world feature (static "Hello, Setlist" page).
Purpose: capture what is unclear, clumsy, missing or too complex in the harness, and turn it into recommendations at the end.
This file lives only on the trial branch.

Legend: 🔴 problem · 🟡 friction · 🟢 worked well

## Log

| # | Step | Observation | Severity |
|---|---|---|---|
| 1 | Session start | The start-of-session check (open PRs, `in-progress` tasks) was quick and clear. | 🟢 |
| 2 | Branch naming | No branch/commit type fits a throwaway experiment. `test` means "tests only" in CONTRIBUTING; `chore` was used as the closest match. | 🟡 |
| 3 | Branch rules | The session system prompt names a fixed working branch, while AGENTS.md says to create `<type>/<short-description>` from `main` per topic. Two sources of truth for the branch name. | 🟡 |
| 4 | Milestones | "Every task belongs to exactly one milestone", but nothing fits an experiment or a one-off (M0 is done, M1 is not defined). Task added to M0 as a workaround. | 🟡 |
| 5 | new-feature step 1 | Questions in step 1 are product-oriented (gig/rehearsal); fine, but the skill does not say how to handle a CEO request that already answers them. | 🟢 |
| 6 | Budget vs. process test | AGENTS.md says to involve leads only for bigger features; for this trial we spawn them on purpose. The rule is clear, but there is no "trial/learning mode" wording. | 🟢 |
| 7 | Spec (product-lead) | Spec granularity unclear: index says "one file per functional area", the template is titled "Area name", but the skill and the task produced a per-feature file. | 🟡 |
| 8 | Spec (product-lead) | No place in the spec template for flags to Design/Engineering; "Open questions" are for the CEO. Flags lived only in the lead's chat report and could get lost. | 🟡 |
| 9 | Spec (product-lead) | Spec vs. UX boundary (step 4 vs. step 5) is vague: layout regions, sticky bars, breakpoints are partly UX. | 🟡 |
| 10 | Spec (product-lead) | No lifecycle for throwaway/experimental specs (only draft/approved/implemented). | 🟡 |
| 11 | Spec (product-lead) | Given/when/then fits static content poorly; the lead mixed it with plain "Rule:" statements. Template could allow both. | 🟡 |
| 12 | Process | The skill says the output is "one PR", but approval stops come at steps 4, 6 and 7. It does not say when to open the PR or where the CEO approves the spec (chat vs. PR review). GM chose: push the draft, approve in chat, open the PR once there is something to review. | 🟡 |
| 14 | Spec approval | Approval in chat worked well. The GM moved the CEO's decisions into the rules and set the status to `approved`. That is fine, but the harness does not say who records the approval or how ("CEO only" sets `approved` for tasks, nothing is said for specs). | 🟡 |
| 15 | Delegation | The Agent tool started the lead in the background, although the GM asked for the foreground. That does not hurt anything, but the GM has nothing to do while waiting. | 🟢 |
| 16 | UX (design-lead) | Step 5 says "UX flow … screens and transitions"; visual design (tokens, typography, contrast) is not mentioned, and the spec template has no slot for it. The GM had to say where to put it. | 🟡 |
| 17 | UX (design-lead) | Brand colors are a CEO decision, but nothing says whether a palette for one feature or a trial counts. The lead labelled it "neutral trial choice". | 🟡 |
| 18 | UX (design-lead) | No design guidelines doc exists yet, so tokens live in a feature spec. Before the first real feature, decide where design tokens live (e.g. `docs/design/`). | 🔴 |
| 19 | UX (design-lead) | Contrast ratios were computed by hand by the lead. The GM re-checked them with a small script (all 20 pairs pass). This should be a reusable check (golden principle 11). | 🟡 |
| 20 | Process | Step 5 has no 🛑, so the CEO does not see the design before the tasks. For a visual feature, the CEO probably wants to approve the look. | 🟡 |
| 21 | Tech impact (step 6) | The skill says "check against ARCHITECTURE.md", but not where to write the result when no ADR is needed. GM put "Technical notes" into the milestone file, an ad-hoc choice. ARCHITECTURE.md is nearly empty, so the check is thin. | 🟡 |
| 22 | Tasks (step 7) | The task had to go into M0, which is marked `done`; the roadmap now looks inconsistent. Same root cause as #4. | 🟡 |
| 23 | Spec (product-lead) and UX | Spec rule "pressed state on rows" collides with "no JavaScript" on iOS Safari. Spec writing did not catch the technical limits; flagged at step 6. | 🟢 |
| 24 | open-pr skill | The skill has no option for a draft PR. A spec-only PR, opened at step 7 and waiting for approval, is naturally a draft. The `gh api` command fails when `draft` is passed twice, so the GM fell back to a normal PR. | 🟡 |
| 25 | Commit trailers | The environment injects attribution trailers (Co-Authored-By, session link). AGENTS.md rule 8 forbids them, and the GM followed AGENTS.md. A mechanical check, for example a commit-msg hook or CI, would make this reliable. | 🟡 |
| 26 | PR timing (CEO feedback) | The GM opened a PR at the end of planning because the `new-feature` Output says "one PR with the spec… opened with open-pr". The CEO expected to work only on the branch and to handle the PR at the end. This conflicts with the "approval in chat counts" rule. The skill should say when a PR is opened, e.g. only once there is something to review, while planning approvals happen in chat. | 🔴 |
| 13 | Spec (product-lead) | The lead stayed in its role, flagged technical choices instead of deciding them, and gave a recommendation for each open question. Quick (~70 s). | 🟢 |
