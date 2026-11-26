// The Song view screen (product spec songs.md, "Song view (M3)"): loads one song
// and shows it; closes with the close button or Escape. Back and the Android back
// gesture need no code: they change the address and the router shows the list.

import { getSong } from '../../data/song-repository.js';
import { delegate, onKeys } from '../events.js';
import { render } from '../html.js';
import { songView } from '../views/song-view.js';

/** @returns {import('../router.js').Screen} */
export function createSongScreen() {
  return {
    load: ({ id }) => getSong(id), // null for an unknown id: the router shows the list

    show(root, song, navigation) {
      render(root, songView(song));
      window.scrollTo(0, 0);
      // Opened from the Songs screen, closing goes back, so the history does not grow.
      // Opened directly by its address, there may be no Songs screen before it (or
      // another website), so closing replaces the address instead.
      const close = navigation.from === 'songs' ? navigation.back : navigation.home;
      const stops = [delegate(root, 'click', { 'close-song': close }), onKeys(document, { Escape: close })];
      return () => stops.forEach((stop) => stop());
    },
  };
}
