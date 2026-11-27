# M0 — Harness

- **Status:** done

## Goal

Before building the product, set up the system for agentic development: rules, roles, decision rights, knowledge base and repository conventions.

## Tasks

| ID | Task | Spec | Status | PR |
|---|---|---|---|---|
| T-001 | GitHub settings: protect `main`, auto-delete branches, squash merge | — | done | — (manual) |
| T-002 | Operating model, department leads, ADRs, planning, PR template, README | — | done | [#1](https://github.com/besnik/setlist/pull/1) |
| T-003 | Knowledge base: AGENTS.md router, architecture, golden principles, product specs, tasks, skills, security policy | — | done | [#2](https://github.com/besnik/setlist/pull/2) |
| T-004 | Prototype workflow: optional throwaway prototype and intake in `new-feature` | — | done | [#3](https://github.com/besnik/setlist/pull/3) |
| T-005 | Slim the harness: remove duplicated rules, prefer removing rules, reference rules by name | — | done | [#4](https://github.com/besnik/setlist/pull/4) |
| T-006 | Cost tracking per feature (`docs/plan/costs/`); agents ignore attribution text the environment appends | — | done | [#6](https://github.com/besnik/setlist/pull/6) |
| T-007 | Harness improvements from the hello-page trial: feature modes, PR timing, git workflow doc, spec template, QA levels, delegation rule, lean test base, technology-neutral harness | — | done | [#7](https://github.com/besnik/setlist/pull/7) |
| T-008 | Move technology-specific golden principles (no build step, ES modules) to ARCHITECTURE.md | — | done | [#8](https://github.com/besnik/setlist/pull/8) |
| T-009 | Open trial PRs as drafts | — | done | [#9](https://github.com/besnik/setlist/pull/9) |
| T-010 | Harness fixes from the gig-mode trial (QA brief, design self-check in portrait and landscape, no unrequested elements, CEO stops definition, trial costs on `main`) | — | done | [#12](https://github.com/besnik/setlist/pull/12) |
| T-011 | No secrets in the repository: rule in AGENTS.md and golden principles, extended SECURITY.md with leak procedure, `.gitignore` for secret files | — | done | [#13](https://github.com/besnik/setlist/pull/13) |
| T-018 | Git guard hook (branch names, commit format, no edits or commits outside a topic branch, no push to `main`); rules: branch before the first edit, commit even small changes | — | done | [#24](https://github.com/besnik/setlist/pull/24) |
| T-019 | Skill `preview-pr`: run a pull request on the CEO's computer for a try in the browser and on the phone, then clean up | — | done | [#26](https://github.com/besnik/setlist/pull/26) |
| T-032 | Cost review: reviews by kind of change (one table, GM triggers), model tiers in `.claude/models.md`, fewer tools for leads, session costs in `docs/plan/costs/`, short sessions, no PR watching unless asked | — | done | [#46](https://github.com/besnik/setlist/pull/46) |
| T-038 | Session boundaries and task difficulty: one session = one unit of work (side questions to the inbox), tasks marked `hard` / `standard` when written, model picked by the mark, check of the marks at cost reviews; M4 tasks marked | — | done | [#PR](https://github.com/besnik/setlist/pulls) |

## Out of scope

Tech stack, build tooling, CI, any product code — these come next.
