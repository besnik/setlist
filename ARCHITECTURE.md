# Architecture

Setlist is an offline-first Progressive Web App. All data lives on the user's device; there is no backend.
Decisions behind this page: [ADR 0004](docs/decisions/0004-tech-stack-and-architecture.md) (stack and architecture), [ADR 0005](docs/decisions/0005-dev-tooling-tests-and-deployment.md) (tooling, tests, deployment), [ADR 0006](docs/decisions/0006-screens-views-and-components.md) (screens, views and components).

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
    ui/               screens/, views/, components/, router (see "Screens and routing")
    main.js           start-up: wires the layers together
  styles/             design tokens (tokens.css), fonts (fonts.css), base styles (base.css), shared components (components.css), one file per screen
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
  - `song-repository.js` — songs (the sample songs in memory until M5 decides their storage).
  - `app-version.js` — registers the service worker and reads the version of the stored app (see "Offline and updates").
  - `settings-repository.js` — the device's preferences (today the font size of the song text) in `localStorage`, the app's first storage: enough for a few small values, not for songs. It validates what it reads (falls back to the default) and never throws when storage is not allowed — the value is then kept in memory while the app is open.
- **ui** — views are functions *state → HTML* built with our own `html` tagged template (`ui/html.js`), which escapes every value by default; only its `render()` writes HTML into the page. One delegated listener per event type (`ui/events.js`) maps `data-action` attributes to actions; key presses not tied to an element (Escape) go through `onKeys` in the same module.
- **Screens and routing** — see the next section.
- A service layer is added only when real cross-cutting logic appears.

## Screens and routing

Decision: [ADR 0006](docs/decisions/0006-screens-views-and-components.md).

```
app/src/ui/
  html.js, events.js  safe rendering; delegated events and keys
  log.js              the app's log (see "Errors and logging")
  wake-lock.js        keeps the screen on (Screen Wake Lock), started and stopped by a screen
  routes.js           pure: address hash → route, song → address
  router.js           follows the address and shows one screen at a time
  screens/            one module per screen: state, actions, side effects
  views/              pure: state → HTML, one per screen
  components/         pure: small templates shared by views (key chip, stage button)
```

- **Routing** uses the URL hash: `#/song/<id>` (id encoded) is the Song view, anything else the Songs screen. Links, Back, reload and the Android back gesture need no extra code.
- **A screen** is made by a factory (`createSongsScreen()`) and is `{ load?(route), show(root, data, navigation) }`. `load` returns the data or `null` for something that does not exist (the router then replaces the address with the Songs screen's). `show` renders a view, registers the screen's actions (`delegate`, `onKeys`) and side effects, and returns `hide()`, which undoes them. A screen keeps its own state in memory (e.g. the search text and scroll position of the Songs screen); the router sets `history.scrollRestoration = 'manual'`, so screens set their scroll position themselves.
- **The router** calls `load`, then `hide()` of the old screen and `show` of the new one, and sets `data-screen` on the root (styles per screen). Data that arrives after a newer address is dropped. `navigation` tells the screen where it came from and lets it go `back()` or `home()`.
- **Views and components are pure** (state in, HTML out): they import only `ui/html.js`, `ui/routes.js`, other views and components, and `domain/`, and use no browser globals — `npm run check` enforces it. They can be unit-tested in Node (risky ones are, e.g. the Song view; the others are covered by e2e).
- **Styles** follow the same split: `styles/components.css` for shared components, one file per screen (`songs-screen.css`, `song-screen.css`).
- `main.js` only wires: it creates the screens, starts the router and the service worker — `npm run check` enforces it (no state, own functions, listeners, rendering or work with the address).

## Errors and logging

Decision: [ADR 0007](docs/decisions/0007-error-handling-and-logging.md). Rules: golden principle 20, *Errors are handled or seen, never swallowed*.

- **Catch only the expected case**, named by `error.name`, type or code: the browser refused the screen lock (`NotAllowedError`), storage is not allowed or full (`SecurityError`, `QuotaExceededError`), a broken escape in an address (`URIError`). Anything else is rethrown or logged.
- **`ui/log.js`** is the only code in `app/` that writes to the console: `log.error`, `log.warn`, `log.info`, each prefixed with `[setlist]`. *error* — a bug or a failure that breaks the app; *warn* — a feature does not work, the app does; *info* — one line at start-up with the version. No song texts or other user data in the log.
- **One boundary:** `logUncaughtErrors()` (called first in `main.js`) logs every error and rejected promise nothing else caught, once, as *error*. The user sees no message (that would be a spec change); the log stays on the device — nothing is sent anywhere.
- `tools/` are command-line scripts: they write to the console directly, and the dev server answers an unexpected error with 500 and logs it instead of hiding it behind 404.
- The service worker (`sw.js`) logs nothing today; when it needs to, it gets its own small log with the same levels (it cannot import `ui/`) and the check an exception for it.
- `npm run check` enforces it: no `catch` without its error, no empty `catch` block or `.catch()` handler in `app/` and `tools/`, and no console use in `app/` outside `ui/log.js`. It catches only these plain forms; a handler that ignores its error in another way is for review.

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

Other commands: `npm start` (dev server at `http://localhost:8080/setlist/app/`, with `site/` at `/setlist/`, also reachable from phones in the same network), `npm run check` (project rules: layer and part imports, pure views and components, `main.js` only wiring, files loaded by HTML and CSS, file header comments, HTML written into the page only by `ui/html.js`, no swallowed errors and console use only in `ui/log.js`, the offline file list and a new version for every app change). First run `npm install` once (Node.js 22 or newer).
