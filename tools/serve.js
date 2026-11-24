// Development server: serves the app under the same path as production
// (`/setlist/app/` ← `app/`) with correct content types, so path and scope
// bugs show up locally. No caching, so a reload always shows the latest files.
//
// Usage: npm start            (port 8080, reachable from the home network)
//        PORT=4173 npm start

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { networkInterfaces } from 'node:os';
import { extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const APP_DIR = join(ROOT, 'app');
const APP_PATH = '/setlist/app/';
const PORT = Number(process.env.PORT) || 8080;

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};

/** Maps a URL path to a file inside `app/`, or returns null when it is outside. */
function fileFor(urlPath) {
  const relative = decodeURIComponent(urlPath.slice(APP_PATH.length));
  const file = resolve(APP_DIR, relative);
  // Refuse `..` tricks: the file must stay inside app/.
  return file === APP_DIR || file.startsWith(APP_DIR + sep) ? file : null;
}

async function handle(req, res) {
  let pathname;
  try {
    ({ pathname } = new URL(req.url, 'http://localhost'));
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Bad request');
    return;
  }

  // The website root redirects to the app, like `site/` does in production.
  if (pathname === '/' || pathname === '/setlist' || pathname === '/setlist/' || pathname === '/setlist/app') {
    res.writeHead(302, { Location: APP_PATH }).end();
    return;
  }

  try {
    let file = pathname.startsWith(APP_PATH) ? fileFor(pathname) : null;
    if (file && (await stat(file)).isDirectory()) file = join(file, 'index.html');
    // Like GitHub Pages: a file name followed by a slash is not found.
    else if (pathname.endsWith('/')) file = null;
    if (!file) throw new Error('outside the app');
    const body = await readFile(file);
    res.writeHead(200, {
      'Content-Type': CONTENT_TYPES[extname(file)] ?? 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
  }
}

createServer(handle).listen(PORT, () => {
  console.log(`Setlist dev server: http://localhost:${PORT}${APP_PATH}`);
  // Addresses for trying the app on a phone in the same network.
  for (const addresses of Object.values(networkInterfaces())) {
    for (const { family, internal, address } of addresses ?? []) {
      if (family === 'IPv4' && !internal) console.log(`  on the network: http://${address}:${PORT}${APP_PATH}`);
    }
  }
});
