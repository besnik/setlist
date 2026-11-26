// The Song view (product spec songs.md, "Song view screen (M3)"): a stage screen
// with a sticky top bar (close button) above the song header and the song sheet.
// The sheet shows the text as written, in the mono font; lines keep their spaces
// and wrap instead of widening the page. A pure view: state in, HTML out.

import { html } from '../html.js';
import { keyChip } from '../components/key-chip.js';
import { CLOSE_ICON, stageButton } from '../components/stage-button.js';

/** @param {import('../../domain/songs.js').Song} song */
export function songView(song) {
  return html`
    <div class="stage-bar">
      ${stageButton({ name: 'Close', action: 'close-song', content: CLOSE_ICON })}
    </div>
    <header class="song-header">
      <h1>${song.title}</h1>
      <div class="song-header__meta">
        <span class="song-header__artist">${song.artist || 'Unknown artist'}</span>
        ${keyChip(song.key)}
      </div>
    </header>
    <div class="song-sheet">${song.text}</div>
  `;
}
