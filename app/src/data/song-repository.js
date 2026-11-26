// Song repository: the only way the app reads songs (ARCHITECTURE.md, data layer).
// Asynchronous, so storage can replace the in-memory sample songs later (M5)
// without changing its callers. Until then it returns the sample songs.

import { SAMPLE_SONGS } from './sample-songs.js';

/**
 * Returns all songs, in no particular order. Callers get copies they may change.
 * @returns {Promise<import('../domain/songs.js').Song[]>}
 */
export async function listSongs() {
  return structuredClone(SAMPLE_SONGS);
}

/**
 * Returns the song with this id, or null when there is none. The caller gets a copy.
 * @param {string} id
 * @returns {Promise<import('../domain/songs.js').Song | null>}
 */
export async function getSong(id) {
  const song = SAMPLE_SONGS.find((candidate) => candidate.id === id);
  return song ? structuredClone(song) : null;
}
