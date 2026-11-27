// The Song view (product spec songs.md, "Song view screen (M3)"): a stage screen
// with a sticky top bar (close button; A− and A+ for the font size) above the song
// header and the song sheet. The sheet is chosen by the song's format ("Song format
// (M4)"); its font size is the user's choice. A pure view: state in, HTML out.

import { html } from '../html.js';
import { canGrowFontSize, canShrinkFontSize } from '../../domain/font-size.js';
import { keyChip } from '../components/key-chip.js';
import { plainSheet } from '../components/plain-sheet.js';
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
    ${songSheet(song, fontSize)}
  `;
}

/**
 * A− and A+, each disabled at its limit.
 * @param {number} fontSize
 */
function fontSizeButtons(fontSize) {
  return [
    stageButton({ name: 'Smaller text', action: 'smaller-text', content: 'A\u2212', disabled: !canShrinkFontSize(fontSize) }),
    stageButton({ name: 'Larger text', action: 'larger-text', content: 'A+', disabled: !canGrowFontSize(fontSize) }),
  ];
}

/**
 * The sheet for the song's format. Only the plain sheet exists so far, so every
 * format shows as plain, as an unknown one does; the ChordPro sheet (T-035) adds
 * its case here, chosen by songFormat() of domain/songs.js.
 * @param {import('../../domain/songs.js').Song} song
 * @param {number} fontSize
 */
function songSheet(song, fontSize) {
  return plainSheet(song.text, fontSize);
}
