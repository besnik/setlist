// Key chip (design guidelines, "Song row"): the song's key in a small tinted chip.
// Shared by the song list and the Song view; a song without a key has no chip.

import { html } from '../html.js';

/** @param {string} key the song's key, e.g. 'Am'; empty for none */
export function keyChip(key) {
  return key ? html`<span class="key-chip">${key}</span>` : '';
}
