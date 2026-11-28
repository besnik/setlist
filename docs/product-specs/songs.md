# Songs

- **Status:** approved (Manage songs: draft)

<!-- Based on the CEO's prototype — see docs/design/prototype-reference.md. -->

## Purpose

The songbook: all the musician's songs with lyrics and chords in one place, quick to find and easy to read while playing.

## Behavior

### Song list

- Rule: the Songs screen lists all songs, sorted by title alphabetically, ignoring letter case; accented letters sort together with their base letter (`Čaj` between `Cabaret` and `Cesta`).
- Rule: each row shows the song title, the artist (or "Unknown artist" when empty) and, when the song has a key, the key as a small chip (e.g. `Am`).
- Rule: a long title or artist is shortened with an ellipsis on one line; the page never scrolls horizontally.
- Rule: the heading shows the number of songs, e.g. "4 songs" (singular "1 song"). It is the total number of songs and does not change while searching.
- Rule: given the first start of the app, when the Songs screen opens, then it shows the sample songs (see *Sample songs*).
- Rule: tapping a row opens the song in the *Song view* (M3).
- Rule: the Songs screen has an Add button (+) that opens the song form (see *Manage songs*, M5).

### Search

- Rule: a search field sits above the list. When the user types, the list is filtered immediately, without a submit button.
- Rule: a song matches when its title, artist or key contains the typed text, ignoring letter case and accents (`piesen` finds `Pieseň`). Leading and trailing spaces are ignored.
- Rule: given a search with no match, then the list area shows "No songs found." Clearing the field shows all songs again.
- Rule: the search text is kept while the app stays open; it is not remembered after a restart.

### Sample songs

- Rule: the app contains seven public-domain sample songs with chords:

  | Song | Artist | Key | Format | Notation |
  |---|---|---|---|---|
  | *Amazing Grace* | Traditional | G | `plain` | `international` |
  | *House of the Rising Sun* | Traditional | Am | `plain` | `international` |
  | *Greensleeves* | Traditional | Em | `plain` | `international` |
  | *When the Saints Go Marching In* | Traditional | C | `plain` | `international` |
  | *A od Prešova* (Slovak folk song) | Traditional | as found in the sources | `chordpro` | `german` |
  | *Tichá noc* (Slovak words of *Silent Night*) | Franz X. Gruber, Joseph Mohr | as found in the sources | `plain` | `german` |
  | *Tancuj, tancuj, vykrúcaj* (Slovak folk song) | Traditional | as found in the sources | `chordpro`, numbered verses and its refrain as the chorus | `german` |

- Rule: the four English songs stay as they are (`plain`); the sample songs are a collection that grows over time.
- Rule: the three Slovak songs are written from at least two public sources each, checked against each other, and only in a version that is free to use (a folk song, or words whose author died more than 70 years ago or is unknown and old). The sample songs have no source (CEO, 2026-11-27, for *A od Prešova*), so the source line is tested with test songs.
- Rule: the sample songs are saved as songs on the very first start; from then on they are ordinary songs that can be edited and deleted (see *Manage songs*).

### Song view *(M3)*

