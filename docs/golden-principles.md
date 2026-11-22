# Golden principles

Opinionated rules that keep Setlist simple, consistent and easy for both agents and humans to work on.
They apply to every change. When a rule is broken repeatedly, we turn it into a mechanical check.

## Product and design

1. **Simplicity first.** Add complexity only when it is needed now — not "just in case" (YAGNI). The simplest solution that meets today's requirements wins. Applies to code, design, docs and process.
2. **Modern and polished.** The app must feel current and pleasant to use. Simple never means dated.
3. **Offline first.** Every feature works without a network connection.

## Code

4. **Boring technology.** Prefer the web platform and well-known, stable tools over new or clever ones. A small helper we write ourselves beats an opaque library.
5. **No build step required.** The app runs straight from the source files in a browser.
6. **Native ES modules, no global state.** Every module imports what it uses explicitly.
7. **Data only through repositories.** No code outside a repository reads or writes storage. See [ARCHITECTURE.md](../ARCHITECTURE.md).
8. **Respect the layers** of domains and UI as described in [ARCHITECTURE.md](../ARCHITECTURE.md).
9. **Validate at the boundary.** Data coming from storage, files or user input is validated before use. Never build on guessed data shapes.
10. **Enforce invariants, not implementations.** Rules define boundaries; inside them, choose the simplest way to solve the problem.

## Process

11. **Specs stay true.** Every change in app behavior updates the matching [product spec](product-specs/) in the same PR.
12. **Record debt, don't hide it.** Shortcuts and known issues go into [tech-debt.md](plan/tech-debt.md).
13. **Feedback becomes rules.** A correction from the CEO or a recurring mistake is captured here or in the docs. If it happens again, it becomes a mechanical check.
