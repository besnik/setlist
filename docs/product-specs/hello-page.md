# Hello page (harness trial)

- **Status:** approved

## Purpose

A single static page that shows what Setlist could look like: one sample setlist with its songs, a header and a bottom navigation bar.
It exists to test our product process end to end on a tiny feature. It is throwaway: it lives in a trial location, not in the app, and nothing on it can be used or changed. This spec lives only on the trial branch and is deleted with it; it never becomes `implemented` on `main`.

## Behavior

### Page and layout regions

- Rule: given the page is opened in a current browser, when it loads, then the browser tab title is "Hello, Setlist".
- Rule: given the page is open, then it shows three regions from top to bottom: a **header**, a **song list** and a **bottom navigation bar**.
- Rule: given the page is open, when the user scrolls the song list, then the header stays at the top and the bottom navigation bar stays at the bottom of the screen; only the song list moves.
- Rule: given the user has scrolled to the end of the list, then the last song is fully visible and not hidden behind the bottom navigation bar.
- Rule: given a phone with a notch or a home indicator, then no text or button is covered by the notch, the rounded corners or the home indicator.
- Rule: given the device has no network connection, when the page is opened from local files, then it looks exactly the same as online (no missing fonts, icons or images).
- Rule: the page works with JavaScript disabled — nothing on it depends on it.

### Header

