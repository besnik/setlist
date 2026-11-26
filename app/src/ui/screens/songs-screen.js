// The Songs screen (product spec songs.md, "Song list" and "Search"): loads the
// songs, shows the list and filters it as the user types. It keeps its state in
// memory while the app is open — the search text, the scroll position (restored
// when the screen shows again) and the app version shown below the list.

import { listSongs } from '../../data/song-repository.js';
import { searchSongs, sortSongs } from '../../domain/songs.js';
import { delegate } from '../events.js';
import { render } from '../html.js';
import { songList, songsView, versionLine } from '../views/songs-view.js';

/** @returns {import('../router.js').Screen & { setVersion: (version: string | null) => void }} */
export function createSongsScreen() {
  let query = '';
  let scroll = 0;
  let version = null;

  return {
    load: async () => sortSongs(await listSongs()),

    show(root, songs) {
      render(root, songsView({ songs, shown: searchSongs(songs, query), query, version }));
      window.scrollTo(0, scroll);
      // Typing re-renders only the list, so the search field keeps its focus and cursor.
      const stop = delegate(root, 'input', {
        search: (event, input) => {
          query = input.value;
          render(root.querySelector('#song-list'), songList(searchSongs(songs, query)));
        },
      });
      return () => {
        scroll = window.scrollY;
        stop();
      };
    },

    /** Shows the app version below the list once the service worker has answered. */
    setVersion(found) {
      version = found;
      const line = document.getElementById('app-version'); // only while this screen is shown
      if (version && line) render(line, versionLine(version));
    },
  };
}
