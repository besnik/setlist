// Install (product spec install-offline.md, "Install", "Permanent identity" and
// "App icon and install"): the web app manifest, its icons and the iPhone tags.
// Installing itself is tried by hand on the phones; these tests guard the files.

import { test, expect } from '@playwright/test';

/** Width and height of a PNG, read from its IHDR header. */
function pngSize(buffer) {
  expect(buffer.subarray(1, 4).toString('latin1')).toBe('PNG');
  return `${buffer.readUInt32BE(16)}x${buffer.readUInt32BE(20)}`;
}

/** The manifest linked from the page, with its URL. */
async function linkedManifest(page, request) {
  await page.goto('./');
  const url = await page.locator('link[rel="manifest"]').evaluate((link) => link.href);
  const response = await request.get(url);
  expect(response.ok()).toBe(true);
  expect(response.headers()['content-type']).toContain('application/manifest+json');
  return { url, manifest: await response.json() };
}

// Rules (Permanent identity): id, scope and start_url all resolve to /setlist/app/.
// Changing id later would create a second app on the user's device.
test('the manifest has the permanent id, scope and start address', async ({ page, request, baseURL }) => {
  const { url, manifest } = await linkedManifest(page, request);
  const resolve = (value) => new URL(value, url).href;

  expect(resolve(manifest.id)).toBe(baseURL);
  expect(resolve(manifest.scope)).toBe(baseURL);
  expect(resolve(manifest.start_url)).toBe(baseURL);
});

// Rules (Install): the installed app is called "Setlist", opens in its own window,
// starts with a dark splash and has no theme_color (the meta tags follow the theme).
test('the manifest names the app and opens it in its own window', async ({ page, request }) => {
  const { manifest } = await linkedManifest(page, request);

  expect(manifest.name).toBe('Setlist');
  expect(manifest.short_name).toBe('Setlist');
  expect(manifest.display).toBe('standalone');
  expect(manifest.background_color).toBe('#0e1013');
  expect(manifest).not.toHaveProperty('theme_color');
  expect(manifest).not.toHaveProperty('orientation');
});

// Rule (App icon): 192 and 512 px icons for browsers, a 512 px maskable icon for
// Android; every icon loads and has the size the manifest states.
test('the manifest icons load and have the stated sizes', async ({ page, request }) => {
  const { url, manifest } = await linkedManifest(page, request);

  const purposes = manifest.icons.map((icon) => `${icon.sizes} ${icon.purpose}`);
  expect(purposes).toEqual(expect.arrayContaining(['192x192 any', '512x512 any', '512x512 maskable']));
  for (const icon of manifest.icons) {
    expect(icon.src, 'icon paths are relative, so they work under /setlist/app/').not.toMatch(/^(\/|[a-z]+:)/i);
    const response = await request.get(new URL(icon.src, url).href);
    expect(response.ok(), icon.src).toBe(true);
    expect(response.headers()['content-type']).toBe('image/png');
    expect(pngSize(await response.body()), icon.src).toBe(icon.sizes);
  }
});

// Rule (Install, iPhone): Add to Home Screen uses the 180 px icon and the name "Setlist".
test('the page has the iPhone home screen icon and title', async ({ page, request }) => {
  await page.goto('./');
  const icon = await page.locator('link[rel="apple-touch-icon"]').evaluate((link) => link.href);
  const response = await request.get(icon);
  expect(response.ok()).toBe(true);
  expect(pngSize(await response.body())).toBe('180x180');
  await expect(page.locator('meta[name="apple-mobile-web-app-title"]')).toHaveAttribute('content', 'Setlist');
});

// Rule (Install, Chrome and Edge): the browser can read the manifest. Chromium
// reports the problems it found in it through its debugging protocol.
test('Chromium reads the manifest without errors', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'the manifest report exists only in Chromium');
  await page.goto('./');
  const session = await page.context().newCDPSession(page);
  const { errors } = await session.send('Page.getAppManifest');
  expect(errors).toEqual([]);
});
