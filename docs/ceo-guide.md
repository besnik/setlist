# CEO guide

A one-page cheat sheet for the owner: how to drive the virtual company without remembering every rule.
Kept up to date by the GM whenever the way we work changes.

## Where to look

| What | Where |
|---|---|
| Overall progress | [docs/plan/roadmap.md](plan/roadmap.md) |
| Current tasks | [docs/plan/milestones/](plan/milestones/) |
| What the app does | [docs/product-specs/](product-specs/) |
| Why something was decided | [docs/decisions/](decisions/) |
| Known shortcuts | [docs/plan/tech-debt.md](plan/tech-debt.md) |
| What each feature cost (tokens, time per step) | [docs/plan/costs/](plan/costs/) |
| Ideas for later | [docs/plan/inbox.md](plan/inbox.md) |
| All rules for agents | [AGENTS.md](../AGENTS.md) |

## Starting work — what to write in chat

You can write in Slovak; these are example openers.

| Situation | Write |
|---|---|
| New feature or milestone | "Use the `new-feature` skill: chcem …" |
| Want to try ideas first | "Use the `new-feature` skill: chcem …, najprv prototyp." — the GM writes a kickoff prompt into the chat |
| Prototype is done | Upload `intake.md` + `final.html` (or a zip) and write "Use the `new-feature` skill: intake prototypu …" |
| Continue unfinished work | "Pokračuj tam, kde sme skončili." — the agent checks open PRs and in-progress tasks |
| Bug in the app | "Našiel som chybu: … (čo som robil, čo som čakal, čo sa stalo)" |
| Technical decision needed | "Priprav ADR na …" (skill `new-adr`) |
| Idea for later | "Zapíš do inboxu: …" |
| Try a pull request before merging | In a **local** session in the `setlist` folder: "Ukáž mi PR <číslo>." (skill `preview-pr`) |
| Change to how we work, or feedback that should become a rule | "Uprav harness: …" (skill `update-harness`) |

A clear, specific instruction is done right away. For anything unclear or bigger, the GM first sends a short plan and waits for your OK.

## Skills

Skills are step-by-step procedures the GM follows. You can name one in chat to make sure it is used.

| Skill | Use it for |
|---|---|
| `new-feature` | A new feature or milestone: mode → questions → optional prototype → spec → UX and visual design → technical impact → tasks |
| `new-adr` | Recording or proposing an important decision |
| `update-harness` | Changing rules, principles or workflow |
| `open-pr` | Opening a pull request (the GM uses it on its own) |
| `preview-pr` | Trying a pull request on your computer before merging it (in a local session) |

Built-in Claude Code commands you can also ask for: `/code-review` (find bugs in changes), `/security-review`, `/simplify`.

Planned skills (when there is code): `implement-task`, `fix-bug`, `cleanup` — see `docs/plan/inbox.md`.

## Reviews and model tiers

