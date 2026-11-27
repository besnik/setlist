// ChordPro sheet (product spec songs.md, "Song format (M4)", `chordpro` format, and
// the UX "Song sheet by format and source line (M4)"): the sheet of a `chordpro`
// song — chords above their syllables in the body font, section marks in a left
// margin, comments, chorus references and empty lines. Renders the blocks of
// domain/chordpro.js; every text goes through the escaping `html` template.
// A component, because the Song view and play mode (M7) show the same sheet.
//
// Layout (components.css): a line is a block of words separated by real spaces,
// so the browser wraps it between words. A word is an inline-block of pieces
// (chord above, text below), so it does not break inside, and its baseline is the
// baseline of its lyrics: words of one row stay level whether they have a chord
// or not. A section's mark is an inline-block at the start of its first line,
// pulled into the margin, so it sits level with that line's lyrics.

import { html } from '../html.js';
import { parseChordPro } from '../../domain/chordpro.js';

// The margin is at least as wide as two mark characters ('1.', 'R:').
const MIN_MARK_CHARS = 2;

/**
 * @typedef {import('../../domain/chordpro.js').Block} Block
 * @typedef {import('../../domain/chordpro.js').SectionLine} SectionLine
 * @typedef {import('../../domain/chordpro.js').Piece} Piece
 */

/**
 * @param {string} text the song text, as written
 * @param {number} fontSize the sheet's font size in px (domain/font-size.js)
 */
export function chordproSheet(text, fontSize) {
  const blocks = parseChordPro(text);
  const markChars = longestMark(blocks);
  // A song with sections has the margin: every line starts right of it.
  const marked = markChars > 0 ? 'chordpro-sheet--marked' : '';
  const style = markChars > 0 ? `--sheet-size: ${fontSize}px; --mark-chars: ${Math.max(markChars, MIN_MARK_CHARS)}` : `--sheet-size: ${fontSize}px`;
  return html`<div class="song-sheet chordpro-sheet ${marked}" style="${style}">${blocks.map(sheetBlock)}</div>`;
}

/**
 * The length of the longest mark (sections and chorus references), 0 without marks.
 * @param {Block[]} blocks
 */
function longestMark(blocks) {
  const marks = blocks.flatMap((block) => {
    if (block.type === 'section') return [block.mark, ...block.lines.filter((line) => line.type === 'chorus-ref').map((line) => line.mark)];
    return block.type === 'chorus-ref' ? [block.mark] : [];
  });
  return Math.max(0, ...marks.map((mark) => [...mark].length));
}

/** @param {Block} block */
function sheetBlock(block) {
  if (block.type !== 'section') return sheetLine(block, '');
  const [first, ...rest] = block.lines;
  // The mark goes before the first line. A section that is empty or starts with a
  // chorus reference (which shows its own mark) gets its mark on a line of its own.
  const lines = first && first.type !== 'chorus-ref'
    ? [sheetLine(first, block.mark), ...rest.map((line) => sheetLine(line, ''))]
    : [sheetLine({ type: 'empty' }, block.mark), ...block.lines.map((line) => sheetLine(line, ''))];
  return html`<div class="chordpro-section chordpro-section--${block.kind}">${lines}</div>`;
}

/**
 * One line of the sheet; `mark` ('' for none) is shown in the margin before it.
 * @param {SectionLine} line
 * @param {string} mark
 */
function sheetLine(line, mark) {
  const markHtml = mark ? sectionMark(mark) : '';
  switch (line.type) {
    case 'line':
      return html`<div class="chordpro-line">${markHtml}${lineWords(line.pieces)}</div>`;
    case 'comment':
      return html`<div class="chordpro-comment">${markHtml}${line.text}</div>`;
    case 'chorus-ref':
      // "Sing the chorus here": the chorus mark only, never the chorus text again.
      return html`<div class="chordpro-empty chordpro-chorus-ref">${sectionMark(line.mark)}</div>`;
    default:
      return html`<div class="chordpro-empty">${markHtml}</div>`;
  }
}

/** @param {string} mark */
function sectionMark(mark) {
  return html`<span class="chordpro-mark"><span class="chordpro-mark__text">${mark}</span></span>`;
}

/**
 * The words of a line, separated by single spaces (the only places a line wraps).
 * A line with chords only has no lyric row.
 * @param {Piece[]} pieces
 */
function lineWords(pieces) {
  const words = splitWords(pieces);
  const hasLyrics = words.some((word) => word.some((piece) => piece.text !== ''));
  return words.map((word, index) => html`${index === 0 ? '' : ' '}<span class="chordpro-word">${word.map((piece) => wordPiece(piece, hasLyrics))}</span>`);
}

/**
 * A chord above its text. Without a chord there is no chord row; on a line with
 * lyrics an empty text still keeps the lyric row (CSS), so the chord stays above it.
 * @param {Piece} piece
 * @param {boolean} hasLyrics
 */
function wordPiece({ chord, text }, hasLyrics) {
  const chordHtml = chord ? html`<span class="chordpro-chord">${chord}</span>` : '';
  const textHtml = hasLyrics ? html`<span class="chordpro-text">${text}</span>` : '';
  return html`<span class="chordpro-piece">${chordHtml}${textHtml}</span>`;
}

/**
 * Groups the pieces of a line into words: the text of a piece is cut at spaces and
 * tabs, the chord stays with the first part. Pieces left with neither chord nor
 * text are dropped, and so are words left empty (spaces at the start or end).
 * '[G]Ama[C]zing grace' → [[G 'Ama', C 'zing'], ['' 'grace']].
 * @param {Piece[]} pieces
 * @returns {Piece[][]}
 */
export function splitWords(pieces) {
  /** @type {Piece[][]} */
  const words = [[]];
  for (const { chord, text } of pieces) {
    const parts = text.split(/[ \t]+/);
    words[words.length - 1].push({ chord, text: parts[0] });
    for (const part of parts.slice(1)) words.push([{ chord: '', text: part }]);
  }
  return words
    .map((word) => word.filter((piece) => piece.chord !== '' || piece.text !== ''))
    .filter((word) => word.length > 0);
}
