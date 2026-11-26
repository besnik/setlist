// The router (ARCHITECTURE.md, "Screens and routing"): follows the address hash
// (routes.js) and shows the screen it names. A screen is a small object:
//   load(route)  optional, asynchronous: the data the screen needs, or null when
//                the address names something that does not exist (an unknown song);
//   show(root, data, navigation)  renders the screen, registers its actions and
//                returns hide(), which undoes them when another screen takes over.
// One screen is shown at a time. When the address changes quickly, data that
// arrives after a newer address is dropped, so an old screen never replaces a new one.

import { routeOf } from './routes.js';

/** @typedef {import('./routes.js').Route} Route */

/**
 * What a screen may do with the address.
 * @typedef {object} Navigation
 * @property {Route['screen'] | null} from the screen shown before this one; null on start
 * @property {() => void} back goes back in the history, like the browser's Back
 * @property {() => void} home replaces the address with the Songs screen's (no new history entry)
 */

/**
 * @typedef {object} Screen
 * @property {(route: Route) => Promise<unknown>} [load]
 * @property {(root: HTMLElement, data: unknown, navigation: Navigation) => () => void} show returns hide()
 */

/**
 * Shows the screen of the current address now and on every change of the address.
 * @param {HTMLElement} root the element the screens render into
 * @param {Record<Route['screen'], Screen>} screens a screen for every route
 * @returns {Promise<void>} resolves when the first screen is shown
 */
export function startRouter(root, screens) {
  let hide = () => {};
  let shown = null;
  let latest = 0; // counts address changes, to drop data that arrives late

  // Screens set their own scroll position; the browser's restore on Back would fight it.
  history.scrollRestoration = 'manual';

  const back = () => history.back(); // the hashchange then shows the previous screen
  const home = () => {
    history.replaceState(null, '', location.pathname + location.search);
    showAddress(); // replaceState fires no hashchange
  };

  async function showAddress() {
    const request = ++latest;
    const route = routeOf(location.hash);
    const screen = screens[route.screen];
    const data = screen.load ? await screen.load(route) : undefined;
    if (request !== latest) return;
    if (data === null) return home(); // the Songs screen always has data, so this ends
    hide();
    root.dataset.screen = route.screen; // e.g. the stage screen drops the column's top padding
    hide = screen.show(root, data, { from: shown, back, home });
    shown = route.screen;
  }

  window.addEventListener('hashchange', showAddress);
  return showAddress();
}