A stage screen: one song full screen, read while playing. The controls follow the *one tap on stage* principle (see [design guidelines](../design/guidelines.md#principles)).

**Open and close**

- Rule: given the Songs screen, when the user taps a song row, then the Song view of that song opens, scrolled to the top.
- Rule: every song has its own address, `#/song/<song id>` (e.g. `…/app/#/song/sample-amazing-grace`). Given that address is opened or reloaded, then the Song view of that song shows.
- Rule: given an address with a song id that does not exist, then the Songs screen shows and the address becomes the Songs screen address (`…/app/`).
- Rule: the user closes the Song view with one tap on the close button (×), with the browser's Back button, with the Android back gesture, or with the Escape key on a keyboard. All of them return to the Songs screen.
- Rule: given the Songs screen had a search text and was scrolled, when the user closes the Song view, then the Songs screen shows the same search text, the same filtered list and the same scroll position.
- Rule: given the Song view was opened directly by its address (no Songs screen before it), when the user taps ×, then the Songs screen shows (the app does not leave to the previous website).

**Content**

- Rule: the Song view shows the title, the artist ("Unknown artist" when empty), the key as a key chip (left out when the song has no key) and the song text.
- Rule: the song text keeps its lines and spaces as written, so a chord stays above the word it belongs to.
- Rule: a long line wraps onto the next line; the page never scrolls horizontally. How chords behave when a line wraps depends on the song's format (see *Song format*).
- Rule: a long title wraps; it is never shortened on the stage screen.
- Rule: the close button and the font size buttons stay visible at the top of the screen while the song text scrolls.

**Chord lines** (the `plain` format, see *Song format*)

- Rule: chord lines are shown bold in the chord color; all other lines are shown as lyrics.
- Rule: a line is a chord line when it contains at least one chord and every word on it is a chord or a bar mark. Words are separated by one or more spaces or tabs; spaces at the start and end of the line are ignored. An empty line, or a line of only spaces, is not a chord line.
- Rule: a chord is, in this order: a root `A`–`H` (`H` is the Central European name of B; `B` is also accepted); optionally `#` or `b`; any sequence (also none) of the qualities and extensions below, e.g. `m7`, `mi7`, `m7b5`, `7sus4`, `maj7`; optionally a slash and a bass note, which is a root with an optional `#` or `b` (`/G#`, `/Bb`, `/H`). Examples that are chords: `C`, `Am`, `Ami`, `Hmi`, `F#m`, `Bb`, `G7`, `Cmaj7`, `Dsus4`, `Asus2`, `Gadd9`, `Bdim`, `Caug`, `C+`, `Em7b5`, `E7/G#`, `D/F#`, `C/H`.
  - Qualities and extensions: `m`, `mi`, `min`, `maj`, `dim`, `aug`, `sus`, `add`, `+`, the numbers `2`, `4`, `5`, `6`, `7`, `9`, `11`, `13`, and `#` or `b` directly before a number (`7b9`, `7#5`).
  - Not chords (rare, accepted): `CM7` (capital `M` for major) and `C6/9` (a slash followed by a number). A line containing them is shown as a lyric line.
- Rule: bar marks are `|`, `||`, the repeat signs `|:` and `:|`, `%` (repeat the previous bar), `/`, `-`, a repeat count (`x2`, `2x`, `x3`, …) and `N.C.` (no chord). A line with bar marks only is not a chord line.
- Rule: a chord in parentheses, such as `(G)` or `(E7/G#)`, counts as a chord (an optional or passing chord); it is shown as written, with the parentheses. Parentheses around a word that is not a chord, such as `(chorus)`, make the line a lyric line.
- Rule: a lyric line whose words happen to look like chords only partly is a lyric line: `A man walks in` and `Am I wrong` contain words that are not chords.
- Rule: letter case matters. The root is an upper-case letter and the quality is written as listed (`Am`, `Ami`, `Cmaj7`), so lyric words such as `a`, `v`, `am`, `be` or `add` are never chords.
- Rule (accepted false positive): a lyric line made only of words that are chords, such as a line `A` or `Hm` or `E A`, is shown as a chord line. This is rare and harmless; a song where it matters can be written in `chordpro`.

**Font size**

- Rule: the Song view has two buttons, A− and A+. Each tap makes the song text 2 px smaller or bigger, from 12 px to 32 px; the default is 16 px.
- Rule: the font size changes the song text (lyrics, chords, section marks and comments) only; the title, the artist and the buttons keep their size.
- Rule: at 12 px A− is disabled, at 32 px A+ is disabled (shown faded, a tap does nothing).
- Rule: the chosen size is the same for all songs and is remembered on the device across closing the song, restarts of the app and updates.
- Rule: given the stored size cannot be read or is not a valid size, then 16 px is used. Given the browser does not allow storing it (e.g. private mode), then the buttons still work for as long as the app stays open.

**Screen stays on**

- Rule: given the browser supports it, while the Song view is shown the screen does not turn off or lock by itself.
- Rule: when the Song view is closed, the screen turns off again after the device's usual time.
- Rule: given the user switched to another app and comes back to the Song view, then the screen stays on again.
- Rule: given the browser does not support it, then the Song view works as usual and shows no message.
### Song format *(M4)*

How a song is stored and shown. Decision: [ADR 0008](../decisions/0008-song-format.md). The user chooses the format by hand when entering a song (*Manage songs*); detecting the format of a pasted text and import / export come with M8.

**Song header**

- Rule: a song has a title, an artist, a key, a text, and these header fields:
  - **Format:** `plain` ("chords over lyrics": a line of chords above each line of lyrics) or `chordpro` (chords in square brackets inside the lyrics, e.g. `[G]Amazing [C]grace`).
  - **Notation:** `international` (`B` is B, `Bb` is B flat), `german`, the Central European notation (`H` is B, `B` is B flat), or `unknown` (from M5: nobody knows; chords are shown as written).
  - **Source** (optional): the name of the website the song came from, as plain text — the domain with its ending, e.g. `akordy.sk` — and the date of import. There is no link to the original. A song typed in by hand has no source.
- Rule: the text is kept exactly as written; neither the format nor the notation ever changes it.
- Rule: lines end with a line break; `\r\n` and `\r` (Windows and old Mac line ends) count as one line break, in both formats.
- Rule: given a song whose format is missing or unknown, then it is shown as `plain` (nothing is lost: `plain` shows every line as written).
- Rule: given a song whose notation is missing or not one of the known values, then it counts as `unknown` (changed in M5, CEO 2026-11-28: the app admits it does not know rather than guess `international`; a later notation setting or transposition does not convert such a song).
- Rule: the key is written in the song's notation (`H` in a `german` song); search finds it as written.
- Rule: the notation does not change what is shown: chords are shown as written. It is stored so that a notation setting and transposition (after the MVP) know what `B` means.

**`plain` format**

- Rule: shown in the monospaced font with the chord lines detected as in the Song view (*Chord lines*).
- Rule: a long line wraps; a wrapped chord line may no longer align with its lyrics (accepted; such a song can be written in `chordpro`).
- Rule: chord-line detection knows the letter names `A`–`H` with `#` or `b` (so `H`, `B`, `F#`, `Bb` in both notations), not the German spelled names such as `Es`, `As`, `Fis`, `Cis` (rare in guitar songbooks; a line with them is shown as lyrics). The sample songs use only letter names.

**`chordpro` format** — a subset of the open [ChordPro](https://www.chordpro.org) format.

- Rule: text in square brackets is a chord, e.g. `[G]`, `[F#m7]`, `[H7]`, `[(D)]`, `[N.C.]`. It is shown as written, above the text that follows it, in the chord color. Its content is not checked against the chord pattern.
- Rule: given `[` without a closing `]` on the same line, then the rest of the line is shown as lyrics, brackets included. An empty `[]` is not shown.
- Rule: the lyrics are shown in the body font; the brackets and the chords are not part of the lyric line.
- Rule: a chord inside a word stays above its syllable: `Ama[C]zing` shows `C` above `zing`.
- Rule: given a chord is wider than the syllable below it, then a small gap follows the chord, so two chords never touch or overlap; the syllable stays where it is and the rest of the word moves right.
- Rule: a line with chords only, such as `[G] [C] [D]`, shows the chords in one row with a gap between them.
- Rule: a line without chords has no chord row (it takes the height of one lyric line). The same holds for each wrapped row of a line: a row with no chord above any of its words has no chord row.
- Rule: a long line wraps between words. When it wraps, each chord stays above its syllable, and a word with chords inside it is not split. The page never scrolls horizontally: only a word (with its chords) wider than the whole line may wrap between its pieces, and a single piece wider than the line may break inside its text (both rare).
- Rule: an empty line keeps its height (a gap between verses).
- Rule: a directive is a line of the form `{name}` or `{name: value}` (spaces around it are ignored; the name ignores letter case):
  - `{start_of_verse}` or `{sov}` starts a verse, `{end_of_verse}` or `{eov}` ends it. `{start_of_chorus}` or `{soc}` starts the chorus, `{end_of_chorus}` or `{eoc}` ends it. Verses and the chorus are **sections**.
  - A section is marked by a short **mark** in a narrow margin on the left, level with the lyrics of its first line: verses are numbered automatically `1.`, `2.`, `3.` … in the order they appear; the chorus mark is `R:`. In a song with sections all lines start at the same place to the right of this margin, so the marks stand out like in a printed songbook (CEO, 2026-11-27, variant A of the preview). No other decoration (no border, no background).
  - A value replaces the mark, shown as written: `{sov: 3a}` shows `3a`, `{soc: Ref.}` shows `Ref.`. A verse with its own mark does not count for the numbering.
  - `{chorus}` on its own line means "sing the chorus here": it shows only the chorus mark `R:` on a line of its own (or its value, `{chorus: Ref.}`), not the chorus text again.
  - Lines outside any section (e.g. an intro) have no mark; they also start to the right of the margin. A song without sections has no margin.
  - `{comment: …}` or `{c: …}` shows its value as a comment line (e.g. `Repeat 2×`, `Capo 2`), muted, without a chord row.
  - Any other directive (e.g. `{title: …}`, `{key: …}`, `{start_of_tab}`) is kept in the text but not shown.
- Rule: sections do not nest. A section ends at its end directive, at the start of the next section, or with the song. A start directive inside a section of the same kind is not shown and does not start a new one; an end directive without its start is not shown.
- Rule: a line that starts with `#` is a ChordPro comment for the writer and is not shown.
- Rule: a line that looks like a directive but is not closed with `}` is shown as lyrics.
- Rule: a directive line, a hidden directive and a `#` line take no space (they do not leave an empty line). A `{c:}` with an empty value is not shown.

**Source line**

- Rule: given a song with a source, then the end of the Song view shows a quiet line "Source: <source>", e.g. "Source: akordy.sk". The source is plain text, shown as written (spaces around it ignored); it is never a link, even when it looks like an address.
- Rule: given the source is empty or only spaces, then there is no source line.
- Rule: a long source wraps; it never widens the page.
- Rule: the date of import is stored but not shown.
- Rule: given a song without a source, then there is no source line.

### Manage songs *(M5)*

The musician's own songbook: type in or paste a song, save it, edit it, delete it — and after closing the app everything is still there. Decision on the storage: [ADR 0009](../decisions/0009-song-storage.md). Scope and the CEO's agreements: [M5](../plan/milestones/M5-manage-songs.md).

**Saved on the device**

- Rule: songs are saved on the device, in the browser's storage of the app. Given the user added, edited or deleted songs, when the app is closed and opened again (also after an update of the app), then the songs are exactly as the user left them.
- Rule: songs never leave the device; nothing is sent anywhere.
- Rule: given the very first start (nothing stored yet), then the seven sample songs are saved as songs. From then on they are ordinary songs: they can be edited and deleted, and they never come back by themselves — not after the user deleted them, not after an update. (Only when the browser's data of the app is cleared does the app start again as on the very first start.)
- Rule: every song has an id made at random when it is added (it never changes, and songs from two devices never get the same id), and it remembers when it was added and when it was last edited. The sample songs keep their ids, so their addresses stay the same.
- Rule: when a song is saved, the app asks the browser to keep its data for good (persistent storage), so the browser does not delete it when the device runs low on space. Whatever the browser answers, nothing is shown.
- Rule: given the browser does not allow storage at all (e.g. some private modes), then the Songs screen shows the sample songs and reading works as before; saving or deleting shows the failure message (see *Save fails*).
- Rule: given a stored song is damaged (a field has the wrong type or is longer than its maximum, or the id is missing), then it is left out of the app and stays in storage untouched; a warning is logged, without the song's content. Given only its format or notation is missing or not a known value, then the song is shown with the fallbacks of *Song format* (`plain`, `unknown`).

**Add**

- Rule: the Songs screen has an Add button (+). Tapping it opens the empty song form, address `#/new`, with the format `plain` and the notation `german` (the app's users are mostly Slovak and Czech musicians; CEO, 2026-11-28). A stored song without a valid notation counts as `unknown` (see *Song format*).
- Rule: given a title is filled in, when the user taps Save, then the song is saved and the Song view of the new song opens in place of the form. The form is not left in the history: Back, × and Escape in that Song view go to the Songs screen, as if the song had been opened from the list.
- Rule: when the user taps Cancel, the form closes without saving and the previous screen shows (see *Unsaved changes*).

**Song form** (one screen for add and edit)

- Rule: the form has these fields, in this order (a "character" in a maximum is one UTF-16 code unit, the length a browser counts — an emoji counts as 2):

  | Field | Kind | Required | Maximum | Notes |
  |---|---|---|---|---|
  | Title | one line | yes | 200 characters | |
  | Artist | one line | no | 200 characters | empty shows "Unknown artist" as before |
  | Key | one line | no | 20 characters | e.g. `Am`; written in the song's notation; not checked against the chord pattern |
  | Format | one of two | yes | — | "Chords over lyrics" (`plain`) or "ChordPro" (`chordpro`); chosen by hand |
  | Notation | one of three | yes | — | "International — B, Bb" (`international`), "German — H, B" (`german`) or "Not sure — chords shown as written" (`unknown`); the stored values as in ADR 0008; chosen by hand |
  | Text | many lines | no | 50 000 characters | lyrics with chords; a song may have no text yet |
  | Source | one line | no | 100 characters | plain text, e.g. `akordy.sk`; empty means no source |

- Rule: the text is saved exactly as typed or pasted: every space, tab, empty line (also at the start and the end) and character stays. Nothing in it is removed or replaced. The one exception is made by the browser in every text field: line breaks are saved as `\n` (a pasted `\r\n` becomes `\n`).
- Rule: when the song is saved, the one-line fields (title, artist, key, source) are cleaned: spaces at the start and the end are removed, a tab or a line break inside becomes one space, and invisible control characters are removed (the ASCII control characters, the zero-width space and the byte order mark, and the marks that change the text direction). Letters, accents, emoji and all visible characters stay.
- Rule: given the title is empty or only spaces, when the user taps Save, then nothing is saved, the message "Enter a title." shows below the title field and the field gets the focus.
- Rule: given a field is longer than its maximum (after cleaning), when the user taps Save, then nothing is saved and the field shows "Too long: 230 characters, at most 200." (with the field's numbers) below it; the first such field gets the focus. Typing and pasting are never cut off, so no text is lost silently.
- Rule: the format (two values) and the notation (three values) are radio choices; only those values can be chosen and saved. Given a song with the notation `unknown` (e.g. imported), then the edit form has "Not sure" selected.
- Rule: the text field uses the monospaced font and does not wrap lines (a long line scrolls sideways inside the field), so a line of chords stays above its lyrics while typing. The page itself never scrolls sideways.
- Rule: the form does not correct, capitalize or spell-check what is typed in the text, key and source (`Ami` stays `Ami`).
- Rule: a source typed by hand does not set the date of import (that comes with import, M8); editing a song keeps its date of import unchanged.
- Rule: two songs may have the same title and artist (versions of one song, a song from a friend); nothing warns about it.

**Help next to a field**

- Rule: the labels Format and Notation each have a small "?" button. Tapping it opens a short explanation with an example (texts below); it closes with its Close button, with Escape or with a tap outside it. The form stays as it was.
- Rule: help for Format:
  - Title: "Format"
  - "**Chords over lyrics** — a line of chords above each line of lyrics, as on most song websites:" then the example `G           C        G` / `Amazing grace, how sweet`
  - "**ChordPro** — chords in square brackets, right before the syllable they belong to. Chords stay on their syllables when a line wraps on a small screen:" then the example `[G]Amazing [C]grace, how [G]sweet`
  - "In ChordPro, `{sov}` and `{eov}` mark a verse, `{soc}` and `{eoc}` the chorus, and `{c: Capo 2}` adds a comment."
- Rule: help for Notation:
  - Title: "Notation"
  - "Which letter means which chord in this song:"
  - "**International** — `B` is B, `Bb` is B flat. Used in English songbooks."
  - "**German** — `H` is B, `B` is B flat. Used in Slovak, Czech and German songbooks."
  - "**Not sure** — choose this when you do not know. Chords are always shown as written."
  - "The app shows chords as written. The notation tells later features (such as transposing) what `B` means."
- Rule: the help is plain text and examples written by us; the "?" button with its explanation is one component that takes its title and content from the screen that uses it.

**Edit**

- Rule: the Song view has an Edit button. Tapping it opens the song form filled with the song, address `#/song/<song id>/edit`.
- Rule: given changes, when the user taps Save, then the changes are saved, the time of the last edit is updated, and the Song view of the song shows the changes. The form is not left in the history: given Songs screen → Song view → Edit → Save, then ×, Escape or Back in the Song view go to the Songs screen (not to the song again).
- Rule: given no changes, when the user taps Save, then the Song view shows again and the time of the last edit does not change. The comparison is made after cleaning (a space added at the end of the title alone is no change).
- Rule: given an edit address of a song that does not exist (e.g. deleted), then the Songs screen shows and the address becomes the Songs screen address, as for an unknown song.
- Rule: the bottom of the edit form shows a muted line with the short id and the dates, e.g. `ID 3f2a91 · added 28 Nov 2026 · edited 2 Dec 2026`:
  - The short id is the first six characters of the id; an id that was not made at random (the sample songs) is shown whole, e.g. `ID sample-amazing-grace`.
  - Dates are in English, day, short month and year, in the device's time zone. "· edited …" is left out while the song was never edited after it was added.
  - Only the edit form shows this line: not the add form, not the Song view (it keeps only the source line), not the song list.

**Delete**

- Rule: the bottom of the edit form has a Delete song button in the danger color. Tapping it asks: title "Delete “<song title>”?", text "This cannot be undone.", buttons Cancel and Delete.
- Rule: Delete removes the song from the device and shows the Songs screen. Cancel (or Escape, or a tap outside the question) closes the question and leaves the form as it was.
- Rule: after a delete, the song is gone everywhere: an address of it (Song view or edit form, e.g. by Back) shows the Songs screen. There is no trash and no undo.
- Rule: given there are no songs at all, then the Songs screen shows "0 songs" and, instead of the list, the empty state "No songs yet. Tap + to add one." (also while a search text is typed).

**Unsaved changes**

- Rule: the form has unsaved changes when any field differs from what the form showed when it opened (for the add form: empty fields, `plain`, `german`). Typing and then removing the same text leaves no changes.
- Rule: given unsaved changes, when the user taps Cancel, presses Escape (with no question or help open), taps Back or uses the Android back gesture, then the app asks: title "Discard changes?", buttons Keep editing and Discard. Keep editing closes the question and the form stays exactly as it was (the address stays the form's). Discard leaves the form without saving, to where the user was going.
- Rule: given no unsaved changes, leaving the form asks nothing; Escape (with no question or help open) then does what Cancel does.
- Rule: given a help or a question is open, when the user taps Back or uses the Android back gesture, then it closes and the screen then acts on Back as above (for a form with unsaved changes: the Discard question). Given the Discard question is open, Back counts as Keep editing.
- Rule: given unsaved changes, when the user reloads the page or closes the tab or window, then the browser's own question ("Leave site?") is shown, where the browser offers one (Safari on iPhone does not — accepted).

**Save fails**

- Rule: given saving fails (the device's storage is full, the browser does not allow storage, or the app was updated in another tab), then the form stays open with everything typed, and a message shows at the top of the form: "Could not save the song. The device's storage is full or not available. Your text is still here — copy it somewhere safe." The message stays until the next Save; nothing typed is lost.
- Rule: given deleting fails for the same reasons, then the question closes, the form stays, and the message reads "Could not delete the song." with the same explanation.
- Rule: given the song was deleted in another tab while its edit form is open, when the user taps Save, then the song is saved again (nothing typed is lost).

**The app was updated in another tab**

- Rule: given the app is open in a tab and a newer version of the app that changes the stored data starts in another tab, then the old tab stops using the storage and shows a bar at the top: "The app was updated." with one button, Reload, which reloads the tab. An open form keeps its text on screen so it can be copied; a Save there fails with the message of *Save fails*.
- Rule: changes of the songs in another tab of the same version need nothing: each screen reads the songs when it opens (a song added in another tab shows in the list the next time the Songs screen opens).

**Security** — every field (title, artist, key, source, text) is user input that may hold an attack.

- Rule: every field is shown as plain text everywhere — the Songs screen, the Song view in both formats (also chords and directives of a `chordpro` song), the source line, the form, the delete question: markup such as `<b>`, `<script>…</script>` or `<img src=x onerror=…>` shows exactly as typed, and nothing in it runs or changes the look.
- Rule: the text is saved as written; there is no "sanitizer" that removes characters. Safety comes from showing every value as text (only the safe rendering writes HTML into the page).
- Rule: each field is checked for its type and its maximum length when it is saved and again when it is read from storage; the format and the notation take only their allowed values (see *Saved on the device* for what happens to a damaged song).
- Rule: as a second line of defense, the app runs only its own scripts: a Content Security Policy forbids scripts from other sites, inline scripts and plugins.

**Good to know**

- Rule: the songs live only on this device and in this browser until backup arrives with import and export (M8) — keep your main songbook elsewhere too. On iPhone, Safari and the app on the home screen keep separate songs, and Safari may delete the data of a website not added to the home screen after about seven days without use ([install-offline.md](install-offline.md#good-to-know-affects-m5-and-m8)). The README says so; the app shows nothing about it in M5.

## UX and visual design

A browse screen. Tokens and components: [design guidelines](../design/guidelines.md). The page and column come from the [app shell](app-shell.md#ux-and-visual-design).

### Songs screen (M1)

Phone, 320 px wide (288 px column):

```
┌────────────────────────────────┐
│                                │  24 px top padding
│ Songs                          │  page header: title 28 px display 700
│ 4 songs                        │  count 14 px muted, 4 px below
│                                │  16 px
│ ┌────────────────────────────┐ │
│ │ Search title, artist, key  │ │  search field, 48 px high
│ └────────────────────────────┘ │
│                                │  16 px
│ ┌────────────────────────────┐ │
│ │ Amazing Grace         ┌─┐  │ │  song row, about 66 px high
│ │ Traditional           │G│  │ │
│ └───────────────────────└─┘──┘ │
│ ┌────────────────────────────┐ │  8 px gap
│ │ Greensleeves         ┌──┐  │ │
│ │ Traditional          │Em│  │ │
│ └──────────────────────└──┘──┘ │
│ ┌────────────────────────────┐ │
│ │ House of the Rising… ┌──┐  │ │  long title: one line, ellipsis
│ │ Traditional          │Am│  │ │
│ └──────────────────────└──┘──┘ │
│ ┌────────────────────────────┐ │
│ │ When the Saints Go…   ┌─┐  │ │
│ │ Traditional           │C│  │ │
│ └───────────────────────└─┘──┘ │
│                                │  24 px bottom padding
└────────────────────────────────┘
 16 px gutters
```

No match:

```
│ ┌────────────────────────────┐ │
│ │ xyz                        │ │
│ └────────────────────────────┘ │
│ ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐ │
│                                │  empty state: dashed box,
│ │     No songs found.        │ │  "No songs found." centered, muted
│                                │
│ └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘ │
```

- **Order, top to bottom:** page header, search field, then the list or the empty state.
- **Page header:** "Songs" and the count line (small, muted), e.g. "4 songs" or "1 song".
- **Search field:** a native search input with the placeholder "Search title, artist, key". It is not focused on start, because the phone keyboard would cover the list.
- **Song row:** title, artist and key chip as specified in the guidelines; the whole row opens the Song view.
  - Title and artist stay on one line and end with an ellipsis.
  - The chip never shrinks. When a song has no key, the row has no chip and the text takes the full width.
- **Empty state:** the "No songs found." component. It replaces the list while a search has no match.
- **Scrolling:** the whole page scrolls; the header and the search field scroll with the list (no sticky parts).
- **Wide screens:** the same layout in the 720 px column. Rows stay full column width; there is no grid of cards.

The exact values (spacing, sizes, row states) live in `app/styles/songs-screen.css`, `app/styles/components.css` and the [design guidelines](../design/guidelines.md).

### Song view screen (M3)

A stage screen ([guidelines](../design/guidelines.md#principles)): content first, few large controls, no tab bar. Phone, 320 px wide (288 px column):

```
┌────────────────────────────────┐
│ ┌──┐               ┌──┐  ┌──┐  │  stage top bar, sticky: 73 px
│ │× │               │A−│  │A+│  │  (8 + 56 + 8 px padding + 1 px border)
│ └──┘               └──┘  └──┘  │
├────────────────────────────────┤  1 px --color-line
│                                │  24 px
│ House of the Rising            │  title: 28 px display 700, wraps
│ Sun                            │
│ Traditional  ┌──┐              │  artist small muted + key chip,
│              │Am│              │  4 px below the title, 8 px gap
│              └──┘              │
│                                │  24 px
│    Am      C        D          │  chord line: mono 700, chord color
│ There is a house in New        │  lyric line: mono 400, ink
│ Orleans                        │  (wraps on a 320 px phone at 16 px)
│    Am       C         E        │
│ They call the Rising Sun       │
│ …                              │  24 px bottom padding
└────────────────────────────────┘
```

- **Page:** the same column, gutters and background as every screen ([app shell](app-shell.md#ux-and-visual-design)), but the bar sits at the very top of the screen from the start. The Songs screen is replaced, not covered.
- **Stage top bar:** sticky at the top, full column width, opaque background (the text scrolls under it unseen), a thin line below it. Left: the close button. Right: A− and A+. Nothing in the middle — the title lives in the song header, so it can wrap.
- **Stage button:** round, big (the stage touch size, `--touch-stage`), on the surface color, no border. Close is a drawn ×; A− / A+ use a real minus sign (−). Each has a name shown as a tooltip with a mouse — "Close", "Smaller text", "Larger text". Pressed, keyboard focus and disabled (faded) states.
- **Song header:** the title wraps (never shortened); below it the artist (small, muted) and the key chip. The header scrolls with the text.
- **Song sheet:** directly on the background, no card. The mono font at the user's size; spaces kept, long lines wrap and never widen the page. Lyric lines regular in the ink color, chord lines bold in the chord color. An empty line keeps its height (a gap between verses).
- **Landscape phone and tablet / desktop:** the same layout; in the 720 px column the bar spans the column only.

The exact values (sizes, paddings, line height, states) live in `app/styles/components.css` and `app/styles/song-screen.css`; the tokens in the [design guidelines](../design/guidelines.md).

### Song sheet by format and source line (M4)

The Song view screen stays as in M3 (bar, header, sheet); only the sheet changes with the song's format, and the source line is added at the end.

`chordpro` sheet, phone 320 px wide (288 px column), 16 px:

```
│ G         C           G        │  chord row: mono 700, chord color
│ Words of a long line of        │  lyric row: body 400, ink
│   D                            │  (illustration, not a real song)
│ the song                       │  wrapped between words; D stays on its syllable
│                                │  empty line: one lyric line high
│    G         C       G         │
│1.  Words of the first verse    │  mark: mono 700, 0.8 em, muted,
│    D            G              │  in the margin; all lines start
│    and its second line         │  right of the margin
│                                │
│    C         G                 │
│R:  Words of the chorus         │  chorus mark "R:"
│    D           G               │
│    second chorus line          │
│                                │
│R:                              │  {chorus}: the mark only
│                                │
│ Repeat 2×                      │  comment: body 400, muted, no chord row
│                                │  24 px
│ Source: akordy.sk              │  source line: small, muted, plain text
└────────────────────────────────┘
```

- **`plain` sheet:** the sheet of the Song view screen above.
- **`chordpro` sheet:**
  - Each line is a row of **pieces**: a chord (above) and the text that follows it (below), stacked; text before the first chord is a piece without a chord. A piece is at least as wide as its chord plus a small gap, so chords never touch.
  - Chords use the mono font and chord color of the `plain` chords, so chords look the same in both formats (no new font file); lyrics use the body font.
  - Pieces of one word stay together; lines wrap between words. Words sit on a common lyric baseline, and a row has a chord row only when one of its words has a chord.
  - Section mark (`1.`, `R:`): smaller, bold mono in the muted color, so it does not draw attention and is never mistaken for a chord (CEO). Level with the lyric row of the section's first line.
  - Margin: as wide as the longest mark in the song plus a gap — small on phones, roomier from the 600 px breakpoint of the page gutter.
  - Comment: body font, muted.
- **Source line:** small, muted, after the sheet; plain text (not a link, not focusable); wraps anywhere, scrolls with the sheet and does not change with the font size.

The exact values (sizes, gaps, line heights, custom properties) live in `app/styles/components.css` and `app/styles/song-screen.css`.

### Manage songs (M5)

The song form is a **browse screen** (full attention, before or between gigs): touch targets ≥ `--touch-min` (44 px), the usual type scale. New shared components (pill button, round add button, text field, radio choice, help button, dialog, notice bar) are in the [design guidelines](../design/guidelines.md#components-m5).

**Songs screen: Add button and empty songbook**

```
┌────────────────────────────────┐
│ Songs                    ┌──┐  │  page header: heading and count left,
│ 7 songs                  │+ │  │  Add button right (round 44 px, accent),
│                          └──┘  │  centered on the header's height
│ ┌────────────────────────────┐ │
│ │ Search title, artist, key  │ │
│ └────────────────────────────┘ │
│ ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐ │  no songs at all: the empty state reads
│   No songs yet. Tap + to add   │  "No songs yet. Tap + to add one."
│ │ one.                       │ │
│ └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘ │
```

- The page header becomes a row: the heading and the count on the left (as before), the Add button on the right with a `--space-3` gap. The button's name (tooltip with a mouse) is "Add song". It scrolls with the page, like the header.
- The empty songbook uses the existing empty state component with the new text.

**Song view: Edit button**

```
┌────────────────────────────────┐
│ ┌──┐ ┌──┐          ┌──┐  ┌──┐  │  stage top bar: × and Edit left,
│ │× │ │✎ │          │A−│  │A+│  │  A− and A+ right; all 56 × 56 px
│ └──┘ └──┘          └──┘  └──┘  │
├────────────────────────────────┤
```

- Edit is a stage button (56 px) next to the close button, `--space-2` gap: a pencil drawn as an inline SVG, 24 px, 2 px stroke, `currentColor`; name "Edit song". Close and Edit both leave the view, so a mis-tap between them is harmless; the font size buttons stay apart on the right.

**Song form screen**

Phone, 320 px wide (288 px column). Edit form shown; the add form has the heading "New song" and no id line and no Delete button.

```
┌────────────────────────────────┐
│ ┌──────┐  Edit song   ┌──────┐ │  form bar, sticky: 61 px
│ │Cancel│              │ Save │ │  (8 + 44 + 8 px padding + 1 px border)
│ └──────┘              └──────┘ │  Cancel: pill; Save: pill, accent
├────────────────────────────────┤
│ ┃ Could not save the song. The │  failure message (only after a failed
│ ┃ device's storage is full …   │  save): 4 px danger bar on the left
│                                │  24 px
│ Title                          │  label: small 600, ink
│ ┌────────────────────────────┐ │  text field: 48 px high
│ │ Amazing Grace              │ │
│ └────────────────────────────┘ │
│ Enter a title.                 │  field message: small, danger (only on error)
│                                │  16 px between fields
│ Artist                         │
│ ┌────────────────────────────┐ │
│ │ Traditional                │ │
│ └────────────────────────────┘ │
│ Key                            │
│ ┌──────────┐                   │  key field: 120 px wide
│ │ G        │                   │
│ └──────────┘                   │
│ Format (?)                     │  label + help button
│ (•) Chords over lyrics         │  radio choices: one per row, 44 px high
│ ( ) ChordPro                   │
│ Notation (?)                   │
│ ( ) International — B, Bb      │
│ (•) German — H, B              │
│ ( ) Not sure — chords shown as │  label wraps; the row grows
│     written                    │
│ Text                           │
│ ┌────────────────────────────┐ │  text area: mono 16 px, line height 1.5,
│ │G         C        G        │ │  no wrapping (scrolls sideways inside),
│ │Amazing grace, how sweet th…│ │  18 lines high (~456 px), the user may
│ │…                           │ │  make it taller
│ └────────────────────────────┘ │
│ Source                         │
│ ┌────────────────────────────┐ │
│ │ akordy.sk                  │ │
│ └────────────────────────────┘ │
│                                │  24 px
│ ID 3f2a91 · added 28 Nov 2026  │  id line: small, muted, wraps
│ · edited 2 Dec 2026            │
│                                │  32 px
│ ┌────────────────────────────┐ │  Delete song: pill, full width,
│ │        Delete song         │ │  danger text and border
│ └────────────────────────────┘ │
│                                │  24 px bottom padding
└────────────────────────────────┘
```

- **Page:** the same column, gutters and background as every screen; like the Song view, **no top padding** above the bar, which sits at the very top.
- **Form bar:** sticky (`position: sticky; top: 0`), `--color-bg`, 1 px `--color-line` bottom border, padding `--space-2` 0. Left Cancel (pill), right Save (accent pill), the heading ("New song" / "Edit song", `row` step, ink) centered between them, one line with an ellipsis. The bar stays visible while the page scrolls and while the phone keyboard is open, so Save is always one tap away.
- **Fields:** label above its field, `--space-1` between them, `--space-4` between fields. Text fields use the text field component; the key field is 120 px wide (20 characters fit when scrolled; a key is short). The field message sits `--space-1` below its field.
- **Radio choices:** the native radio button with its label, each row at least 44 px high (the whole row is the target), `accent-color: var(--color-accent)`. Vertical, because "International — B, Bb" does not fit half of a 288 px column.
- **Text area:** the text field component, but `--font-mono` 16 px, line height 1.5, `white-space: pre` (`wrap="off"`), 18 rows, `resize: vertical`, padding `--space-3`. No spell-check, autocorrect or autocapitalize.
- **Failure message:** at the top of the form, below the bar: `--color-surface` background, 4 px `--color-danger` bar on the left, `--radius-card`, padding `--space-3` `--space-4`, `body` text in ink. The screen scrolls to it when it appears.
- **Id line:** `small`, `--color-muted`, `--space-5` above it, wraps.
- **Delete song:** a pill button at full column width, `--color-surface` background, `--color-danger` text and a 1 px `--color-danger` border, `--space-6` above it, so it is far from the fields and from Save.
- **Delete question and Discard question:** the dialog component. Delete: title "Delete “Amazing Grace”?" (the title wraps, never shortened), text "This cannot be undone.", buttons Cancel (pill) and Delete (danger pill). Discard: title "Discard changes?", buttons Keep editing (pill) and Discard (danger pill). The safe choice comes first and gets the focus when the question opens.
- **Help:** the dialog component with the help title, the text (`body`) and the examples (`--font-mono` 14 px on `--color-bg`, `--radius-chip`, padding `--space-2` `--space-3`, `white-space: pre`, scrolls sideways inside if needed), and one Close button (pill).
- **The app was updated:** the notice bar at the top of the window, above every screen.
- **Landscape phone** (640 × 360): the same layout; with the keyboard open little of the form shows. The sticky bar should keep Save and Cancel visible while the keyboard is open — best effort: iPhone Safari moves the visible area with the keyboard, so the CEO checks it on a phone. A dialog is at most 85 % of the screen height in both variants; its content scrolls inside.
- **Tablet / desktop:** the same layout in the 720 px column; the dialogs are centered cards (see the guidelines).

**Self-check**

| Rule | Check |
|---|---|
| Form bar fits a 320 px phone | Cancel ≈ 6 letters × 8.5 px + 32 px ≈ 83 px; Save ≈ 70 px; heading "Edit song" ≈ 80 px; 83 + 70 + 2 × 8 gap = 169 px, 119 px left for the heading ≥ 80 px. A longer heading ends with an ellipsis. |
| Touch targets ≥ 44 px | Pills 44 px high; radio rows ≥ 44 px; the "?" help button has a 44 × 44 px target around its 24 px circle; Add 44 px; Edit 56 px. |
| Song view bar fits 320 px | 4 × 56 + 2 × 8 = 240 px ≤ 288 px; 48 px free between Edit and A−. |
| No sideways scroll of the page | Fields are full column width (the key 120 px); the text area scrolls inside itself; titles in dialogs and the id line wrap. |
| No zoom on iPhone when a field gets focus | All fields 16 px or larger. |
| Text is never lost | Typing and pasting are not cut off (no `maxlength`); a failed save keeps the form. |
| Save and Add readable | Filled accent buttons use `--color-accent-fill` (light `#c2410c`: white text 5.2 : 1; dark `#ff7a4d`: dark text 7.4 : 1), not the lighter accent (3.8 : 1 with white). |
| Danger color readable | `--color-danger` on `--color-surface`: about 5.2 : 1 light, about 6.2 : 1 dark; on `--color-bg` about 4.7 : 1 light, 6.8 : 1 dark. On-color text on the danger and accent pills: see the guidelines. |
| Delete far from Save | Save is in the bar at the top, Delete at the very end of the form, below the id line, with 32 px above it. |
| Portrait and landscape, phone to desktop | Nothing depends on the width except the dialog (bottom sheet below 600 px, centered card from 600 px); both are at most 85 % of the screen height with inner scrolling, so the help fits a 640 × 360 phone. |

## Notes for Design / Engineering

Song list (M1): the `Song` type, the fixed sort order and the accent-insensitive search are in `domain/songs.js`; the song repository is described in [ARCHITECTURE.md](../../ARCHITECTURE.md).

Song view (M3): routing, the screens, the settings repository and the screen lock are described in [ARCHITECTURE.md](../../ARCHITECTURE.md).

Song format (M4): the code (`Song` type in `domain/songs.js`, the readers in `domain/`, the sheets in `ui/components/`) is described in [ARCHITECTURE.md](../../ARCHITECTURE.md).

Manage songs (M5):

- **Storage:** [ADR 0009](../decisions/0009-song-storage.md) — IndexedDB used directly, database `setlist`, version 1, one store `songs` (key `id`). Records have exactly the `Song` shape. The sample songs are written in the upgrade from no database only. The data version is the database version; `versionchange` → close and tell the app. `navigator.storage.persist()` after a successful save when `navigator.storage.persisted()` is false (feature-detect; ignore the answer).
- **Song fields:** the `Song` type gains `createdAt` and `updatedAt` (ISO date-time strings from `new Date().toISOString()`); new songs get `crypto.randomUUID()` (a secure context: `https` or `localhost`; the dev server's LAN address is not one — note for testing on a phone). The form never sets `importedAt`.
- **Where the code goes:**
  - `domain/song-fields.js` (new) — the limits (domain constants), `cleanLine(value)` (trim, tab / line break → space, control characters removed), `songFieldErrors(fields)` (required title, maximum lengths, allowed format and notation → a list of `{ field, message }`), and `validateSong(record)` → `Song | null` (types, lengths, non-empty id, ISO dates; unknown format / notation → the M4 fallbacks). One job: the rules of a song's fields. Pure, unit tests with every rule above. `domain/songs.js` keeps the type, order and search.
  - `data/database.js` (new) — the only code that touches IndexedDB: open, upgrade (seed), `versionchange`, promise wrappers for requests and transactions, `onOutdated(callback)`. The expected failures (`QuotaExceededError`, `SecurityError`, `InvalidStateError` after close, a refused open) reach callers by their `error.name`, per ADR 0007.
  - `data/song-repository.js` — `listSongs()` and `getSong(id)` (every record through `validateSong`), `addSong(fields)` → `Song`, `updateSong(id, fields)` → `Song` (a `put`, so a song deleted in another tab is saved again), `deleteSong(id)`. When storage is not allowed, `listSongs` / `getSong` fall back to the sample songs in memory and the writes reject.
    - The data layer cannot import `ui/log.js`, so the warning about a damaged record is logged by the caller: e.g. the repository also returns how many records it skipped, and the screen logs that number (no content). The task picks the smallest form and records it in ARCHITECTURE.md.
  - `data/sample-songs.js` — unchanged data; its header comment says they seed the first start.
  - `ui/routes.js` — routes `{ screen: 'new-song' }` for `#/new` and `{ screen: 'edit-song', id }` for `#/song/<id>/edit`; `newSongHash`, `editSongHash(id)`. Unit tests.
  - `ui/router.js` — two additions:
    - **History state** (with T-042): the router writes `{ index, from }` into `history.state` of every entry it shows (`index` counts entries of this app run; `from` is the screen before it), so `navigation.from` is right again after Back and Forward. A new `navigation.replace(hash)` replaces the current entry and keeps its `from`. Add: Save → `replace(songHash(id))` (the Song view's `from` stays `songs`, so × goes back). Edit: Save → `back()` when the form was opened from this song's Song view, else `replace(songHash(id))`. E2e: Songs → Song → Edit → Save → × / Back / Escape → Songs; Songs → + → Save → × / Back → Songs.
    - **Leave guard** (T-045): the shown screen may answer whether it can be left (asynchronously, after its question). On a `hashchange` away from a guarded screen, the router computes the move from `history.state.index` (an entry without state is a typed address: one step forward), restores the form's entry with `history.go(-delta)` while ignoring the `hashchange` that causes, shows the question, and on Discard repeats the move (`history.go(delta)`, or the typed address) with the guard off. `beforeunload` while the screen says unsaved. Tests: Cancel, Escape, Back, the Android back gesture (`page.goBack()`), a typed address, Keep editing and Discard, with and without changes.
  - `ui/screens/song-form-screen.js` (new) — one screen for add and edit (`load` returns the song or the empty draft; `null` for an unknown id): reads the fields, unsaved-changes state, Save (errors from `songFieldErrors`, then the repository), Delete, the failure message, the questions. The text area's value is set and compared as the browser normalises it (`\n` line breaks); the view writes the text so that a leading empty line survives the HTML parser (a newline right after `<textarea>`, or the value set by property) — tested with a text that starts and ends with empty lines.
  - `ui/views/song-form-view.js` (new) — pure: form state → HTML (fields with values, messages, radio choices, help buttons with their content, id line, Delete). The id line (short id and `Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })`) is a small function here, unit-tested with fixed dates.
  - `ui/components/help-button.js` (new) — the "?" button and its dialog; takes `{ id, title, content }` from outside (`content` is an `html` template); no options for the future.
  - `ui/components/dialog.js` (new) — the dialog markup (title, content, buttons) used by the help, delete and discard questions.
  - `ui/dialogs.js` (new) — the side effects of dialogs: open with `showModal()`, close, close on a tap outside (the click target is the `<dialog>` for its padding too, so compare the click position with the dialog's rectangle), return the focus, resolve a question with the chosen button, close on Back (Chrome does it by itself, Safari does not: the router tells the open dialog first). Native `<dialog>` (Escape closes it by itself; the screen's Escape key is not handled while a dialog is open).
  - `ui/update-notice.js` (new) — shows the notice bar "The app was updated." with Reload; `main.js` wires `onOutdated` from `data/database.js` to it (wiring only).
  - `ui/views/songs-view.js` — Add button in the header, the "No songs yet" empty state. `ui/views/song-view.js` — Edit button (`EDIT_ICON` in `ui/components/stage-button.js`), and it drops its own repairs of bad data (`songFormat`, the `source` type check): it trusts the `Song` type (tech debt entry removed).
  - `ui/screens/song-screen.js` — the Edit action; nothing else.
  - Styles: `styles/song-form-screen.css` (new, the form screen); `styles/components.css` — pill button, round add button, text field, radio choice, help button, dialog, notice bar, failure message; `styles/tokens.css` — `--color-danger`, `--color-on-accent`, `--color-accent-fill`, `--radius-dialog`. `index.html` loads the new stylesheet.
  - `index.html` — the Content Security Policy as a `<meta http-equiv>` (GitHub Pages cannot set headers): `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'`. `'unsafe-inline'` for styles only, because the sheets set `--sheet-size` and `--mark-chars` in a `style` attribute (numbers made by our code); scripts stay strict, which is what stops an attack. `frame-ancestors` cannot be set in a meta tag (accepted). Check that the service worker, the manifest, the fonts and the e2e test helpers (`addInitScript`) still work, that the meta tag comes before the module script, and that the offline e2e server serves the same `index.html`.
  - Every new file goes into the offline list (`app/sw.js`); every change to `app/` needs a new VERSION.
- **Fits the architecture:** yes — storage only in `data/`, rules of the fields in `domain/`, one new screen with its pure view, shared dialogs as components plus one side-effect module. The router gains one mechanism (leave guard) that M6 (setlist form) reuses. No new dependency; ADR 0009 for the storage. ARCHITECTURE.md: storage, routes, leave guard, dialogs, CSP, updated with the tasks.
- **No input "sanitizer":** escaping on output (`ui/html.js`) is the defense; `cleanLine` is a clean-up of one-line fields, not a security filter.
- **Tests:**
  - Unit: `song-fields.js` (cleaning, every limit at max and max + 1 (also with an emoji), required title, allowed values, `validateSong` with every wrong type), routes, the id line, the form view (values escaped, messages, radio states).
  - E2e (Chromium and WebKit): add → reload → still there; edit → reload; delete → reload; the sample songs only on the first start (delete one, reload: it stays deleted); a damaged record in IndexedDB is skipped and the others show; storage refused (a blocked `indexedDB.open`) → sample songs, Save shows the failure message with the text kept; quota error on save → message, text kept; Back / Escape / Cancel with and without changes; the `versionchange` notice (a second page opens the database with a higher version); help opens and closes; no sideways page scroll at 320 px with a long line in the text field.
  - **Attack strings in every field** (title, artist, key, source, text in both formats, e.g. `<img src=x onerror=alert(1)>`, `"><script>alert(1)</script>`, `</textarea><script>alert(1)</script>`, `javascript:alert(1)`, `[<img src=x onerror=alert(1)>]`, `{c: <b>x</b>}`): saved, then checked in the list, the Song view, the edit form and the delete question — shown as text, no element created from them, no dialog fired (`page.on('dialog')`), no CSP violation in normal use.

## Out of scope

- Manage songs (M5): detecting the format of a pasted text, import and export of files, backup (M8); cleaning up text pasted from a website (an importer for that website, after the MVP); a preview of the song while typing; tags and categories; transposition; sync; a trash or undo for deleted songs; warning about songs with the same title; showing the id or dates anywhere but the edit form; a message in the app about iPhone keeping separate data.
- Categories or tags of songs (an idea in the inbox).
- Filters, tags, sorting options, favorites.
- In the Song view: previous / next song (play mode, M7), transposition (after the MVP), a display of the current font size.
- Song format (M4): detecting the format of a pasted text, import and export, converting between formats (a later milestone); a notation setting that shows `H` / `B` the user's way (after the MVP); other ChordPro features — bridge and other sections, tabs, grids, chord diagrams, `{title}` and other header directives as song fields, several songs in one text; formats other than `plain` and `chordpro` (e.g. tabs).

## Open questions

Manage songs (M5):

- *(none open)* Decided by the CEO on 2026-11-28: the stored notation values stay `international` / `german`, plus a third value `unknown`; the form names them "International — B, Bb", "German — H, B" and "Not sure — chords shown as written"; a new song starts with `german`; a missing or unknown stored notation counts as `unknown` (no longer `international`). Showing chords in the user's preferred notation is an idea in the [inbox](../plan/inbox.md) (after the MVP, with transposition).

Earlier:

- The Slovak words of *Tichá noc* were decided by the CEO on 2026-11-27: both Slovak songs count as folk songs and are used as found. One of the sources checked names Ladislav Hohoš as the author of the words (the others give no author); this is noted in the T-037 PR.
