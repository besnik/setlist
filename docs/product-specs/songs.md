# Songs

- **Status:** approved

<!-- Based on the CEO's prototype — see docs/design/prototype-reference.md. -->

## Purpose

The songbook: all the musician's songs with lyrics and chords in one place, quick to find and easy to read while playing.

## Behavior

### Song list

- Rule: the Songs screen lists all songs, sorted by title alphabetically, ignoring letter case; accented letters sort together with their base letter (`Čaj` between `Cabaret` and `Cesta`).
- Rule: each row shows the song title, the artist (or "Unknown artist" when empty) and, when the song has a key, the key as a small chip (e.g. `Am`).
- Rule: a long title or artist is shortened with an ellipsis on one line; the page never scrolls horizontally.
- Rule: the heading shows the number of songs, e.g. "4 songs" (singular "1 song"). It is the total number of songs and does not change while searching.
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

A browse screen. Tokens and components: [design guidelines](../design/guidelines.md). The page and column come from the [app shell](app-shell.md#ux-and-visual-design).

### Songs screen (M1)

Phone, 320 px wide (288 px column):

```
┌────────────────────────────────┐
│                                │  24 px top padding
│ Songs                          │  page header: title 28 px display 700
│ 4 songs                        │  count 14 px muted, 4 px below
│                                │  16 px
│ ┌────────────────────────────┐ │
│ │ Search title, artist, key  │ │  search field, 48 px high
│ └────────────────────────────┘ │
│                                │  16 px
│ ┌────────────────────────────┐ │
│ │ Amazing Grace         ┌─┐  │ │  song row, about 66 px high
│ │ Traditional           │G│  │ │
│ └───────────────────────└─┘──┘ │
│ ┌────────────────────────────┐ │  8 px gap
│ │ Greensleeves         ┌──┐  │ │
│ │ Traditional          │Em│  │ │
│ └──────────────────────└──┘──┘ │
│ ┌────────────────────────────┐ │
│ │ House of the Rising… ┌──┐  │ │  long title: one line, ellipsis
│ │ Traditional          │Am│  │ │
│ └──────────────────────└──┘──┘ │
│ ┌────────────────────────────┐ │
│ │ When the Saints Go…   ┌─┐  │ │
│ │ Traditional           │C│  │ │
│ └───────────────────────└─┘──┘ │
│                                │  24 px bottom padding
└────────────────────────────────┘
 16 px gutters
```

No match:

```
│ ┌────────────────────────────┐ │
│ │ xyz                        │ │
│ └────────────────────────────┘ │
│ ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐ │
│                                │  empty state: dashed box,
│ │     No songs found.        │ │  "No songs found." centered, muted
│                                │
│ └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘ │
```

- **Order, top to bottom:** page header, search field, then the list or the empty state.
  - 16 px (`--space-4`) between the header, the search field and the list.
  - 8 px (`--space-2`) between rows.
- **Page header:** "Songs" (`title`) and the count line (`small`, muted), e.g. "4 songs" or "1 song".
- **Search field:** a native search input with the placeholder "Search title, artist, key". It is not focused on start, because the phone keyboard would cover the list.
- **Song row:** title, artist and key chip as specified in the guidelines.
  - Title and artist stay on one line and end with an ellipsis.
  - The chip never shrinks. When a song has no key, the row has no chip and the text takes the full width.
- **Empty state:** the "No songs found." component. It replaces the list while a search has no match.
- **Scrolling:** the whole page scrolls; the header and the search field scroll with the list (no sticky parts in M1).
- **Wide screens:** the same layout in the 720 px column. Rows stay full column width; there is no grid of cards.

## Notes for Design / Engineering

- Song fields for M1: `id`, `title`, `artist`, `key`, `text`. The `text` keeps the prototype's provisional "chords over lyrics" form until the song format is decided in M4 — do not build on it.
- The song list reads songs through an asynchronous repository in `data/` ([ARCHITECTURE.md](../../ARCHITECTURE.md)); in M1 it returns the sample songs.
- Sorting and accent-insensitive matching are domain logic with unit tests. Use a fixed collation (not the device language), so the order is the same on every device.

## Out of scope

- Opening, adding, editing or deleting songs (M3, M5).
- Filters, tags, sorting options, favorites.

## Open questions

None.
