// The Song view (product spec songs.md, "Song view screen (M3)"): a stage screen
// with a sticky top bar (close button; A− and A+ for the font size) above the song
// header and the song sheet. The sheet's font size is the user's choice.
// The sheet shows the text as written, in the mono font; lines keep their spaces
// and wrap instead of widening the page. Chord lines are marked for highlighting.
// A pure view: state in, HTML out.

import { html } from '../html.js';
import { isChordLine } from '../../domain/chords.js';
import { MAX_FONT_SIZE, MIN_FONT_SIZE } from '../../domain/font-size.js';
import { keyChip } from '../components/key-chip.js';
import { CLOSE_ICON, stageButton } from '../components/stage-button.js';

/**
 * @param {import('../../domain/songs.js').Song} song
 * @param {number} fontSize the sheet's font size in px (domain/font-size.js)
 */
export function songView(song, fontSize) {
  return html`
    <div class="stage-bar">
      ${stageButton({ name: 'Close', action: 'close-song', content: CLOSE_ICON })}
      <div class="stage-bar__end">${fontSizeButtons(fontSize)}</div>
    </div>
    <header class="song-header">
      <h1>${song.title}</h1>
      <div class="song-header__meta">
        <span class="song-header__artist">${song.artist || 'Unknown artist'}</span>
        ${keyChip(song.key)}
      </div>
    </header>
    <div class="song-sheet" style="--sheet-size: ${fontSize}px">${sheetLines(song.text)}</div>
  `;
}

/**
 * A− and A+, each disabled at its limit.
 * @param {number} fontSize
 */
function fontSizeButtons(fontSize) {
  return [
    stageButton({ name: 'Smaller text', action: 'smaller-text', content: 'A\u2212', disabled: fontSize <= MIN_FONT_SIZE }),
    stageButton({ name: 'Larger text', action: 'larger-text', content: 'A+', disabled: fontSize >= MAX_FONT_SIZE }),
  ];
}

// The lines of the sheet, joined by line breaks; each chord line in its own span.
/** @param {string} text */
function sheetLines(text) {
  return text.split('\n').map((line, index) => {
    const separator = index === 0 ? '' : '\n';
    return isChordLine(line) ? html`${separator}<span class="chord-line">${line}</span>` : html`${separator}${line}`;
  });
}
