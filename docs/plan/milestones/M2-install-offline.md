# M2 — Install and offline

- **Status:** not started — spec and tasks are written when M1 is done

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

## Out of scope

Push notifications, background sync, anything beyond install and offline.
