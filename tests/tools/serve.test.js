// Tests of the dev server (tools/serve.js): it serves app/ at the production path
// /setlist/app/ and site/ at /setlist/ with correct content types (ADR 0005),
// never serves files outside them, and survives malformed requests.

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { connect } from 'node:net';
import { once } from 'node:events';

const PORT = 4189;
const base = `http://localhost:${PORT}`;
let server;

before(async () => {
  server = spawn(process.execPath, ['tools/serve.js'], { env: { ...process.env, PORT: String(PORT) } });
  await once(server.stdout, 'data'); // the server prints its address once it listens
});

after(() => server.kill());

/** Sends a raw HTTP request line, so malformed targets reach the server unchanged. */
async function raw(target) {
  const socket = connect(PORT, 'localhost');
  await once(socket, 'connect');
  socket.end(`GET ${target} HTTP/1.1\r\nHost: localhost\r\nConnection: close\r\n\r\n`);
  socket.on('error', () => {});
  socket.resume(); // drain the response, or 'close' never fires
  await once(socket, 'close');
}

// Rule: the app is served at /setlist/app/ with correct content types; site/ at /setlist/.
test('serves the app at its production path', async () => {
  const page = await fetch(`${base}/setlist/app/`);
  assert.equal(page.status, 200);
  assert.match(page.headers.get('content-type'), /^text\/html/);
  const script = await fetch(`${base}/setlist/app/src/main.js`);
  assert.match(script.headers.get('content-type'), /^text\/javascript/);
  const site = await fetch(`${base}/setlist/`);
  assert.equal(site.status, 200);
  assert.match(await site.text(), /url=app\//);
  for (const [path, location] of [['/', '/setlist/'], ['/setlist', '/setlist/'], ['/setlist/app', '/setlist/app/']]) {
    const response = await fetch(`${base}${path}`, { redirect: 'manual' });
    assert.equal(response.status, 302, path);
    assert.equal(response.headers.get('location'), location, path);
  }
});

// Rule: no file outside app/ and site/ is served, even with encoded `..` segments.
test('does not serve files outside app/ and site/', async () => {
  for (const path of [
    '/setlist/app/..%2fpackage.json', '/setlist/app/..%5cpackage.json', '/setlist/app/%2e%2e/package.json',
    '/setlist/..%2fpackage.json', '/setlist/%2e%2e/package.json', '/package.json',
  ]) {
    assert.equal((await fetch(`${base}${path}`)).status, 404, path);
  }
});

// Bug: a malformed request target (`new URL` throws outside the try/catch) crashed the server.
test('survives a malformed request target', async () => {
  await raw('http://[');
  await raw('/setlist/app/%E0%A4%A');
  assert.equal((await fetch(`${base}/setlist/app/`)).status, 200);
});

// Bug (T-031 QA): an address with an encoded null byte names no file, so it is "Not
// found" as before; the narrowed catch answered it with 500 and logged a stack trace.
test('an encoded null byte in the address is not found', async () => {
  assert.equal((await fetch(`${base}/setlist/app/%00`)).status, 404);
});
