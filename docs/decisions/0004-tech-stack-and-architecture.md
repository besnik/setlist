# 0004. Tech stack and architecture of the app

- **Status:** accepted
- **Date:** 2026-11-24
- **Decided by:** CEO (in chat while defining the MVP; confirmed by merging the MVP plan PR)

## Context

The MVP (milestones M1–M8, see the [roadmap](../plan/roadmap.md)) starts from scratch. A throwaway prototype (a single HTML file, see [prototype reference](../design/prototype-reference.md)) showed the behavior and look we want. The foundations chosen now will stay with us for a long time:

- The app is an offline-first, installable PWA with no backend; all data stays on the device.
- Targets: Chrome and Edge on Windows, Chrome on Android, Safari on iPhone (current versions).
- The code must stay readable for the CEO and for agents: layered, documented, no magic.
- Later the repository may hold more parts: a user guide, importers (e.g. from public song sites), maybe a backend.

## Options considered

### Framework

1. **A UI framework** (React, Vue, Svelte) — rich ecosystem, but needs a build step, adds a large dependency and hides how things work. Rejected by the CEO.
2. **A small rendering library from a CDN** (e.g. lit-html, Preact + htm) — efficient re-rendering, no build; but an external runtime dependency that the service worker must cache from a foreign domain.
3. **The platform only** (HTML, CSS, JavaScript with native ES modules) plus a few small helpers we write ourselves — no build, no runtime dependency, everything readable. ✅

### Rendering

1. **Plain `innerHTML` with manual escaping** (prototype) — simple, but one forgotten `esc()` is an XSS hole.
2. **DOM creation helpers** (`el('div', …)`) — safe, but verbose and hard to read.
3. **Web Components** — native encapsulation, but more ceremony than the MVP needs.
4. **An `html` tagged template that escapes every value by default**, views as functions *state → HTML*, events through one delegated listener and `data-action` attributes. ✅ Safe by default and as readable as the prototype. If re-rendering ever loses focus or scroll in a way we cannot fix simply, option 2 of *Framework* (lit-html) is the fallback — a new ADR.

### Repository layout

1. **App at the repository root** — simplest today; moving it later touches the service worker, CI and deployment.
2. **One top-level folder per part, the app in `app/`** ✅ — costs nothing now, the deployed site contains exactly the app (no docs, tests or tools), and future parts (`guide/`, `importer/`, `server/`) get their own folders without moves.

## Decision

1. **Platform only:** HTML, CSS and JavaScript with native ES modules. No framework, no build step, **no runtime dependencies and no CDN** in the app.
2. **Parts:** the repository holds isolated parts, each in its own top-level folder, with its own row in the *Parts and tests* table of [ARCHITECTURE.md](../../ARCHITECTURE.md). M1 creates `app/` and `site/` (the root of the website: a redirect to the app, later a signpost); `guide/` (user guide, after the MVP) and others are created when needed. Parts never import each other's code — the only exception: another part may import the app's pure `domain` modules (e.g. an importer reusing the song parser).
3. **Layers inside the app:** `domain` (pure logic: no DOM, no storage, no browser APIs) ← `data` (storage and seed data; the only code that touches storage) ← `ui` (views, components, router) ← `main.js` (wires everything together). Imports only point to the left, and a layer may use any layer further left (e.g. `ui` may use `domain`). A service layer is added only when real cross-cutting logic appears.
4. **Rendering:** views are functions that turn state into HTML through our own auto-escaping `html` tagged template; one delegated event listener per event type maps `data-action` attributes to actions.
5. **Data access is asynchronous from the start** (repository functions return promises), so the storage chosen in M5 (likely IndexedDB, own ADR) does not change the interfaces.
6. **Routing:** hash-based (`#songs`, `#setlist-<id>`) — works on static hosting without server configuration.
7. **Documentation in code:** a short header comment in every module, JSDoc for data types and exported functions (editors check types from it; no TypeScript, no build).
8. **Fonts and all assets are served by the app itself** — nothing is loaded from third-party domains (offline, privacy).

## Consequences

- The app runs by opening its folder through any static server; what is in `app/` is exactly what users get.
- No framework means we write a few helpers ourselves (`html`, router, store). They must stay small and tested.
- The layer rule and the isolation of parts are checked mechanically by the project's check command (see [ADR 0005](0005-dev-tooling-tests-and-deployment.md)).
- The song format (M4) and the storage (M5) get their own ADRs; this ADR only keeps them possible.
