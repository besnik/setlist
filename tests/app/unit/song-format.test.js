// Song header (product spec songs.md, "Song format (M4)", Song header): the format
// and notation fallbacks, line ends in every format, and the header of the sample songs.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { NOTATIONS, SONG_FORMATS, songFormat, songNotation, splitLines } from '../../../app/src/domain/songs.js';
import { listSongs } from '../../../app/src/data/song-repository.js';
import { songView } from '../../../app/src/ui/views/song-view.js';

// Rule: a missing or unknown format is shown as `plain`.
test('a missing or unknown format counts as plain', () => {
  assert.equal(songFormat('plain'), 'plain');
  assert.equal(songFormat('chordpro'), 'chordpro');
  for (const unknown of [undefined, null, '', 'ChordPro', 'tabs', 1]) assert.equal(songFormat(unknown), 'plain', String(unknown));
});

// Rule: a missing or unknown notation counts as `international`.
test('a missing or unknown notation counts as international', () => {
  assert.equal(songNotation('international'), 'international');
  assert.equal(songNotation('german'), 'german');
  for (const unknown of [undefined, null, '', 'German', 'czech', 0]) assert.equal(songNotation(unknown), 'international', String(unknown));
});

// Rule: `\r\n` and `\r` count as one line break, like `\n`; empty lines keep their place.
test('lines split on \\r\\n, \\r and \\n', () => {
  assert.deepEqual(splitLines('a\r\nb\rc\nd'), ['a', 'b', 'c', 'd']);
  assert.deepEqual(splitLines('a\r\n\r\nb\n'), ['a', '', 'b', '']);
  assert.deepEqual(splitLines(''), ['']);
});

// Rule (`plain` format): Windows line ends show the same sheet as '\n' — no stray '\r'.
test('the plain sheet reads Windows line ends', () => {
  const sheet = (text) => /<div class="song-sheet"[^>]*>[\s\S]*<\/div>/.exec(String(songView({ id: 'x', title: 'x', artist: '', key: '', text, format: 'plain', notation: 'international' }, 16)))[0];
  assert.equal(sheet('G  C\r\nla la\rend'), sheet('G  C\nla la\nend'));
});

// Rule (Sample songs): the four English songs are `plain`, `international`, with no source.
test('the sample songs carry a valid song header', async () => {
  for (const song of await listSongs()) {
    assert.ok(SONG_FORMATS.includes(song.format), `${song.title} has a known format`);
    assert.ok(NOTATIONS.includes(song.notation), `${song.title} has a known notation`);
    if (song.importedAt !== undefined) assert.match(song.importedAt, /^\d{4}-\d{2}-\d{2}$/);
  }
  const englishIds = ['sample-amazing-grace', 'sample-house-of-the-rising-sun', 'sample-greensleeves', 'sample-when-the-saints'];
  const english = (await listSongs()).filter((song) => englishIds.includes(song.id));
  assert.equal(english.length, 4);
  for (const song of english) assert.deepEqual([song.format, song.notation, song.source], ['plain', 'international', undefined], song.title);
});
