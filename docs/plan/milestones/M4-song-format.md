# M4 — Song format

- **Status:** in-progress — spec, ADR 0008 and tasks approved ([#47](https://github.com/besnik/setlist/pull/47), CEO 2026-11-27); T-033, T-034, T-035 done

## Goal

Decide how songs are stored and entered, and replace the provisional rendering from M3. Must be done before M5, because from M5 on the user's own songs are saved.

## Try it

A song displays well on a narrow phone too (chords stay above the right syllables when lines wrap), and the sample songs in both formats (`plain` and `chordpro`) show correctly — among them two Slovak songs, *A od Prešova* and *Tichá noc*. No input in M4: the songs are prepared by hand (CEO, 2026-11-27).

## Cross-cutting

Approved by the CEO in chat (2026-11-26), done before the M4 work starts.

| ID | Task | Spec | Status | PR |
|---|---|---|---|---|
| T-031 | Error handling and logging: golden principle, ADR 0007, `ui/log.js` (levels, prefix), uncaught errors logged once, an info line at start-up, every `catch` narrowed to its expected case (app and tools), check rules 11–12 against swallowed errors and console use outside the log; unit and e2e tests | [ADR 0007](../../decisions/0007-error-handling-and-logging.md) | done | [#44](https://github.com/besnik/setlist/pull/44) |

## Tasks

Spec: [songs.md — Song format](../../product-specs/songs.md#song-format-m4). Decision: [ADR 0008](../../decisions/0008-song-format.md). Approved by the CEO with the spec PR [#47](https://github.com/besnik/setlist/pull/47) (2026-11-27). Order: top to bottom.

| ID | Task | Difficulty | Spec | Status | PR |
|---|---|---|---|---|---|
| T-033 | Song header fields: `format`, `notation`, optional `source`, `importedAt` in the `Song` type and the sample songs; fallbacks (unknown format → `plain`, unknown notation → `international`) as domain functions with unit tests; the M3 sheet moved to `ui/components/plain-sheet.js` and chosen by format in `song-view.js`; the sheet CSS moved from `song-screen.css` to `components.css`; lines split on `\r\n`, `\r`, `\n`; `isChordLine` comments no longer provisional; files in `domain/songs.js`, `data/sample-songs.js`, offline list in `app/sw.js`, new VERSION. No visible change. T-028 rides along | standard — header fields and fallbacks within existing modules | [Song format](../../product-specs/songs.md#song-format-m4) | done | [#48](https://github.com/besnik/setlist/pull/48) |
| T-034 | ChordPro reader `domain/chordpro.js`: `parseChordPro(text)` → blocks (lines of chord + text pieces, verses numbered automatically or with their own mark, chorus with the mark `R:`, `{chorus}` references, comments, empty lines; other directives and `#` lines dropped); unit tests for every rule of the `chordpro` format (also `\r\n`, nesting, empty `{c:}`) | hard — new domain module; parses user-written text into the shared block structure | [Song format](../../product-specs/songs.md#song-format-m4) | done | [#51](https://github.com/besnik/setlist/pull/51) |
| T-035 | ChordPro sheet `ui/components/chordpro-sheet.js`, its CSS in `components.css` (mark margin with `--mark-chars` and the responsive `--mark-gap`), `song-view.js` uses it for `chordpro`; the first `chordpro` sample song, *A od Prešova* (`german`, no source (CEO, 2026-11-27); written from at least two public sources, checked to be a free folk song) in `data/sample-songs.js`; offline list and VERSION; e2e: chords above their syllables at 320 px and 32 px also after wrapping, no horizontal scroll, section marks, comment and font size; the chorus mark by a unit test of the component; tests updated to five songs | hard — new component; renders user input (escaping) | [Song format](../../product-specs/songs.md#song-format-m4), [UX](../../product-specs/songs.md#song-sheet-by-format-and-source-line-m4) | done | [#52](https://github.com/besnik/setlist/pull/52) |
| T-036 | Source line at the end of the Song view: plain text "Source: <source>" (never a link), none for an empty source; in `ui/views/song-view.js`, its CSS in `song-screen.css`; new VERSION; unit test of the view (plain text, markup shown as text, spaces ignored) and e2e (no source line for the sample songs, which have no source) | standard — small addition to the song view; plain text through the existing safe rendering | [Song format](../../product-specs/songs.md#song-format-m4) | approved | — |
| T-037 | Two Slovak songs in `data/sample-songs.js`, each written from at least two public sources: *Tichá noc* with Slovak words (`plain`, `german`, letter-name chords only; **gate:** free to use (spec *Open questions*), else another public-domain Slovak carol and a question to the CEO in the PR) and *Tancuj, tancuj, vykrúcaj* (`chordpro`, `german`, verses with `{sov}`, its refrain as the chorus, later repeats as `{chorus}`); e2e: verse numbers, `R:` and the reference shown, no horizontal scroll at 32 px on 320 px; unit and e2e tests updated to seven songs; new VERSION | standard — sample data and tests | [Sample songs](../../product-specs/songs.md#sample-songs) | approved | — |

## Answers from the analysis (CEO, 2026-11-27)

- **Format:** several stored formats, the text kept as written, `format` in the song header: `plain` and `chordpro` in the MVP (question 1).
- **Notation:** not rewritten — the song header holds `notation` (`international` / `german`); chords are shown as written in M4; a notation display setting after the MVP (question 2).
- **Header and source:** header fields stored next to the text (not as directives); optional `source` and `importedAt`; the source is plain text, the website's name (e.g. `akordy.sk`), never a link — no URL is stored, for safety (CEO, 2026-11-27); shown quietly at the end of the Song view (question 3).
- **ChordPro subset:** chords, verses (`sov` / `eov`, numbered `1.`, `2.` automatically) and the chorus (`soc` / `eoc`, mark `R:`), `{chorus}` as a short "R:" reference, comments (`c`); other directives kept but not shown. Sections are marked by a small grey mark in a left margin (variant A of a visual preview, CEO 2026-11-27); the margin is as wide as the longest mark plus a gap that is small on phones and roomier from 600 px (CSS custom properties `--mark-chars`, `--mark-gap`).
- **Input:** none in M4 — the songs are prepared by hand. Detecting the format of a pasted text, import and export belong to a later milestone.
- **No prototype:** the ChordPro layout (chord above its syllable) is a well-known pattern.
- **Sample songs:** copyrighted songs (e.g. *Nepoznám*, *Wonderwall*) are not added — the repository and the app are public. Added instead: *A od Prešova* (folk song, `chordpro`), *Tichá noc* with Slovak words (`plain`) and, for a ChordPro chorus, the Slovak folk song *Tancuj, tancuj, vykrúcaj* (`chordpro`). The four English songs stay as they are (`plain`); the demo collection grows over time.

## Questions for the analysis (ADR) — answered above

1. **Internal format.** Plain text "chords over lyrics", ChordPro (`[G]Amazing [C]grace`), an own structured format, or a combination (store one format, accept several on input). Criteria: open and human-readable, future import and export, transposition, wrapping on narrow screens.
   - Initial lean (GM): store ChordPro as the canonical text, also accept "chords over lyrics" on input with automatic conversion, one song model in memory. The CEO also considered supporting both formats side by side.
   - CEO (2026-11-26, M3 planning): plain text "chords over lyrics" should stay supported in some form. Not decided yet whether as a second stored format or only as input converted to the one internal format by import / export.
     - For one internal format: import and export convert other formats (plain text, ChordPro, others), so a second internal format may be unnecessary; the M3 chord-line detection becomes the plain-text reader.
     - For keeping plain text as stored: some plain text may not convert reliably (unusual layouts, lines the detection misreads); storing it as written never loses anything.
     - To analyze: which plain-text cases fail to convert, and whether "keep the line as written lyrics" is a good enough fallback.
   - CEO (2026-11-26, after T-024): lean towards **several stored formats** — each song keeps its text as written plus a format tag in a song header (e.g. `plain` for "chords over lyrics", `chordpro` for embedded chords); the import decides the format (auto-detected, the user can change it). Each format has its own rendering: plain text in a monospaced font (alignment by spaces), ChordPro in the body font with chords above their syllables. A new format later (e.g. tabs) is a new tag and a new rendering, without touching stored songs.
   - Known weak spots of "chords over lyrics": alignment needs a monospaced font, wrapped lines move chords away from their syllables, chord-line detection is a guess ("A man …"), transposition changes chord lengths.
2. **Chord notation (B vs. H).** CEO's proposal: always store the international notation (B, Bb); show the German / Central European notation (H, B) only in the UI, as an app setting, possibly per song.
   - Trap to analyze: on input, "B" means Bb in the German notation and H in the international one — the app cannot tell without knowing the user's notation. Also `Hm` / `Hmi`, `Es` / `As`.
   - Decide which part is in the MVP: at least the storage rule (it affects saved data); the display setting may come after the MVP.

3. **Song header and source.** CEO (2026-11-26): besides the format, the header may hold where the song came from — the source (e.g. "supermusic.cz"), a link to the original and the date of import. Being transparent about the source is fair to the platform the song came from. Proposal (GM): show the source quietly at the end of the Song view (small muted text with the link); songs typed in by hand have no source. Decide which fields are in the MVP.
   - Related: the importer should work on single songs the user chooses (paste or open one song), not collect whole databases — song texts are usually copyrighted and websites' terms often forbid bulk downloading (see the importer idea in the [inbox](../inbox.md)).

## Cleanup from M3

From the M3 end-of-milestone architecture check. Approved by the CEO in chat (2026-11-26).

| ID | Task | Spec | Status | PR |
|---|---|---|---|---|
| T-028 | Stale comments: `app/sw.js` (header and the registration comment) still says `src/main.js` registers the worker — it is `data/app-version.js`; `app/src/data/sample-songs.js` says "in M1" — the sample songs are the only songs until M5. Ride along with the first M4 PR that changes `app/` (needs a new VERSION) | — | done | [#48](https://github.com/besnik/setlist/pull/48) |
| T-029 | `tools/check.js`: one shared helper that strips comments from source, instead of the same two regexes copied in 5 rules; tests in `tests/tools` stay green. With the next new check rule | — | approved | — |
| T-030 | One shared "Unknown artist" fallback for the song list and the Song view (a small component in `ui/components/`), before M6 adds setlist rows and M7 the play-mode header | — | approved | — |

## Ideas for later (not in M4)

- **Tabs** (guitar tablature): monospaced content like "chords over lyrics", so the format tag allows adding it later as its own format or as tab blocks inside a song (ChordPro has `{start_of_tab}` … `{end_of_tab}`). The M4 format must not block it.

## Out of scope

Transposition, import from websites, export to other formats (after the MVP; the format must make them possible).
