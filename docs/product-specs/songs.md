# Songs

- **Status:** approved (Song format: draft)

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

- Rule: the app contains seven public-domain sample songs with chords:

  | Song | Artist | Key | Format | Notation |
  |---|---|---|---|---|
  | *Amazing Grace* | Traditional | G | `plain` | `international` |
  | *House of the Rising Sun* | Traditional | Am | `plain` | `international` |
  | *Greensleeves* | Traditional | Em | `plain` | `international` |
  | *When the Saints Go Marching In* | Traditional | C | `plain` | `international` |
  | *A od Prešova* (Slovak folk song, from M4) | Traditional | as found in the sources | `chordpro` | `german` |
  | *Tichá noc* (Slovak words of *Silent Night*, from M4) | Franz X. Gruber, Joseph Mohr | as found in the sources | `plain` | `german` |
  | *Pásli ovce Valaši* (Czech folk carol, from M4) | Traditional | as found in the sources | `chordpro`, with its refrain as the chorus | `german` |

- Rule: the four English songs stay as they are (`plain`); the sample songs are a collection that grows over time.
- Rule: the three Czech and Slovak songs are written from at least two public sources each, checked against each other, and only in a version that is free to use (a folk song, or words whose author died more than 70 years ago or is unknown and old). *A od Prešova* names the website it was checked against as its source (e.g. `akordy.sk`, see *Song format*), so the source line has a real example.
- Rule: until *Manage songs* (M5) the sample songs are the only songs.

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
- Rule: a long line wraps onto the next line; the page never scrolls horizontally. How chords behave when a line wraps depends on the song's format (see *Song format*).
- Rule: a long title wraps; it is never shortened on the stage screen.
- Rule: the close button and the font size buttons stay visible at the top of the screen while the song text scrolls.

**Chord lines** (the `plain` format, see *Song format*)

- Rule: chord lines are shown bold in the chord color; all other lines are shown as lyrics.
- Rule: a line is a chord line when it contains at least one chord and every word on it is a chord or a bar mark. Words are separated by one or more spaces or tabs; spaces at the start and end of the line are ignored. An empty line, or a line of only spaces, is not a chord line.
- Rule: a chord is, in this order: a root `A`–`H` (`H` is the Central European name of B; `B` is also accepted); optionally `#` or `b`; any sequence (also none) of the qualities and extensions below, e.g. `m7`, `mi7`, `m7b5`, `7sus4`, `maj7`; optionally a slash and a bass note, which is a root with an optional `#` or `b` (`/G#`, `/Bb`, `/H`). Examples that are chords: `C`, `Am`, `Ami`, `Hmi`, `F#m`, `Bb`, `G7`, `Cmaj7`, `Dsus4`, `Asus2`, `Gadd9`, `Bdim`, `Caug`, `C+`, `Em7b5`, `E7/G#`, `D/F#`, `C/H`.
  - Qualities and extensions: `m`, `mi`, `min`, `maj`, `dim`, `aug`, `sus`, `add`, `+`, the numbers `2`, `4`, `5`, `6`, `7`, `9`, `11`, `13`, and `#` or `b` directly before a number (`7b9`, `7#5`).
  - Not chords (rare, accepted in M4): `CM7` (capital `M` for major) and `C6/9` (a slash followed by a number). A line containing them is shown as a lyric line.
- Rule: bar marks are `|`, `||`, the repeat signs `|:` and `:|`, `%` (repeat the previous bar), `/`, `-`, a repeat count (`x2`, `2x`, `x3`, …) and `N.C.` (no chord). A line with bar marks only is not a chord line.
- Rule: a chord in parentheses, such as `(G)` or `(E7/G#)`, counts as a chord (an optional or passing chord); it is shown as written, with the parentheses. Parentheses around a word that is not a chord, such as `(chorus)`, make the line a lyric line.
- Rule: a lyric line whose words happen to look like chords only partly is a lyric line: `A man walks in` and `Am I wrong` contain words that are not chords.
- Rule: letter case matters. The root is an upper-case letter and the quality is written as listed (`Am`, `Ami`, `Cmaj7`), so lyric words such as `a`, `v`, `am`, `be` or `add` are never chords.
- Rule (accepted false positive): a lyric line made only of words that are chords, such as a line `A` or `Hm` or `E A`, is shown as a chord line. This is rare and harmless (kept in M4); a song where it matters can be written in `chordpro`.

**Font size**

