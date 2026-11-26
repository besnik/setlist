# M3 — Song view

- **Status:** in-progress
- **Spec:** [songs.md — Song view](../../product-specs/songs.md#song-view-m3), [UX](../../product-specs/songs.md#song-view-screen-m3)

## Goal

Tap a song in the list and read it full screen, as on stage: lyrics with chords, chord lines highlighted, font size adjustable with one tap.

## Try it

Open *House of the Rising Sun* on the tablet, make the text bigger with A+, close it, open another song: the size is remembered. Leave the song open for a few minutes: the screen does not turn off.

## Scope

- Full-screen view of one song: title, artist, key, the chord sheet; its own address, closed with ×, Back or Escape.
- Chord lines detected and highlighted (provisional rendering of the "chords over lyrics" text; M4 decides the song format — the detection may stay as the reader of plain-text input).
- Big A− / A+ buttons, size remembered across songs and restarts.
- The screen stays on while a song is shown.
- **One tap on stage:** every key control of the view is one tap away with a big touch target (design principle, see [design-lead](../../../.claude/agents/design-lead.md)).

## Tasks

Order: T-024 first. Then T-025, T-026 and T-027 can run in parallel — each changes the version in `sw.js`, so whichever merges later picks a new one.

| ID | Task | Spec | Status | PR |
|---|---|---|---|---|
| T-024 | Song view: hash router, rows as links (row states), `getSong(id)`, the Song view screen (stage top bar with ×, song header, sheet in mono without highlighting), close with ×, Back and Escape keeping the search text and scroll, unknown id → Songs screen, JetBrains Mono 400 in the offline list; e2e tests; ARCHITECTURE.md (router) updated | [Open and close, Content](../../product-specs/songs.md#song-view-m3), [UX](../../product-specs/songs.md#song-view-screen-m3) | done | [#37](https://github.com/besnik/setlist/pull/37) |
| T-025 | Chord lines: `isChordLine` in `domain/` with unit tests for every example and counter-example of the rules; the sheet shows chord lines bold in the chord color; e2e check of one chord and one lyric line | [Chord lines](../../product-specs/songs.md#song-view-m3) | done | [#40](https://github.com/besnik/setlist/pull/40) |
| T-026 | Font size: A− / A+ in the stage top bar, 12–32 px in steps of 2, default 16, disabled at the limits; a settings repository in `data/` (`localStorage`, validated, safe when storage is unavailable); e2e tests of the limits and of the size kept across songs and a reload; ARCHITECTURE.md (data: settings repository, first storage) updated | [Font size](../../product-specs/songs.md#song-view-m3) | done | [#41](https://github.com/besnik/setlist/pull/41) |
| T-027 | Screen stays on: Screen Wake Lock while the Song view is shown, released on close, requested again when the page becomes visible; no error when unsupported (e2e) | [Screen stays on](../../product-specs/songs.md#song-view-m3) | in-progress | [#42](https://github.com/besnik/setlist/pull/42) |

## CEO actions

- From M2: install the app on the iPhone (Safari, *Share → Add to Home Screen*), turn on airplane mode, open it.
- After T-027 is deployed: open a song on the phone and the iPhone **on the deployed site** (not the dev server — the screen lock needs `https`) and wait longer than the screen timeout — the screen stays on.

## Out of scope

Previous / next song (M7), editing (M5), transposition (after the MVP), the song format (M4).
