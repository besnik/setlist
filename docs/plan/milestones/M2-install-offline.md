# M2 — Install and offline

- **Status:** in-progress
- **Spec:** [install-offline.md](../../product-specs/install-offline.md)

## Goal

Setlist becomes a real PWA: it can be installed on the phone, tablet and laptop, and it opens and works without a network.

## Try it

Install the app on Android (Chrome) and iPhone (Safari, *Add to Home Screen*), turn on airplane mode, open it: it works. After a new version is deployed, the app picks it up.

## Scope

- Web app manifest, provisional app icon (the final logo is a CEO decision).
- Hard-to-reverse values decided in the spec: manifest `id`, `scope` and `start_url` (proposal: all `./`), service worker at `app/sw.js` limited to `/setlist/app/`.
- All app files cached for offline use.
- Update to a new version (how the user gets it — to be specified). Without a build there are no content hashes: every release bumps the cache version, enforced by the check.
- A check that the offline file list contains every file of the app.

## Tasks

Order: T-021 and T-022 can run in parallel — whichever merges second adds the other's files to the offline list in `sw.js` and changes the version. T-023 needs T-022.

| ID | Task | Spec | Status | PR |
|---|---|---|---|---|
| T-021 | Install: provisional app icon (PNG sizes from the spec), web app manifest with the permanent `id`, `scope` and `start_url`, iPhone tags in `index.html`; e2e test that the manifest is valid and its icons load | [install-offline.md](../../product-specs/install-offline.md), [UX](../../product-specs/install-offline.md#ux-and-visual-design) | done | [#31](https://github.com/besnik/setlist/pull/31) |
| T-022 | Offline and updates: `app/sw.js` (complete offline file list, cache-first, cache per version, old caches removed, update from the next start), registration from `main.js`, the version in one place and the version line below the song list, no stale files on the dev server; e2e tests (Chromium): works offline after the first visit, a new version is used after all pages are closed and the app opened again, a failed update keeps the old version; ARCHITECTURE.md updated | [install-offline.md](../../product-specs/install-offline.md), [Notes](../../product-specs/install-offline.md#notes-for-design--engineering) | done | [#32](https://github.com/besnik/setlist/pull/32) |
| T-023 | Check: the offline file list matches the files of the app; a change under `app/` changes the version (against `origin/main`, CI fetches `main`); deploy compares against `HEAD^`; tests of both rules in `tests/tools`; rule list in the header of `tools/check.js` and in ARCHITECTURE.md updated | [Notes](../../product-specs/install-offline.md#notes-for-design--engineering) | proposed | — |

## CEO actions

- After T-022 is deployed: install the app on the Android phone and the iPhone, turn on airplane mode, open it (see *Try it*).
  - 2026-11-26: done on Windows (Chrome: install offered by itself, own window) and Android (Chrome: *Install app* from the menu, works in airplane mode).
  - iPhone: not tested yet — still open.

## Out of scope

Push notifications, background sync, anything beyond install and offline.
