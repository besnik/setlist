# M4 — Song format

- **Status:** not started — analysis, ADR, spec and tasks are written when M3 is done

## Goal

Decide how songs are stored and entered, and replace the provisional rendering from M3. Must be done before M5, because from M5 on the user's own songs are saved.

## Try it

A song displays well on a narrow phone too (chords stay above the right syllables when lines wrap), and both input styles work.

## Questions for the analysis (ADR)

1. **Internal format.** Plain text "chords over lyrics", ChordPro (`[G]Amazing [C]grace`), an own structured format, or a combination (store one format, accept several on input). Criteria: open and human-readable, future import and export, transposition, wrapping on narrow screens.
   - Initial lean (GM): store ChordPro as the canonical text, also accept "chords over lyrics" on input with automatic conversion, one song model in memory. The CEO also considered supporting both formats side by side.
   - Known weak spots of "chords over lyrics": alignment needs a monospaced font, wrapped lines move chords away from their syllables, chord-line detection is a guess ("A man …"), transposition changes chord lengths.
2. **Chord notation (B vs. H).** CEO's proposal: always store the international notation (B, Bb); show the German / Central European notation (H, B) only in the UI, as an app setting, possibly per song.
   - Trap to analyze: on input, "B" means Bb in the German notation and H in the international one — the app cannot tell without knowing the user's notation. Also `Hm` / `Hmi`, `Es` / `As`.
   - Decide which part is in the MVP: at least the storage rule (it affects saved data); the display setting may come after the MVP.

## Out of scope

Transposition, import from websites, export to other formats (after the MVP; the format must make them possible).
