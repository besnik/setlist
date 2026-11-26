// The app's addresses (product spec songs.md, "Song view (M3)"): the URL hash
// names the screen. `#/song/<id>` is the Song view of one song; any other address
// is the Songs screen. Song ids are encoded in the address, so any id stays safe.
// Pure functions on strings, so views may build links; router.js follows the address.

/**
 * @typedef {{ screen: 'songs' } | { screen: 'song', id: string }} Route
 */

const SONG_HASH = /^#\/song\/([^/]+)$/;

/**
 * The screen an address hash shows.
 * @param {string} hash `location.hash`, e.g. '#/song/sample-amazing-grace' or ''
 * @returns {Route}
 */
export function routeOf(hash) {
  const encoded = SONG_HASH.exec(hash)?.[1];
  if (encoded === undefined) return { screen: 'songs' };
  try {
    return { screen: 'song', id: decodeURIComponent(encoded) };
  } catch {
    return { screen: 'songs' }; // a broken escape such as '%E0' names no song
  }
}

/**
 * The address hash of a song's Song view.
 * @param {string} id
 * @returns {string}
 */
export function songHash(id) {
  return `#/song/${encodeURIComponent(id)}`;
}
