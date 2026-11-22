---
name: update-harness
description: Change how the virtual company works — rules, principles, skills, workflow or agent prompts — and keep all harness documents consistent. Use when the CEO asks to adjust the harness or gives feedback that should become a rule.
---

# Update the harness

Goal: one change, applied everywhere it belongs, with no contradictions between documents.

## 1. Decide where the rule belongs

| Kind of rule | Home |
|---|---|
| Must be known in every session | `AGENTS.md` — only the essentials, keep it under ~100 lines |
| How code, design or process should be done | `docs/golden-principles.md` |
| Roles, decision rights, workflow | `docs/company/operating-model.md` |
| Specific to one lead | `.claude/agents/<lead>.md` |
| A repeatable step-by-step procedure | a skill in `.claude/skills/` |
| Branch, commit, PR conventions | `CONTRIBUTING.md`, `.github/pull_request_template.md` |
| Can be checked by a machine | a check (`make check`, test, CI) — preferred over prose |

Prefer one home plus short references over copying the rule.

## 2. Keep documents consistent

Search for the topic in all harness files and update every place that repeats or contradicts it:

```bash
grep -rn -i "<keyword>" AGENTS.md CONTRIBUTING.md ARCHITECTURE.md docs .claude .github
```

## 3. Update the CEO guide

If the change affects how the CEO works with the company (new skill, new decision point, new step), update `docs/ceo-guide.md`.

## 4. Record significant decisions

If the change alters the operating model in a lasting way, record it with the `new-adr` skill (or amend an ADR that is not merged yet).

## 5. Check and ship

- Relative markdown links still work.
- `AGENTS.md` is still short.
- Commit as `docs: …`, add to the open harness PR if there is one, otherwise open a new PR (`open-pr` skill).
