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
  sw.js               service worker: offline use and updates (outside the layers)
  src/
    domain/           pure logic: no DOM, no storage, no browser APIs
    data/             storage and seed data — the only code that touches storage
    ui/               views (screens), components, router
    main.js           start-up: wires the layers together
  styles/             design tokens (tokens.css), fonts (fonts.css), base styles (base.css)
  assets/             fonts (assets/fonts/), app icons (assets/icons/)
  manifest.webmanifest  web app manifest (install; its id, scope and start_url are permanent)
tests/app/unit/       unit tests (domain logic)
tests/app/e2e/        end-to-end tests (browser)
tests/tools/          tests of the development tools
site/                 root of the website — a redirect to the app today; later a signpost page
tools/                development tools for the whole repository (dev server, check)
docs/                 knowledge base (not deployed)
package.json          development commands and dependencies only
```

Future parts get their own folder when they are needed, e.g. `guide/` (user guide after the MVP, published at `/setlist/guide/`), `importer/`, `server/`. Folders are not created in advance.

## Layers of the app

```
main.js  →  ui  →  data  →  domain
```

- Imports only point to the right; a layer may import any layer to its right (e.g. `ui` may use `domain` directly). `domain` imports nothing outside `domain`.
- Tests may import anything; `tools/` import nothing from `app/`.
- **domain** — data types (JSDoc), validation, chord detection, setlist operations. Fully unit-testable in Node.
- **data** — repositories. Validate everything read from storage (golden principle *Validate at the boundary*). Functions are asynchronous (return promises).
- **ui** — views are functions *state → HTML* built with our own `html` tagged template (`ui/html.js`), which escapes every value by default; only its `render()` writes HTML into the page. One delegated listener per event type (`ui/events.js`) maps `data-action` attributes to actions. Routing uses the URL hash.
- A service layer is added only when real cross-cutting logic appears.

## Offline and updates

Spec: [install-offline.md](docs/product-specs/install-offline.md).

- `app/sw.js` is a standalone classic script at the root of `app/`, outside the layers: it imports nothing and nothing imports it. `data/app-version.js` registers it (`./sw.js`, scope `/setlist/app/`) and asks it for the version shown below the song list.
- It holds the **offline file list** (every published file of the app except `sw.js` and documentation) and the **version** (`VERSION`, format `YYYY.MM.DD`, `.2`, `.3` for more releases on one day), which names the cache.
- On install it downloads every file past the HTTP cache and stores them only when all arrived; one failure fails the install, so the app keeps its current version. It answers the app's requests from its own version's cache (cache-first). On activate it removes older caches.
- A new version is used from the next start: the browser activates the new worker only when no page of the app is open (no `skipWaiting`, no forced reload).
- **Every change to a file under `app/` changes `VERSION`, and every new file goes into the offline list** — without a build there are no content hashes. `npm run check` enforces both: the offline list must match the files under `app/`, and when a file under `app/` differs from the base, `VERSION` must differ too. The base is `origin/main` on a pull request and the parent commit `HEAD^` on deploy (which also catches two pull requests merged with the same version); locally it is `origin/main` (or `CHECK_VERSION_BASE`), and the rule is skipped with a note when that is missing — run `git fetch origin main` first.
- **Development:** on `localhost` the worker is not registered (and one left from an earlier visit is removed), so a reload always shows edited files. `?sw` in the address turns it on there; the e2e tests of offline and updates (`tests/app/e2e/offline.spec.js`, Chromium only) use it with their own small server that can publish a new version, fail a file or stop.

## Addresses

| Address | Content |
|---|---|
| `https://besnik.github.io/setlist/app/` | The app (from `app/`). The path is **permanent** — an installed PWA is bound to it. |
| `https://besnik.github.io/setlist/` | From `site/`: a redirect to the app; later a signpost page (what Setlist is, links to the app and the guide). |
| `https://besnik.github.io/setlist/guide/` | From `guide/` (after the MVP): the user guide. |

**Deployment:** every merge to `main` runs the workflow `.github/workflows/deploy.yml`: the check and all tests again, then it assembles the site (`site/` → `/setlist/`, `app/` → `/setlist/app/`) and publishes it to GitHub Pages. The dev server serves the same paths.

Storage and installed apps belong to the origin `https://besnik.github.io`; see [ADR 0005](docs/decisions/0005-dev-tooling-tests-and-deployment.md) for what that means.

## Parts and tests

Each part of the app, its technology and how to run its tests (golden principle *A lean test base in the repository*).

| Part | Technology | Tests | Command |
|---|---|---|---|
| `app/` | HTML, CSS, JavaScript (ES modules) | `tests/app/unit` (`node --test`), `tests/app/e2e` (Playwright: Chromium; WebKit in CI) | `npm run test:unit`, `npm run test:e2e` |
| `tools/` | Node.js scripts (development only) | `tests/tools` (`node --test`) | `npm run test:unit` |
| **All** | | | `npm test` |

Other commands: `npm start` (dev server at `http://localhost:8080/setlist/app/`, with `site/` at `/setlist/`, also reachable from phones in the same network), `npm run check` (project rules: layer and part imports, files loaded by HTML and CSS, file header comments, HTML written into the page only by `ui/html.js`, the offline file list and a new version for every app change). First run `npm install` once (Node.js 22 or newer).
