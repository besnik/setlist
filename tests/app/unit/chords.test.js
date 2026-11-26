// Chord lines (product spec songs.md, "Song view (M3)", Chord lines): every example
// and counter-example of the rules for isChordLine.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isChordLine } from '../../../app/src/domain/chords.js';

const chordLines = (lines) => lines.forEach((line) => assert.equal(isChordLine(line), true, `chord line: ${JSON.stringify(line)}`));
const lyricLines = (lines) => lines.forEach((line) => assert.equal(isChordLine(line), false, `lyric line: ${JSON.stringify(line)}`));

// Rule: a chord is a root, an optional accidental, qualities and extensions, an optional bass note.
test('every chord example of the spec is a chord', () => {
  chordLines([
    'C', 'Am', 'Ami', 'Hmi', 'F#m', 'Bb', 'G7', 'Cmaj7', 'Dsus4', 'Asus2', 'Gadd9', 'Bdim', 'Caug', 'C+',
    'Em7b5', 'E7/G#', 'D/F#', 'C/H', 'Amin', 'Am7', 'Ami7', 'A7sus4', 'G7b9', 'C7#5', 'G11', 'F13', 'A5', 'D6',
    'C/Bb', 'Hb',
  ]);
});

// Rule: not chords in M3 — capital M for major, a slash followed by a number.
test('CM7 and C6/9 are not chords', () => {
  lyricLines(['CM7', 'C6/9', 'Am CM7', 'G C6/9']);
});

// Rule: words are separated by spaces or tabs; spaces at the start and end are ignored.
test('chords separated by spaces and tabs make a chord line', () => {
  chordLines(['   Am      C        D          F', 'G\tD\t\tEm', '  C  ', 'G              G7        C       G']);
});

// Rule: an empty line or a line of only spaces is not a chord line.
test('empty and blank lines are not chord lines', () => {
  lyricLines(['', '   ', '\t \t']);
});

// Rule: bar marks may stand between chords; a line of bar marks only is not a chord line.
test('bar marks go with chords, but not alone', () => {
  chordLines(['| G | C | D |', '|| Am ||', '|: G C :|', 'G % C %', 'G / / / C', 'G - - C', 'Am x2', 'Am 2x', 'G x3', 'N.C. G', '|: C G :| x2']);
  lyricLines(['| | |', '|: % :|', '- / -', 'x2', 'N.C.', '%']);
});

// Rule: a chord in parentheses counts; a non-chord word in parentheses makes a lyric line.
test('chords in parentheses count, other words in parentheses do not', () => {
  chordLines(['G (D) Em', '(E7/G#)', 'C (G) Am']);
  lyricLines(['G (chorus)', '(chorus)', '(G', 'G)', '(G)(C)']);
});

// Rule: a line with words that are not chords is a lyric line, also if some words look like chords.
test('lyric lines with chord-like words are lyric lines', () => {
  lyricLines(['A man walks in', 'Am I wrong', 'Amazing grace, how sweet the sound', 'There is a house in New Orleans', 'G C Dm and', 'Am,', 'Am C:']);
});

// Rule: letter case matters — lyric words such as a, v, am, be, add are never chords.
test('lower-case words are never chords', () => {
  lyricLines(['a', 'v', 'am', 'be', 'add', 'am be a', 'c d e', 'AM', 'Add', 'Bad', 'Ham', 'Ab Cd']);
});

// Rule (accepted false positive): a lyric line made only of chord-like words is a chord line.
test('a lyric line of chord-like words only is a chord line', () => {
  chordLines(['A', 'Hm', 'E A']);
});
