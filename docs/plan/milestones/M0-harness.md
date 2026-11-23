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
| T-trial | Harness trial: build the static hello page (throwaway, branch is deleted after the trial) | [hello-page.md](../../product-specs/hello-page.md) | in-progress | [#5](https://github.com/besnik/setlist/pull/5) |

## Technical notes for T-trial

Technical impact check (new-feature step 6): fits the architecture and golden principles (no build step, works offline, no dependencies). No ADR needed: it is throwaway and does not touch app structure.

- **Location:** `playground/hello-page/index.html` with one stylesheet `style.css` next to it. No JavaScript.
- **Markup:** song list as an ordered list; bottom bar as `<nav>` with `<button type="button">` elements, so they are focusable and do nothing. The current section is marked with `aria-current="page"`.
- **Icons:** inline SVG with `currentColor`, so they work offline and follow the theme.
- **Fonts:** system UI font stack, no web fonts.
- **Theme:** design tokens as CSS custom properties, dark values under `prefers-color-scheme: dark`.
- **Layout:** full-height grid (header / scrolling list / bar) using dynamic viewport height. Breakpoints: `min-width: 600px` (wide) and `max-height: 499px` (short landscape). Text sizes in `rem`, so they scale with zoom.
- **Safe areas:** `viewport-fit=cover` with `env(safe-area-inset-*)` padding.
- **Pressed state:** CSS `:active`. Known risk: iOS Safari may not show `:active` on non-interactive song rows without JavaScript. This is accepted for the trial; QA reports what it sees.
- **Checks:** there is no `make check`/CI yet. QA verifies with headless-browser screenshots (phone, landscape, desktop; light and dark) and an automated check for horizontal overflow.

## Out of scope

Tech stack, build tooling, CI, any product code — these come next.
