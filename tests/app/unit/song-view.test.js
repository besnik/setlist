// Song view (product spec songs.md, "Song view (M3)", Content): the pure view of
// one song — fallbacks, escaping, the text as written, chord lines and the close button.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { songView } from '../../../app/src/ui/views/song-view.js';
import { songList } from '../../../app/src/ui/views/songs-view.js';

const song = { id: 'my song/1', title: '<i>Tom & Jerry</i>', artist: '', key: '', text: '  C\nla <la>' };

// Rule (Content): "Unknown artist" when empty, no key chip without a key; song data is escaped.
test('the Song view shows fallbacks and escapes song data', () => {
  const markup = String(songView(song));
  assert.match(markup, /Unknown artist/);
  assert.doesNotMatch(markup, /key-chip/);
  assert.match(markup, /&lt;i&gt;Tom &amp; Jerry&lt;\/i&gt;/);
  // Spaces and lines kept; the chord line in its own span, the lyric line plain.
  assert.match(markup, /<div class="song-sheet"><span class="chord-line">  C<\/span>\nla &lt;la&gt;<\/div>/);
  assert.match(markup, /aria-label="Close"[^>]*data-action="close-song"/);
  assert.match(String(songView({ ...song, key: 'Am' })), /<span class="key-chip">Am<\/span>/);
});

// Rule (Open and close): every row links to the song's own address, with the id encoded.
test('a song row links to its Song view', () => {
  assert.match(String(songList([song])), /<a class="song-row" href="#\/song\/my%20song%2F1">/);
});

// Rule (Chord lines): only chord lines are marked; empty lines keep their place.
test('the sheet marks chord lines only and keeps empty lines', () => {
  const markup = String(songView({ ...song, text: 'Am I wrong\n\nG  (D)\n| x2 |' }));
  assert.match(markup, /<div class="song-sheet">Am I wrong\n\n<span class="chord-line">G  \(D\)<\/span>\n\| x2 \|<\/div>/);
});
