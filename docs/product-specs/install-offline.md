# Install and offline

- **Status:** draft

<!-- M2. Everything else around the screens (address, start, theme, screen sizes) is in app-shell.md. -->

## Purpose

Setlist is a Progressive Web App: it can be installed like an app on the phone, the tablet and the laptop, and it works without a network — at a gig there is often no signal. Updates arrive on their own without disturbing a performance.

## Behavior

### Install

- Rule: given Chrome on Android, when the user opens the app, then the browser offers to install it (its install banner or *Install app* in the menu).
- Rule: given Safari on iPhone, when the user taps *Share → Add to Home Screen*, then the home screen gets the icon and the name "Setlist".
- Rule: given Chrome or Edge on Windows, when the user opens the app, then the browser offers to install it (icon in the address bar or *Install Setlist* in the menu).
- Rule: the installed app has the name "Setlist" and the Setlist icon, opens in its own window without the browser's address bar, and starts on the Songs screen.
- Rule: the app has no install button of its own; installing is done through the browser (the user guide, M9, explains how).
- Rule: the installed app follows the system light or dark theme like the browser tab.
- Rule: the app can be used in portrait and landscape; the orientation is not locked.

### Offline

- Rule: given the app was opened once with a network and finished loading, when it is opened again without a network (airplane mode), then it starts and everything it offers works — the song list, search and the fonts — in the browser tab and in the installed app. Exception: in a Safari tab on iPhone (not on the home screen), Safari may delete the stored app after about seven days without use; then the next visit needs a network again.
- Rule: everything the app needs to start is stored on the device on the first visit; there are no files that load only later and might be missing offline.
- Rule: the very first visit needs a network; if there is none, the browser shows its own error.
- Rule: offline support covers only the app (`/setlist/app/`); the root of the website (`/setlist/`) is not part of it.

### Updates

- Rule: given a new version was published, when the app is opened with a network, then the new version downloads in the background; the screen the user is on is not interrupted and the page never reloads by itself.
- Rule: the downloaded version is used from the next start of the app: after every window and tab of the app has been closed and the app is opened again. A reload alone keeps the current version, and so does an open browser tab of the app while the installed app restarts.
- Rule: given the download of a new version fails or is incomplete (for example the network drops), then the app keeps working in its current version and tries again on a later start.
- Rule: given there is no network, then the app starts in the version it already has.
- Rule: the bottom of the Songs screen shows the app version in small muted text, e.g. `Version 2026.11.30`, so the user can see that an update has arrived. It may move to a Settings or About screen once one exists.

### Permanent identity

These values are hard to change after the first users install the app: browsers and phones recognize the installed app by them. Changing `id` later creates a second, separate app on the device.

| Value | Setting | Resolves to |
|---|---|---|
| App identity (`id`) | `./` | `https://besnik.github.io/setlist/app/` |
| Scope (`scope`) | `./` | everything under `/setlist/app/` |
| Start address (`start_url`) | `./` | `https://besnik.github.io/setlist/app/` |
| Offline worker | `app/sw.js` | controls only `/setlist/app/` |

### Good to know (affects M5 and M8)

- On iPhone, the app on the home screen keeps its own data, separate from Safari: songs saved in Safari are not visible in the installed app and the other way round. Removing the app from the home screen deletes its data.
- Safari may delete the data of a website that is not added to the home screen after about seven days without use. Installed apps are not affected.

## UX and visual design

Tokens: [design guidelines](../design/guidelines.md).

### App icon and install

- Provisional icon until the CEO chooses the logo and brand colors: a rounded square in `--color-accent` (light value `#e8501f`) with a white bold "S" in Bricolage Grotesque 700, centered.
- The "S" stays inside the central 80 % circle (safe zone), so Android can cut the icon into a circle, a squircle or a rounded square without cutting the letter. White on the accent is 3.75 : 1, above the 3 : 1 minimum for large bold text.
- Files (PNG, served by the app): 192 × 192 and 512 × 512 px with rounded corners (browsers, Windows); 512 × 512 px *maskable* — full bleed, square, no transparent corners — for Android, which cuts its own shape; 180 × 180 px full bleed for the iPhone home screen, which rounds the corners itself.
- Name and short name: "Setlist".
- Splash screen and window background (Android): `#0e1013` (dark `--color-bg`) — a short dark splash is harmless in daylight and never blinds on a dark stage. The manifest has no `theme_color`, so the window bar follows the theme through the existing `theme-color` meta tags. On Windows in light mode the window may show the dark background for a moment while starting — accepted.
- iPhone: status bar in the default style (dark text on light, light text on dark), content below it — no `viewport-fit=cover` in M2.

