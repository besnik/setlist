// Plain sheet (product spec songs.md, "Song format (M4)", `plain` format): the sheet
// of a `plain` song — the text as written, in the mono font; lines keep their spaces
// and wrap instead of widening the page. Chord lines are marked for highlighting.
// A component, because the Song view and play mode (M7) show the same sheet.

import { html } from '../html.js';
import { isChordLine } from '../../domain/chords.js';
import { splitLines } from '../../domain/songs.js';

/**
 * @param {string} text the song text, as written
 * @param {number} fontSize the sheet's font size in px (domain/font-size.js)
 */
export function plainSheet(text, fontSize) {
  return html`<div class="song-sheet" style="--sheet-size: ${fontSize}px">${sheetLines(text)}</div>`;
}

// The lines of the sheet, joined by line breaks; each chord line in its own span.
/** @param {string} text */
function sheetLines(text) {
  return splitLines(text).map((line, index) => {
    const separator = index === 0 ? '' : '\n';
    return isChordLine(line) ? html`${separator}<span class="chord-line">${line}</span>` : html`${separator}${line}`;
  });
}
