# 0003. Throwaway prototypes outside the harness

- **Status:** accepted
- **Date:** 2026-11-23
- **Decided by:** CEO

## Context

The harness makes work predictable but expensive and conservative: every session loads the rules, roles and docs, and agents think within them. For new features with open questions (how the UI should feel, which data model works, whether a web API behaves as documented), this slows down exploration and makes it costly to try several approaches.

## Options considered

1. **Explore inside the harness** — the GM or a lead builds prototypes. Consistent, but each attempt carries the full harness context and its rules shape the ideas.
2. **Prototypes in the repository** (`prototypes/` folder or branch) — prototypes are kept next to the spec. Bloats the repository and mixes throwaway code with the product.
3. **Separate repository** (e.g. `setlist-prototypes`) — clean separation, but extra setup that is not needed yet.
4. **Chat only** — the GM writes a kickoff prompt into the chat; the CEO builds and compares 1–3 variants in a separate, clean session; the CEO brings back an intake package (`intake.md` + prototype files) in the chat. Nothing is stored in the repository except the resulting spec.

## Decision

Option 4. It is part of the `new-feature` skill (step 3) and is optional — used only when something is unclear.

- Prototype code is a reference for behavior and look only and is never copied into the app.
- Everything that matters from the prototype ends up in the spec, because the prototype files are not kept.

## Consequences

- Exploration is cheaper and freer; the harness receives distilled learnings instead of code.
- Prototype files are lost after the session unless the CEO keeps them locally. If we need them later, option 3 can be added.
- Uploading HTML or zip files to the GM chat has to work in the environment; if not, the intake step needs another transport.
