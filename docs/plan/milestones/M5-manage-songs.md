# M5 — Manage songs

- **Status:** not started — scope agreed with the CEO on 2026-11-28; spec and tasks come next (`new-feature`)

## Goal

The musician's own songbook: type in or paste a song, save it, edit it, delete it — and after closing the app everything is still there.

## Try it

Paste a song from the web into a new song, close the app, open it again: the song is there. Edit it, then delete it.

## Scope

- **Storage on the device:** likely IndexedDB (own ADR). Each song is validated once when read (one domain function, so views can trust the `Song` type — see [tech-debt.md](../tech-debt.md)). Ask the browser for persistent storage (`navigator.storage.persist()`). Sample songs only on the very first start; after that they are ordinary songs (can be edited and deleted).
- **Ready for history and import** (CEO, 2026-11-28): a new song gets a random id (`crypto.randomUUID()`), so songs from two devices never clash on import (M8); each song stores `createdAt` and `updatedAt`, so import and later sync can tell which version is newer; the stored data carry a version number, so a later change of the song's shape can upgrade old records.
- The stored song has the same shape as the `Song` type, and the M8 export file will reuse it.
- **Song form** (one screen for add and edit): title (required), artist, key, **format** (`plain` / `chordpro`, default `plain`), **notation** (`international` / `german`), text with chords, optional **source** (plain text, e.g. `akordy.sk`). The user chooses the format and the notation by hand.
- **Help next to a field:** a small "?" button that opens a short explanation with an example — for the format (chords over lyrics vs. chords in square brackets) and the notation (`H` / `B`). Built as one small component in `ui/components/` that takes its content from outside, so other screens can reuse it later; no options "for the future" (CEO, 2026-11-28). On a phone it may be a bottom sheet, because the text is longer than a tooltip.
- **Add:** a "+" button on the Songs screen opens the empty form; after saving, the Song view of the new song opens.
- **Edit:** a button in the Song view opens the form with the song.
- **Delete:** with confirmation.
- **Unsaved changes:** leaving the form with unsaved changes asks first.
- **iPhone note** (Safari and the app on the home screen keep separate data, see [install-offline.md](../../product-specs/install-offline.md#good-to-know-affects-m5-and-m8)): in the README; later in the user guide (M9). Nothing in the app in M5 — sync between devices would remove the problem (CEO, 2026-11-28).

## Out of scope

- Detecting the format of a pasted text, import and export of files (M8).
- Preview of the song while typing, tags and categories, transposition, sync.
- Backup: stays in M8 (CEO, 2026-11-28). Until then the songs live only on the device — keep the main songbook elsewhere too.
