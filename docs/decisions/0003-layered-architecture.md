# 0003. Layered architecture for domains and UI

- **Status:** accepted
- **Date:** 2026-11-22
- **Decided by:** CEO

## Context

Agents replicate whatever patterns exist in the code. Without strict boundaries the codebase drifts. Clear, predictable layers keep the code legible for agents and let a human developer step in at any time. The UI layer is often neglected, but in a PWA it holds much of the code and needs the same discipline.

## Options considered

1. **No fixed structure** — fastest to start, drifts quickly.
2. **Feature folders only** — some order, but no rules for dependencies.
3. **DDD-style layers for domains plus layers for the UI** — a little more structure upfront, predictable and checkable.

## Decision

Option 3, as described in [ARCHITECTURE.md](../../ARCHITECTURE.md):

- **Domains:** `types → repository → service (optional) → ui`. A service is added only when logic spans several entities or domains.
- **UI:** `components → views → app`. Components are dumb (data in, events out); views compose components and call domain code; only the app switches views.
- **Platform** holds technical infrastructure; only repositories may use storage.
- **Shared** holds small pure helpers usable by all layers.
- The rules will be enforced mechanically, with error messages that explain the fix.

## Consequences

- Storage can later be replaced or extended with cloud sync by changing platform and repositories only.
- Slightly more files than a flat structure — accepted for predictability.
- Mechanical checks need to be set up together with the tech stack.
