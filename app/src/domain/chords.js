// Chord lines (product spec songs.md, "Song view (M3)", Chord lines, and "Song
// format (M4)", `plain` format): tells a line of chords from a line of lyrics in a
// `plain` ("chords over lyrics") song — the reader of that format.
// Pure logic, no browser APIs.

// A chord: root (H = B in Central Europe), optional accidental, any sequence of
// qualities and extensions, optional slash bass note. Letter case matters, so lyric
// words such as 'a', 'am' or 'add' never match. Parentheses mark an optional chord.
const ROOT = '[A-H][#b]?';
const EXTENSION = '(?:min|mi|maj|m|dim|aug|sus|add|\\+|[#b]?(?:11|13|2|4|5|6|7|9))';
const CHORD = new RegExp(`^(?:${ROOT}${EXTENSION}*(?:/${ROOT})?|\\(${ROOT}${EXTENSION}*(?:/${ROOT})?\\))$`);

// Bar marks: bar lines, repeat signs, repeat bar, beat marks, repeat counts, no chord.
const BAR_MARK = /^(?:\||\|\||\|:|:\||%|\/|-|x\d+|\d+x|N\.C\.)$/;

/**
 * True when the line has at least one chord and every word on it is a chord or a
 * bar mark. Words are separated by spaces or tabs.
 * @param {string} line
 * @returns {boolean}
 */
export function isChordLine(line) {
  const words = line.trim().split(/[ \t]+/).filter(Boolean);
  return words.some((word) => CHORD.test(word)) && words.every((word) => CHORD.test(word) || BAR_MARK.test(word));
}
