# M5 — Manage songs

- **Status:** not started — spec and tasks are written when M4 is done

## Goal

The musician's own songbook: add, edit and delete songs; everything stays saved on the device.

## Try it

Paste a song from the web into a new song, close the app, open it again: the song is there.

## Scope

- Add and edit a song: title (required), artist, key, text with chords (in the format from M4); delete with confirmation.
- Permanent storage on the device (likely IndexedDB — own ADR), validated when read (one domain function, so views can trust the `Song` type — see [tech-debt.md](../tech-debt.md)); ask the browser for persistent storage (`navigator.storage.persist()`).
- Known limit to explain to users: on iPhone, the app added to the Home Screen has storage separate from Safari tabs — songs entered in Safari do not appear in the installed app.
- Sample songs only on the very first start.

## Out of scope

Import from files or websites, tags, sync.
