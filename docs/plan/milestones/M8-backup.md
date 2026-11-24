# M8 — Backup

- **Status:** not started — spec and tasks are written when M7 is done

## Goal

Protect the songbook against data loss: the data live only on the device, and clearing the browser data (or Safari removing data of a website not used for a while) would erase everything.

## Try it

Export a backup on the laptop, import it on the phone: all songs and setlists are there.

## Scope

- Export all songs and setlists into one file (JSON) the user saves.
- Import such a file, validated before use; what happens to existing data is specified with the feature.

## Out of scope

Automatic or cloud backup, sync between devices, other file formats.
