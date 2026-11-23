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
