# Songs

- **Status:** approved (Song view: draft)

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
- Rule: tapping a row opens the song in the *Song view* (M3).

### Search

- Rule: a search field sits above the list. When the user types, the list is filtered immediately, without a submit button.
- Rule: a song matches when its title, artist or key contains the typed text, ignoring letter case and accents (`piesen` finds `Pieseň`). Leading and trailing spaces are ignored.
- Rule: given a search with no match, then the list area shows "No songs found." Clearing the field shows all songs again.
- Rule: the search text is kept while the app stays open; it is not remembered after a restart.

### Sample songs

- Rule: the app contains four public-domain sample songs with chords: *Amazing Grace* (G), *House of the Rising Sun* (Am), *Greensleeves* (Em), *When the Saints Go Marching In* (C), artist "Traditional".
- Rule: in M1 the sample songs are the only songs; adding own songs comes with *Manage songs* (M5).

### Song view *(M3)*

A stage screen: one song full screen, read while playing. The controls follow the *one tap on stage* principle (see [design guidelines](../design/guidelines.md#principles)).

**Open and close**

- Rule: given the Songs screen, when the user taps a song row, then the Song view of that song opens, scrolled to the top.
- Rule: every song has its own address, `#/song/<song id>` (e.g. `…/app/#/song/sample-amazing-grace`). Given that address is opened or reloaded, then the Song view of that song shows.
- Rule: given an address with a song id that does not exist, then the Songs screen shows and the address becomes the Songs screen address (`…/app/`).
- Rule: the user closes the Song view with one tap on the close button (×), with the browser's Back button, with the Android back gesture, or with the Escape key on a keyboard. All of them return to the Songs screen.
- Rule: given the Songs screen had a search text and was scrolled, when the user closes the Song view, then the Songs screen shows the same search text, the same filtered list and the same scroll position.
- Rule: given the Song view was opened directly by its address (no Songs screen before it), when the user taps ×, then the Songs screen shows (the app does not leave to the previous website).

**Content**

- Rule: the Song view shows the title, the artist ("Unknown artist" when empty), the key as a key chip (left out when the song has no key) and the song text.
- Rule: the song text keeps its lines and spaces as written, so a chord stays above the word it belongs to.
- Rule: a long line wraps onto the next line; the page never scrolls horizontally. A wrapped chord line may no longer align with its lyrics — accepted until the song format (M4).
- Rule: a long title wraps; it is never shortened on the stage screen.
- Rule: the close button and the font size buttons stay visible at the top of the screen while the song text scrolls.

**Chord lines** (provisional — replaced by the song format in M4)

- Rule: chord lines are shown bold in the chord color; all other lines are shown as lyrics.
- Rule: a line is a chord line when it contains at least one chord and every word on it (separated by spaces) is a chord or a bar mark. An empty line is not a chord line.
- Rule: a chord is a root `A`–`H` (`H` is the Central European name of B; `B` is also accepted), optionally followed by `#` or `b`, then optionally by a quality and extensions, then optionally by a slash and a bass note. Examples that are chords: `C`, `Am`, `Ami`, `Hmi`, `F#m`, `Bb`, `G7`, `Cmaj7`, `Dsus4`, `Asus2`, `Gadd9`, `Bdim`, `Caug`, `C+`, `Em7b5`, `E7/G#`, `D/F#`, `C/H`.
  - Qualities and extensions: `m`, `mi`, `min`, `maj`, `dim`, `aug`, `sus`, `add`, `+`, the numbers `2`, `4`, `5`, `6`, `7`, `9`, `11`, `13`, and `#` or `b` before a number (`7b9`, `7#5`).
- Rule: bar marks are `|`, `||`, `/`, `-`, a repeat count (`x2`, `2x`, `x3`, …) and `N.C.` (no chord). A line with bar marks only is not a chord line.
- Rule: a lyric line whose words happen to look like chords only partly is a lyric line: `A man walks in` and `Am I wrong` contain words that are not chords.
- Rule: letter case matters. The root is an upper-case letter and the quality is written as listed (`Am`, `Ami`, `Cmaj7`), so lyric words such as `a`, `am`, `be` or `add` are never chords.

**Font size**

- Rule: the Song view has two buttons, A− and A+. Each tap makes the song text 2 px smaller or bigger, from 12 px to 32 px; the default is 16 px.
- Rule: the font size changes the song text (lyrics and chord lines) only; the title, the artist and the buttons keep their size.
- Rule: at 12 px A− is disabled, at 32 px A+ is disabled (shown faded, a tap does nothing).
- Rule: the chosen size is the same for all songs and is remembered on the device across closing the song, restarts of the app and updates.
- Rule: given the stored size cannot be read or is not a valid size, then 16 px is used. Given the browser does not allow storing it (e.g. private mode), then the buttons still work for as long as the app stays open.

**Screen stays on**

- Rule: given the browser supports it, while the Song view is shown the screen does not turn off or lock by itself.
- Rule: when the Song view is closed, the screen turns off again after the device's usual time.
- Rule: given the user switched to another app and comes back to the Song view, then the screen stays on again.
- Rule: given the browser does not support it, then the Song view works as usual and shows no message.
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
- **From M3:** rows open the Song view; their states are in the guidelines (*Song row*).

### Song view screen (M3)

A stage screen ([guidelines](../design/guidelines.md#principles)): content first, few large controls, no tab bar. Phone, 320 px wide (288 px column):

```
┌────────────────────────────────┐
│ ┌──┐               ┌──┐  ┌──┐  │  stage top bar, sticky: 72 px
│ │× │               │A−│  │A+│  │  (8 px padding + 56 px buttons)
│ └──┘               └──┘  └──┘  │
├────────────────────────────────┤  1 px --color-line
│                                │  24 px
│ House of the Rising            │  title: 28 px display 700, wraps
│ Sun                            │
│ Traditional  ┌──┐              │  artist small muted + key chip,
│              │Am│              │  4 px below the title, 8 px gap
│              └──┘              │
│                                │  24 px
│    Am      C        D          │  chord line: mono 700, chord color
│ There is a house in New        │  lyric line: mono 400, ink
│ Orleans                        │  (wraps on a 320 px phone at 16 px)
│    Am       C         E        │
│ They call the Rising Sun       │
│ …                              │  24 px bottom padding
└────────────────────────────────┘
```

- **Page:** the same column, gutters and background as every screen ([app shell](app-shell.md#ux-and-visual-design)). The Songs screen is replaced, not covered.
- **Stage top bar:** sticky at the top (`position: sticky; top: 0`), full column width, `--color-bg` background (opaque, so the text scrolls under it unseen), 1 px `--color-line` bottom border, padding `--space-2` 0.
  - Left: the close button. Right: A− and A+ with a `--space-2` gap between them. Nothing in the middle — the title lives in the song header, so it can wrap.
- **Stage button:** a new component (guidelines). 56 × 56 px (`--touch-stage`), `--radius-pill` (round), `--color-surface` background, no border, content in `--color-ink`.
  - Close: an × drawn as an inline SVG, 24 px, 2 px stroke, `currentColor`.
  - A− / A+: text in the `row` step (17 px, 600), with a real minus sign (−, U+2212).
  - States: pressed — background `--color-line`; keyboard focus — 2 px `--color-accent` outline, offset 2 px; disabled — opacity 0.4, no press state.
- **Song header:** the title in the `title` step (wraps, no ellipsis); below it, `--space-1` apart, a row with the artist (`small`, muted) and the key chip, `--space-2` gap, wrapping when needed. The header scrolls with the text.
- **Song sheet:** directly on `--color-bg`, no card. `--space-5` between the header and the sheet.
  - All lines in `--font-mono`, size from the user's choice (`--sheet-size`, 12–32 px, default 16 px), line height 1.5, `white-space: pre-wrap` and `overflow-wrap: anywhere` (keeps spaces, wraps long lines, never widens the page).
  - Lyric lines: weight 400, `--color-ink`. Chord lines: weight 700, `--color-chord`.
  - An empty line keeps its height (a gap between verses).
- **Landscape phone** (e.g. 640 × 360): the same layout; the bar takes 73 px of the height, the rest shows the song.
- **Tablet / desktop:** the same layout in the 720 px column; the bar spans the column only.

**Self-check**

| Rule | Check |
|---|---|
| Key controls one tap, ≥ 56 px | ×, A−, A+ are 56 × 56 px and always visible (sticky bar). |
| Bar fits a 320 px phone | 56 + 56 + 8 + 56 = 176 px ≤ 288 px; at least 112 px free between × and A−, so no mis-tap. |
| No horizontal scroll | Sheet wraps (`pre-wrap`, `overflow-wrap: anywhere`); title wraps; chip row wraps. |
| Readable sheet | Mono character width is about 0.6 × size: at 16 px about 30 characters per line on a 320 px phone, about 34 on a 360 px phone, about 70 in the tablet column; at 32 px about 15 on a 320 px phone. Lines of the sample songs (up to 41 characters) wrap on phones at the default size — accepted (CEO, M3 planning) until M4. |
| Chord lines readable in both themes | `--color-chord` on `--color-bg`: about 4.7 : 1 light, about 9.7 : 1 dark, bold. |
| Disabled buttons recognizable | Opacity 0.4 of ink on surface stays visible in both themes; they are only at 12 and 32 px. |

## Notes for Design / Engineering

- Song fields for M1: `id`, `title`, `artist`, `key`, `text`. The `text` keeps the prototype's provisional "chords over lyrics" form until the song format is decided in M4 — do not build on it.
- The song list reads songs through an asynchronous repository in `data/` ([ARCHITECTURE.md](../../ARCHITECTURE.md)); in M1 it returns the sample songs.
- Sorting and accent-insensitive matching are domain logic with unit tests. Use a fixed collation (not the device language), so the order is the same on every device.

Song view (M3):

- **Routing:** the first router (`ui/`, URL hash, ARCHITECTURE.md): `#/song/<id>` shows the Song view, anything else the Songs screen. Rows are links (`<a href="#/song/<id>">`), so Back, reload and the Android back gesture work without extra code. The × goes `history.back()` when the Song view was opened from the Songs screen in this app, otherwise it replaces the address with the Songs screen. The Songs screen state (search text, scroll position) is kept in memory while the app is open.
- **Repository:** `getSong(id)` in `data/song-repository.js` (asynchronous, returns a copy or `null`).
- **Chord lines:** `isChordLine(line)` in `domain/` (pure, unit tests with every example of the rules above, also the counter-examples). Provisional: M4 replaces it with the song format, so keep it small and do not build other features on it.
- **Font size:** a small settings repository in `data/` reads and writes the size in `localStorage` (first storage of the app). It validates what it reads (even number 12–32, else 16) and never throws when storage is unavailable. One setting does not decide the storage of songs (M5, its own decision); `localStorage` is enough for a preference. The size is a CSS custom property `--sheet-size` on the sheet; the limits and the step are domain constants.
- **Screen stays on:** Screen Wake Lock API (`navigator.wakeLock.request('screen')`), only while the Song view is shown; released when it closes; requested again on `visibilitychange` when the page becomes visible (the browser releases it when the page is hidden). Feature-detect, ignore errors. Browser API code sits in `ui/` (the view's side effect), not in `domain/`. Supported in Chrome/Edge and in Safari on iPhone from iOS 16.4 (in a home-screen app from iOS 18.4).
- **Fonts:** the sheet's lyric lines need JetBrains Mono 400 — a fifth WOFF2 file in `app/assets/fonts/` (same subset as the others), in the offline file list.
- **Tests:** e2e for opening (tap, address, unknown id), closing (×, Back, Escape, direct address) with the search text and scroll kept, no horizontal scroll at 320 px with the longest sample line at 32 px, chord lines styled, font size limits and memory across a reload. The screen lock cannot be checked by a test in Playwright beyond "no error when unsupported" — the CEO checks it on a phone.

## Out of scope

- Adding, editing or deleting songs (M5).
- Categories or tags of songs (an idea in the inbox).
- Filters, tags, sorting options, favorites.
- In the Song view: previous / next song (play mode, M7), editing (M5), transposition (after the MVP), section labels and inline chords such as `[G]` (song format, M4), a display of the current font size.

## Open questions

None.
