# Design guidelines

What every Setlist screen shares: principles, tokens and components. Based on the [prototype reference](prototype-reference.md) — the CEO likes its look, so it is the starting point, not something to redo.
Add a token or component here only when a screen needs it (golden principle *Simplicity first*).

## Principles

All screens:

- **Minimal, clean, modern.** One centered column, generous whitespace, no decoration that carries no meaning.
- **Readable in a dark venue.** Dark mode is a first-class theme; text tokens keep strong contrast in both themes (see *Contrast*).
- **Mobile first.** Design for a 320 px wide phone first; tablet and desktop get the same column, centered.
- **Nothing widens the page.** The page scrolls vertically only. Every flex or grid child that holds text has `min-width: 0`, and long words wrap or end with an ellipsis.
- **Nothing hidden that matters.** No critical action behind a long press, a swipe only or a hover.

There are two kinds of screens with different rules:

| | Browse screens | Stage screens |
|---|---|---|
| Examples | Song list, setlists, editing a song or setlist | Song view (M3), play mode (M7) |
| Used | Before and between gigs, full attention | While playing, one hand, a glance |
| Density | May be denser: several rows per screen, secondary text in `--color-muted` | Content first, controls few and large |
| Touch targets | At least `--touch-min` (44 px) | Every key control (font size, previous / next, close) at least `--touch-stage` (56 px), reachable with one tap of one finger; previous / next 64 px high |
| Text | Type scale below | Song text from 12 to 32 px in steps of 2 (default 16 px), chosen by the user |
| Chrome | Header, search, later the tab bar | As little as possible; no tab bar |

## Tokens (provisional)

Tokens are CSS custom properties defined once in the app's styles. Colors, type, spacing and radius in components use tokens; small fixed sizes (1–2 px borders, a component's height) may be raw values. A token that no M1 screen uses (marked *from M3/M5*) is added to the CSS only when its screen is built.

### Color

Provisional — taken from the prototype. The CEO decided to keep them through the MVP and to choose the brand colors later, together with a logo. The theme follows the system (`prefers-color-scheme`); the page declares `color-scheme: light dark` so native controls (scrollbars, the search field) match.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--color-bg` | `#f3f4f6` | `#0e1013` | Page background; also the browser UI color (`theme-color`) |
| `--color-surface` | `#ffffff` | `#171a1f` | Rows, cards, search field |
| `--color-ink` | `#14171c` | `#eceef2` | Main text |
| `--color-muted` | `#677081` | `#9aa1ad` | Secondary text (artist, count, hints, placeholder) |
| `--color-line` | `#e1e4e9` | `#2a2f38` | Borders and dividers (decorative only) |
| `--color-accent` | `#e8501f` | `#ff7a4d` | Focus ring; later primary actions (next, save) |
| `--color-chord` | `#c2410c` | `#ffa27d` | Key chip text; chord lines of the song sheet (from M3) |
| `--color-tint` | `#fdece5` | `#2a1a14` | Key chip background |
| `--color-danger` | `#c8372a` | `#ff6b5e` | Destructive actions, error messages (from M5) |
| `--color-accent-fill` | `#c2410c` | `#ff7a4d` | Background of filled accent buttons: Save, Add (from M5); darker than the accent in light, so white text reads |
| `--color-on-accent` | `#ffffff` | `#0e1013` | Text and icons on filled accent and danger buttons (from M5) |

#### Contrast

Approximate WCAG contrast ratios:

| Pair | Light | Dark |
|---|---|---|
| ink on bg / surface | 16.3 / 18.0 | 16.4 / 15.0 |
| muted on bg / surface | 4.5 / 5.0 | 7.3 / 6.7 |
| chord on tint (key chip) | 4.5 | 8.5 |
| chord on surface | 5.2 | 8.9 |
| accent (focus ring) on bg | 3.4 | 7.4 |
| danger on surface / bg | 5.2 / 4.7 | 6.2 / 6.8 |
| on-accent on accent-fill | 5.2 | 7.4 |
| on-accent on danger | 5.2 | 6.8 |

- Light `--color-muted` and the light key chip sit right at 4.5 : 1. Do not use them on anything darker than `--color-bg`, or below 13 px.
- White text on the light accent is about 3.8 : 1, which is enough only for large or bold text: so filled accent buttons (Save, Add in M5; next in M7) use `--color-accent-fill` with `--color-on-accent` text (5.2 : 1 light). In the dark theme the text on accent and danger is dark (`--color-on-accent`), because white on the light dark-theme accent is too faint.

### Typography

Fonts are self-hosted (see *Fonts*). Each stack falls back to system fonts.

| Token | Value |
|---|---|
| `--font-display` | `"Bricolage Grotesque", system-ui, sans-serif` — screen headings |
| `--font-body` | `"DM Sans", system-ui, sans-serif` — all UI text |
| `--font-mono` | `"JetBrains Mono", ui-monospace, monospace` — key chips; the song sheet (from M3) |

