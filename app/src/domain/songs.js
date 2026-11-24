// Songs in the domain (product spec songs.md): the song type, the order of the song
// list and the search match. Pure logic, no browser APIs.

/**
 * A song. `text` keeps the provisional "chords over lyrics" form until the song
 * format is decided (M4) — do not build on it.
 * @typedef {object} Song
 * @property {string} id
 * @property {string} title
 * @property {string} artist empty when unknown
 * @property {string} key empty when the song has no key, e.g. 'Am'
 * @property {string} text
 */

// A fixed collation instead of the device language, so the order is the same on
// every device. English collation sorts accented letters with their base letter
// (Čaj next to Caj); Slovak collation would put Č after all of C.
const collator = new Intl.Collator('en', { usage: 'sort' });

/**
 * Returns the songs sorted by title, ignoring letter case and accents; songs with
 * the same title keep a stable order by artist, then id. The input is not changed.
 * @param {Song[]} songs
 * @returns {Song[]}
 */
export function sortSongs(songs) {
  return [...songs].sort(
    (a, b) => collator.compare(a.title, b.title) || collator.compare(a.artist, b.artist) || collator.compare(a.id, b.id),
  );
}

/**
 * Lowercases the text and removes accents ('Pieseň' → 'piesen'), for matching.
 * @param {string} text
 * @returns {string}
 */
export function foldText(text) {
  return text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
}

/**
 * Returns the songs whose title, artist or key contains the query, ignoring letter
 * case, accents and spaces around the query. An empty query returns all songs.
 * @param {Song[]} songs
 * @param {string} query
 * @returns {Song[]}
 */
export function searchSongs(songs, query) {
  const needle = foldText(query.trim());
  if (needle === '') return songs;
  return songs.filter((song) => [song.title, song.artist, song.key].some((field) => foldText(field).includes(needle)));
}

/**
 * The song count line: '1 song', '4 songs'.
 * @param {number} count
 * @returns {string}
 */
export function songCountLabel(count) {
  return count === 1 ? '1 song' : `${count} songs`;
}
