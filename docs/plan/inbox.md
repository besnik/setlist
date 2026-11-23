# Idea inbox

Raw ideas go here — one line each, no filtering. The GM or Product lead turns them into tasks.

- Choose the tech stack (CEO decision, ADR needed).
- Design the detailed architecture with the solution — idea: DDD-style domain layers `types → repository → service (optional) → ui`, UI layers `components → views → app`, storage only through repositories.
- Set up mechanical checks for the architecture and a CI workflow.
- Deploy the app (e.g. GitHub Pages).
- Define MVP scope (M1) and write the first product specs.
- Skill `implement-task` — approved task → branch → build → the check command and tests → QA review → PR (with the first code).
- Skill `fix-bug` — reproduce → failing test → fix → passing test → update spec if needed (with the first code).
- Skill `cleanup` — find deviations from golden principles and tech debt, open small cleanup PRs (end of a milestone).
- Quality grades per area — later.
- Testing ADR for M1 (frontend): lean test base per golden principles. Candidate from the harness trial: `tests/unit` with `node --test` plus `tests/e2e` with Playwright (preinstalled in the agent environment; usable on Windows, e.g. the VS Code Playwright extension), run via npm scripts (`npm test`, `npm run test:unit`, `npm run test:e2e`). Only one option — compare alternatives in the ADR.
- Design system home for M1: `docs/design/` (tokens, typography, components) — decide with the first real screen. Brand colors are a CEO decision.
