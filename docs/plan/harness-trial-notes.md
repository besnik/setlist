# Harness trial notes (throwaway)

Live log from the second harness trial: a static "Gig mode" screen (HTML + CSS, sample data), run in 🟢 small mode after the improvements from the hello-page trial (#4–#9).
This file lives only on the trial branch.

Legend: 🔴 problem · 🟡 friction · 🟢 worked well

## Log

| # | Step | Observation | Severity |
|---|---|---|---|
| 1 | Session start | Start-of-session check was quick: no open PRs, no `in-progress` tasks. | 🟢 |
| 2 | Branch | The session's system prompt still assigns a fixed branch (`claude/…`) and says "push to no other branch without permission"; git-workflow.md says the repo name wins. The GM followed the repo (`chore/trial-gig-mode`), but two contradicting instructions remain; the repo rule is only a sentence, not an explicit permission statement the environment recognises. | 🟡 |
| 3 | Step 1 | Step 1 has no 🛑, but "ask questions" implies waiting. With the request already clear, the GM merged step 1 questions into the single small-mode stop. The skill could say so: "in small mode, ask step-1 questions together with the approval stop if the request is clear". | 🟡 |
| 4 | Step 3 | Prototype check was easy: nothing unclear, skipped. | 🟢 |
| 5 | Step 2 | `index.md` says specs are per functional area — clear now. Area "Gig mode" was an obvious fit. | 🟢 |
| 6 | Spec vs. trial | The trial rule says a trial "adds no tasks or specs to `main`", but the skill still needs a spec and a task on the branch. Fine in practice (the PR is closed), but the spec had to say "trial" in its purpose; a real gig-mode spec later will have to start from scratch. | 🟡 |
| 7 | Tasks | Still no milestone for a trial or pre-M1 work: T-010 went into M0, which is `done` (same as hello-page #4/#22, deliberately not fixed in P3). | 🟡 |
| 8 | Tech impact | The spec now has a "Notes for Design / Engineering" slot — clear where step 6 goes. | 🟢 |
| 9 | Design | Design tokens again live in a feature spec: `docs/design/` is still only an idea in the inbox (hello-page #18, 🔴). Each trial re-invents a palette. | 🔴 |
| 10 | Design self-check | Contrast was computed with a throwaway script again (no reusable check). The height self-check by hand found a real problem (landscape with a 2-line title had zero margin) — the self-check step is worth it. | 🟡 |
| 11 | Golden principle 10 | "Every part of the app has tests in the repository" cannot be met before the testing ADR; the GM recorded it in tech-debt. Nothing in the harness says what to do until then. | 🟡 |
| 12 | Delegation | Budget rule was clear: small feature → GM writes spec and design itself (no product/design lead). QA will still be delegated. | 🟢 |
| 13 | Design summary | "Short design summary in chat" plus the spec on the branch — the CEO has to read only the chat. | 🟢 |
| 14 | Approval | Recording the CEO's OK was straightforward: the GM moved decisions into the spec, set the spec to `approved` and the task straight to `in-progress`. Skipping the `approved` step in the file is harmless but not described. | 🟢 |
| 15 | Implementation | GM implemented the two files itself (delegation rule: no lead for ≤5 files). Clear and cheap. | 🟢 |
| 16 | Light QA | A light-QA prompt with explicit sizes, budget and output format kept QA to ~83k tokens and 49 s (hello page: 124k, 4 min) and still found real issues (sideways scroll at 200 % zoom on 320 px, overlapping breakpoints in the spec). Worth turning into a QA prompt template. | 🟢 |
| 17 | Design self-check | The self-check verified numbers per breakpoint but not overlapping breakpoints (tablet width + short height). The step could ask: "which rules win when two layouts apply?". | 🟡 |
| 18 | Commit trailers | The environment still injects attribution trailers (Co-Authored-By, session link) in its instructions; AGENTS rule 8 wins and the GM left them out. P1 recommendation #3 from the hello-page trial (project attribution setting / check) is not in the repo yet — no `.claude/settings.json`. | 🔴 |
| 19 | QA findings | Who fixes QA findings is now clear (operating model: GM fixes trivial ones). All four were trivial. | 🟢 |
| 20 | Costs | "CEO stops" is ambiguous: one chat stop with two decisions. Recorded as "1 (2 decisions)". Also, a GM-only feature with only QA delegated fits the `*` "light feature" marker — good that it exists. | 🟡 |
| 21 | Task lifecycle | T-010 stays `in-progress`: the trial PR is closed without merging and has no final status (same as hello-page #43, accepted as P3). | 🟡 |
| 22 | Spec status | The spec is `approved` but will never be `implemented` (trial). Same root cause as #21; harmless. | 🟢 |

## Summary

Compared with the hello-page trial, the harness is clearly lighter: one CEO stop instead of four, ~83k lead tokens instead of ~283k, and no confusion about modes, PR timing, spec template or who fixes findings.

Remaining issues, by priority:

1. 🔴 **Attribution vs. rule 8 has no mechanical fix yet** (#18): add the project attribution setting (or a commit-msg / CI check).
2. 🔴 **Design tokens have no home** (#9): decide `docs/design/` with the first real M1 screen.
3. 🟡 **Verification still from scratch** (#10, #11, #16): until the testing ADR, keep a short QA prompt template in `qa-lead.md` (sizes, budget, output) so each QA run is cheap and comparable.
4. 🟡 **Small wording fixes**: step 1 in small mode merges into the approval stop (#3); design self-check covers overlapping layouts (#17); "CEO stops" counts decisions or stops (#20); the session-assigned branch vs. repo branch conflict (#2).
5. Deliberately not changing (P3): milestone/lifecycle for trials (#7, #21, #22).
