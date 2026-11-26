// Keeps the screen on (product spec songs.md, "Song view (M3)", Screen stays on)
// with the Screen Wake Lock API. The browser releases the lock when the page is
// hidden (another app, a locked phone), so it is requested again when the page
// becomes visible. Without the API, or when the browser refuses (no secure
// context, battery saver), nothing happens and no message is shown.

/**
 * Keeps the screen on until the returned function is called.
 * @returns {() => void} stops keeping the screen on and releases the lock
 */
export function keepScreenOn() {
  if (!navigator.wakeLock) return () => {};
  let lock = null;
  let stopped = false;

  const request = async () => {
    if (stopped || document.visibilityState !== 'visible' || (lock && !lock.released)) return;
    try {
      const granted = await navigator.wakeLock.request('screen');
      // Stopped meanwhile, or a second request won the race: keep only one lock.
      if (stopped || (lock && !lock.released)) release(granted);
      else lock = granted;
    } catch {
      // Refused: the screen turns off as usual.
    }
  };

  document.addEventListener('visibilitychange', request);
  request();
  return () => {
    stopped = true;
    document.removeEventListener('visibilitychange', request);
    if (lock) release(lock);
    lock = null;
  };
}

function release(lock) {
  lock.release().catch(() => {});
}