### Version line

```
│  ...                               │
│  Wonderwall · Oasis           [F#m]│
│                                    │
│          Version 2026.11.30        │   ← --color-muted, small step, centered,
└────────────────────────────────────┘     --space-5 above, below the list
```

**Self-check:** the version line is plain text below the list, so it never widens the page at 320 px; the icon's "S" fits the safe zone at every icon size; no screen element changes size in portrait or landscape.

## Notes for Design / Engineering

- No new dependency, no build step and no change to the layers; no ADR needed: the cache strategy follows from this spec and [ADR 0004](../decisions/0004-tech-stack-and-architecture.md) / [ADR 0005](../decisions/0005-dev-tooling-tests-and-deployment.md). Record the service worker in [ARCHITECTURE.md](../../ARCHITECTURE.md) (layout and the check rules).
- Manifest `app/manifest.webmanifest` with the values above (`display: standalone`, relative URLs only), linked from `index.html` with the iPhone tags (`apple-touch-icon`, `apple-mobile-web-app-title`).
- `app/sw.js` is a standalone classic script at the root of `app/`, outside the layers (it is not imported by and imports nothing from `app/src`), with a header comment. Registered from `main.js` as `navigator.serviceWorker.register('./sw.js')` — the URL resolves against the page, not the module.
- Strategy: on `install`, put the complete list of app files into a cache named after the version, fetching each file with `{ cache: 'reload' }` so the HTTP cache cannot put old files under the new version's name, and fail the install if any file fails (so a partial update never becomes active). Serve every request of the app cache-first; the navigation to `./` or `./index.html` is answered with `index.html`. On `activate`, delete caches of older versions.
- Updates take effect on the next start: the new worker waits until no page of the app is open (no `skipWaiting()`, no forced reload). Browsers check `sw.js` itself past the HTTP cache by default, so GitHub Pages' `max-age=600` does not delay the check; it only matters for the install fetches above.
- **Version:** one constant `VERSION` in `app/sw.js` (so every release is also a byte change of the worker, which is what the browser compares). It names the cache. The version line asks the active worker for it (`postMessage`) through a small function in `data/`; with no active worker (first visit, dev server) the line is not shown. Every change to a file under `app/` must change the version — without a build there are no content hashes. Format proposal: the date of the change, `YYYY.MM.DD` (with `.2`, `.3` for more releases on one day).
- **Check** (new rules in `npm run check`, with messages that say how to fix):
  1. The offline file list in `app/sw.js` contains every file of the app that is published (all files under `app/` except `sw.js` itself and documentation such as `README.md` and licence texts, which must still be published), and nothing that does not exist.
  2. When a file under `app/` differs from the base, the version must differ too. Base: `origin/main` on a pull request (CI fetches `main`); the parent commit `HEAD^` in the deploy workflow (`fetch-depth: 2`), which also catches two PRs that merged with the same version. Locally the rule is skipped with a note when the base is missing.
  - The manifest is not covered by the existing rules 1 and 5 (JSON has no comments); its icon paths are checked by the T-021 e2e test.
- **Development:** a cache-first worker would hide edits behind the old cache. On `localhost` the app must show edited files after a reload (e.g. do not register the worker on the dev server unless a test asks for it). The e2e tests test offline and updates in **Chromium only**: offline with `context.setOffline(true)` *and* all requests blocked (`context.route('**', (r) => r.abort())`, or the server stopped), because `setOffline` alone may not cover the worker's own requests; an update by closing all pages of the context and opening a new one; a failed update by blocking one file during the update and checking that the old version keeps working.
- WebKit in Playwright does not cover the iPhone home screen; installing on Android and iPhone is tested by the CEO by hand on the deployed site.

## Out of scope

- Push notifications, background sync, sharing to the app, an in-app install button, an "update now" button (M2 scope).
- Offline use of the website root and the user guide.

## Open questions

None. Decided by the CEO on 2026-11-26: the version line is shown below the song list; updates arrive silently from the next start (no "Reload" notice); the provisional "S" icon is accepted until the logo is chosen.
