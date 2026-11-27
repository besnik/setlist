// ChordPro sheet (product spec songs.md, "Song format (M4)", `chordpro` format, and
// the UX "Song sheet by format and source line (M4)"): the markup of the component —
// words of pieces, section marks and the margin, comments, chorus references,
// escaping, and the choice of the sheet by format in the Song view.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chordproSheet, splitWords } from '../../../app/src/ui/components/chordpro-sheet.js';
import { songView } from '../../../app/src/ui/views/song-view.js';

const sheet = (text) => String(chordproSheet(text, 16));
const marks = (markup) => [...markup.matchAll(/<span class="chordpro-mark__text">([^<]*)<\/span>/g)].map((match) => match[1]);

// Rule (`chordpro`): a chord inside a word stays above its syllable; spaces split words.
test('pieces are grouped into words at spaces', () => {
  assert.deepEqual(splitWords([{ chord: 'G', text: 'Ama' }, { chord: 'C', text: 'zing grace ' }]), [
    [{ chord: 'G', text: 'Ama' }, { chord: 'C', text: 'zing' }],
    [{ chord: '', text: 'grace' }],
  ]);
  // A chord over a space is a word of its own; spaces at the start are dropped.
  assert.deepEqual(splitWords([{ chord: '', text: '  la ' }, { chord: 'D', text: ' da' }]), [
    [{ chord: '', text: 'la' }],
    [{ chord: 'D', text: '' }],
    [{ chord: '', text: 'da' }],
  ]);
  assert.match(
    sheet('Ama[C]zing grace'),
    /<div class="chordpro-line"><span class="chordpro-word"><span class="chordpro-piece"><span class="chordpro-text">Ama<\/span><\/span><span class="chordpro-piece"><span class="chordpro-chord">C<\/span><span class="chordpro-text">zing<\/span><\/span><\/span> <span class="chordpro-word">/,
  );
});

// Rule (`chordpro`): a line with chords only shows them in one row, without a lyric row.
test('a line of chords only has no lyric row', () => {
  const markup = sheet('[G] [C] [D]');
  assert.equal(markup.match(/class="chordpro-chord"/g).length, 3);
  assert.doesNotMatch(markup, /chordpro-text/);
});

// Rules (`chordpro`, UX): the chorus mark is 'R:', verses are numbered, a value
// replaces the mark; the margin is as wide as the longest mark, at least 2.
test('sections show their marks and set the margin', () => {
  const markup = sheet('{sov}\n[G]one\n{eov}\n{soc}\n[C]chorus\n{eoc}\n{sov}\ntwo\n{eov}\n{chorus}');
  assert.deepEqual(marks(markup), ['1.', 'R:', '2.', 'R:']);
  assert.match(markup, /class="song-sheet chordpro-sheet chordpro-sheet--marked" style="--sheet-size: 16px; --mark-chars: 2"/);
  assert.match(markup, /<div class="chordpro-section chordpro-section--chorus"><div class="chordpro-line"><span class="chordpro-mark"><span class="chordpro-mark__text">R:<\/span><\/span><span class="chordpro-word">/);
  // {chorus} shows the mark only, not the chorus text again.
  assert.equal(markup.match(/chorus</g).length, 1);
  assert.match(sheet('{soc: Ref.}\nla\n{eoc}'), /--mark-chars: 4"/);
  assert.match(sheet('{sov: 3a}\nla'), /--mark-chars: 2"/);
});

// Rule (`chordpro`): a song without sections has no margin.
test('a song without sections has no margin', () => {
  const markup = sheet('[G]la la\n{c: Capo 2}');
  assert.doesNotMatch(markup, /chordpro-sheet--marked|--mark-chars|chordpro-mark/);
  assert.match(markup, /<div class="chordpro-comment">Capo 2<\/div>/);
});

// Rule (`chordpro`): an empty line keeps its height; a section starting with an empty line keeps its mark.
test('empty lines are kept, also with a mark', () => {
  assert.match(sheet('a\n\nb'), /<\/div><div class="chordpro-empty"><\/div><div class="chordpro-line">/);
  assert.match(sheet('{sov}\n\nla'), /<div class="chordpro-empty"><span class="chordpro-mark"><span class="chordpro-mark__text">1\.<\/span><\/span><\/div>/);
});

// Safe rendering (ADR 0004): chords, lyrics, comments and marks are escaped.
test('song text is escaped', () => {
  const markup = sheet('{sov: <b>}\n[<i>]<img src=x onerror=alert(1)>\n{c: <script>}');
  assert.doesNotMatch(markup, /<(b|i|img|script)[ >]/);
  assert.match(markup, /&lt;b&gt;/);
  assert.match(markup, /<span class="chordpro-chord">&lt;i&gt;<\/span>/);
  assert.match(markup, /&lt;script&gt;/);
});

// Rule (Song format): the Song view shows a `chordpro` song with the ChordPro sheet,
// any other format (also an unknown one) with the plain sheet.
test('the Song view chooses the sheet by format', () => {
  const song = { id: 'x', title: 'x', artist: '', key: '', text: '[G]la', notation: 'german' };
  assert.match(String(songView({ ...song, format: 'chordpro' }, 16)), /chordpro-sheet/);
  assert.doesNotMatch(String(songView({ ...song, format: 'plain' }, 16)), /chordpro-sheet/);
  assert.doesNotMatch(String(songView({ ...song, format: 'tabs' }, 16)), /chordpro-sheet/);
});
