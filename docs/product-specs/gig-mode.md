# Gig mode

- **Status:** approved

## Purpose

Gig mode is the screen a musician looks at on stage while playing a setlist. It answers three questions at a glance, from arm's length, in a dark venue: what am I playing now, what comes next, and how far through the set am I.

This first version is a **harness trial**: a single static screen with sample data, built with HTML and CSS only. It lives on the trial branch and is not part of the app.

## Behavior

### Static gig screen (trial)

Content

- Rule: the browser tab title is "Gig mode – Setlist".
- Rule: the screen shows, from top to bottom: a **top bar** (setlist name and progress), the **current song**, the **next song** and the **Previous / Next buttons**.
- Rule: the current song shows its title, key and duration (`m:ss`). The title is the largest text on the screen.
- Rule: the next song shows its title, key and duration, labelled "Next". It is clearly smaller than the current song.
- Rule: progress is shown as `<position> / <total>` (e.g. `3 / 12`), where position is the current song's place in the setlist.
- Rule: a screen reader announces progress as "Song 3 of 12" (not "3 slash 12").
- Rule: all UI text is in English.

Buttons

- Rule: there are two buttons, **Previous** and **Next**, side by side at the bottom of the screen, each with an arrow and a text label. Next is on the right and is the more prominent one.
- Rule: given the user taps or clicks a button, then nothing happens (no navigation, no reload, no error). The buttons are visual only. A pressed look is best effort (some mobile browsers show none without JavaScript).
- Rule: each button has a touch area of at least 44 × 44 CSS pixels and can be reached with a thumb on a phone held in one hand.
- Rule: given a keyboard user presses Tab, then focus moves Previous → Next and the focused button is clearly visible.

Screen sizes

- Rule: given a phone in portrait (narrowest 320 × 568 CSS pixels) or landscape (smallest 568 × 320), then the whole screen fits without vertical or sideways scrolling and no text is cut off.
- Rule: given a song title is too long for one line, then it wraps (the current title to at most 3 lines with the sample data) and the layout does not break.
- Rule: given a tablet or desktop window, then the content stays in a centered column and does not stretch into long lines.
- Rule: given the user zooms to 200 %, then all text and buttons are still visible and usable; scrolling is allowed at that zoom.

Look and robustness

- Rule: the screen is always dark, whatever the system theme (CEO decision).
- Rule: normal text has a contrast ratio of at least 4.5:1 and large text and button outlines at least 3:1 against their background.
- Rule: the page works with JavaScript disabled and without a network connection (no web fonts, icons or images loaded from the network).

### Sample data

- Rule: setlist name **"Friday at The Anchor"**, 12 songs, artist "Traditional" (public domain, no rights questions once the repository is public).
- Rule: the current song is song **3 of 12, "Whiskey in the Jar", key G, 4:05**.
- Rule: the next song is song 4, **"The Parting Glass", key D, 3:40**.

## UX and visual design

One screen, no transitions. Sizes in CSS pixels at 100 % zoom; text sizes must scale with zoom. Colors are **provisional** (no design system yet).

### Sketch

Phone portrait (320–599 px wide):

```
┌────────────────────────────────┐
│ Friday at The Anchor    3 / 12 │  top bar, 56
│                                │
│ NOW PLAYING                    │  label 14, muted, caps
│ Whiskey in                     │
│ the Jar                        │  title 44 / 700, line-height 1.1
│                                │
│ ╭─────────╮ ╭────────╮         │
│ │ Key  G  │ │  4:05  │         │  chips 20 / 600, 40 high
│ ╰─────────╯ ╰────────╯         │
│                                │  (flexible space)
│ ────────────────────────────── │
│ NEXT                           │  label 14, muted, caps
│ The Parting Glass      D  3:40 │  22 / 600; key and time muted
├────────────────────────────────┤
│ ╭────────────╮ ╭─────────────╮ │
│ │ ‹ Previous │ │   Next ›    │ │  buttons, 64 high, 12 apart
│ ╰────────────╯ ╰─────────────╯ │
└────────────────────────────────┘
```