Tests and the check command run on every change. An independent review by a lead runs only where it pays off ([details](company/operating-model.md#reviews)):

- **Spec PR:** light QA of the spec.
- **Small task:** no lead; the GM answers the structure questions in the PR. If it touches a risky area (security, stored data, offline, dev server, CI, deployment): light QA.
- **Larger task** (new screen, layer or mechanism, or more than ~5 code files): one QA run that also checks the structure.
- **End of a milestone:** the Engineering lead reviews the whole codebase; you get a list of proposed cleanup tasks to approve.
- **Full QA** only when you ask: "Urob plnú QA". You can ask for a structure review any time: "Pozri sa na architektúru …".

Each PR says under *How it was verified* which review it got.

**Model tiers:** leads run on a fixed tier, set in [.claude/models.md](../.claude/models.md) — the only file that names models. When you start a session, pick the model by the work: **strong** for a new feature, spec or milestone end; **standard** for an approved task ("začni T-0NN"), PR comments and harness edits. If a task in a standard session turns out hard (a larger feature, many files, a refactoring), the GM hands the implementation to the Engineering lead on the strong tier — and tells you why and what it costs first.

## Running the app on your computer

Needs [Node.js](https://nodejs.org) 22 or newer. In the repository folder, once: `npm install`. Then:

| Command | What it does |
|---|---|
| `npm start` | Runs the app at `http://localhost:8080/setlist/app/`; it also prints an address for your phone in the same Wi-Fi |
| `npm test` | Runs all tests |
| `npm run check` | Checks the project rules |

## Previewing a pull request on your computer

Run a **local** Claude Code session (desktop app or terminal on your computer, not the cloud) in the `setlist` folder and write:

```
Ukáž mi PR <číslo>.
```

The agent fetches the PR, starts the app and gives you two addresses: one for this computer and one for your phone in the same Wi-Fi. On the first run Windows Firewall may ask for access — allow **private networks**. When you are done, write "hotovo": the agent stops the app and switches back to `main`. Nothing in the repository changes.

**First time on a computer** (Git and [Node.js](https://nodejs.org) 22 or newer installed, no `setlist` folder yet): start the local session in the folder where the project should live (e.g. `Documents`) and write:

```
Naklonuj https://github.com/besnik/setlist.git do priečinka setlist a potom postupuj podľa setlist/.claude/skills/preview-pr/SKILL.md: ukáž mi PR <číslo>.
```

Next time start the session directly in the `setlist` folder.

## Trying the app on your phone

Every merge to `main` is published to **https://besnik.github.io/setlist/app/** a few minutes later (tab *Actions* → workflow *Deploy* shows the progress). There are no online previews of pull requests: try a change before merging on your computer (see above), or after merging here.

## Small and big features

The GM proposes a mode at the start; you confirm it.

- 🟢 **Small** (one task, one screen): you approve spec, design and task in **one chat message**. The GM builds it on a branch and opens **one PR at the end**.
- 🔵 **Big** (several tasks): a **spec PR** — merging it approves the spec and tasks. Then one PR per task.

Either way you get a **short design summary in chat** — no need to read markdown. A visual preview (screenshot) only if you ask, or if the GM proposes it with a cost estimate.

## Where you decide 🛑

- **Specs** — what a feature does (`docs/product-specs/`).
- **Technical decisions** — tech stack, architecture, libraries, larger refactorings (ADRs in `docs/decisions/`).
- **Tasks** — which work starts (task tables in `docs/plan/milestones/`). Your instruction in chat counts as approval.
- **Anything public** — releases, marketing texts.
- **Merging** pull requests.

Every report from the GM ends with what needs your **decision** and what needs your **action**.

## Reviewing a pull request on mobile

In the GitHub app, add comments to lines with **Start a review**, send them with **Submit review**, and approve by merging (**Squash and merge**). The GM watches a PR only when you ask (each wake-up costs a little) — so to have your comments worked on, first write in chat:

```
Sleduj PR #<číslo> a zapracuj moje komentáre.
```

## Merging a pull request

1. Read the PR description (What / Why / Needs from CEO) and skim the changes.
2. Click **Squash and merge**.
3. In the commit message, **delete the line** `_Generated by [Claude Code](https://claude.ai/code)_` — the environment adds it automatically (also to PR descriptions). Agents ignore it on purpose, so they do not spend tokens on it; delete it by hand if you want.
4. Confirm. The branch is deleted automatically.

## GitHub settings already in place

- **Ruleset `protect-main`** (Settings → Rules → Rulesets): PR required, no force push, no deletion of `main`.
- **Squash merge only, auto-delete branches** (Settings → General → Pull Requests).
- **Private vulnerability reporting** (Settings → Advanced Security).
- **Recommended: Secret scanning and Push protection** (Settings → Advanced Security) — GitHub blocks a push that contains a token or key. Agents never commit secrets (rule in `AGENTS.md`, details in `SECURITY.md`); if one slips in anyway, it must be revoked, not just deleted.

An automatic check (a hook in `.claude/settings.json`) stops agents from editing or committing outside a proper topic branch, from using wrong branch names or commit messages, and from pushing to `main`. It needs `python3` on the machine where Claude Code runs.

Agents can push branches but cannot delete branches or force-push. A leftover branch you delete yourself at https://github.com/besnik/setlist/branches.

## Tips

- Small topics, one at a time — one topic is one branch and one PR.
- Tell the GM when something annoys you — it becomes a rule so you never have to say it twice.
- Mind the budget: most of the cost is the main session itself — every message re-reads the whole conversation. The GM warns you before expensive steps; costs are in `docs/plan/costs/`, and every ~3–5 features the GM proposes a cost review.
- Start a new session for each new task or topic, and for a side question or discussion — a long session makes every message more expensive. The GM's report says whether to continue in the same session or start a new one, and gives you an opener to paste.
- Weaker models follow links less, so rules every session needs are written short in `AGENTS.md`, and what a lead needs is in its own file. If an agent on the standard tier misses a rule, tell the GM — it moves the rule where the agent surely sees it.
- After a new model release, ask the GM to review the harness for rules it no longer needs ("Uprav harness: …").
