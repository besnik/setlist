// The app's log (ARCHITECTURE.md, "Errors and logging"; ADR 0007): the only place
// that writes to the browser console, so every message has the same prefix and
// can be found among the browser's own. There is no server: the log stays on the
// device (developer tools), nothing is sent anywhere.
//
// Levels: error — a bug or a failure that breaks the app and must be fixed;
// warn — a feature does not work, the app does; info — rare events worth knowing
// (one line at start-up). Never log song texts or other user data.

const PREFIX = '[setlist]';

/** Writes to the console with the app's prefix; `details` are e.g. the caught error. */
export const log = {
  /** @param {string} message what was being done @param {...unknown} details */
  error: (message, ...details) => console.error(PREFIX, message, ...details),
  /** @param {string} message @param {...unknown} details */
  warn: (message, ...details) => console.warn(PREFIX, message, ...details),
  /** @param {string} message @param {...unknown} details */
  info: (message, ...details) => console.info(PREFIX, message, ...details),
};

/**
 * Logs every error nothing else caught (a thrown error or a rejected promise) as
 * an error with the app's prefix. Replaces the browser's own report of it, so each
 * error is in the console once. Called once at start-up, before anything can fail.
 */
export function logUncaughtErrors() {
  window.addEventListener('error', (event) => {
    event.preventDefault();
    log.error('Uncaught error', event.error ?? event.message);
  });
  window.addEventListener('unhandledrejection', (event) => {
    event.preventDefault();
    log.error('Unhandled promise rejection', event.reason);
  });
}
