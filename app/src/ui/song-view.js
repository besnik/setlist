// The Song view (product spec songs.md, "Song view screen (M3)"): a stage screen
// with a sticky top bar (close button) above the song header and the song sheet.
// The sheet shows the text as written, in the mono font; lines keep their spaces
// and wrap instead of widening the page.

import { html } from './html.js';

/** @param {import('../domain/songs.js').Song} song */
export function songScreen(song) {
  return html`
    <div class="stage-bar">
      <button class="stage-button" type="button" aria-label="Close" title="Close" data-action="close-song">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18"/>
        </svg>
      </button>
    </div>
    <header class="song-header">
      <h1>${song.title}</h1>
      <div class="song-header__meta">
        <span class="song-header__artist">${song.artist || 'Unknown artist'}</span>
        ${song.key ? html`<span class="key-chip">${song.key}</span>` : ''}
      </div>
    </header>
    <div class="song-sheet">${song.text}</div>
  `;
}
