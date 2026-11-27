# 0008. Song format

- **Status:** proposed
- **Date:** 2026-11-27
- **Decided by:** CEO

## Context

From M5 on, the user's own songs are saved on the device, so the shape of a song must be decided before then (M4). Until now the song text used a provisional "chords over lyrics" form (M3).

Forces:

- The format must stay open and human-readable, and must not block later import and export, transposition and tabs.
- On a narrow phone, a wrapped "chords over lyrics" line moves the chords away from their syllables. ChordPro (`[G]Amazing [C]grace`) keeps each chord with its syllable when a line wraps.
- "Chords over lyrics" is what most song websites and people write. A conversion to another format is a guess (is this line chords or lyrics?) and can break unusual layouts.
- Central European musicians write `H` for the note called `B` internationally, and `B` for `Bb`. The same text `B` means two different chords, and the app cannot tell which without knowing the notation.
- Songs from websites are usually copyrighted; being transparent about where a song came from is fair to the source.

## Options considered

1. **One internal format (ChordPro); other formats converted on input.** One renderer and one model. But every conversion from plain text is a guess, and a wrong guess changes the user's text for good.
2. **Several stored formats, each song tagged with its format.** The text is kept exactly as written; each format has its own renderer. Nothing is lost, and a new format later (e.g. tabs) is a new tag and a new renderer, with no change to stored songs. More renderers to maintain.
3. **An own structured format (e.g. JSON lines of chords and lyrics).** Precise, but not human-readable or writable, and every input must be converted.

For the chord notation:

1. **Always store the international notation; convert on input.** Needs to know the notation at input anyway, and rewrites the user's text.
2. **Store the text as written and tag the song with its notation.** Nothing is rewritten; a later display setting or transposition reads the tag.

## Decision

**Option 2 for the format, option 2 for the notation** (CEO, 2026-11-26 and 2026-11-27).

- A song keeps its text **as written**, together with header fields stored next to the text (not as directives inside it):
  - `format`: `plain` ("chords over lyrics") or `chordpro` (chords in square brackets). The MVP has exactly these two.
  - `notation`: `international` (`B` = B, `Bb` = B flat) or `german` (`H` = B, `B` = B flat).
  - Optional source fields: `source` (the website's name as plain text, e.g. `akordy.sk`) and `importedAt` (the date of import). The source is never a link: no address is stored or shown, so a malformed or harmful link cannot get in (CEO, 2026-11-27).
- Each format has its own renderer in the Song view: `plain` in the monospaced font with chord-line detection (from M3), `chordpro` in the body font with every chord above its syllable.
- The notation does not change what is shown in the MVP (chords are shown as written); it is stored so that a display setting and transposition after the MVP know what `B` means.
- Detecting the format of a pasted text, import and export belong to a later milestone (import / export), not M4. In M4 the songs are prepared by hand.

## Consequences

- Stored songs never need a migration when a new format is added; the renderer chooses by `format`.
- Two renderers instead of one; shared parts (the chord pattern, the sheet styling, the font size) are reused.
- `plain` songs still lose chord alignment when a line wraps on a narrow phone; users who need wrapping use `chordpro`. A converter from `plain` to `chordpro` may come with import / export.
- Export to ChordPro later writes the header fields as directives (`{title: …}`, `{artist: …}`, `{key: …}`).
- The song model grows by `format`, `notation` and two optional source fields (spec [songs.md](../product-specs/songs.md#song-format-m4)).
