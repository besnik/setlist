# Golden principles

Opinionated rules that keep Setlist simple, consistent and easy for both agents and humans to work on.
They apply to every change. When a rule is broken repeatedly, we turn it into a mechanical check.

## Product and design

1. **Functionality first.** Every feature and milestone starts with an analysis of what it must do (a product spec). The technical solution is derived from it — never the other way round. Iterate in small steps: analyze only the next piece, build it, learn.
2. **Simplicity first.** Add complexity only when it is needed now — not "just in case" (YAGNI). The simplest solution that meets today's requirements wins. No abstraction, layer or option until there is a real second use case. Applies to code, design, docs and process.
3. **Modern and polished.** The app must feel current and pleasant to use. Simple never means dated.
4. **Offline first.** Every feature works without a network connection.

## Code

5. **Boring technology.** Prefer the web platform and well-known, stable tools over new or clever ones. A small helper we write ourselves beats an opaque library.
6. **No build step required.** The app runs straight from the source files in a browser.
7. **Native ES modules, no global state.** Every module imports what it uses explicitly.
8. **Follow the architecture principles** in [ARCHITECTURE.md](../ARCHITECTURE.md).
9. **Validate at the boundary.** Data coming from storage, files or user input is validated before use. Never build on guessed data shapes.
10. **Enforce invariants, not implementations.** Rules define boundaries; inside them, choose the simplest way to solve the problem.

## Process

11. **Machines check, humans steer.** Agentic development holds together only through what is verified automatically — tests, `make check`, CI — not through written rules alone. Anything that can be checked by a machine is checked by a machine, with error messages that tell the agent how to fix the problem. Written rules are the starting point; the rules that matter get a check. The CEO's review is for judgment, not for catching what a check could catch.
12. **Specs stay true.** Every change in app behavior updates the matching [product spec](product-specs/) in the same PR.
13. **Record debt, don't hide it.** Shortcuts and known issues go into [tech-debt.md](plan/tech-debt.md).
14. **Explore cheaply, build carefully.** When something is unclear, a throwaway prototype outside the harness answers it first. Only its learnings enter the project, through the spec — prototype code is never copied.
15. **Feedback becomes rules.** A correction from the CEO or a recurring mistake is captured here or in the docs. If it happens again, it becomes a mechanical check.
