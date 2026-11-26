# App shell

- **Status:** approved — except the section *Install and offline*, which is a draft (M2)

<!-- Based on the CEO's prototype — see docs/design/prototype-reference.md. -->

## Purpose

What surrounds every screen: where the app lives, how it starts, how it adapts to the device and the light. The app must be usable on a phone, a tablet and a laptop, without installation or registration.

## Behavior

### Start and address

- Rule: the app opens at `https://besnik.github.io/setlist/app/` and shows the Songs screen.
- Rule: `https://besnik.github.io/setlist/` redirects to the app (until a signpost page exists).
- Rule: the browser tab and the page title read "Setlist".
- Rule: the app loads nothing from other websites (fonts and all assets come with the app).

### Language

- Rule: all texts of the app are in English. Song content can be in any language.

### Theme

- Rule: the app follows the system setting: light colors when the system is light, dark colors when it is dark, and it switches when the system setting changes.
- Rule: there is no theme switch in the app.

### Screen sizes

- Rule: the app works from a 320 px wide phone up to a desktop window, in portrait and landscape; the page never scrolls horizontally.
- Rule: on wide screens the content stays in one centered column.

### Navigation *(planned — M6)*

A bottom tab bar Songs / Setlists arrives with setlists. Before that the app has a single screen.

### Install and offline

*Draft — M2.*

Setlist is a Progressive Web App: it can be installed like an app and it works without a network.

**Install**

- Rule: given Chrome on Android, when the user opens the app, then the browser offers to install it (its install banner or *Install app* in the menu).
- Rule: given Safari on iPhone, when the user taps *Share → Add to Home Screen*, then the home screen gets the icon and the name "Setlist".
- Rule: given Chrome or Edge on Windows, when the user opens the app, then the browser offers to install it (icon in the address bar or *Install Setlist* in the menu).
- Rule: the installed app has the name "Setlist" and the Setlist icon, opens in its own window without the browser's address bar, and starts on the Songs screen.
- Rule: the app has no install button of its own; installing is done through the browser (the user guide, M9, explains how).
- Rule: the installed app follows the system light or dark theme like the browser tab.
- Rule: the app can be used in portrait and landscape; the orientation is not locked.

**Offline**

- Rule: given the app was opened once with a network and finished loading, when it is opened again without a network (airplane mode), then it starts and everything it offers works — the song list, search and the fonts — in the browser tab and in the installed app.
- Rule: everything the app needs to start is stored on the device on the first visit; there are no files that load only later and might be missing offline.
- Rule: the very first visit needs a network; if there is none, the browser shows its own error.
- Rule: offline support covers only the app (`/setlist/app/`); the root of the website (`/setlist/`) is not part of it.

**Updates**

- Rule: given a new version was published, when the app is opened with a network, then the new version downloads in the background; the screen the user is on is not interrupted and the page never reloads by itself.
- Rule: the downloaded version is used from the next start of the app (after it was closed and opened again, or after a reload).
- Rule: given the download of a new version fails or is incomplete (for example the network drops), then the app keeps working in its current version and tries again on a later start.
- Rule: given there is no network, then the app starts in the version it already has.
- Rule *(if the CEO approves, see Open questions)*: the bottom of the Songs screen shows the app version in small muted text, e.g. `Version 2026.11.30`, so the user can see that an update has arrived.

**Permanent identity**

These values are hard to change after the first users install the app: browsers and phones recognize the installed app by them. Changing `id` later creates a second, separate app on the device.

| Value | Setting | Resolves to |
|---|---|---|
| App identity (`id`) | `./` | `https://besnik.github.io/setlist/app/` |
| Scope (`scope`) | `./` | everything under `/setlist/app/` |
| Start address (`start_url`) | `./` | `https://besnik.github.io/setlist/app/` |
| Offline worker | `app/sw.js` | controls only `/setlist/app/` |

**Good to know (affects M5 and M8)**

- On iPhone, the app on the home screen keeps its own data, separate from Safari: songs saved in Safari are not visible in the installed app and the other way round. Removing the app from the home screen deletes its data.
- Safari may delete the data of a website that is not added to the home screen after about seven days without use. Installed apps are not affected.

## UX and visual design

Tokens and components: [design guidelines](../design/guidelines.md).

**Page**

- Page background `--color-bg`. Text uses `--font-body` with the `body` step in `--color-ink`.
- The page declares `color-scheme: light dark`.
- Light and dark values switch with `prefers-color-scheme`, so a change in the system setting applies right away, without a reload.
- `<meta name="theme-color">` is set once per theme (two meta tags with a `media` attribute) to the hex value of `--color-bg` — a meta tag cannot use `var()` — so the browser's own bar matches.
- Fonts: four self-hosted WOFF2 files (see the guidelines), `font-display: swap`. The page is readable in the fallback fonts before they load.

**Column**

```
phone (320–599 px)                     tablet / desktop (≥ 600 px)
┌────────────────────┐                 ┌──────────────────────────────────────────┐
│16│  content    │16 │                 │        │  content, max 720 px  │        │
│  │  column     │   │                 │  auto  │  24 px gutter inside  │  auto  │
└────────────────────┘                 └──────────────────────────────────────────┘
```

