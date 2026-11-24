// Start-up of the app: wires the layers together and renders the first screen,
// the song list (product spec songs.md). The search text lives in memory only,
// so it is kept while the app stays open and forgotten after a restart.

import { listSongs } from './data/song-repository.js';
import { searchSongs, sortSongs } from './domain/songs.js';
import { delegate } from './ui/events.js';
import { render } from './ui/html.js';
import { songList, songsScreen } from './ui/songs-view.js';

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