- Rule: the Song view has two buttons, A− and A+. Each tap makes the song text 2 px smaller or bigger, from 12 px to 32 px; the default is 16 px.
- Rule: the font size changes the song text (lyrics, chords, chorus labels and comments) only; the title, the artist and the buttons keep their size.
- Rule: at 12 px A− is disabled, at 32 px A+ is disabled (shown faded, a tap does nothing).
- Rule: the chosen size is the same for all songs and is remembered on the device across closing the song, restarts of the app and updates.
- Rule: given the stored size cannot be read or is not a valid size, then 16 px is used. Given the browser does not allow storing it (e.g. private mode), then the buttons still work for as long as the app stays open.

**Screen stays on**

- Rule: given the browser supports it, while the Song view is shown the screen does not turn off or lock by itself.
- Rule: when the Song view is closed, the screen turns off again after the device's usual time.
- Rule: given the user switched to another app and comes back to the Song view, then the screen stays on again.
- Rule: given the browser does not support it, then the Song view works as usual and shows no message.
### Song format *(M4)*

How a song is stored and shown. Decision: [ADR 0008](../decisions/0008-song-format.md). In M4 the songs are the sample songs, prepared by hand; entering songs comes with M5, detecting the format of a pasted text and import / export with a later milestone.

**Song header**

- Rule: a song has a title, an artist, a key, a text, and these header fields:
  - **Format:** `plain` ("chords over lyrics": a line of chords above each line of lyrics) or `chordpro` (chords in square brackets inside the lyrics, e.g. `[G]Amazing [C]grace`).
  - **Notation:** `international` (`B` is B, `Bb` is B flat) or `german`, the Central European notation (`H` is B, `B` is B flat).
  - **Source** (optional): the name of the website the song came from, as plain text — the domain with its ending, e.g. `akordy.sk` — and the date of import. There is no link to the original. A song typed in by hand has no source.
- Rule: the text is kept exactly as written; neither the format nor the notation ever changes it.
- Rule: lines end with a line break; `\r\n` and `\r` (Windows and old Mac line ends) count as one line break, in both formats.
- Rule: given a song whose format is missing or unknown, then it is shown as `plain` (nothing is lost: `plain` shows every line as written).
- Rule: given a song whose notation is missing or unknown, then it counts as `international`.
- Rule: the key is written in the song's notation (`H` in a `german` song); search finds it as written.
- Rule: in M4 the notation does not change what is shown: chords are shown as written. It is stored so that a notation setting and transposition (after the MVP) know what `B` means.

**`plain` format**

- Rule: shown in the monospaced font with the chord lines detected as in the Song view (*Chord lines*).
- Rule: a long line wraps; a wrapped chord line may no longer align with its lyrics (accepted; such a song can be written in `chordpro`).
- Rule: chord-line detection knows the letter names `A`–`H` with `#` or `b` (so `H`, `B`, `F#`, `Bb` in both notations), not the German spelled names such as `Es`, `As`, `Fis`, `Cis` (rare in guitar songbooks; a line with them is shown as lyrics). The sample songs use only letter names.

