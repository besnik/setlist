// The app version (product spec install-offline.md, "Updates"): the running
// service worker holds it (app/sw.js), so the version shown is the version in use.
// Also registers that worker, because both are about the stored app.

/**
 * Registers the service worker, which stores the app for offline use. Not on the
 * dev server, where a cached app would hide edits after a reload; there it
 * removes a worker left from an earlier visit. `?sw` in the address turns it on
 * there anyway (the e2e tests of offline and updates).
 */
export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return; // e.g. plain http from another device
  const devServer = ['localhost', '127.0.0.1'].includes(location.hostname);
  if (devServer && !new URLSearchParams(location.search).has('sw')) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.unregister()));
    return;
  }
  // The URL resolves against the page, so the worker's scope is the app folder.
  await navigator.serviceWorker.register('./sw.js');
}

/**
 * Returns the version of the active service worker, or null when there is none
 * (first visit, dev server, a browser without service workers).
 * @returns {Promise<string | null>}
 */
export async function appVersion() {
  const worker = navigator.serviceWorker && (await navigator.serviceWorker.getRegistration())?.active;
  if (!worker) return null;
  const channel = new MessageChannel();
  const answer = new Promise((resolve) => {
    channel.port1.onmessage = (event) => resolve(event.data);
  });
  worker.postMessage('version', [channel.port2]);
  const version = await answer;
  return typeof version === 'string' ? version : null; // validate at the boundary
}
