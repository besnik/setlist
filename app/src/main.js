// Start-up of the app: wires the layers together and shows the screen the address
// names (ui/router.js): the Songs screen or the Song view of one song (product spec
// songs.md). The Songs screen state (search text, scroll position) lives in memory
// only, so it is kept while the app stays open and forgotten after a restart.
// Also registers the service worker (offline use and updates, install-offline.md).

import { appVersion, registerServiceWorker } from './data/app-version.js';
import { getSong, listSongs } from './data/song-repository.js';
import { searchSongs, sortSongs } from './domain/songs.js';
import { delegate, onKeys } from './ui/events.js';
import { render } from './ui/html.js';
import { routeOf } from './ui/router.js';
import { songScreen } from './ui/song-view.js';
import { songList, songsScreen, versionLine } from './ui/songs-view.js';

const root = document.getElementById('app');
const songs = sortSongs(await listSongs());
let query = '';
let version = null;
let listScroll = 0; // scroll position of the Songs screen, restored when it shows again
let screen = null; // the screen shown now: 'songs' or 'song'
let openedFromList = false; // whether the Song view shown was opened from the Songs screen

// The app restores the Songs screen's scroll position itself; the browser's own
// restore on Back would fight it.
history.scrollRestoration = 'manual';

/** Shows the screen of the current address. */
async function show() {
  if (screen === 'songs') listScroll = window.scrollY;
  const route = routeOf(location.hash);
  if (route.screen === 'song') {
    const song = await getSong(route.id);
    if (song) {
      openedFromList = screen === 'songs';
      showScreen('song', songScreen(song));
      window.scrollTo(0, 0);
      return;
    }
    goToSongsAddress(); // an unknown song: the Songs screen with its own address
  }
  if (screen === 'songs') return; // e.g. an unknown '#…' while the list is shown
  showScreen('songs', songsScreen({ songs, shown: searchSongs(songs, query), query, version }));
  window.scrollTo(0, listScroll);
}

function showScreen(name, template) {
  screen = name;
  root.dataset.screen = name; // the stage screen drops the column's top padding (styles)
  render(root, template);
}

/** Replaces the address with the Songs screen's, without a new history entry. */
function goToSongsAddress() {
  history.replaceState(null, '', location.pathname + location.search);
}

/**
 * Closes the Song view. Opened from the Songs screen it goes back, so the history
 * does not grow; opened directly by its address there may be no Songs screen
 * before it (or another website), so it replaces the address instead.
 */
function closeSong() {
  if (openedFromList) {
    history.back(); // the hashchange shows the Songs screen
  } else {
    goToSongsAddress();
    show();
  }
}

window.addEventListener('hashchange', show);
delegate(root, 'click', { 'close-song': closeSong });
delegate(root, 'input', {
  search: (event, input) => {
    query = input.value;
    render(document.getElementById('song-list'), songList(searchSongs(songs, query)));
  },
});
onKeys(document, {
  Escape: () => {
    if (screen === 'song') closeSong();
  },
});
await show();

// After the first screen, so neither delays it. A failure here never breaks the app:
// without a worker it only does not work offline.
registerServiceWorker().catch((error) => console.warn('Service worker not registered:', error));
appVersion().then((found) => {
  version = found;
  const line = document.getElementById('app-version'); // only on the Songs screen
  if (version && line) render(line, versionLine(version));
});