**`chordpro` format** — a subset of the open [ChordPro](https://www.chordpro.org) format.

- Rule: text in square brackets is a chord, e.g. `[G]`, `[F#m7]`, `[H7]`, `[(D)]`, `[N.C.]`. It is shown as written, above the text that follows it, in the chord color. Its content is not checked against the chord pattern.
- Rule: given `[` without a closing `]` on the same line, then the rest of the line is shown as lyrics, brackets included. An empty `[]` is not shown.
- Rule: the lyrics are shown in the body font; the brackets and the chords are not part of the lyric line.
- Rule: a chord inside a word stays above its syllable: `Ama[C]zing` shows `C` above `zing`.
- Rule: given a chord is wider than the syllable below it, then a small gap follows the chord, so two chords never touch or overlap; the syllable stays where it is and the rest of the word moves right.
- Rule: a line with chords only, such as `[G] [C] [D]`, shows the chords in one row with a gap between them.
- Rule: a line without chords has no chord row (it takes the height of one lyric line).
- Rule: a long line wraps between words. When it wraps, each chord stays above its syllable, and a word with chords inside it is not split. The page never scrolls horizontally: only a word (with its chords) wider than the whole line may wrap between its pieces, and a single piece wider than the line may break inside its text (both rare).
- Rule: an empty line keeps its height (a gap between verses).
- Rule: a directive is a line of the form `{name}` or `{name: value}` (spaces around it are ignored; the name ignores letter case):
  - `{start_of_chorus}` or `{soc}` starts the chorus, `{end_of_chorus}` or `{eoc}` ends it. The lines between are shown as the chorus: marked with a line on their left and indented. A value, e.g. `{soc: Refrén}`, is shown as the chorus label above it; without a value there is no label.
  - `{comment: …}` or `{c: …}` shows its value as a comment line (e.g. `Repeat 2×`, `Capo 2`), muted, without a chord row.
  - Any other directive (e.g. `{title: …}`, `{key: …}`, `{start_of_tab}`) is kept in the text but not shown.
- Rule: given a chorus without its end, then it ends with the song. Given `{eoc}` without a start, then it is not shown.
- Rule: a line that starts with `#` is a ChordPro comment for the writer and is not shown.
- Rule: a line that looks like a directive but is not closed with `}` is shown as lyrics.
- Rule: a directive line, a hidden directive and a `#` line take no space (they do not leave an empty line). A `{soc}` inside a chorus is not shown and does not start a second chorus. A `{c:}` with an empty value is not shown.

**Source line**

- Rule: given a song with a source, then the end of the Song view shows a quiet line "Source: <source>", e.g. "Source: akordy.sk". The source is plain text, shown as written (spaces around it ignored); it is never a link, even when it looks like an address.
- Rule: given the source is empty or only spaces, then there is no source line.
- Rule: a long source wraps; it never widens the page.
- Rule: the date of import is stored but not shown in M4.
- Rule: given a song without a source, then there is no source line.

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
│ ┌──┐               ┌──┐  ┌──┐  │  stage top bar, sticky: 73 px
│ │× │               │A−│  │A+│  │  (8 + 56 + 8 px padding + 1 px border)
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

- **Page:** the same column, gutters and background as every screen ([app shell](app-shell.md#ux-and-visual-design)), but **without the column's top padding**: the bar sits at the very top of the screen from the start. The Songs screen is replaced, not covered.
- **Stage top bar:** sticky at the top (`position: sticky; top: 0`), full column width, `--color-bg` background (opaque, so the text scrolls under it unseen), 1 px `--color-line` bottom border, padding `--space-2` 0.
  - Left: the close button. Right: A− and A+ with a `--space-2` gap between them. Nothing in the middle — the title lives in the song header, so it can wrap.
- **Stage button:** a new component (guidelines). 56 × 56 px (`--touch-stage`), `--radius-pill` (round), `--color-surface` background, no border, content in `--color-ink`.
  - Close: an × drawn as an inline SVG, 24 px, 2 px stroke, `currentColor`.
  - A− / A+: text in the `row` step (17 px, 600), with a real minus sign (−, U+2212).
  - Names: each button has a name shown as a tooltip with a mouse — "Close", "Smaller text", "Larger text".
  - States: pressed — background `--color-line`; keyboard focus — 2 px `--color-accent` outline, offset 2 px; disabled — opacity 0.4, no press state (a disabled button loses keyboard focus — accepted).
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

### Song sheet by format and source line (M4)

The Song view screen stays as in M3 (bar, header, sheet); only the sheet changes with the song's format, and the source line is added at the end.

`chordpro` sheet, phone 320 px wide (288 px column), 16 px:

```
│ G         C           G        │  chord row: mono 700, chord color
│ Words of a long line of        │  lyric row: body 400, ink
│   D                            │  (illustration, not a real song)
│ the song                       │  wrapped between words; D stays on its syllable
│                                │  empty line: one lyric line high
│ ┃ Refrén                       │  chorus label: small, muted
│ ┃ G        D                   │  chorus: 2 px line on the left,
│ ┃ Tichá noc, svätá noc         │  text indented 12 px
│                                │
│ Repeat 2×                      │  comment: body 400, muted, no chord row
│                                │  24 px
│ Source: akordy.sk              │  source line: small, muted, plain text
└────────────────────────────────┘
```

- **Sheet:** the same box as in M3 (`--sheet-size`, 12–32 px, no card, `--space-5` below the header).
- **`plain` sheet:** exactly the M3 sheet (mono, `pre-wrap`, chord lines 700 in `--color-chord`).
- **`chordpro` sheet:**
  - Each line is a row of **pieces**. A piece is a chord (above) and the text that follows it (below), stacked; text before the first chord is a piece without a chord.
  - Chords: `--font-mono` 700, `--color-chord`, the sheet size, line height 1.2. Using the mono font of the `plain` chords keeps chords looking the same in both formats and needs no new font file.
  - Lyrics: `--font-body` 400, `--color-ink`, the sheet size, line height 1.5.
  - A piece is at least as wide as its chord plus a gap of 0.5 em, so chords never touch (`Ama C zing` with a wide chord: the syllable starts under the chord, the rest of the word moves right).
  - Pieces of one word stay together on one row; the space between words is where a line may wrap. Only a word wider than its line wraps between its pieces.
  - A line with at least one chord reserves the chord row for all its pieces, so the lyrics of one line stay on one baseline. A line without chords has no chord row.
  - Chorus: `--space-3` (12 px) left padding, 2 px `--color-line` left border. The label (when given) in `small`, `--color-muted`, above the first chorus line.
  - Comment: `--font-body` 400, `--color-muted`, the sheet size.
- **Source line:** `small` step, `--color-muted`, `--space-5` above it, after the sheet, `overflow-wrap: anywhere`. "Source: " then the source, plain text (not a link, not focusable). It scrolls with the sheet; it does not change with the font size.

**Self-check**

| Rule | Check |
|---|---|
| Chord above its syllable when wrapping | Pieces of a word wrap as one unit; a chord and its syllable are one piece, so they never part. |
| No horizontal scroll | Rows wrap between words. Inside a chorus the line is 274 px (288 − 12 padding − 2 border). A word of 16 letters at 32 px in the body font (about 0.55 em per letter) is about 280 px, and a word with several chords can be wider (each piece ≥ chord + 0.5 em) — so a word wider than its line wraps between its pieces, and one piece wider than the line breaks inside its text (`overflow-wrap: anywhere`). Tested e2e at 32 px on a 320 px phone with the longest line of *A od Prešova*, and with the chorus of *Pásli ovce Valaši* (274 px line). |
| Chords never overlap | A piece is at least chord width + 0.5 em. |
| Readable on a 320 px phone at 16 px | Body font about 0.5 em per letter: about 36 characters per line (mono: 30), so the ChordPro sheet wraps less than `plain`. |
| Chords readable in both themes | Same `--color-chord` on `--color-bg` as M3, bold. |
| Chorus and comment recognizable in both themes | The chorus line uses `--color-line`; comments and the label use `--color-muted` (about 4.5 : 1 light, about 7.3 : 1 dark, as the artist line). |
| Portrait and landscape, phone to desktop | Nothing depends on the width except where lines wrap; the 720 px column wraps less. |

## Notes for Design / Engineering

- Song fields for M1: `id`, `title`, `artist`, `key`, `text` (M4 adds the format fields, below).
- The song list reads songs through an asynchronous repository in `data/` ([ARCHITECTURE.md](../../ARCHITECTURE.md)); in M1 it returns the sample songs.
- Sorting and accent-insensitive matching are domain logic with unit tests. Use a fixed collation (not the device language), so the order is the same on every device.

Song view (M3):

- **Routing:** the first router (`ui/`, URL hash, ARCHITECTURE.md): `#/song/<id>` shows the Song view, anything else the Songs screen. Rows are links (`<a href="#/song/<id>">`), so Back, reload and the Android back gesture work without extra code. Song ids in addresses are encoded (`encodeURIComponent`), so ids created in M5 stay safe. The × goes `history.back()` when the Song view was opened from the Songs screen in this app, otherwise it replaces the address with the Songs screen. Escape does exactly what × does (a `keydown` handler through `ui/events.js`). The Songs screen state (search text, scroll position) is kept in memory while the app is open; set `history.scrollRestoration = 'manual'` and scroll the Song view to the top on open, so the browser's own scroll restore does not fight the remembered position.
- **Repository:** `getSong(id)` in `data/song-repository.js` (asynchronous, returns a copy or `null`).
- **Chord lines:** `isChordLine(line)` in `domain/` (pure, unit tests with every example of the rules above, also the counter-examples). From M4 it is the reader of the `plain` format.
- **Font size:** a small settings repository in `data/` reads and writes the size in `localStorage` (first storage of the app). It validates what it reads (even number 12–32, else 16) and never throws when storage is unavailable. One setting does not decide the storage of songs (M5, its own decision); `localStorage` is enough for a preference. The size is a CSS custom property `--sheet-size` on the sheet; the limits and the step are domain constants.
- **Screen stays on:** needs a secure context (`https` or `localhost`) — on a phone it works only on the deployed site, not through the dev server's LAN address. Screen Wake Lock API (`navigator.wakeLock.request('screen')`), only while the Song view is shown; released when it closes; requested again on `visibilitychange` when the page becomes visible (the browser releases it when the page is hidden). Feature-detect, ignore errors. Browser API code sits in `ui/` (the view's side effect), not in `domain/`. Supported in Chrome/Edge and in Safari on iPhone from iOS 16.4 (in a home-screen app from iOS 18.4).
- **Fonts:** the sheet's lyric lines need JetBrains Mono 400 — a fifth WOFF2 file in `app/assets/fonts/` (same subset as the others), in the offline file list.
- **Tests:** e2e for opening (tap, address, unknown id), closing (×, Back, Escape, direct address) with the search text and scroll kept, no horizontal scroll at 320 px with the longest sample line at 32 px, chord lines styled, font size limits and memory across a reload. The screen lock is tested e2e with a fake `navigator.wakeLock` (requested while shown, released on close, one lock after coming back, no error when unsupported or refused); that the screen really stays on, the CEO checks on a phone.

Song format (M4):

- **Song fields:** `id`, `title`, `artist`, `key`, `text`, `format` (`'plain' | 'chordpro'`), `notation` (`'international' | 'german'`), and optional `source` (plain text) and `importedAt` (ISO date `YYYY-MM-DD`). The `Song` type in `domain/songs.js`; the format and notation values are domain constants there. The fallbacks (unknown format → `plain`, unknown notation → `international`) are small domain functions with unit tests, so M5 storage reuses them.
- **Where the code goes:**
  - `domain/chords.js` — stays: `isChordLine` is the reader of the `plain` format (no longer provisional; update its comments).
  - `domain/chordpro.js` (new) — `parseChordPro(text)`: pure, text in, a list of blocks out (lines of pieces `{ chord, text }`, chorus blocks with an optional label, comments, empty lines; hidden directives and `#` lines dropped). Unit tests with every rule above. Knows nothing of HTML.
  - `ui/components/plain-sheet.js` (new) — the M3 sheet lines, moved out of `song-view.js`.
  - `ui/components/chordpro-sheet.js` (new) — renders the blocks of `parseChordPro`. Both sheets are components, because play mode (M7) shows the same sheet.
  - `ui/views/song-view.js` — chooses the sheet by format and adds the source line; nothing else.
  - The source line is plain text in `song-view.js` through the escaping `html` template — no link, no `href`, so no address check is needed.
  - CSS: the sheet styles move from `song-screen.css` to `components.css` (shared with M7, done in T-033 with `plain-sheet.js`); the ChordPro sheet styles go there too; the source line stays in `song-screen.css`.
  - Both readers split lines on `\r\n`, `\r` and `\n`.
  - `data/sample-songs.js` — the new fields on the four English songs (unchanged text, `plain`), *A od Prešova* (with T-035, the first `chordpro` song), *Tichá noc* and *Pásli ovce Valaši* (T-037).
  - New files go into the offline file list (`app/sw.js`); every change to `app/` needs a new VERSION.
- **No ADR beyond 0008, no new dependency, no new font file** (Slovak letters are in the Latin Extended subset of the fonts).
- **Tests:** unit tests for `parseChordPro` and the fallbacks; e2e: a `chordpro` song shows its chords above the right syllables (the chord's left edge over its syllable's left edge) at 320 px and 32 px, also after a line wraps; no horizontal scroll; chorus (*Pásli ovce Valaši*) and comment shown; the source line as plain text (no link; markup in it shown as text), none for an empty source; a `plain` song unchanged; the song count now "7 songs".

## Out of scope

- Adding, editing or deleting songs (M5).
- Categories or tags of songs (an idea in the inbox).
- Filters, tags, sorting options, favorites.
- In the Song view: previous / next song (play mode, M7), editing (M5), transposition (after the MVP), a display of the current font size.
- Song format (M4): detecting the format of a pasted text, import and export, converting between formats (a later milestone); a notation setting that shows `H` / `B` the user's way (after the MVP); other ChordPro features — verse and bridge sections, tabs, grids, chord diagrams, `{title}` and other header directives as song fields, several songs in one text; formats other than `plain` and `chordpro` (e.g. tabs).

## Open questions

- **Slovak words of *Tichá noc*.** The author of the Slovak translation is not named in the sources found so far. *Recommendation:* a gate in T-037 — use the common old version only when no source names a modern author; if any source names an author who died less than 70 years ago (or the age of the words cannot be shown), use another public-domain Slovak carol instead and ask the CEO in the PR.
