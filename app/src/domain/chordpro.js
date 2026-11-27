// ChordPro reader (product spec songs.md, "Song format (M4)", `chordpro` format):
// turns the text of a `chordpro` song into blocks for its sheet — lines of chord and
// text pieces, verses and the chorus as sections with their marks, chorus references,
// comments and empty lines. Hidden directives and `#` lines leave no block.
// Pure logic, no browser APIs; knows nothing of HTML (the sheet escapes the text).

import { splitLines } from './songs.js';

/**
 * A chord and the text that follows it, up to the next chord. `chord` is '' for the
 * text before the first chord of a line. Both are kept as written.
 * @typedef {{ chord: string, text: string }} Piece
 */

/**
 * @typedef {{ type: 'line', pieces: Piece[] }} LineBlock a line of lyrics and chords
 * @typedef {{ type: 'empty' }} EmptyBlock an empty line (a gap between verses)
 * @typedef {{ type: 'comment', text: string }} CommentBlock `{comment: …}`, e.g. 'Capo 2'
 * @typedef {{ type: 'chorus-ref', mark: string }} ChorusRefBlock `{chorus}`: "sing the chorus here"
 * @typedef {LineBlock | EmptyBlock | CommentBlock | ChorusRefBlock} SectionLine
 */

/**
 * A verse or the chorus. `mark` is shown in the margin: '1.', '2.' … for verses,
 * 'R:' for the chorus, or the value of the start directive (e.g. '3a', 'Ref.').
 * @typedef {{ type: 'section', kind: 'verse' | 'chorus', mark: string, lines: SectionLine[] }} SectionBlock
 */

/** @typedef {SectionLine | SectionBlock} Block */

const CHORUS_MARK = 'R:';

// The start and end directives of the sections, long and short names.
/** @type {Record<string, 'verse' | 'chorus'>} */
const SECTION_STARTS = { start_of_verse: 'verse', sov: 'verse', start_of_chorus: 'chorus', soc: 'chorus' };
/** @type {Record<string, 'verse' | 'chorus'>} */
const SECTION_ENDS = { end_of_verse: 'verse', eov: 'verse', end_of_chorus: 'chorus', eoc: 'chorus' };

// A directive line, once trimmed: '{name}' or '{name: value}'. Names are the ChordPro
// ones (letters, digits, '_', '-'); a braced line of another form stays a lyric line,
// so its text is still shown.
const DIRECTIVE = /^\{\s*([\w-]+)\s*(?::(.*))?\}$/;

/**
 * Reads the text of a `chordpro` song into blocks.
 *
 * Steps per line: a `#` line is dropped; a directive starts or ends a section, adds
 * a comment or a chorus reference, or is dropped; any other line becomes a line of
 * pieces (or an empty line). Lines go into the open section, else to the top level.
 * Sections do not nest: a section ends at its end directive, at the start of the
 * next section, or with the song; a repeated start of the open kind and an end
 * without its start are ignored.
 * @param {string} text the song text, as written
 * @returns {Block[]}
 */
export function parseChordPro(text) {
  /** @type {Block[]} */
  const blocks = [];
  /** @type {SectionBlock | null} */
  let section = null;
  let verseNumber = 0;
  /** @param {SectionLine} block */
  const add = (block) => (section ? section.lines : blocks).push(block);

  for (const line of songLines(text)) {
    if (line.startsWith('#')) continue;
    const directive = parseDirective(line);
    if (!directive) {
      add(parseLine(line));
      continue;
    }
    const { name, value } = directive;
    const startKind = SECTION_STARTS[name];
    if (startKind) {
      if (section?.kind === startKind) continue;
      // A value replaces the mark; such a verse does not count for the numbering.
      const mark = value || (startKind === 'chorus' ? CHORUS_MARK : `${++verseNumber}.`);
      section = { type: 'section', kind: startKind, mark, lines: [] };
      blocks.push(section);
    } else if (SECTION_ENDS[name]) {
      if (section?.kind === SECTION_ENDS[name]) section = null;
    } else if (name === 'chorus') {
      add({ type: 'chorus-ref', mark: value || CHORUS_MARK });
    } else if ((name === 'comment' || name === 'c') && value) {
      add({ type: 'comment', text: value });
    }
    // Any other directive (title, key, tabs …) stays in the text but is not shown.
  }
  return blocks;
}

// The lines of the text. A line break at the very end closes the last line; it does
// not start an empty one.
/** @param {string} text */
function songLines(text) {
  const lines = splitLines(text);
  if (lines.at(-1) === '') lines.pop();
  return lines;
}

/**
 * The directive on the line, or null when the line is not one. The name ignores
 * letter case; the value is trimmed, and an empty value counts as none.
 * @param {string} line
 * @returns {{ name: string, value: string } | null}
 */
function parseDirective(line) {
  const match = DIRECTIVE.exec(line.trim());
  if (!match) return null;
  return { name: match[1].toLowerCase(), value: (match[2] ?? '').trim() };
}

/**
 * Splits a line into pieces at its chords. A `[` without a closing `]` on the line
 * makes the rest of the line text, brackets included; an empty `[]` is dropped.
 * A line with no chord and only spaces is an empty line.
 * @param {string} line
 * @returns {LineBlock | EmptyBlock}
 */
function parseLine(line) {
  /** @type {Piece[]} */
  const pieces = [{ chord: '', text: '' }];
  let rest = line;
  while (rest !== '') {
    const firstOpen = rest.indexOf('[');
    const close = firstOpen === -1 ? -1 : rest.indexOf(']', firstOpen + 1);
    if (close === -1) {
      pieces[pieces.length - 1].text += rest;
      break;
    }
    // The `[` nearest to the `]`: in 'a[b[C]' the first `[` is never closed, so it is text.
    const open = rest.lastIndexOf('[', close);
    pieces[pieces.length - 1].text += rest.slice(0, open);
    const chord = rest.slice(open + 1, close);
    if (chord !== '') pieces.push({ chord, text: '' });
    rest = rest.slice(close + 1);
  }
  if (pieces[0].text === '' && pieces.length > 1) pieces.shift();
  if (pieces.every((piece) => piece.chord === '' && piece.text.trim() === '')) return { type: 'empty' };
  return { type: 'line', pieces };
}
