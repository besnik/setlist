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
| 13 | Spec (product-lead) | The lead stayed in its role, flagged technical choices instead of deciding them, and gave a recommendation for each open question. Quick (~70 s). | 🟢 |
