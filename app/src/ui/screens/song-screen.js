// The Song view screen (product spec songs.md, "Song view (M3)"): loads one song
// and shows it; closes with the close button or Escape. Back and the Android back
// gesture need no code: they change the address and the router shows the list.
// A− and A+ change the font size of the song text, the same for every song and
// remembered on the device (data/settings-repository.js).

import { canGrowFontSize, canShrinkFontSize, largerFontSize, smallerFontSize } from '../../domain/font-size.js';
import { getFontSize, setFontSize } from '../../data/settings-repository.js';
import { getSong } from '../../data/song-repository.js';
import { delegate, onKeys } from '../events.js';
import { render } from '../html.js';
import { songView } from '../views/song-view.js';

/** @returns {import('../router.js').Screen} */
export function createSongScreen() {
  return {
    // null for an unknown id: the router shows the list
    async load({ id }) {
      const [song, fontSize] = await Promise.all([getSong(id), getFontSize()]);
      return song && { song, fontSize };
    },

    show(root, { song, fontSize }, navigation) {
      render(root, songView(song, fontSize));
      window.scrollTo(0, 0);
      // Opened from the Songs screen, closing goes back, so the history does not grow.
      // Opened directly by its address, there may be no Songs screen before it (or
      // another website), so closing replaces the address instead.
      const close = navigation.from === 'songs' ? navigation.back : navigation.home;
      let size = fontSize;
      const resize = (change) => () => {
        size = change(size);
        applyFontSize(root, size);
        setFontSize(size);
      };
      const stops = [
        delegate(root, 'click', { 'close-song': close, 'smaller-text': resize(smallerFontSize), 'larger-text': resize(largerFontSize) }),
        onKeys(document, { Escape: close }),
      ];
      return () => stops.forEach((stop) => stop());
    },
  };
}

// Updates the shown view in place instead of rendering it again, so the pressed
// button keeps its keyboard focus and the text its scroll position.
function applyFontSize(root, size) {
  root.querySelector('.song-sheet').style.setProperty('--sheet-size', `${size}px`);
  root.querySelector('[data-action="smaller-text"]').disabled = !canShrinkFontSize(size);
  root.querySelector('[data-action="larger-text"]').disabled = !canGrowFontSize(size);
}
