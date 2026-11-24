// Song repository: the only way the app reads songs (ARCHITECTURE.md, data layer).
// Asynchronous, so storage can replace the in-memory sample songs later (M5)
// without changing its callers. In M1 it returns the sample songs.

import { SAMPLE_SONGS } from './sample-songs.js';

/**
 * Returns all songs, in no particular order. Callers get copies they may change.
 * @returns {Promise<import('../domain/songs.js').Song[]>}
 */
export async function listSongs() {
  return structuredClone(SAMPLE_SONGS);
}