- The current-song block sits in the flexible middle area; the next-song block and the buttons are anchored to the bottom (thumb zone).
- **Previous:** outlined (1 px `line-strong`), text `text`. **Next:** filled `accent`, text `on-accent`.
- **Focus:** 3 px `accent` outline, 3 px offset, on both buttons.

Tablet / desktop (600 px and wider): the same column, max 640 wide, centered; current title 64, next title 26; buttons max 640 wide in total.

Short landscape (height below 500): top bar 44, current title 32, label hidden ("NOW PLAYING"), chips 32 high, buttons 52 high.

### Tokens (provisional)

| Token | Value | Use |
|---|---|---|
| `bg` | `#0B0D10` | Page |
| `surface` | `#171A1F` | Chips, Previous button |
| `text` | `#F2F4F7` | Titles, labels on buttons |
| `muted` | `#9AA3AE` | Labels, next song key and duration |
| `accent` | `#FFB020` | Next button, focus ring |
| `on-accent` | `#111317` | Text on the Next button |
| `line-strong` | `#9AA3AE` | Previous button outline |
| `track` | `#2A2F37` | Divider above the next song |

Font: the system UI stack (no web fonts). Durations and `3 / 12` use tabular numbers. Spacing scale: 4, 8, 12, 16, 24, 32.

### Self-check

- Contrast (computed): `text`/`bg` 17.7, `text`/`surface` 15.8, `muted`/`bg` 7.6, `muted`/`surface` 6.8, `on-accent`/`accent` 10.2, `accent`/`bg` 10.6 (focus ring), `line-strong`/`bg` 7.6. All meet 4.5:1 or 3:1. `track`/`bg` is 1.45, but the divider is decorative and carry no information.
- Buttons at 320 wide: (320 − 2 × 16 − 12) / 2 = 138 × 64 (52 in landscape) ≥ 44 × 44.
- Height at 320 × 568: 56 + 24 + 20 + 2 × 48 (title) + 16 + 40 + 24 + 1 + 20 + 30 + 16 + 64 + 16 ≈ 427 < 568. Title "Whiskey in the Jar" at 44 px needs 2 lines at 288 px content width.
- Height at 568 × 320 (landscape): the title at 32 px fits on one line in 536 px of width, so 44 + 16 + 36 + 12 + 32 + 16 + 1 + 20 + 28 + 12 + 52 + 12 ≈ 281 < 320. ✓ (With a two-line title it would be ≈ 317, i.e. almost no margin — longer real titles are out of scope for this trial.)
- Largest text: current title (44 / 64) > next title (22 / 26) > chips (20). ✓

## Notes for Design / Engineering

- Technical impact: fits ARCHITECTURE.md (no build step, plain files). No ADR, no new dependency, no refactoring. No JavaScript, so no ES modules yet.
- Location: `playground/gig-mode/` (`index.html`, `style.css`), like the earlier hello-page trial; not inside the app (the app structure does not exist yet).
- Buttons: real `<button type="button">` elements, outside any form, so a tap does nothing.
- Progress for screen readers: e.g. visible `3 / 12` with `aria-hidden`, plus visually hidden "Song 3 of 12".
- Safe areas (notch, home indicator) via `env(safe-area-inset-*)`; `viewport-fit=cover`.
- Tests: there is no test tooling yet (golden principle *A lean test base* needs the M1 testing ADR). Verification is by QA with throwaway checks; recorded in tech debt.

## Out of scope

- Any behavior: the buttons do not change the song, nothing is stored, no real data.
- Lyrics, chords, notes, tempo, a timer or clock.
- Other states: first song (no Previous), last song (no Next), empty setlist.
- Light theme (CEO decision: gig mode is always dark), a progress bar (CEO decision: the `3 / 12` number is enough), settings, landscape-specific features beyond fitting on screen.

## Open questions

None. Decided by the CEO: always dark; no progress bar.
