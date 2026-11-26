// Start-up of the app: wires the layers together and renders the first screen,
// the song list (product spec songs.md). The search text lives in memory only,
// so it is kept while the app stays open and forgotten after a restart.
// Also registers the service worker (offline use and updates, install-offline.md).

import { appVersion, registerServiceWorker } from './data/app-version.js';
import { listSongs } from './data/song-repository.js';
import { searchSongs, sortSongs } from './domain/songs.js';
import { delegate } from './ui/events.js';
import { render } from './ui/html.js';
import { songList, songsScreen, versionLine } from './ui/songs-view.js';

const root = document.getElementById('app');
const songs = sortSongs(await listSongs());
let query = '';

render(root, songsScreen({ songs, shown: songs, query }));

delegate(root, 'input', {
  search: (event, input) => {
    query = input.value;
    render(document.getElementById('song-list'), songList(searchSongs(songs, query)));
  },
});

// After the first screen, so neither delays it. A failure here never breaks the app:
// without a worker it only does not work offline.
registerServiceWorker().catch((error) => console.warn('Service worker not registered:', error));
appVersion().then((version) => {
  if (version) render(document.getElementById('app-version'), versionLine(version));
});
