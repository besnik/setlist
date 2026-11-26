// Development server: serves the website under the same paths as production
// (`/setlist/app/` ← `app/`, `/setlist/` ← `site/`) with correct content types,
// so path and scope bugs show up locally. No caching, so a reload always shows
// the latest files.
//
// Usage: npm start            (port 8080, reachable from the home network)
//        PORT=4173 npm start

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { networkInterfaces } from 'node:os';
import { extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const APP_PATH = '/setlist/app/';
const SITE_PATH = '/setlist/';
// URL path prefix → folder, like the deploy workflow assembles the site.
// The longer prefix comes first, so /setlist/app/ is never looked up in site/.
const MOUNTS = [
  [APP_PATH, join(ROOT, 'app')],
  [SITE_PATH, join(ROOT, 'site')],
];
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

/** Maps a URL path to a file inside its mounted folder, or returns null when it is outside. */
function fileFor(urlPath) {
  // `${urlPath}/` also matches a mounted folder without its slash (`/setlist/app`).
  const mount = MOUNTS.find(([prefix]) => `${urlPath}/`.startsWith(prefix));
  if (!mount) return null;
  const [prefix, dir] = mount;
  const file = resolve(dir, decodeURIComponent(urlPath.slice(prefix.length)));
  // Refuse `..` tricks: the file must stay inside its folder.
  return file === dir || file.startsWith(dir + sep) ? file : null;
}

async function handle(req, res) {
  let pathname;
  try {
    ({ pathname } = new URL(req.url, 'http://localhost'));
  } catch (error) {
    if (!(error instanceof TypeError)) throw error; // TypeError: not a valid URL
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Bad request');
    return;
  }

  // The server root leads to the website (site/ itself redirects to the app).
  if (pathname === '/' || pathname === '/setlist') {
    res.writeHead(302, { Location: SITE_PATH }).end();
    return;
  }

  try {
    let file = fileFor(pathname);
    if (file && (await stat(file)).isDirectory()) {
      // Like GitHub Pages: a folder without its trailing slash redirects to the
      // folder, so relative URLs on its page resolve inside it.
      if (!pathname.endsWith('/')) {
        res.writeHead(302, { Location: `${pathname}/` }).end();
        return;
      }
      file = join(file, 'index.html');
    }
    // Like GitHub Pages: a file name followed by a slash is not found.
    else if (pathname.endsWith('/')) file = null;
    if (!file) return notFound(res); // outside the website
    const body = await readFile(file);
    res.writeHead(200, {
      'Content-Type': CONTENT_TYPES[extname(file)] ?? 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(body);
  } catch (error) {
    // Expected: no such file, or a broken escape (URIError) that names no file.
    if (NOT_FOUND.has(error?.code) || error instanceof URIError) return notFound(res);
    // A bug or a disk error: say so instead of hiding it behind "Not found".
    console.error(`Setlist dev server: ${pathname}:`, error);
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Server error');
  }
}

// File system errors that mean the address names no file.
const NOT_FOUND = new Set(['ENOENT', 'ENOTDIR', 'EISDIR']);

function notFound(res) {
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
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
