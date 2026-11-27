// ChordPro reader (product spec songs.md, "Song format (M4)", `chordpro` format):
// every rule of the format for parseChordPro — chords and pieces, empty lines,
// directives, sections and their marks, chorus references, comments, `#` lines.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseChordPro } from '../../../app/src/domain/chordpro.js';

const line = (...pieces) => ({ type: 'line', pieces: pieces.map(([chord, text]) => ({ chord, text })) });
const lyric = (text) => line(['', text]);
const EMPTY = { type: 'empty' };
const verse = (mark, ...lines) => ({ type: 'section', kind: 'verse', mark, lines });
const chorus = (mark, ...lines) => ({ type: 'section', kind: 'chorus', mark, lines });
const parse = (...lines) => parseChordPro(lines.join('\n'));

// Rule: text in square brackets is a chord, above the text that follows it; content not checked.
test('a chord goes with the text that follows it, as written', () => {
  assert.deepEqual(parse('[G]Amazing [C]grace'), [line(['G', 'Amazing '], ['C', 'grace'])]);
  assert.deepEqual(parse('[F#m7]a [H7]b [(D)]c [N.C.]d [anything]e'), [
    line(['F#m7', 'a '], ['H7', 'b '], ['(D)', 'c '], ['N.C.', 'd '], ['anything', 'e']),
  ]);
});

// Rule: text before the first chord is a piece without a chord; a chord inside a word stays above its syllable.
test('text before the first chord and a chord inside a word', () => {
  assert.deepEqual(parse('Ama[C]zing grace'), [line(['', 'Ama'], ['C', 'zing grace'])]);
  assert.deepEqual(parse('  Intro [G]here'), [line(['', '  Intro '], ['G', 'here'])]);
});

// Rule: a line with chords only shows the chords in one row.
test('a line of chords only', () => {
  assert.deepEqual(parse('[G] [C] [D]'), [line(['G', ' '], ['C', ' '], ['D', ''])]);
  assert.deepEqual(parse('[G][C]'), [line(['G', ''], ['C', ''])]);
});

// Rule: a line without chords is a lyric line (no chord row).
test('a line without chords', () => {
  assert.deepEqual(parse('Words of the song'), [lyric('Words of the song')]);
});

// Rule: `[` without a closing `]` on the same line makes the rest of the line lyrics, brackets included.
test('an unclosed bracket is lyrics', () => {
  assert.deepEqual(parse('[G]Words [Am and more'), [line(['G', 'Words [Am and more'])]);
  assert.deepEqual(parse('[G'), [lyric('[G')]);
  assert.deepEqual(parse('a[b[C]d'), [line(['', 'a[b'], ['C', 'd'])]);
  assert.deepEqual(parse('text] [G]x'), [line(['', 'text] '], ['G', 'x'])]);
  // The bracket closes on its own line only.
  assert.deepEqual(parse('[G', ']x'), [lyric('[G'), lyric(']x')]);
});

// Rule: an empty `[]` is not shown.
test('an empty chord is dropped', () => {
  assert.deepEqual(parse('Ama[]zing'), [lyric('Amazing')]);
  assert.deepEqual(parse('[]Words [G]on'), [line(['', 'Words '], ['G', 'on'])]);
  assert.deepEqual(parse('[]'), [EMPTY]);
});

// Rule: an empty line keeps its height (a gap between verses); a line of only spaces is empty too.
test('empty lines', () => {
  assert.deepEqual(parse('a', '', '   ', 'b'), [lyric('a'), EMPTY, EMPTY, lyric('b')]);
  // A line break at the very end closes the last line; it adds no empty line.
  assert.deepEqual(parseChordPro('a\n'), [lyric('a')]);
  assert.deepEqual(parseChordPro('a\n\n'), [lyric('a'), EMPTY]);
  assert.deepEqual(parseChordPro(''), []);
});

