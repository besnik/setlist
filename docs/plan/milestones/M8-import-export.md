# M8 — Import and export

- **Status:** not started — spec and tasks are written when M7 is done

## Goal

Move songs and setlists in and out of the app as files: share a song with another guitarist, and protect the songbook against data loss — the data live only on the device, and clearing the browser data (or Safari removing data of a website not used for a while) would erase everything.

## Try it

Export one song and send it to a friend, who imports it. Export a backup on the laptop, import it on the phone: all songs and setlists are there.

## Scope

- Analyzed as a whole once setlists exist (CEO decision).
- **Export:** one song (to share it with other musicians), several chosen songs (pick them from the list, helped by the search), a setlist, and everything as a backup.
- **Import:** one file; the app sees whether it holds one song or more and imports them. What happens to existing songs (duplicates, the same song in another version) is specified with the feature.
- **Detecting the format** (`plain` / `chordpro`) of an imported or pasted text; the user can change it.
- Files validated before use.

## Out of scope

Automatic or cloud backup, sync between devices, import from song websites (after the MVP, see the [inbox](../inbox.md)).

## Open questions (for the spec)

- **Songs vs. setlists:** one file format for everything, or separate ones? Does an exported setlist carry its songs (so it works on another device), and what if the songs already exist there?
- **Picking songs to export:** search and checkboxes may be enough; a filter by tags needs tags first (an idea in the [inbox](../inbox.md)).
- **File format:** our own JSON for songs and setlists, ChordPro (`.cho`) for one song so other apps can read it, or both.
