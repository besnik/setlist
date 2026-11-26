# 0006. Screens, views and components in the UI layer

- **Status:** accepted
- **Date:** 2026-11-26
- **Decided by:** CEO

## Context

With the Song view (T-024) the app got its second screen and a router. The first version put the whole flow into `main.js`: the Songs screen state, switching screens, loading a song, closing it, Escape and every action of every screen. The next tasks (font size, screen lock) and milestones (editor, setlists, play mode) would all have grown that one file. The CEO asked to set a clean structure now, while it is cheap.

## Options considered

1. **Keep everything in `main.js`** — no new files; but one file grows with every screen and mixes state, side effects and wiring (spaghetti).
2. **A UI framework** — ready-made structure; but a runtime dependency and a build step, against ADR 0004.
3. **Our own small split: screens, views, components and a router** — a few short files with clear jobs and one tiny contract (`load` / `show` → `hide`); no dependency. Justified now: two screens exist and four more are planned.

## Decision

Option 3. Inside `app/src/ui/`:

- `views/` and `components/` — **pure** functions *state → HTML* (`html` template). They import only `ui/html.js`, `ui/routes.js`, other views and components, and `domain/`, and use no browser globals. `npm run check` enforces this (rule 9), so they stay unit-testable in Node.
- `screens/` — one module per screen with a factory `createXScreen()` returning `{ load?(route), show(root, data, navigation) → hide }`. A screen holds its own state (closure, no global state), loads data through `data/`, renders views, registers its actions and side effects, and undoes them in `hide()`.
- `routes.js` — pure address functions (hash → route, song → address). `router.js` — follows the address, shows one screen at a time, sends unknown items (`load` returns `null`) to the Songs screen and drops data that arrives after a newer address.
- `main.js` — only wiring: creates the screens, starts the router and the service worker.
- CSS follows the same split: `components.css` (shared), one file per screen (`songs-screen.css`, `song-screen.css`).

## Consequences

- A new screen is a new file in `screens/` plus its view and a row in the router's table; nothing else grows.
- Side effects with a lifetime (Escape, the screen lock in T-027) get a natural place to start and stop.
- More, smaller files — each new file must also go into the offline file list (the check reminds).
- The layer rule (`main.js → ui → data → domain`) is unchanged.
