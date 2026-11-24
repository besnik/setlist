// Delegated events (ADR 0004, task T-016): one listener per event type on a root
// element calls the action named by the nearest data-action element. A tiny stand-in
// for the DOM keeps this a fast unit test.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { delegate } from '../../../app/src/ui/events.js';

/** A minimal element: attributes, a parent and event listeners. */
function element(attributes = {}, parentElement = null) {
  const listeners = {};
  return {
    parentElement,
    getAttribute: (name) => attributes[name] ?? null,
    addEventListener: (type, listener) => { listeners[type] = listener; },
    removeEventListener: (type, listener) => { if (listeners[type] === listener) delete listeners[type]; },
    dispatch: (type, target) => listeners[type]?.({ type, target }),
    listeners,
  };
}

// The action of the nearest data-action element runs, with the event and that element.
test('the nearest action runs', () => {
  const root = element();
  const card = element({ 'data-action': 'open' }, root);
  const icon = element({}, card);
  const calls = [];
  delegate(root, 'click', { open: (event, target) => calls.push([event.type, target]) });

  root.dispatch('click', icon);
  assert.deepEqual(calls, [['click', card]]);
});

// An action that this event type does not handle is skipped in favour of an outer one.
test('unhandled actions are skipped', () => {
  const root = element();
  const card = element({ 'data-action': 'open' }, root);
  const input = element({ 'data-action': 'search' }, card);
  const calls = [];
  delegate(root, 'click', { open: () => calls.push('open') });
  delegate(root, 'input', { search: () => calls.push('search') });

  root.dispatch('click', input);
  root.dispatch('input', input);
  assert.deepEqual(calls, ['open', 'search']);
});

// No action, the root's own attribute and inherited object names do nothing.
test('nothing runs without a matching action', () => {
  const root = element({ 'data-action': 'open' });
  const plain = element({}, root);
  const odd = element({ 'data-action': 'toString' }, root);
  const calls = [];
  delegate(root, 'click', { open: () => calls.push('open') });

  root.dispatch('click', plain);
  root.dispatch('click', odd);
  root.dispatch('click', { parentElement: plain }); // a text node: no attributes
  assert.deepEqual(calls, []);
});

// The returned function removes the listener.
test('listening can be stopped', () => {
  const root = element();
  const stop = delegate(root, 'click', {});
  assert.equal(typeof root.listeners.click, 'function');
  stop();
  assert.equal(root.listeners.click, undefined);
});
