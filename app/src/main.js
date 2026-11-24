// Start-up of the app: wires the layers together and renders the first screen.
// Placeholder until the app shell (T-015) and the song list (T-017) exist.

const root = document.getElementById('app');
const heading = document.createElement('h1');
heading.textContent = 'Setlist';
root.replaceChildren(heading);