- Rule: given the page is open, then the header shows the app name "Setlist" and, more prominently, the title of the sample setlist (see [Sample data](#sample-data)).

### Song list

- Rule: given the page is open, then every song of the sample setlist is shown as one row, in setlist order.
- Rule: each row shows the song's position in the setlist (1, 2, 3 …), title, artist, key and duration (`m:ss`).
- Rule: given a guitarist looks at the screen from arm's length in a dim room, then the song title is the most prominent text in the row and readable without zooming.
- Rule: given a song title or artist is too long for the row, then the layout does not break and the page never scrolls sideways.
- Rule: given the user taps a song row, then it shows a subtle pressed state and nothing else happens (no navigation, no reload, no error).

### Bottom navigation bar

- Rule: given the page is open, then the bar shows four buttons in this order: **Songs**, **Setlists**, **Gig**, **Settings**; each has an icon and a text label.
- Rule: exactly one button, **Setlists**, is shown as the current section; the difference is visible without relying on color alone.
- Rule: given the user taps any button, then it shows a subtle pressed state and nothing else happens (no navigation, no reload, no error). The buttons are visual only.
- Rule: given a phone held in one hand, then every button can be reached with the thumb and has a touch area of at least 44 × 44 CSS pixels.
- Rule: given a keyboard user presses Tab, then focus moves through the buttons and the focused button is clearly visible.

### Screen sizes

- Rule: given a phone in portrait (narrowest supported width 320 CSS pixels), then all regions fit the width with no sideways scrolling and no cut-off text.
- Rule: given a phone in landscape, then the header and bottom bar together leave most of the screen height for the song list.
- Rule: given a tablet or desktop window, then the content does not stretch into very long lines; it stays at a comfortable reading width, and the page still looks intentional (not a stretched phone screen with empty space).
- Rule: given the user zooms the page to 200 %, then all text and buttons are still visible and usable.

### Theme

- Rule: given the system is set to light mode, then the page uses a light theme; given dark mode, a dark theme.
- Rule: given the page is open, when the user switches the system theme, then the page follows without a reload.
- Rule: in both themes, normal text has a contrast ratio of at least 4.5:1 and large text, icons and the current-section marker at least 3:1 against their background.

### Sample data

- Rule: the setlist title is **"Hello, Setlist"**.
- Rule: the setlist has 8 songs, enough to need scrolling on a phone in portrait.
- Rule: every song has a title, artist, key and duration; keys use common notation (e.g. `G`, `Em`, `F#m`) and durations are realistic (2:30–6:00).
- Rule: the songs are traditional or public-domain songs (no rights questions once the repository is public), for example "House of the Rising Sun", "Scarborough Fair", "Whiskey in the Jar", "Wild Mountain Thyme", "The Water Is Wide", "Shenandoah", "Amazing Grace", "Danny Boy", with "Traditional" as the artist.
- Rule: all UI text is in English.

## UX and visual design

One screen, no transitions. All sizes are CSS pixels at 100 % zoom. The units used to build them are Engineering's choice, but text sizes must scale with zoom.

### Sketches

Phone portrait (320–599 px wide). Icons in sketches: `(n)` note, `[=]` list, `(m)` microphone, `(*)` gear.

```
┌────────────────────────────────┐
│░░░░░░ notch / status bar ░░░░░░│  safe area (chrome color)
│ SETLIST                        │
│ Hello, Setlist                 │  header, 72
├────────────────────────────────┤
│  1  House of the Rising    Am  │
│     Sun                  4:30  │  row, min 64
│     Traditional                │
│     ────────────────────────── │  divider, inset to title
│  2  Scarborough Fair       Em  │
│     Traditional          3:10  │
│     ────────────────────────── │
│  …  (scrolls)                  │
├────────────────────────────────┤
│  (n)   ╭[=]╮    (m)     (*)    │
│ Songs Setlists  Gig  Settings  │  bottom bar, 64
│░░░░░░░ home indicator ░░░░░░░░░│  safe area (chrome color)
└────────────────────────────────┘
```

Tablet / desktop (600 px and wider). The list becomes a centered card on the chrome-colored page, rows become single-line columns, and the bar becomes a centered group of horizontal chips. Header, card and bar share one content column, so the page reads as designed for the width.

```
┌──────────────────────────────────────────────────────────────────┐
│        SETLIST                                                   │
│        Hello, Setlist                                            │  header, 72
├──────────────────────────────────────────────────────────────────┤
│      ╭──────────────────────────────────────────────────────╮    │
│      │  1  House of the Rising Sun              Am    4:30  │    │
│      │     Traditional                                      │    │
│      │     ──────────────────────────────────────────────── │    │
│      │  2  Scarborough Fair                     Em    3:10  │    │
│      │     Traditional                                      │    │
│      │  …                                                   │    │
│      ╰──────────────────────────────────────────────────────╯    │
├──────────────────────────────────────────────────────────────────┤
│        (n) Songs   ╭[=] Setlists╮   (m) Gig   (*) Settings       │  bottom bar, 64
└──────────────────────────────────────────────────────────────────┘
```

Short landscape (viewport height below 500 px, e.g. a phone in landscape or 200 % zoom on a laptop): the header shrinks to one line of 48 (`SETLIST` and `Hello, Setlist` side by side) and the bar to 56. On a 375 px tall phone this leaves about 72 % of the height for the list.

### Layout and sizes

- **Spacing scale:** 4, 8, 12, 16, 24, 32. Nothing else.
- **Safe areas:** header, rows and bar extend their background into the notch, rounded-corner and home-indicator areas but keep their content inside the safe area (top, bottom, left and right).
- **Header:** chrome background, 72 high (48 short landscape) plus top safe area. Content left-aligned with 16 side padding: `SETLIST` overline above the setlist title, 4 apart. 1 px `line` at the bottom.
- **Bottom bar:** chrome background, 64 high (56 short landscape) plus bottom safe area, 1 px `line` at the top.
  - Phone: four equal-width buttons filling the bar (80 × 64 at 320 px); icon above label, 4 apart.
  - 600 px and wider: buttons grouped in the center, max 480 wide in total, each button at least 112 wide and the full bar height; icon left of label, 8 apart.
- **Song row (phone):** min height 64, padding 12 vertical, 16 horizontal. Three columns:
  - position: fixed 28 wide, right-aligned, top-aligned with the title's first line;
  - 12 gap, then title with artist below it (2 apart), takes the remaining width;
  - 12 gap, then key above duration, right-aligned, min 48 wide.
- **Song row (600 px and wider):** same, but key and duration sit side by side in two right-aligned columns of 56, both aligned with the title's first line.
- **Dividers:** 1 px `line` between rows (not after the last), starting at the title column and ending at the right padding.
- **Long text — decision: wrap, never ellipsis.** The spec forbids cut-off text, and on stage a truncated title is worse than a taller row. Title and artist wrap onto as many lines as needed; a single very long word breaks inside the word rather than overflow. Position, key and duration never wrap.
- **Max content width:** 720 for the card, header content and bar group, centered. Card has 24 margin from the header and bar (12 in short landscape) and at least 16 on the sides.
- **End of list:** the last row plus its bottom spacing ends above the bar (spec rule); no extra empty space beyond that.

### Design tokens

Two themes; the page follows the system setting. Nothing else uses color.

| Token | Use | Light | Dark |
|---|---|---|---|
| `chrome` | header, bar, page behind the card, safe areas | `#F4F4F5` | `#09090B` |
| `surface` | song list (phone) / card (wide) | `#FFFFFF` | `#18181B` |
| `text` | titles, keys, current label | `#18181B` | `#FAFAFA` |
| `text-muted` | overline, position, artist, duration, other labels and icons | `#52525B` | `#A1A1AA` |
| `accent` | current-section marker, focus ring | `#115E59` | `#2DD4BF` |
| `on-accent` | icon and label on the marker | `#F4F4F5` | `#09090B` |
| `pressed` | pressed-state background | `#E4E4E7` | `#27272A` |
| `line` | dividers, header/bar borders, card border | `#E4E4E7` | `#27272A` |

The accent (deep teal / bright teal) is a neutral trial choice, not a brand decision.

**Contrast check** (WCAG ratios, rounded down). Required: 4.5 for normal text, 3 for large text, icons and the marker.

| Pair | Light | Dark |
|---|---|---|
| `text` on `surface` / `chrome` | 17.7 / 16.1 | 16.9 / 19.0 |
| `text-muted` on `surface` / `chrome` | 7.7 / 7.0 | 6.9 / 7.7 |
| `text` on `pressed` | 13.9 | 14.2 |
| `text-muted` on `pressed` | 6.0 | 5.8 |
| `accent` marker / focus ring on `chrome` | 6.8 | 10.6 |
| `accent` marker on `pressed` | 5.9 | 8.0 |
| `accent` focus ring on `surface` | 7.5 | 9.5 |
| `on-accent` on `accent` | 6.8 | 10.6 |

`line` is decorative and has no contrast requirement; no information depends on it.

### Typography

- **Font:** the system UI font stack (system-ui, then the platform fonts, then sans-serif). No web fonts, so it is identical offline.
- **Digits:** position, key and duration use equal-width (tabular) digits so the columns line up.

| Text | Size / line height | Weight | Color |
|---|---|---|---|
| `SETLIST` overline (uppercase, letter spacing 0.08 em) | 12 / 16 | 700 | `text-muted` |
| Setlist title in header | 24 / 30 (20 in short landscape) | 700 | `text` |
| Song title | 18 / 24 | 600 | `text` |
| Artist | 14 / 20 | 400 | `text-muted` |
| Position | 15 / 24 | 500 | `text-muted` |
| Key | 16 / 24 | 700 | `text` |
| Duration | 14 / 20 | 400 | `text-muted` |
| Bar label | 12 / 16 | 500 (700 when current) | `text-muted` (`text` when current) |

The song title is the largest and boldest text in the row (spec rule).

### Corner radii

- Card: 16, with a 1 px `line` border. No shadow.
- Current-section marker: fully rounded (pill).
- Pressed background in the bar and focus ring: 12.
- Rows: 0 (the pressed background fills the row edge to edge; inside the card it is clipped by the card corners).

### Bottom bar buttons

- **Icons:** 24 × 24, outline style, about 2 px stroke with rounded ends and joins, one consistent family. Songs = music note, Setlists = list with lines, Gig = microphone, Settings = gear. Inactive icons use `text-muted`.
- **Current section (Setlists) — not color alone:** the icon sits on a filled `accent` pill (phone: 56 × 32 behind the icon; 600 px and wider: one pill around icon and label, 40 high, 16 side padding) with the icon (and label inside the pill) in `on-accent`. On phone the label below is `text` at weight 700. Shape, fill and weight all differ from the other buttons.
- **Pressed state (all buttons):** a `pressed` rounded rectangle (radius 12) fills the button, inset 4 from its edges, behind icon, label and marker. It appears immediately on press and fades out over about 150 ms on release (no fade if the system asks for reduced motion). No scale, bounce or ripple.
- **Focus (keyboard):** a 2 px `accent` ring with 2 px gap around the button, radius 12. Shown only for keyboard focus, not on tap.
- **Hover:** none (simplicity; the spec asks only for a pressed state).

### Song row pressed state

The row background turns `pressed` edge to edge, with the same timing as the bar buttons. Text does not change.

## Out of scope

- Any behavior: no navigation between sections, no tapping into songs, no editing, adding, reordering, searching or deleting.
- Real or stored data; the content is fixed in the page.
- A manual light/dark switch (the page only follows the system).
- Installing as an app, offline caching, app icon.
- Other languages.
- Being part of the future app: this page is not reused and no app code is based on it.

## Open questions

None. Decided by the CEO on approval: current section is **Setlists**; sample songs are traditional/public-domain; rows and buttons show a subtle pressed state; the spec is deleted with the trial branch.
