# Architecture

Setlist is an offline-first Progressive Web App. All data lives on the user's device; there is no backend.

The detailed structure (modules, layers, code map) will be designed together with the solution and added here.
Until then, these principles apply to all code.

## Principles

### Simplicity first

Add complexity only when it is needed now — not "just in case" or "for the future" (YAGNI).
No abstraction, layer or pattern until there is a real need for it. The simplest working solution wins.

### SOLID

Applied pragmatically, in plain JavaScript:

- **Single responsibility** — a module or function does one thing and has one reason to change.
- **Open/closed** — add new behavior by adding code, not by rewriting working code.
- **Liskov substitution** — anything that replaces something else must behave as callers expect.
- **Interface segregation** — keep module interfaces small; expose only what callers need.
- **Dependency inversion** — high-level logic does not depend on low-level details such as storage or the DOM; keep them separate so either can change on its own.

SOLID never justifies extra complexity: when the two conflict, simplicity wins.
