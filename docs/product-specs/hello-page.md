# Hello page (harness trial)

- **Status:** approved

## Purpose

A single static page that shows what Setlist could look like: one sample setlist with its songs, a header and a bottom navigation bar.
It exists to test our product process end to end on a tiny feature. It is throwaway: it lives in a trial location, not in the app, and nothing on it can be used or changed. This spec lives only on the trial branch and is deleted with it; it never becomes `implemented` on `main`.

## Behavior

### Page and layout regions

- Rule: given the page is opened in a current browser, when it loads, then the browser tab title is "Hello, Setlist".
- Rule: given the page is open, then it shows three regions from top to bottom: a **header**, a **song list** and a **bottom navigation bar**.
- Rule: given the page is open, when the user scrolls the song list, then the header stays at the top and the bottom navigation bar stays at the bottom of the screen; only the song list moves.
- Rule: given the user has scrolled to the end of the list, then the last song is fully visible and not hidden behind the bottom navigation bar.
- Rule: given a phone with a notch or a home indicator, then no text or button is covered by the notch, the rounded corners or the home indicator.
- Rule: given the device has no network connection, when the page is opened from local files, then it looks exactly the same as online (no missing fonts, icons or images).
- Rule: the page works with JavaScript disabled — nothing on it depends on it.

### Header

- Rule: given the page is open, then the header shows the app name "Setlist" and, more prominently, the title of the sample setlist (see [Sample data](#sample-data)).

### Song list

- Rule: given the page is open, then every song of the sample setlist is shown as one row, in setlist order.
- Rule: each row shows the song's position in the setlist (1, 2, 3 …), title, artist, key and duration (`m:ss`).
- Rule: given a guitarist looks at the screen from arm's length in a dim room, then the song title is the most prominent text in the row and readable without zooming.
- Rule: given a song title or artist is too long for the row, then the layout does not break and the page never scrolls sideways.
- Rule: given the user taps a song row, then it shows a subtle pressed state and nothing else happens (no navigation, no reload, no error).

### Bottom navigation bar

- Rule: given the page is open, then the bar shows four buttons in this order: **Songs**, **Setlists**, **Gig**, **Settings**; each has an icon and a text label.
- Rule: exactly one button, **Setlists**, is shown as the current section; the difference is visible without relying on color alone.
- Rule: given the user taps any button, then it shows a subtle pressed state and nothing else happens (no navigation, no reload, no error). The buttons are visual only.
- Rule: given a phone held in one hand, then every button can be reached with the thumb and has a touch area of at least 44 × 44 CSS pixels.
- Rule: given a keyboard user presses Tab, then focus moves through the buttons and the focused button is clearly visible.

### Screen sizes

- Rule: given a phone in portrait (narrowest supported width 320 CSS pixels), then all regions fit the width with no sideways scrolling and no cut-off text.
- Rule: given a phone in landscape, then the header and bottom bar together leave most of the screen height for the song list.
- Rule: given a tablet or desktop window, then the content does not stretch into very long lines; it stays at a comfortable reading width, and the page still looks intentional (not a stretched phone screen with empty space).
- Rule: given the user zooms the page to 200 %, then all text and buttons are still visible and usable.

### Theme

- Rule: given the system is set to light mode, then the page uses a light theme; given dark mode, a dark theme.
- Rule: given the page is open, when the user switches the system theme, then the page follows without a reload.
- Rule: in both themes, normal text has a contrast ratio of at least 4.5:1 and large text, icons and the current-section marker at least 3:1 against their background.

### Sample data

- Rule: the setlist title is **"Hello, Setlist"**.
- Rule: the setlist has 8 songs, enough to need scrolling on a phone in portrait.
- Rule: every song has a title, artist, key and duration; keys use common notation (e.g. `G`, `Em`, `F#m`) and durations are realistic (2:30–6:00).
- Rule: the songs are traditional or public-domain songs (no rights questions once the repository is public), for example "House of the Rising Sun", "Scarborough Fair", "Whiskey in the Jar", "Wild Mountain Thyme", "The Water Is Wide", "Shenandoah", "Amazing Grace", "Danny Boy", with "Traditional" as the artist.
- Rule: all UI text is in English.

## Out of scope

- Any behavior: no navigation between sections, no tapping into songs, no editing, adding, reordering, searching or deleting.
- Real or stored data; the content is fixed in the page.
- A manual light/dark switch (the page only follows the system).
- Installing as an app, offline caching, app icon.
- Other languages.
- Being part of the future app: this page is not reused and no app code is based on it.

## Open questions

None. Decided by the CEO on approval: current section is **Setlists**; sample songs are traditional/public-domain; rows and buttons show a subtle pressed state; the spec is deleted with the trial branch.
