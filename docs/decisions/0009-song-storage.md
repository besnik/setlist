# 0009. Song storage on the device

- **Status:** proposed
- **Date:** 2026-11-28
- **Decided by:** CEO

## Context

From M5 on, the musician's own songs are saved on the device: add, edit, delete, and everything is still there after closing the app ([M5 scope](../plan/milestones/M5-manage-songs.md), spec [songs.md — Manage songs](../product-specs/songs.md#manage-songs-m5)). There is no backend ([ADR 0004](0004-tech-stack-and-architecture.md)) and no runtime dependency.

Forces:

- A song text may be up to 50 000 characters; a songbook may hold hundreds of songs (several MB).
- Saving must never lose text silently: a failure must reach the form as an error.
- The data must be ready for import and later sync (M8 and after): random ids, `createdAt` / `updatedAt`, a version number so a later change of the song's shape can upgrade old records.
- A new app version can change the shape of the data while an old tab is still open (e.g. after a reload that bypassed the service worker).
- The browser may clear site data under storage pressure unless the site has persistent storage.
- Supported browsers: current Chrome, Edge and Safari on iPhone ([ARCHITECTURE.md](../../ARCHITECTURE.md)).

## Options considered

1. **`localStorage`** (already used for the font size) — simple, synchronous. But about 5 MB per origin, strings only, blocks the page on every write, and has no version or upgrade mechanism. Not enough for a songbook.
2. **IndexedDB, used directly** — the browser's database: asynchronous, structured records, far more space (a share of the free disk), transactions (a write either succeeds or fails as a whole), a database version with an upgrade step (`onupgradeneeded`), and a `versionchange` event that tells an old tab to let go. Supported in every target browser, also in a home-screen app on iPhone. Its API is verbose (events, not promises) — one small module of our own wraps it.
3. **IndexedDB through a library** (e.g. `idb`, Dexie) — nicer API, but a runtime dependency ([ARCHITECTURE.md](../../ARCHITECTURE.md): none) for what a small module does.
4. **Origin Private File System (OPFS)** — files on the device; good for big binary data, but no transactions or versioning built in, and we would design a file format first. More work for no gain at this size.

## Decision

**Option 2 — IndexedDB used directly**, wrapped in one module of the data layer:

- `data/database.js` opens the database `setlist` and owns its version and upgrades; it is the only code that touches IndexedDB. `data/song-repository.js` reads and writes songs through it.
- One object store `songs`, key `id`. A record has exactly the shape of the `Song` type (the M8 export reuses it).
- **The data version is the IndexedDB database version** (1 in M5). A later change of the song's shape raises it and upgrades the old records in `onupgradeneeded`, in one transaction.
- **Sample songs** are written in the upgrade from no database (the very first start) and in no other case; after that they are ordinary records.
- A new song gets the id `crypto.randomUUID()`; the sample songs keep their ids (`sample-…`), so their addresses stay valid.
- On `versionchange` (a newer app version opened the database) the module closes the database and tells the app, which shows "The app was updated — reload".
- `navigator.storage.persist()` is asked when a song is saved and storage is not yet persistent; the answer changes nothing visible.
- Every record read is validated once (`validateSong` in the domain); views trust the `Song` type.

## Consequences

- Songs survive restarts and updates, with room for a large songbook; writes are atomic.
- A data upgrade has one place to live; the versioning needs no field on each record.
- Our own wrapper (promises over IndexedDB requests) must be tested in real browsers: e2e in Chromium and WebKit; no fake IndexedDB in Node (no new dependency).
- `localStorage` stays for small preferences only (font size).
- Data stays per origin and per browser: on iPhone, Safari and the home-screen app keep separate data ([install-offline.md](../product-specs/install-offline.md#good-to-know-affects-m5-and-m8)); a backup comes with M8.
