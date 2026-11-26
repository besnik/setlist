# Golden principles

Opinionated rules that keep Setlist simple, consistent and easy for both agents and humans to work on.
They apply to every change. When a rule is broken repeatedly, we turn it into a mechanical check.

## Product and design

1. **Functionality first.** Every feature and milestone starts with an analysis of what it must do (a product spec). The technical solution is derived from it — never the other way round. Iterate in small steps: analyze only the next piece, build it, learn.
2. **Simplicity first.** Add complexity only when it is needed now — not "just in case" (YAGNI). The simplest solution that meets today's requirements wins. No abstraction, layer or option until there is a real second use case. Applies to code, design, docs and process.
3. **Modern and polished.** The app must feel current and pleasant to use. Simple never means dated.
4. **Offline first.** Every feature works without a network connection.

## Code

5. **Boring technology.** Prefer the platform's built-in features and well-known, stable tools over new or clever ones. A small helper we write ourselves beats an opaque library.
6. **Explicit dependencies, no global state.** Every module imports what it uses explicitly.
7. **Follow the architecture principles** in [ARCHITECTURE.md](../ARCHITECTURE.md).
8. **Validate at the boundary.** Data coming from storage, files or user input is validated before use. Never build on guessed data shapes.
9. **No secrets in the repository.** Use obvious placeholders. Details: [SECURITY.md](../SECURITY.md).
10. **Enforce invariants, not implementations.** Rules define boundaries; inside them, choose the simplest way to solve the problem.
11. **A lean test base in the repository.** Every part of the app has tests in the repository and documented commands in [ARCHITECTURE.md](../ARCHITECTURE.md): one command for everything and one per part. Cover smoke tests and the main happy paths; unit tests only for risky logic; every bug found gets one test. Engineering writes the happy-path tests; QA adds tests for uncovered spec rules and for every bug it finds. Tests of an area live together, whoever wrote them, and every test starts with a short comment naming the spec rule or bug it covers. Tests are fast and print only a summary and failures. Full testing (many screen sizes, edge cases) runs only when the CEO asks for it. A new test tool or language is a CEO decision (ADR).
12. **Code explains itself; comments explain why.** Write comments for a human reading the code without the agent's context: a short note at the top of each file or module on what it is for, a comment before complex logic or a non-obvious flow describing the steps, and the reason behind any surprising choice (a workaround, a limit, a trade-off). Keep them brief and accurate; do not restate what the code plainly says, and update or delete comments when the code changes.
13. **Keep the structure clean as you go.** Every file and function has one job. When a change adds a screen, module or larger feature, check the structure before the pull request ([architecture check](company/operating-model.md#architecture-checks)): a cheap refactor goes into the same PR, a bigger one into [tech-debt.md](plan/tech-debt.md) and a proposal to the CEO. Each milestone ends with a review of the whole codebase.

## Process

14. **Machines check, humans steer.** Agentic development holds together only through what is verified automatically — tests, the project's check command (see [ARCHITECTURE.md](../ARCHITECTURE.md)), CI — not through written rules alone. Anything that can be checked by a machine is checked by a machine, with error messages that tell the agent how to fix the problem. Written rules are the starting point; the rules that matter get a check. The CEO's review is for judgment, not for catching what a check could catch.
15. **Specs stay true.** Every change in app behavior updates the matching [product spec](product-specs/) in the same PR.
16. **Record debt, don't hide it.** Shortcuts and known issues go into [tech-debt.md](plan/tech-debt.md).
17. **Explore cheaply, build carefully.** When something is unclear, a throwaway prototype outside the harness answers it first. Only its learnings enter the project, through the spec — prototype code is never copied.
18. **Feedback becomes rules.** A correction from the CEO or a recurring mistake is captured here or in the docs. If it happens again, it becomes a mechanical check.
19. **The harness is technology-neutral.** Rules, skills and agent prompts describe contracts and process, never specific languages, frameworks or tools. Technology choices are project decisions: they live in ADRs and [ARCHITECTURE.md](../ARCHITECTURE.md).
20. **Errors are handled or seen, never swallowed.** Catch an error only where the code can do something sensible about it, and only the expected case, named precisely (by type, name or code) — e.g. "the browser refused", "no such file". Everything else is rethrown or logged; unexpected errors travel up to one boundary (start-up, a request handler) that logs them. An expected case may stay silent; say why in a comment. Log through one place per part, with a level — *error* for a bug or a failure to fix, *warn* when a feature does not work but the rest does, *info* for a few events worth knowing (e.g. start-up and version) — and a message that says what was being done. Never log secrets or personal data. The project's check enforces what a machine can see (no empty catch).
