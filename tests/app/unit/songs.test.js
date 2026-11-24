// Song list order and search (product spec songs.md, "Song list" and "Search"),
// the song count label, and the sample songs from the repository.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { searchSongs, songCountLabel, sortSongs } from '../../../app/src/domain/songs.js';
import { listSongs } from '../../../app/src/data/song-repository.js';

const song = (title, artist = '', key = '', id = title) => ({ id, title, artist, key, text: '' });
const titles = (songs) => songs.map((s) => s.title);

// Rule (Song list): sorted by title, ignoring letter case; accented letters sort with their base letter.
test('songs are sorted by title, ignoring case and accents', () => {
  const songs = [song('Cibuľa'), song('cesta'), song('Čaj'), song('Cabaret'), song('Ábel'), song('zima')];
  assert.deepEqual(titles(sortSongs(songs)), ['Ábel', 'Cabaret', 'Čaj', 'cesta', 'Cibuľa', 'zima']);
});

// Rule (Notes): the order does not depend on the input order; the input is not changed.
test('sorting is stable and leaves the input alone', () => {
  const a = song('Same', 'B', '', '1');
  const b = song('Same', 'A', '', '2');
  const input = [a, b];
  assert.deepEqual(sortSongs(input), [b, a]);
  assert.deepEqual(sortSongs([b, a]), [b, a]);
  assert.deepEqual(input, [a, b]);
});

// Rule (Search): title, artist or key contains the text, ignoring case, accents and surrounding spaces.
test('search matches title, artist and key, ignoring case, accents and spaces', () => {
  const songs = [song('Pieseň o láske', 'Ľudová', 'D'), song('Greensleeves', 'Traditional', 'Em')];
  assert.deepEqual(titles(searchSongs(songs, 'piesen')), ['Pieseň o láske']);
  assert.deepEqual(titles(searchSongs(songs, '  LUDOV ')), ['Pieseň o láske']);
  assert.deepEqual(titles(searchSongs(songs, 'em')), ['Greensleeves']);
  assert.deepEqual(titles(searchSongs(songs, 'trad')), ['Greensleeves']);
  assert.deepEqual(searchSongs(songs, 'xyz'), []);
});

// Rule (Search): clearing the field shows all songs again.
test('an empty or blank query returns all songs', () => {
  const songs = [song('A'), song('B')];
  assert.deepEqual(searchSongs(songs, ''), songs);
  assert.deepEqual(searchSongs(songs, '   '), songs);
});

// Rule (Song list): the heading shows "4 songs", singular "1 song".
test('the count label is singular for one song', () => {
  assert.equal(songCountLabel(0), '0 songs');
  assert.equal(songCountLabel(1), '1 song');
  assert.equal(songCountLabel(4), '4 songs');
});

// Rule (Sample songs): four public-domain songs with chords, artist "Traditional".
test('the repository returns the four sample songs', async () => {
  const songs = await listSongs();
  assert.deepEqual(
    songs.map((s) => [s.title, s.key, s.artist]).sort(),
    [
      ['Amazing Grace', 'G', 'Traditional'],
      ['Greensleeves', 'Em', 'Traditional'],
      ['House of the Rising Sun', 'Am', 'Traditional'],
      ['When the Saints Go Marching In', 'C', 'Traditional'],
    ],
  );
  for (const s of songs) assert.ok(s.id && s.text.length > 0, `${s.title} has an id and text`);
  songs[0].title = 'changed';
  assert.notEqual((await listSongs())[0].title, 'changed', 'callers get copies');
});