// Rule: `\r\n` and `\r` count as one line break.
test('Windows and old Mac line ends', () => {
  const expected = [verse('1.', line(['G', 'one']), EMPTY, lyric('two')), lyric('three')];
  assert.deepEqual(parseChordPro('{sov}\r\n[G]one\r\n\r\ntwo\r\n{eov}\r\nthree\r\n'), expected);
  assert.deepEqual(parseChordPro('{sov}\r[G]one\r\rtwo\r{eov}\rthree'), expected);
});

// Rule: a directive is `{name}` or `{name: value}`; spaces around it are ignored, the name ignores letter case.
test('directives with spaces and in any letter case', () => {
  assert.deepEqual(parse('  {SOV}  ', 'a', '{ End_Of_Verse }'), [verse('1.', lyric('a'))]);
  assert.deepEqual(parse('{C:Capo 2}', '{ comment :  Repeat 2×  }'), [
    { type: 'comment', text: 'Capo 2' },
    { type: 'comment', text: 'Repeat 2×' },
  ]);
});

// Rule: sov / start_of_verse and soc / start_of_chorus start sections; eov / eoc end them.
test('verses and the chorus are sections, long and short names', () => {
  assert.deepEqual(parse('{start_of_verse}', 'a', '{end_of_verse}', '{start_of_chorus}', 'b', '{end_of_chorus}'), [
    verse('1.', lyric('a')),
    chorus('R:', lyric('b')),
  ]);
  assert.deepEqual(parse('{sov}', 'a', '{eov}', '{soc}', 'b', '{eoc}'), [verse('1.', lyric('a')), chorus('R:', lyric('b'))]);
});

// Rule: verses are numbered 1., 2., 3. in the order they appear; the chorus mark is R:.
test('verses are numbered automatically', () => {
  assert.deepEqual(parse('{sov}', 'a', '{eov}', '{soc}', 'r', '{eoc}', '{sov}', 'b', '{eov}', '{sov}', 'c', '{eov}'), [
    verse('1.', lyric('a')),
    chorus('R:', lyric('r')),
    verse('2.', lyric('b')),
    verse('3.', lyric('c')),
  ]);
});

// Rule: a value replaces the mark, as written; a verse with its own mark does not count for the numbering.
test('a section with its own mark', () => {
  assert.deepEqual(parse('{sov}', 'a', '{eov}', '{sov: 3a}', 'b', '{eov}', '{sov}', 'c', '{eov}', '{soc: Ref.}', 'r', '{eoc}'), [
    verse('1.', lyric('a')),
    verse('3a', lyric('b')),
    verse('2.', lyric('c')),
    chorus('Ref.', lyric('r')),
  ]);
  // An empty value counts as none.
  assert.deepEqual(parse('{sov: }', 'a', '{soc:}', 'b'), [verse('1.', lyric('a')), chorus('R:', lyric('b'))]);
});

// Rule: `{chorus}` shows only the chorus mark R: (or its value), not the chorus text again.
test('a chorus reference', () => {
  assert.deepEqual(parse('{soc}', 'r', '{eoc}', '{chorus}', '{chorus: Ref.}', '{Chorus:}'), [
    chorus('R:', lyric('r')),
    { type: 'chorus-ref', mark: 'R:' },
    { type: 'chorus-ref', mark: 'Ref.' },
    { type: 'chorus-ref', mark: 'R:' },
  ]);
});

// Rule: lines outside any section have no mark.
test('lines outside sections stay at the top level', () => {
  assert.deepEqual(parse('Intro [G]x', '{sov}', 'a', '{eov}', 'Outro'), [
    line(['', 'Intro '], ['G', 'x']),
    verse('1.', lyric('a')),
    lyric('Outro'),
  ]);
});

// Rule: sections do not nest; a section ends at its end directive, at the next section's start, or with the song.
test('a section ends at the next section or with the song', () => {
  assert.deepEqual(parse('{sov}', 'a', '{soc}', 'r', '{sov}', 'b'), [verse('1.', lyric('a')), chorus('R:', lyric('r')), verse('2.', lyric('b'))]);
});

