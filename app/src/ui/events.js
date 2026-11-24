// Delegated events (ADR 0004): instead of a listener on every element, one listener
// per event type sits on a root element. Elements name what they do with a
// data-action attribute (<button data-action="open-song">), and the listener calls
// the matching action. Re-rendering the content therefore never loses listeners.

/**
 * @callback Action
 * @param {Event} event
 * @param {Element} element the element with the data-action attribute
 */

/**
 * Listens for one event type on `root` and calls the action named by the nearest
 * data-action element around the event's target. An element whose action is not in
 * `actions` is skipped, so an <input data-action="search"> inside a clickable card
 * does not stop the card's click action.
 * @param {Element} root
 * @param {string} type event type, e.g. 'click' or 'input'
 * @param {Record<string, Action>} actions action name → function
 * @returns {() => void} stops listening
 */
export function delegate(root, type, actions) {
  const listener = (event) => {
    // Walk from the target up to (not including) the root; text nodes have no attributes.
    for (let node = event.target; node && node !== root; node = node.parentElement) {
      const name = node.getAttribute?.('data-action');
      if (name && Object.hasOwn(actions, name)) {
        actions[name](event, node);
        return;
      }
    }
  };
  root.addEventListener(type, listener);
  return () => root.removeEventListener(type, listener);
}
