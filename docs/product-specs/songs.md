# Songs

- **Status:** approved (UX and visual design follow in T-012)

<!-- Based on the CEO's prototype — see docs/design/prototype-reference.md. -->

## Purpose

The songbook: all the musician's songs with lyrics and chords in one place, quick to find and easy to read while playing.

## Behavior

### Song list

- Rule: the Songs screen lists all songs, sorted by title alphabetically, ignoring letter case; accented letters sort together with their base letter (`Čaj` between `Cesta` and `Cibuľa`).
- Rule: each row shows the song title, the artist (or "Unknown artist" when empty) and, when the song has a key, the key as a small chip (e.g. `Am`).
- Rule: a long title or artist is shortened with an ellipsis on one line; the page never scrolls horizontally.
- Rule: the heading shows the number of songs, e.g. "4 songs" (singular "1 song").
- Rule: given the first start of the app, when the Songs screen opens, then it shows the sample songs (see *Sample songs*).
- Rule: in M1, rows are not interactive yet — opening a song comes with *Song view* (M3).

### Search

- Rule: a search field sits above the list. When the user types, the list is filtered immediately, without a submit button.
- Rule: a song matches when its title, artist or key contains the typed text, ignoring letter case and accents (`piesen` finds `Pieseň`). Leading and trailing spaces are ignored.
- Rule: given a search with no match, then the list area shows "No songs found." Clearing the field shows all songs again.
- Rule: the search text is kept while the app stays open; it is not remembered after a restart.

### Sample songs

- Rule: the app contains four public-domain sample songs with chords: *Amazing Grace* (G), *House of the Rising Sun* (Am), *Greensleeves* (Em), *When the Saints Go Marching In* (C), artist "Traditional".
- Rule: in M1 the sample songs are the only songs; adding own songs comes with *Manage songs* (M5).

### Song view *(planned — M3)*
### Song format *(planned — M4)*
### Manage songs *(planned — M5)*

## UX and visual design

To be written in task T-012 (design foundation), based on the [prototype reference](../design/prototype-reference.md).

## Notes for Design / Engineering

- Song fields for M1: `id`, `title`, `artist`, `key`, `text`. The `text` keeps the prototype's provisional "chords over lyrics" form until the song format is decided in M4 — do not build on it.
- The song list reads songs through an asynchronous repository in `data/` ([ARCHITECTURE.md](../../ARCHITECTURE.md)); in M1 it returns the sample songs.
- Sorting and accent-insensitive matching are domain logic with unit tests. Use a fixed collation (not the device language), so the order is the same on every device.

## Out of scope

- Opening, adding, editing or deleting songs (M3, M5).
- Filters, tags, sorting options, favorites.

## Open questions

None.
