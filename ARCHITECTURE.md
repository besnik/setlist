# Architecture

Setlist is an offline-first Progressive Web App. All data lives on the user's device; there is no backend.
Decisions behind this page: [ADR 0004](docs/decisions/0004-tech-stack-and-architecture.md) (stack and architecture), [ADR 0005](docs/decisions/0005-dev-tooling-tests-and-deployment.md) (tooling, tests, deployment).

## Technical constraints

- **No build step.** The app runs straight from its source files in a browser.
- **Native ES modules.** Every module imports what it uses (golden principle *Explicit dependencies, no global state*).
- **No runtime dependencies, no CDN.** The app uses only the platform and small helpers of our own. Fonts and all other assets are served by the app.
- **Supported browsers:** current Chrome and Edge (Windows, Android) and Safari (iPhone). Firefox should work but is not tested.

## Repository layout

The repository holds **isolated parts**, one top-level folder each. Parts never import each other's code; the only exception is the app's pure `domain` layer, which other parts may import (e.g. an importer reusing the song parser).

```
app/                  the PWA — published at /setlist/app/
  index.html
  src/
    domain/           pure logic: no DOM, no storage, no browser APIs
    data/             storage and seed data — the only code that touches storage
    ui/               views (screens), components, router
    main.js           start-up: wires the layers together
  styles/             design tokens and styles
  assets/             fonts, icons
tests/app/unit/       unit tests (domain logic)
tests/app/e2e/        end-to-end tests (browser)
site/                 root of the website — a redirect to the app today; later signpost and user guide
tools/                development tools for the whole repository (dev server, check)
docs/                 knowledge base (not deployed)
package.json          development commands and dependencies only
```

Future parts get their own folder when they are needed, e.g. `guide/` (user guide, after the MVP), `importer/`, `server/`. Folders are not created in advance.

## Layers of the app

```
main.js  →  ui  →  data  →  domain
```

- Imports only point to the right; a layer may import any layer to its right (e.g. `ui` may use `domain` directly). `domain` imports nothing outside `domain`.
- Tests may import anything; `tools/` import nothing from `app/`.
- **domain** — data types (JSDoc), validation, chord detection, setlist operations. Fully unit-testable in Node.
- **data** — repositories. Validate everything read from storage (golden principle *Validate at the boundary*). Functions are asynchronous (return promises).
- **ui** — views are functions *state → HTML* built with our own `html` tagged template, which escapes every value by default. One delegated listener per event type maps `data-action` attributes to actions. Routing uses the URL hash.
- A service layer is added only when real cross-cutting logic appears.

## Addresses

| Address | Content |
|---|---|
| `https://besnik.github.io/setlist/app/` | The app (from `app/`). The path is **permanent** — an installed PWA is bound to it. |
| `https://besnik.github.io/setlist/` | From `site/`: a redirect to the app; later signpost and user guide. |

Storage and installed apps belong to the origin `https://besnik.github.io`; see [ADR 0005](docs/decisions/0005-dev-tooling-tests-and-deployment.md) for what that means.

## Parts and tests

Each part of the app, its technology and how to run its tests (golden principle *A lean test base in the repository*). The commands are created in task T-013.

| Part | Technology | Tests | Command |
|---|---|---|---|
| `app/` | HTML, CSS, JavaScript (ES modules) | `tests/app/unit` (`node --test`), `tests/app/e2e` (Playwright: Chromium; WebKit in CI) | `npm run test:unit`, `npm run test:e2e` |
| **All** | | | `npm test` |

Other commands: `npm start` (dev server), `npm run check` (project rules: layer and part imports, file header comments).
