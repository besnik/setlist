// The Songs screen (product spec songs.md, "Song list" and "Search"): page header
// with the song count, the search field, then the list or the empty state.
// The list sits in its own element, so typing re-renders only the list and the
// search field keeps its focus and cursor. The app version is filled in below the
// list once the service worker has answered. Each row is a link to the song's
// Song view (router.js). A pure view: state in, HTML out.

import { html } from '../html.js';
import { songHash } from '../routes.js';
import { keyChip } from '../components/key-chip.js';
import { songCountLabel } from '../../domain/songs.js';

/**
 * The whole screen.
 * @param {{ songs: import('../../domain/songs.js').Song[], shown: import('../../domain/songs.js').Song[], query: string, version: string | null }} state
 *   songs: all songs (for the count); shown: the songs that match the query, in list order;
 *   version: the app version once known, else null
 */
export function songsView({ songs, shown, query, version }) {
  return html`
    <header class="page-header">
      <h1>Songs</h1>
      <p class="page-header__count">${songCountLabel(songs.length)}</p>
    </header>
    <input class="search-field" type="search" placeholder="Search title, artist, key"
      aria-label="Search songs" autocomplete="off" value="${query}" data-action="search">
    <div id="song-list">${songList(shown)}</div>
    <div id="app-version">${version ? versionLine(version) : ''}</div>
  `;
}

/**
 * The version line below the list (product spec install-offline.md, "Updates").
 * @param {string} version
 */
export function versionLine(version) {
  return html`<p class="version-line">Version ${version}</p>`;
}

/**
 * The list of songs, or the empty state when no song matches.
 * @param {import('../../domain/songs.js').Song[]} shown
 */
export function songList(shown) {
  if (shown.length === 0) return html`<p class="empty-state">No songs found.</p>`;
  return html`<ul class="song-list">${shown.map(songRow)}</ul>`;
}

/** @param {import('../../domain/songs.js').Song} song */
function songRow(song) {
  return html`
    <li>
      <a class="song-row" href="${songHash(song.id)}">
        <div class="song-row__text">
          <div class="song-row__title">${song.title}</div>
          <div class="song-row__artist">${song.artist || 'Unknown artist'}</div>
        </div>
        ${keyChip(song.key)}
      </a>
    </li>
  `;
}
