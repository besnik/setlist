# Install and offline

- **Status:** approved

<!-- Everything else around the screens (address, start, theme, screen sizes) is in app-shell.md. -->

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

- Provisional icon until the CEO chooses the logo and brand colors: a rounded square in the accent color with a white bold "S" in the display font, centered.
- The "S" stays inside the central safe zone, so Android can cut the icon into a circle, a squircle or a rounded square without cutting the letter. There is a rounded icon for browsers and Windows, a full-bleed *maskable* one for Android and a full-bleed one for the iPhone home screen (which rounds the corners itself).
- Name and short name: "Setlist".
- Splash screen and window background (Android) are dark — a short dark splash is harmless in daylight and never blinds on a dark stage. The window bar follows the theme. On Windows in light mode the window may show the dark background for a moment while starting — accepted.
- iPhone: status bar in the default style, content below it (no `viewport-fit=cover`).

The exact values (icon sizes, colors) live in `app/manifest.webmanifest`, `app/index.html` and `app/assets/icons/`.

### Version line

```
│  ...                               │
│  Wonderwall · Oasis           [F#m]│
│                                    │
│          Version 2026.11.30        │   ← small, muted, centered, below the list
└────────────────────────────────────┘
```

## Notes for Design / Engineering

The service worker, the version and the check rules are described in [ARCHITECTURE.md](../../ARCHITECTURE.md#offline-and-updates).

## Out of scope

- Push notifications, background sync, sharing to the app, an in-app install button, an "update now" button.
- Offline use of the website root and the user guide.

## Open questions

None. Decided by the CEO on 2026-11-26: the version line is shown below the song list; updates arrive silently from the next start (no "Reload" notice); the provisional "S" icon is accepted until the logo is chosen.
