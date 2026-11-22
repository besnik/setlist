# Idea inbox

Raw ideas go here — one line each, no filtering. The GM or Product lead turns them into tasks.

- Choose the tech stack (CEO decision, ADR needed).
- Design the detailed architecture with the solution — idea: DDD-style domain layers `types → repository → service (optional) → ui`, UI layers `components → views → app`, storage only through repositories.
- Set up mechanical checks for the architecture and a CI workflow.
- Deploy the app (e.g. GitHub Pages).
- Define MVP scope (M1) and write the first product specs.
- Skill `implement-task` — approved task → branch → build → `make check` and tests → QA review → PR (with the first code).
- Skill `fix-bug` — reproduce → failing test → fix → passing test → update spec if needed (with the first code).
- Skill `cleanup` — find deviations from golden principles and tech debt, open small cleanup PRs (end of a milestone).
- Quality grades per area — later.
