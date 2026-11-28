# M4 — Song format

- **Status:** done — spec, ADR 0008 and tasks approved ([#47](https://github.com/besnik/setlist/pull/47), CEO 2026-11-27); T-033–T-037 done

## Goal

Decide how songs are stored and entered, and replace the provisional rendering from M3. Must be done before M5, because from M5 on the user's own songs are saved.

## Try it

A song displays well on a narrow phone too (chords stay above the right syllables when lines wrap), and the sample songs in both formats (`plain` and `chordpro`) show correctly — among them two Slovak songs, *A od Prešova* and *Tichá noc*. No input in M4: the songs are prepared by hand (CEO, 2026-11-27).

## Scope

Two stored formats (`plain`, `chordpro`) with `format`, `notation` and an optional `source` in the song header; a ChordPro reader and sheet; a quiet source line in the Song view; Slovak sample songs. Spec: [songs.md — Song format](../../product-specs/songs.md#song-format-m4). Decisions: [ADR 0007](../../decisions/0007-error-handling-and-logging.md) (error handling), [ADR 0008](../../decisions/0008-song-format.md) (song format).

## Key decisions

Not recorded in ADR 0008 or the spec:

- No prototype: the ChordPro layout (chord above its syllable) is a well-known pattern (CEO, 2026-11-27).
- Section marks in a small grey left margin — variant A of a visual preview (CEO, 2026-11-27).
- Copyrighted songs (e.g. *Nepoznám*, *Wonderwall*) are not added as sample songs, because the repository and the app are public; free folk songs are used instead, and the demo collection grows over time (CEO, 2026-11-27).

## Cross-cutting

Approved by the CEO in chat (2026-11-26), done before the M4 work starts.

| ID | Task | Spec | Status | PR |
|---|---|---|---|---|
| T-031 | Error handling and logging: golden principle, ADR 0007 and the app's log `ui/log.js`; uncaught errors logged once, every `catch` narrowed to its expected case, and check rules against swallowed errors and console use outside the log. Unit and e2e tests | [ADR 0007](../../decisions/0007-error-handling-and-logging.md) | done | [#44](https://github.com/besnik/setlist/pull/44) |

## Tasks

Approved by the CEO with the spec PR [#47](https://github.com/besnik/setlist/pull/47) (2026-11-27).

| ID | Task | Difficulty | Spec | Status | PR |
|---|---|---|---|---|---|
| T-033 | Song header fields (`format`, `notation`, optional `source`, `importedAt`) in the `Song` type and the sample songs, with fallbacks for unknown values as unit-tested domain functions; the M3 sheet became the `plain` sheet component, chosen by format. No visible change | standard — header fields and fallbacks within existing modules | [Song format](../../product-specs/songs.md#song-format-m4) | done | [#48](https://github.com/besnik/setlist/pull/48) |
| T-034 | ChordPro reader: text in, blocks out (chord pieces, numbered verses, chorus `R:`, `{chorus}` references, comments). Unit tests for every rule of the `chordpro` format | hard — new domain module; parses user-written text into the shared block structure | [Song format](../../product-specs/songs.md#song-format-m4) | done | [#51](https://github.com/besnik/setlist/pull/51) |
| T-035 | ChordPro sheet with the section-mark margin, and the first `chordpro` sample song *A od Prešova* (no source, CEO 2026-11-27; checked to be a free folk song). E2e: chords above their syllables at 320 px and 32 px also after wrapping, no horizontal scroll, marks and comments | hard — new component; renders user input (escaping) | [Song format](../../product-specs/songs.md#song-format-m4), [UX](../../product-specs/songs.md#song-sheet-by-format-and-source-line-m4) | done | [#52](https://github.com/besnik/setlist/pull/52) |
| T-036 | Source line "Source: …" at the end of the Song view, plain text and never a link. Unit test of the view (markup shown as text) and e2e | standard — small addition to the song view; plain text through the existing safe rendering | [Song format](../../product-specs/songs.md#song-format-m4) | done | [#53](https://github.com/besnik/setlist/pull/53) |
| T-037 | Slovak sample songs *Tichá noc* (`plain`) and *Tancuj, tancuj, vykrúcaj* (`chordpro`, verses and a repeated chorus), each written from at least two public sources; e2e for verse numbers, `R:` and the reference. **CEO (2026-11-27):** both count as folk songs and are used in Slovak | standard — sample data and tests | [Sample songs](../../product-specs/songs.md#sample-songs) | done | [#54](https://github.com/besnik/setlist/pull/54) |

## Cleanup from M3

From the M3 end-of-milestone architecture check. Approved by the CEO in chat (2026-11-26).

| ID | Task | Spec | Status | PR |
|---|---|---|---|---|
| T-028 | Stale comments in `app/sw.js` and `data/sample-songs.js` fixed; rode along with T-033 | — | done | [#48](https://github.com/besnik/setlist/pull/48) |

T-029 and T-030 (approved, not done) moved to [M5](M5-manage-songs.md#cleanup-carried-over).

## End-of-milestone architecture check

Engineering lead, 2026-11-27: the codebase is healthy, nothing blocks M5, and `ARCHITECTURE.md` matches the code. No new cleanup tasks; one note for the M5 storage task went to [tech-debt.md](../tech-debt.md) (validate songs once when read from storage).
