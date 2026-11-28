# M2 — Install and offline

- **Status:** done
- **Spec:** [install-offline.md](../../product-specs/install-offline.md)

## Goal

Setlist becomes a real PWA: it can be installed on the phone, tablet and laptop, and it opens and works without a network.

## Try it

Install the app on Android (Chrome) and iPhone (Safari, *Add to Home Screen*), turn on airplane mode, open it: it works. After a new version is deployed, the app picks it up.

## Scope

Web app manifest with the permanent `id`, `scope` and `start_url` and a provisional icon; a service worker that stores every app file for offline use; updates from the next start, with a version bumped on every release and enforced by the check.

## Tasks

| ID | Task | Spec | Status | PR |
|---|---|---|---|---|
| T-021 | Install: provisional app icon, web app manifest with the permanent identity values and the iPhone tags. E2e test that the manifest is valid and its icons load | [install-offline.md](../../product-specs/install-offline.md), [UX](../../product-specs/install-offline.md#ux-and-visual-design) | done | [#31](https://github.com/besnik/setlist/pull/31) |
| T-022 | Offline and updates: the service worker (complete offline file list, cache-first, a cache per version, update from the next start) and the version line below the song list; not registered on the dev server. E2e tests (Chromium): works offline, a new version is used after a restart, a failed update keeps the old version | [install-offline.md](../../product-specs/install-offline.md) | done | [#32](https://github.com/besnik/setlist/pull/32) |
| T-023 | Check rules: the offline file list matches the app's files, and a change under `app/` changes the version (against `origin/main` on a PR, `HEAD^` on deploy). Tests of both rules | [ARCHITECTURE.md](../../../ARCHITECTURE.md#offline-and-updates) | done | [#35](https://github.com/besnik/setlist/pull/35) |

## CEO actions

- Install the app and open it in airplane mode (see *Try it*).
  - 2026-11-26: done on Windows (Chrome: install offered by itself, own window) and Android (Chrome: *Install app* from the menu, works in airplane mode).
  - iPhone: not tested yet.

## Out of scope

Push notifications, background sync, anything beyond install and offline.