// Rule: a start directive inside a section of the same kind is not shown and does not start a new one.
test('a repeated start of the same kind is ignored', () => {
  assert.deepEqual(parse('{sov}', 'a', '{sov: 9}', 'b', '{eov}', '{sov}', 'c'), [verse('1.', lyric('a'), lyric('b')), verse('2.', lyric('c'))]);
  assert.deepEqual(parse('{soc}', 'a', '{start_of_chorus}', 'b', '{eoc}'), [chorus('R:', lyric('a'), lyric('b'))]);
});

// Rule: an end directive without its start is not shown.
test('an end without its start is ignored', () => {
  assert.deepEqual(parse('{eov}', 'a', '{eoc}'), [lyric('a')]);
  // The end of the other kind does not close the open section.
  assert.deepEqual(parse('{sov}', 'a', '{eoc}', 'b', '{eov}', 'c'), [verse('1.', lyric('a'), lyric('b')), lyric('c')]);
});

// Rule: `{comment: …}` or `{c: …}` shows its value as a comment line; an empty `{c:}` is not shown.
test('comments, also inside a section', () => {
  assert.deepEqual(parse('{c: Capo 2}', '{sov}', '{comment: Repeat 2×}', 'a', '{eov}'), [
    { type: 'comment', text: 'Capo 2' },
    verse('1.', { type: 'comment', text: 'Repeat 2×' }, lyric('a')),
  ]);
  assert.deepEqual(parse('a', '{c:}', '{c:   }', '{c}', '{comment}', 'b'), [lyric('a'), lyric('b')]);
});

// Rule: any other directive is kept in the text but not shown; it takes no space.
test('other directives are hidden', () => {
  assert.deepEqual(parse('{title: Song}', '{key: G}', '{start_of_tab}', 'a', '{end_of_tab}', '{x_custom-1: y}'), [lyric('a')]);
});

// Rule: a line that starts with `#` is a comment for the writer and is not shown; it takes no space.
test('# lines are hidden', () => {
  assert.deepEqual(parse('# written by hand', 'a', '#', '{sov}', '#note', 'b'), [lyric('a'), verse('1.', lyric('b'))]);
  // Only a `#` at the start of the line.
  assert.deepEqual(parse('[G]#1 hit'), [line(['G', '#1 hit'])]);
});

// Rule: a line that looks like a directive but is not closed with `}` is shown as lyrics.
test('an unclosed directive is lyrics', () => {
  assert.deepEqual(parse('{sov', 'a', '{c: Capo 2', '{c: x} trailing'), [lyric('{sov'), lyric('a'), lyric('{c: Capo 2'), lyric('{c: x} trailing')]);
});

// A braced line not of the form {name} or {name: value} stays visible as lyrics, so no text is lost.
test('a braced line of another form is lyrics', () => {
  assert.deepEqual(parse('{}', '{c Capo 2}', '{: x}'), [lyric('{}'), lyric('{c Capo 2}'), lyric('{: x}')]);
});

// Rule: chords inside a section line, and a value with a colon or braces is kept as written.
test('a full song', () => {
  const text = [
    '{title: Example}',
    '# a song for the tests',
    '{c: Capo 2}',
    '{sov}',
    '[G]Words of the [C]first [G]verse',
    '{eov}',
    '',
    '{soc}',
    '[C]Words of the [G]chorus',
    '{eoc}',
    '',
    '{sov}',
    'Se[D]cond verse',
    '{eov}',
    '{chorus}',
    '{c: Repeat: 2× {slowly}}',
  ].join('\n');
  assert.deepEqual(parseChordPro(text), [
    { type: 'comment', text: 'Capo 2' },
    verse('1.', line(['G', 'Words of the '], ['C', 'first '], ['G', 'verse'])),
    EMPTY,
    chorus('R:', line(['C', 'Words of the '], ['G', 'chorus'])),
    EMPTY,
    verse('2.', line(['', 'Se'], ['D', 'cond verse'])),
    { type: 'chorus-ref', mark: 'R:' },
    { type: 'comment', text: 'Repeat: 2× {slowly}' },
  ]);
});

test('a directive named like an object property is hidden, not a section', () => {
  assert.deepEqual(parseChordPro('{constructor}\n{toString}\n{eov}'), []);
});
