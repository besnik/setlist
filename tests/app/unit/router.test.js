// Router (product spec songs.md, "Song view (M3)", Routing): `#/song/<id>` is the
// Song view, anything else the Songs screen; ids are encoded in the address.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { routeOf, songHash } from '../../../app/src/ui/router.js';

// Rule (Open and close): every song has its own address, #/song/<song id>.
test('a song address names the Song view of that song', () => {
  assert.deepEqual(routeOf('#/song/sample-amazing-grace'), { screen: 'song', id: 'sample-amazing-grace' });
});

test('any other address is the Songs screen', () => {
  for (const hash of ['', '#', '#/', '#/song/', '#/song', '#/songs/x', '#/song/a/b', '#other', '#/song/%E0']) {
    assert.deepEqual(routeOf(hash), { screen: 'songs' }, hash);
  }
});

// Routing: song ids in addresses are encoded, so ids created later stay safe.
test('ids with special characters survive the address', () => {
  for (const id of ['a b', 'a/b', 'č#?%&', 'x:y']) {
    const hash = songHash(id);
    assert.match(hash, /^#\/song\/[^/#?]+$/, id);
    assert.deepEqual(routeOf(hash), { screen: 'song', id });
  }
});
