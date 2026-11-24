# Prototype reference

The MVP is based on a throwaway prototype the CEO built outside the harness (one HTML file, Slovak UI). The prototype file is not kept in the repository, so this page records what we take from it. It is a **reference for behavior and look only** — the app is written from scratch ([ADR 0003](../decisions/0003-throwaway-prototypes.md)).

The CEO likes the layout and the design: minimal, clean, very readable on stage. Treat them as the starting point, not as something to redo. Colors are **provisional** until the CEO decides the brand.

## Behavior (where it lands in the MVP)

| Prototype behavior | Milestone |
|---|---|
| Song list sorted by title, search by title, artist and key | M1 |
| Light and dark theme following the system | M1 |
| Installable, works offline | M2 *(not in the prototype)* |
| Full-screen song view, chord lines detected and highlighted, font size A−/A+ remembered | M3 |
| Chord detection understands H and `mi` (`Ami`), extensions, slash chords, bar marks (`|`, `/`, `-`, `x2`, `N.C.`) | M3 (provisional), M4 (format) |
| Add, edit, delete a song (title, artist, key, text); title required; trailing whitespace trimmed | M5 |
| Data saved on the device; sample songs and one setlist on first start | M5, M6 |
| Setlists ("playlists" in the prototype): create, rename, delete, add songs (checkbox picker), reorder with up/down, remove; deleting a song removes it from all setlists | M6 |
| Bottom navigation: Songs / Setlists | M6 |
| Play mode: previous / next with big buttons, swipe, keyboard arrows; position `3 / 12` and "next: …"; Escape closes; edit the current song from play mode | M7 |
| Playing from the song list plays the (filtered) list in order | M7 |

## Look

- **Layout:** one narrow column (max 720 px) centered; list first; fixed bottom tab bar; play mode full screen with a top bar (close, context, A−, A+, edit) and a bottom bar with big previous / next buttons (64 px high, next is the accent color) and the position in between.
- **Typography:** display font *Bricolage Grotesque* (headings), body *DM Sans*, chords and key chips *JetBrains Mono*. Chord sheet font size 16 px by default, 12–32 px in steps of 2.
- **Shapes:** radius 14 px for cards and rows, pill buttons (min height 44 px), round icon buttons 44 px, dialogs radius 20 px.
- **Colors (provisional):**

| Token | Light | Dark |
|---|---|---|
| background | `#f3f4f6` | `#0e1013` |
| surface | `#ffffff` | `#171a1f` |
| ink | `#14171c` | `#eceef2` |
| muted | `#677081` | `#9aa1ad` |
| line | `#e1e4e9` | `#2a2f38` |
| accent | `#e8501f` | `#ff7a4d` |
| chord | `#c2410c` | `#ffa27d` |
| tint (key chip background) | `#fdece5` | `#2a1a14` |
| danger | `#c8372a` | `#ff6b5e` |

- **Details worth keeping:** key shown as a small mono chip next to the song; empty states as a dashed box with a short hint; chord lines in the accent-like chord color and bold; the tab bar slightly translucent with blur.

## What we change on purpose

- UI language is **English** (the prototype is Slovak).
- "Playlists" are called **Setlists**.
- Fonts are served by the app, not by Google Fonts (offline, privacy).
- No dedicated accessibility work (ARIA labels, screen reader support) — the audience is everyday musicians (CEO decision).
