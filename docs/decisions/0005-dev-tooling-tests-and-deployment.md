# 0005. Development tooling, tests, CI and deployment

- **Status:** accepted
- **Date:** 2026-11-24
- **Decided by:** CEO (in chat while defining the MVP; confirmed by merging the MVP plan PR)

## Context

The app itself needs no build ([ADR 0004](0004-tech-stack-and-architecture.md)), but agents and the CEO need repeatable commands to run the app, test it and check the rules (golden principles *A lean test base in the repository* and *Machines check, humans steer*). The CEO works on Windows and tests on an Android phone and an iPhone; a PWA needs HTTPS, so testing on a phone needs a public deployment.

## Options considered

### Command runner

1. **Makefile** — familiar, but awkward on Windows.
2. **npm scripts** (Node.js as a development tool only) ✅ — one place for all commands, works on Windows, macOS and Linux, and Node.js is needed for the test tools anyway.

### Tests

1. **Unit tests with Node's built-in runner (`node --test`)** ✅ — no dependency; fits the pure `domain` layer.
2. **End-to-end tests with Playwright (`@playwright/test`)** ✅ — real browsers including WebKit (close to Safari on iPhone), Chromium preinstalled in the agent environment, has a VS Code extension for Windows.
3. Alternatives (Vitest, Jest, Cypress, Web Test Runner) — add more dependencies without a need we have today.

### Dev server

1. **`npx serve` or similar package** — another dependency.
2. **`python -m http.server`** — needs Python, no correct MIME types everywhere.
3. **Own small static server in Node (`tools/`)** ✅ — about 40 lines, no dependency.

### Hosting

1. **GitHub Pages via GitHub Actions** ✅ — free for a public repository, HTTPS, deploys from `main`.
2. Netlify, Cloudflare Pages — extra accounts and services we do not need.

## Decision

1. **Node.js is a development tool only.** `package.json` at the repository root holds the commands and development dependencies; the app never depends on it.
2. **Commands** (documented in [ARCHITECTURE.md](../../ARCHITECTURE.md)): `npm start` (dev server), `npm test` (all tests), `npm run test:unit`, `npm run test:e2e`, `npm run check` (project rules).
3. **The only development dependency is `@playwright/test`**, pinned to an exact version that matches the browsers available in the agent environment (today `1.63.0`). Unit tests use `node --test`. The dev server and the check are our own scripts in `tools/`.
   - E2E tests run in Chromium everywhere; WebKit runs in CI (the agent environment has only Chromium).
   - The dev server serves the app under the same path as production (`/setlist/app/`) with correct content types, so path and scope bugs show up locally. The app uses relative URLs only.
4. **The check command** starts with: layer and part import rules, a header comment in every source file. Later checks are added when a rule matters (e.g. the offline file list in M2).
5. **CI:** a GitHub Actions workflow runs the check and all tests on every pull request; the deploy job runs them again before publishing.
6. **Deployment:** GitHub Actions publishes `main` to GitHub Pages. The workflow assembles the site from the parts:
   - `https://besnik.github.io/setlist/app/` ← `app/` — the app (PWA). The path is permanent: an installed PWA is bound to it.
   - `https://besnik.github.io/setlist/` ← `site/` — a redirect to the app today; later a signpost page and the user guide.
7. **Origin: we stay on `https://besnik.github.io`** (no custom domain, no separate organization). Browser storage and installed apps belong to the *origin*, not to the path. Consequences we accept:
   - Other projects published under `besnik.github.io` share the origin and could in theory read or clear Setlist data.
   - Moving to another domain later means users must move their data with the backup (M8) and reinstall the app.

## Consequences

- One command set for the CEO, agents and CI, on every operating system.
- E2E tests run in Chromium (and WebKit in CI); real devices are tested by hand by the CEO on the deployed site.
- GitHub Pages has no previews of pull requests: the CEO tries a change on the phone after it is merged (or, until M2, through `npm start` on the home network).
- The CEO must enable GitHub Pages once (Settings → Pages → Source: *GitHub Actions*).
- Linting and formatting tools are not part of this decision; they are an idea in the inbox.