Type scale. Each step is a set of size, weight and line-height tokens, e.g. `--text-title-size`, `--text-title-weight`, `--text-title-leading`.

| Step | Font | Size | Weight | Line height | Use |
|---|---|---|---|---|---|
| `title` | display | 28 px | 700 | 1.15 | Screen heading ("Songs") |
| `row` | body | 17 px | 600 | 1.25 | Row title (song title) |
| `body` | body | 16 px | 400 | 1.45 | Body text, search input, empty state |
| `small` | body | 14 px | 400 | 1.35 | Secondary text (artist, song count) |
| `chip` | mono | 13 px | 700 | 1 | Key chip |

- Inputs are 16 px or larger, otherwise iPhone Safari zooms in on focus.
- Stage screens: the song sheet uses `--font-mono` at the size the user chooses (`--sheet-size`, 12–32 px in steps of 2, default 16 px), line height 1.5; lyric lines 400 in `--color-ink`, chord lines 700 in `--color-chord` (from M3; layout in [songs.md](../product-specs/songs.md#song-view-screen-m3)).

### Spacing, shape, sizes

| Token | Value | Use |
|---|---|---|
| `--space-1` | 4 px | Tight gaps (title ↔ count) |
| `--space-2` | 8 px | Gap between rows |
| `--space-3` | 12 px | Row padding (vertical), gap text ↔ chip |
| `--space-4` | 16 px | Row padding (horizontal), section gaps, phone gutter |
| `--space-5` | 24 px | Top and bottom page padding, gutter from 600 px |
| `--space-6` | 32 px | Empty state padding |
| `--radius-chip` | 8 px | Key chip |
| `--radius-card` | 14 px | Rows, cards, search field, empty state |
| `--radius-dialog` | 20 px | Dialogs (from M5) |
| `--radius-pill` | 999 px | Pill buttons (from M5) |
| `--touch-min` | 44 px | Minimum touch target on browse screens |
| `--touch-stage` | 56 px | Minimum key control on stage screens (from M3) |
| `--content-max` | 720 px | Max width of the content column |
| `--gutter` | 16 px (< 600 px), 24 px (≥ 600 px) | Space between the column and the screen edge |

## Fonts

- Served by the app as **WOFF2** files from `app/assets/fonts/` (how they were made: its README) and loaded with `@font-face` (`font-display: swap`). Nothing comes from Google Fonts or another site.
- Only the files that screens use, with no italics. In M1 there are four, from M3 five:

| Family | Weight | Used for |
|---|---|---|
| Bricolage Grotesque | 700 | `title` |
| DM Sans | 400 | `body`, `small` |
| DM Sans | 600 | `row` |
| JetBrains Mono | 700 | `chip`, chord lines of the song sheet (from M3) |
| JetBrains Mono | 400 | Lyric lines of the song sheet (from M3) |

- From M3: JetBrains Mono 400 for the lyric lines of the song sheet (a fifth file). Add a file only when a screen needs it.
- The fonts are under the SIL Open Font License: its license file ships next to the font files.
- Subset: Latin and Latin Extended (Central European letters such as č, ľ, ň). Glyphs a font does not have fall back to the system font.

## Components (M1)

### Page header

- The screen heading (`title`, `--color-ink`), with the count line below it (`small`, `--color-muted`) and a `--space-1` gap between them, e.g. "4 songs" or "1 song".
- Left-aligned in the column, directly at the top of the page (the page's top padding gives the space above it).
- There is no top app bar: the heading is the top of the screen.

### Search field

- Native search input. Full column width, 48 px high, `--radius-card`, `--color-surface` background, 1 px `--color-line` border, padding 0 `--space-4`.
- Text uses the `body` step in `--color-ink`. The placeholder uses `--color-muted`.
- **States:**
  - **Empty:** shows the placeholder.
  - **Filled:** shows the text and the browser's built-in clear button, if the browser has one.
  - **Focus:** the border turns `--color-accent` and a 2 px `--color-accent` outline (offset 0) is added around it.
- No icon and no custom clear button in M1.

### Song row

```
┌──────────────────────────────────────┐
│ House of the Rising Sun        ┌──┐  │   title: row, ink, 1 line, ellipsis
│ Traditional                    │Am│  │   artist: small, muted, 1 line, ellipsis
└──────────────────────────────────────┘   chip: vertically centered
```

- **Box:** `--color-surface` background, `--radius-card`, no border, no fixed height (about 66 px with one-line title and artist), padding `--space-3` `--space-4`. Rows are separated by a `--space-2` gap.
- **Layout:** two columns. The text column takes the remaining width (`min-width: 0`, so the ellipsis works). The chip column has its natural width, never shrinks, and has a `--space-3` gap before it.
- **Title and artist:**
  - The title uses `row` in `--color-ink`.
  - The artist uses `small` in `--color-muted`, 2 px below the title, and reads "Unknown artist" when empty.
  - Both stay on one line (`white-space: nowrap; overflow: hidden; text-overflow: ellipsis`).
- **Key chip:** `chip` in `--color-chord` on `--color-tint`, padding `--space-1` `--space-2`, `--radius-chip`. It is left out when the song has no key.
- **States in M1:** only the default state; rows are not interactive.
- **From M3:** the whole row is a link that opens the Song view (no underline, colors as above).
  - Pointer cursor. Hover (mouse) and pressed: background `--color-line`.
  - Keyboard focus: 2 px `--color-accent` outline, offset 2 px.

### Empty state

- Replaces the list. A transparent box at full column width, with a 2 px dashed `--color-line` border, `--radius-card` and padding `--space-6` `--space-4`.
- Centered text using `body` in `--color-muted`: "No songs found."
- The text carries the message; the faint dashed border only frames it.

### Later components

Specified with their milestone; the look comes from the [prototype reference](prototype-reference.md):

- **Tab bar** (M6): fixed at the bottom, Songs / Setlists, slightly translucent with blur, targets ≥ `--touch-min`.
- **Stage top bar and stage button** (M3): specified in [songs.md](../product-specs/songs.md#song-view-screen-m3) — a sticky bar with round 56 px buttons (close, A−, A+). Move them here when a second screen (play mode) uses them.
- **Play bars** (M7): the stage top bar gains context and edit; a bottom bar with big previous / next buttons (64 px, next in accent) and the position between them. All are stage controls, ≥ `--touch-stage`.
- **Dialogs and forms** (M5): see *Components (M5)* below.

## Components (M5)

Used first by the song form ([songs.md](../product-specs/songs.md#manage-songs-m5-1)); shared, so later forms (setlists, M6) reuse them.

### Pill button

- At least 44 px high (`--touch-min`), padding 0 `--space-4`, `--radius-pill`, text in the `row` step (17 px, 600), one line.
- **Plain:** `--color-surface` background, `--color-ink` text, no border (Cancel, Keep editing, Close).
- **Accent:** `--color-accent-fill` background, `--color-on-accent` text (Save).
- **Danger:** `--color-danger` background, `--color-on-accent` text (Delete and Discard in a question).
- **Danger outline:** `--color-surface` background, `--color-danger` text and 1 px border (Delete song at the end of the edit form).
- States: pressed — plain `--color-line`, accent and danger 85 % brightness (`filter: brightness(0.85)`); keyboard focus — 2 px `--color-accent` outline, offset 2 px; disabled — opacity 0.4.

### Round add button

- 44 × 44 px, `--radius-pill`, `--color-accent-fill` background, a plus drawn as an inline SVG (20 px, 2 px stroke, `--color-on-accent`). Name shown as a tooltip with a mouse ("Add song"). States as the accent pill.

### Text field

- The look of the search field: full width, 48 px high, `--radius-card`, `--color-surface`, 1 px `--color-line` border, padding 0 `--space-4`, `body` text in ink; focus — `--color-accent` border and a 2 px `--color-accent` outline.
- Label above it: `small` size at 600 weight, `--color-ink`, `--space-1` gap.
- **Error:** the border turns `--color-danger`; the message below it (`small`, `--color-danger`, `--space-1` gap).
- A multi-line variant (text area) sets its own font, height and wrapping (song text: see the spec).

### Radio choice

- The native radio button and its label in one row at least 44 px high; the whole row is the target. `accent-color: var(--color-accent)`; label in `body`, ink. Choices stack vertically.

### Help button

- A "?" in a 24 px circle (1.5 px `--color-muted` border, `small` 600 `--color-muted`), next to a label with a `--space-2` gap, with a 44 × 44 px touch target around it. Name "Help: <label>" as a tooltip. Opens a dialog with its title and content (given by the screen).

### Dialog

- The native `<dialog>`, opened as a modal. Backdrop: black at 40 % opacity (both themes).
- **Below 600 px: a bottom sheet** — full screen width, at the bottom, `--radius-dialog` on the top corners only, padding `--space-5` `--space-4` plus the safe area at the bottom, at most 85 % of the screen height (its content scrolls inside).
- **From 600 px: a centered card** — at most 420 px wide and 85 % of the screen height (its content scrolls inside), `--radius-dialog`, padding `--space-5`.
- Background `--color-surface`. Title in the `row` step (wraps), `--space-3` below it; text in `body`; buttons at the end, right-aligned, `--space-2` apart, `--space-5` above them. The safe or first button gets the focus on open.
- Closes with its buttons, Escape, Back or a tap on the backdrop (all count as the safe choice). Focus returns to the button that opened it.

### Notice bar

- Fixed at the top of the window, full width, above every screen: `--color-surface`, 1 px `--color-line` bottom border, padding `--space-2` `--gutter`, the text (`body`, ink) and one plain pill button on the right ("Reload").

### Failure message

- A box in the flow of a screen: `--color-surface`, a 4 px `--color-danger` bar on the left, `--radius-card`, padding `--space-3` `--space-4`, `body` text in ink.
