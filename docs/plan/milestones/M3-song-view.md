# M3 — Song view

- **Status:** done
- **Spec:** [songs.md — Song view](../../product-specs/songs.md#song-view-m3), [UX](../../product-specs/songs.md#song-view-screen-m3)

## Goal

Tap a song in the list and read it full screen, as on stage: lyrics with chords, chord lines highlighted, font size adjustable with one tap.

## Try it

Open *House of the Rising Sun* on the tablet, make the text bigger with A+, close it, open another song: the size is remembered. Leave the song open for a few minutes **on the deployed site** (the screen lock needs `https`, so not through the dev server): the screen does not turn off.

## Scope

- Full-screen view of one song: title, artist, key, the chord sheet; its own address, closed with ×, Back or Escape.
- Chord lines detected and highlighted (the detection became the reader of the `plain` format in M4).
- Big A− / A+ buttons, size remembered across songs and restarts.
- The screen stays on while a song is shown.
- **One tap on stage:** every key control of the view is one tap away with a big touch target (design principle, see [design-lead](../../../.claude/agents/design-lead.md)).

## Tasks

| ID | Task | Spec | Status | PR |
|---|---|---|---|---|
| T-024 | Song view: the first router (URL hash), rows as links, and the Song view screen with the stage top bar; closed with ×, Back and Escape, keeping the Songs screen's search text and scroll. E2e tests | [Open and close, Content](../../product-specs/songs.md#song-view-m3), [UX](../../product-specs/songs.md#song-view-screen-m3) | done | [#37](https://github.com/besnik/setlist/pull/37) |
| T-025 | Chord lines: `isChordLine` with unit tests for every example and counter-example of the rules; chord lines bold in the chord color, checked e2e | [Chord lines](../../product-specs/songs.md#song-view-m3) | done | [#40](https://github.com/besnik/setlist/pull/40) |
| T-026 | Font size: A− / A+ (12–32 px), remembered in a settings repository in `localStorage`, the app's first storage, safe when storage is unavailable. E2e tests of the limits and of the size kept across songs and a reload | [Font size](../../product-specs/songs.md#song-view-m3) | done | [#41](https://github.com/besnik/setlist/pull/41) |
| T-027 | Screen stays on with Screen Wake Lock while the Song view is shown, requested again when the page becomes visible. E2e with a fake wake lock; the CEO checks a real phone | [Screen stays on](../../product-specs/songs.md#song-view-m3) | done | [#42](https://github.com/besnik/setlist/pull/42) |

## End-of-milestone architecture check

Engineering lead, 2026-11-26: the codebase is healthy, nothing blocks M4. Cleanup tasks T-028–T-030 went to [M4](M4-song-format.md#cleanup-from-m3); two stale ARCHITECTURE.md notes were fixed right away; one design note for M6 went to [tech-debt.md](../tech-debt.md).

## Out of scope

Previous / next song (M7), editing (M5), transposition (after the MVP).
