// Service worker of the app (product spec install-offline.md, "Offline" and
// "Updates"). A standalone classic script outside the layers: it imports nothing
// and nothing imports it; src/data/app-version.js registers it.
//
// - install: downloads every file of the app into a cache named after VERSION. If
//   any file fails, the install fails, so a partial update never becomes active
//   and the app keeps its current version (the browser tries again later).
// - fetch: answers the app's requests from this version's cache (cache-first);
//   the start page ('./' or './index.html') is answered with index.html.
// - activate: removes the caches of older versions. The browser activates a new
//   worker only when no page of the app is open (no skipWaiting), so a new version
//   is used from the next start and a performance is never interrupted.

// Change on every release: the browser installs a new worker only when this file
// changes, and the cache name keeps versions apart. Format: date of the change,
// YYYY.MM.DD (.2, .3 for more releases on one day).
const VERSION = '2026.11.27';
const CACHE = `setlist-${VERSION}`;

// Every published file of the app except this worker and documentation (README,
// licence texts), relative to this file. Missing a file here breaks offline use.
const FILES = [
  'index.html',
  'manifest.webmanifest',
  'src/main.js',
  'src/data/app-version.js',
  'src/data/sample-songs.js',
  'src/data/settings-repository.js',
  'src/data/song-repository.js',
  'src/domain/chords.js',
  'src/domain/font-size.js',
  'src/domain/songs.js',
  'src/ui/events.js',
  'src/ui/html.js',
  'src/ui/log.js',
  'src/ui/routes.js',
  'src/ui/router.js',
  'src/ui/components/key-chip.js',
  'src/ui/components/plain-sheet.js',
  'src/ui/components/stage-button.js',
  'src/ui/screens/song-screen.js',
  'src/ui/screens/songs-screen.js',
  'src/ui/views/song-view.js',
  'src/ui/views/songs-view.js',
  'src/ui/wake-lock.js',
  'styles/base.css',
  'styles/components.css',
  'styles/fonts.css',
  'styles/song-screen.css',
  'styles/songs-screen.css',
  'styles/tokens.css',
  'assets/fonts/bricolage-grotesque-700.woff2',
  'assets/fonts/dm-sans-400.woff2',
  'assets/fonts/dm-sans-600.woff2',
  'assets/fonts/jetbrains-mono-400.woff2',
  'assets/fonts/jetbrains-mono-700.woff2',
  'assets/icons/apple-touch-icon-180.png',
  'assets/icons/icon-192.png',
  'assets/icons/icon-512.png',
  'assets/icons/icon-maskable-512.png',
];

const START_PAGES = new Set([new URL('./', self.location).href, new URL('index.html', self.location).href]);

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      // Download everything first and store only when all files arrived.
      // cache: 'reload' skips the HTTP cache, which could still hold the files of
      // the previous version and put them under this version's name.
      const responses = await Promise.all(
        FILES.map(async (file) => {
          const response = await fetch(new Request(file, { cache: 'reload' }));
          if (!response.ok) throw new Error(`${file}: HTTP ${response.status}`);
          // Read the body now: unread bodies hold the browser's few connections
          // per server, and the remaining downloads would wait forever.
          const { status, statusText, headers } = response;
          return [file, new Response(await response.blob(), { status, statusText, headers })];
        }),
      );
      const cache = await caches.open(CACHE);
      await Promise.all(responses.map(([file, response]) => cache.put(file, response)));
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(names.filter((name) => name.startsWith('setlist-') && name !== CACHE).map((name) => caches.delete(name)));
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  url.search = ''; // e.g. './?sw' (see src/data/app-version.js) is the start page too
  const key = START_PAGES.has(url.href) ? 'index.html' : request;
  event.respondWith(
    (async () => {
      // Only this version's cache: a newer version waiting in its own cache must not mix in.
      const cached = await (await caches.open(CACHE)).match(key);
      return cached ?? fetch(request);
    })(),
  );
});

// The version line asks which version is running (src/data/app-version.js).
self.addEventListener('message', (event) => {
  if (event.data === 'version') event.ports[0]?.postMessage(VERSION);
});
