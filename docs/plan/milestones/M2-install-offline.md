# M2 — Install and offline

- **Status:** in-progress — spec and tasks proposed
- **Spec:** [app-shell.md#install-and-offline](../../product-specs/app-shell.md#install-and-offline)

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

Order: T-021 and T-022 can run in parallel; T-023 needs T-022.

| ID | Task | Spec | Status | PR |
|---|---|---|---|---|
| T-021 | Install: provisional app icon (PNG sizes from the spec), web app manifest with the permanent `id`, `scope` and `start_url`, iPhone tags in `index.html`; e2e test that the manifest is valid and its icons load | [app-shell.md#install-and-offline](../../product-specs/app-shell.md#install-and-offline), [UX](../../product-specs/app-shell.md#ux-and-visual-design) | proposed | — |
| T-022 | Offline and updates: `app/sw.js` (complete offline file list, cache-first, cache per version, old caches removed, update from the next start), registration from `main.js`, the version in one place (and the version line if approved), no stale files on the dev server; e2e tests: works offline after the first visit, a new version is used after a restart; ARCHITECTURE.md updated | [app-shell.md#install-and-offline](../../product-specs/app-shell.md#install-and-offline), [Notes](../../product-specs/app-shell.md#notes-for-design--engineering) | proposed | — |
| T-023 | Check: the offline file list matches the files of the app; a change under `app/` changes the version (against `origin/main`, CI fetches `main`); tests of both rules in `tests/tools` | [Notes](../../product-specs/app-shell.md#notes-for-design--engineering) | proposed | — |

## CEO actions

- After T-022 is deployed: install the app on the Android phone and the iPhone, turn on airplane mode, open it (see *Try it*).

## Out of scope

Push notifications, background sync, anything beyond install and offline.
