# Tech debt

Known shortcuts, workarounds and issues we chose to fix later. Add an entry whenever you take a shortcut; remove it in the PR that fixes it.

| Area | Debt | Why it exists | Added |
|---|---|---|---|
| Check (`tools/check.js`) | Rule 5 (files loaded by HTML and CSS) does not read `srcset` or imports inside inline `<script>` blocks | Neither is used yet; add when the first responsive image or inline module appears | 2026-11-24 |
| Search (`domain/songs.js`) | Letters with no accent to strip (ł, ø, ß, đ) do not fold, so `l` does not find `ł` | Slovak and Czech letters fold correctly; add a mapping when songs in other languages need it | 2026-11-24 |
| Screen lock (`ui/wake-lock.js`) | A lock the browser releases while the page stays visible (e.g. battery saver on some Android browsers) is not requested again until the next app switch | The spec does not cover it; fix by listening to the lock's `release` event (a few lines) if the CEO sees the screen turn off on stage | 2026-11-26 |
| ChordPro sheet (`ui/components/chordpro-sheet.js`) | When the first word of a section is wider than the whole line (it wraps between its pieces), the section mark sits level with the last row of that word instead of the first | The mark is aligned by baseline, and a wrapped word's baseline is its last row; such a word is very rare (no sample song has one). Fix with a grid for marked lines if a real song shows it | 2026-11-27 |
| Song view closing (`ui/screens/song-screen.js`) | × goes back only when the Song view was opened from the Songs screen, otherwise it goes to the Songs screen | Design note for M6: when songs open from a setlist, the rule becomes "opened from any screen of the app → back" (one line); not needed before | 2026-11-26 |
| Song view (`ui/views/song-view.js`) | The view repairs bad song data itself: a missing or unknown `format` (via `songFormat`) and a non-string `source` | Only the trusted sample songs exist. In M5 the storage task checks each song once when read (e.g. `validateSong` in `domain/songs.js`, built on `songFormat` / `songNotation`), and the view then trusts the `Song` type | 2026-11-27 |