- One column, `max-width: var(--content-max)` (720 px, the outer width including the gutters, `box-sizing: border-box`), centered with automatic side margins.
- Side gutter `--gutter`: 16 px below 600 px, 24 px from 600 px.
- Top and bottom padding `--space-5` (24 px).
- The page scrolls vertically only. Every flex or grid child that holds text has `min-width: 0`, and long words wrap or ellipsize, so nothing widens the page.
- No `viewport-fit=cover` in M1: on phones with a notch in landscape the browser keeps the content inside the safe area by itself.
- No top app bar and no navigation in M1. The screen heading is the top of the page; the tab bar comes in M6.

**App icon and install** *(draft — M2)*

- Provisional icon until the CEO chooses the logo and brand colors: a rounded square in `--color-accent` (light value `#e8501f`) with a white bold "S" in Bricolage Grotesque 700, centered.
- The "S" stays inside the central 80 % circle (safe zone), so Android can cut the icon into a circle, a squircle or a rounded square without cutting the letter. White on the accent is about 3.8 : 1, enough for one large bold letter.
- Files (PNG, served by the app): 192 × 192 and 512 × 512 px with rounded corners (browsers, Windows); 512 × 512 px *maskable* — full bleed, square, no transparent corners — for Android, which cuts its own shape; 180 × 180 px full bleed for the iPhone home screen, which rounds the corners itself.
- Name and short name: "Setlist".
- Splash screen and window background (Android): `#0e1013` (dark `--color-bg`) — a short dark splash is harmless in daylight and never blinds on a dark stage. The window bar follows the theme through the existing `theme-color` meta tags.
- iPhone: status bar in the default style (dark text on light, light text on dark), content below it — no `viewport-fit=cover` in M2.

**Version line** *(only if approved, see Open questions)*

```
│  ...                               │
│  Wonderwall · Oasis           [F#m]│
│                                    │
│          Version 2026.11.30        │   ← --color-muted, small step, centered,
└────────────────────────────────────┘     --space-5 above, below the list
```

**Self-check:** the version line is plain text below the list, so it never widens the page at 320 px; the icon's "S" fits the safe zone at every icon size; no screen element changes size in portrait or landscape.

## Notes for Design / Engineering

- **Install and offline (M2)** — no new dependency, no build step and no change to the layers; no ADR needed: the cache strategy follows from this spec and [ADR 0004](../decisions/0004-tech-stack-and-architecture.md) / [ADR 0005](../decisions/0005-dev-tooling-tests-and-deployment.md). Record the service worker in [ARCHITECTURE.md](../../ARCHITECTURE.md) (layout and the check rules).
- Manifest `app/manifest.webmanifest` with the values above (`display: standalone`, relative URLs only), linked from `index.html` with the iPhone tags (`apple-touch-icon`, `apple-mobile-web-app-title`).
- `app/sw.js` is a standalone script at the root of `app/`, outside the layers (it is not imported by and imports nothing from `app/src`). Registered from `main.js` with a relative URL.
- Strategy: on `install`, put the complete list of app files into a cache named after the version, and fail the install if any file fails (so a partial update never becomes active). Serve every request of the app cache-first; the navigation to `./` or `./index.html` is answered with `index.html`. On `activate`, delete caches of older versions.
- Updates take effect on the next start: the new worker waits (no `skipWaiting()` while a page is open, no forced reload). Browsers check for a new `sw.js` on start; the dev and Pages servers must not let it be cached for long (GitHub Pages sends `max-age=600`, which is acceptable).
- **Version** in one place, shared by the worker (cache name) and, if approved, the version line. Every change to a file under `app/` must change the version — without a build there are no content hashes. Format proposal: the date of the change, `YYYY.MM.DD` (with `.2`, `.3` for more releases on one day).
- **Check** (new rules in `npm run check`, with messages that say how to fix):
  1. The offline file list in `app/sw.js` contains every file of the app that is published (all files under `app/` except `sw.js` itself and documentation such as `README.md` and licence texts, which must still be published), and nothing that does not exist.
  2. When a file under `app/` differs from `origin/main`, the version must differ too. CI needs the history of `main` for this (`fetch-depth: 0` or a fetch of `main`); locally the rule is skipped with a note when `origin/main` is missing.
- **Development:** a cache-first worker would hide edits behind the old cache. On `localhost` the app must show edited files after a reload (e.g. do not register the worker on the dev server unless a test asks for it). The e2e tests must be able to test offline in Chromium (Playwright `context.setOffline(true)`) and the update path.
- WebKit in Playwright does not cover the iPhone home screen; installing on Android and iPhone is tested by the CEO by hand on the deployed site.

## Out of scope

- Accessibility work beyond good defaults: ARIA labels, screen reader support, high-contrast modes (CEO decision — audience is everyday musicians).
- User accounts, sync between devices, a backend.
- Translations of the UI (an idea in the inbox).
- Push notifications, background sync, sharing to the app, an in-app install button, an "update now" button (M2 scope).
- Offline use of the website root and the user guide.

## Open questions

1. **Version line on the Songs screen?** Without it the user (and the CEO testing M2) cannot see whether an update has arrived. **Recommendation: yes** — one line of small muted text below the song list; it also helps when reporting a bug.
2. **How does the user get an update?** Options: (a) silently, from the next start of the app; (b) a notice "New version — Reload" that the user taps. **Recommendation: (a)** — nothing ever changes or pops up during a gig, and there is no extra UI; a notice can be added later if updates feel too slow.
3. **Provisional icon** — a white "S" on the accent color (see *UX and visual design*) until the logo is chosen. **Recommendation: accept it**; changing an icon later is easy (unlike `id` and `scope`).
