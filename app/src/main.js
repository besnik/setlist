// Start-up of the app: wires the layers together. The router shows the screen the
// address names (ui/router.js, ui/screens/); the service worker stores the app for
// offline use and tells its version (install-offline.md). Errors nothing else
// catches are logged (ui/log.js, ARCHITECTURE.md "Errors and logging").

import { appVersion, registerServiceWorker } from './data/app-version.js';
import { log, logUncaughtErrors } from './ui/log.js';
import { startRouter } from './ui/router.js';
import { createSongScreen } from './ui/screens/song-screen.js';
import { createSongsScreen } from './ui/screens/songs-screen.js';

logUncaughtErrors();

const songsScreen = createSongsScreen();
await startRouter(document.getElementById('app'), { songs: songsScreen, song: createSongScreen() });

// After the first screen, so neither delays it. A failure here never breaks the app:
// without a worker it only does not work offline.
registerServiceWorker().catch((error) => log.warn('Service worker not registered', error));
appVersion().then((version) => {
  songsScreen.setVersion(version);
  log.info(`Started, version ${version ?? 'unknown (no service worker)'}`);
});
