# Architecture

Setlist is an offline-first Progressive Web App. All data lives on the user's device; there is no backend.

## Technical constraints

Project decisions about technology (the harness itself stays technology-neutral — see the golden principles).

- **No build step required.** The app runs straight from the source files in a browser.
- **Native ES modules.** The code uses the browser's native module system; every module imports what it uses (golden principle *Explicit dependencies, no global state*).

The detailed structure (modules, layers, code map) will be designed together with the solution and added here.
Until then, the golden principle *Simplicity first* ([docs/golden-principles.md](docs/golden-principles.md)) applies to all code.
