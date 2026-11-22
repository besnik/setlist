# Architecture

A short map of how Setlist is structured. Read this before changing code.
Concrete technologies and tooling are defined in the tech stack ADR (to be written in [docs/decisions/](docs/decisions/)).

## Overview

Setlist is an offline-first Progressive Web App. All data lives on the user's device; there is no backend.
The code is split into **domains** (data and logic) and **UI**, each with a fixed set of layers.
Dependencies only point "forward" through the layers — never backwards and never sideways unless stated below.

```
            ┌──────────────────── UI ─────────────────────┐
            │  components  →  views  →  app (shell)       │
            └──────────────────────▲──────────────────────┘
                                   │
   ┌──────────────── each domain ──┴─────────────────────┐
   │  types  →  repository  →  service (optional)        │
   └─────────────────▲───────────────────────────────────┘
                     │
                 platform            shared  (usable by all)
```

## Domains

Planned: `songs`, `setlists`, `settings`. A new domain gets the same layers.

| Layer | Responsibility | May depend on | Must not |
|---|---|---|---|
| **types** | Data shapes, factory functions (`createSong()`), validation (`validateSong()`) | shared | Touch the DOM, storage or any other layer |
| **repository** | Load and save the domain's entities (`songRepository.getAll()`, `save()`); validates data read from storage via types | types, platform, shared | Touch the DOM or UI |
| **service** *(optional)* | Logic spanning several entities or domains (e.g. "add song to setlist") | types, repositories (also of other domains), shared | Touch the DOM or UI |

**When to add a service:** only when logic spans more than one entity or domain. For plain create/read/update/delete, the UI calls the repository directly (YAGNI).

## Platform

Technical infrastructure: browser storage, service worker helpers and similar.
**Only repositories may use storage from platform.** This keeps a future cloud sync a change in platform and repositories only — the rest of the app stays untouched.

## UI

| Layer | Responsibility | Rules |
|---|---|---|
| **components** | Reusable UI pieces (song item, button, list, dialog) | "Dumb": receive data as parameters, report user actions as events (`CustomEvent`). Never call repositories or services, know nothing about routing. |
| **views** | Screens (song list, song editor, setlist, gig mode) | Compose components, call services or repositories, hold screen state. |
| **app** | Bootstrap, router, navigation, layout shell, service worker registration | The only place that switches between views. |

Rules across the UI:

- A component never imports a view; a view never imports another view — only the app switches views.
- Views call a domain's **service** if it has one, otherwise its **repository**.
- Domain layers (types, repository, service) never touch the DOM.
- Shared styles (variables, theme, dark mode) live in one place; a component's styles live next to the component.

## Shared

Small pure helpers (formatting, id generation). Usable by any layer; must not import anything else from the app.

## Code map

Planned layout (created as code arrives):

```
src/
├── app/            # bootstrap, router, shell
├── domains/
│   ├── songs/      # song.types.js, song.repository.js, (song.service.js)
│   └── setlists/
├── ui/
│   ├── components/
│   └── views/
├── platform/       # storage, service worker helpers
└── shared/
```

## Enforcement

These rules will be checked mechanically (import rules, with error messages that explain the fix) — to be set up together with the tech stack.

## Cross-cutting concerns

To be defined when needed (e.g. errors, sync, login).
