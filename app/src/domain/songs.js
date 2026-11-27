// Songs in the domain (product spec songs.md): the song type and its header fields
// ("Song format (M4)", ADR 0008), the order of the song list and the search match.
// Pure logic, no browser APIs.

/**
 * A song. `text` is kept exactly as written; `format` says how to read it and
 * `notation` what its chord letters mean. Neither ever changes the text.
 * @typedef {object} Song
 * @property {string} id
 * @property {string} title
 * @property {string} artist empty when unknown
 * @property {string} key empty when the song has no key, e.g. 'Am'; in the song's notation
 * @property {string} text
 * @property {SongFormat} format
 * @property {Notation} notation
 * @property {string} [source] where the song came from, as plain text (e.g. 'akordy.sk'); never a link
 * @property {string} [importedAt] the date of import, 'YYYY-MM-DD'
 */

/**
 * `plain`: "chords over lyrics", a line of chords above each line of lyrics.
 * `chordpro`: chords in square brackets inside the lyrics, e.g. '[G]Amazing [C]grace'.
 * @typedef {'plain' | 'chordpro'} SongFormat
 */

/**
 * `international`: B is B, Bb is B flat. `german` (Central European): H is B, B is B flat.
 * @typedef {'international' | 'german'} Notation
 */

/** @type {readonly SongFormat[]} */
export const SONG_FORMATS = Object.freeze(['plain', 'chordpro']);

/** @type {readonly Notation[]} */
export const NOTATIONS = Object.freeze(['international', 'german']);

/**
 * The song's format; a missing or unknown one counts as `plain`, which shows every
 * line as written, so nothing is lost.
 * @param {unknown} format
 * @returns {SongFormat}
 */
export function songFormat(format) {
  return SONG_FORMATS.includes(/** @type {SongFormat} */ (format)) ? /** @type {SongFormat} */ (format) : 'plain';
}

/**
 * The song's notation; a missing or unknown one counts as `international`.
 * @param {unknown} notation
 * @returns {Notation}
 */
export function songNotation(notation) {
  return NOTATIONS.includes(/** @type {Notation} */ (notation)) ? /** @type {Notation} */ (notation) : 'international';
}

/**
 * Splits a song text into lines; '\r\n' and '\r' (Windows and old Mac line ends)
 * count as one line break, like '\n'. Used by the readers of every format.
 * @param {string} text
 * @returns {string[]}
 */
export function splitLines(text) {
  return text.split(/\r\n|\r|\n/);
}

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
