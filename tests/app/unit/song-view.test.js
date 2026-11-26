// Song view (product spec songs.md, "Song view (M3)", Content): the pure view of
// one song — fallbacks, escaping, the text as written, chord lines, the close button and
// the font size buttons.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { songView } from '../../../app/src/ui/views/song-view.js';
import { songList } from '../../../app/src/ui/views/songs-view.js';

const song = { id: 'my song/1', title: '<i>Tom & Jerry</i>', artist: '', key: '', text: '  C\nla <la>' };

// Rule (Content): "Unknown artist" when empty, no key chip without a key; song data is escaped.
test('the Song view shows fallbacks and escapes song data', () => {
  const markup = String(songView(song, 16));
  assert.match(markup, /Unknown artist/);
  assert.doesNotMatch(markup, /key-chip/);
  assert.match(markup, /&lt;i&gt;Tom &amp; Jerry&lt;\/i&gt;/);
  // Spaces and lines kept; the chord line in its own span, the lyric line plain.
  assert.match(markup, /<div class="song-sheet" style="--sheet-size: 16px"><span class="chord-line">  C<\/span>\nla &lt;la&gt;<\/div>/);
  assert.match(markup, /aria-label="Close"[^>]*data-action="close-song"/);
  assert.match(String(songView({ ...song, key: 'Am' }, 16)), /<span class="key-chip">Am<\/span>/);
});

// Rule (Open and close): every row links to the song's own address, with the id encoded.
test('a song row links to its Song view', () => {
  assert.match(String(songList([song])), /<a class="song-row" href="#\/song\/my%20song%2F1">/);
});

// Rule (Chord lines): only chord lines are marked; empty lines keep their place.
test('the sheet marks chord lines only and keeps empty lines', () => {
  const markup = String(songView({ ...song, text: 'Am I wrong\n\nG  (D)\n| x2 |' }, 16));
  assert.match(markup, /<div class="song-sheet" style="--sheet-size: 16px">Am I wrong\n\n<span class="chord-line">G  \(D\)<\/span>\n\| x2 \|<\/div>/);
});

// Rules (Font size): the sheet has the chosen size; A− is disabled at 12 px, A+ at 32 px.
test('the font size buttons are disabled at the limits', () => {
  const buttons = (size) => {
    const markup = String(songView(song, size));
    return {
      sheet: /class="song-sheet" style="([^"]*)"/.exec(markup)[1],
      smaller: /<button[^>]*aria-label="Smaller text"[^>]*>/.exec(markup)[0].includes(' disabled'),
      larger: /<button[^>]*aria-label="Larger text"[^>]*>/.exec(markup)[0].includes(' disabled'),
    };
  };
  assert.deepEqual(buttons(16), { sheet: '--sheet-size: 16px', smaller: false, larger: false });
  assert.deepEqual(buttons(12), { sheet: '--sheet-size: 12px', smaller: true, larger: false });
  assert.deepEqual(buttons(32), { sheet: '--sheet-size: 32px', smaller: false, larger: true });
  assert.match(String(songView(song, 16)), />A\u2212<\/button>/);
});
