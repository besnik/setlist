# 0007. Error handling and logging

- **Status:** accepted
- **Date:** 2026-11-26
- **Decided by:** CEO

## Context

The code had no rules for errors and logging. Several places used an empty `catch {}` (the screen lock, the settings repository, the router's addresses, the dev tools). Each one was meant for one expected case, but each also hid every other error, including our own bugs. The only log was one `console.warn` when the service worker failed to register. An error nothing caught had no handler, so a bug on stage left no trace. The CEO asked for sensible error handling and logging, with general rules that hold for frontend and backend code alike.

## Options considered

1. **Leave it as it is.** It costs nothing, but bugs disappear silently, and every new `catch` repeats the problem.
2. **A logging library, or sending errors to a service.** Logs would be collected centrally. But that is a runtime dependency (against ADR 0004), it needs a network connection (against offline first), and it sends data about users, which would need a privacy decision.
3. **Rules, a small log module of our own, and a check.** Narrow every `catch` to its expected case. Log through one module with levels and a prefix. Add one handler for uncaught errors. `npm run check` rejects swallowed errors. There is no dependency.

## Decision

Option 3.

- **General rules** (technology-neutral): golden principle *Errors are handled or seen, never swallowed*. Catch only the expected case, named precisely; rethrow or log the rest. Unexpected errors go to one boundary that logs them. Log through one place, with levels (*error* / *warn* / *info*), a message saying what was being done, and no secrets or personal data.
- **In the app:**
  - `app/src/ui/log.js` holds `log.error`, `log.warn` and `log.info` with the `[setlist]` prefix. It is the only code that writes to the console.
  - `logUncaughtErrors()` is called first in `main.js`. It replaces the browser's own report of an uncaught error, so each error appears once, with the prefix.
  - At start-up the app logs one *info* line with its version.
  - The log stays on the device.
  - Details are in ARCHITECTURE.md, "Errors and logging".
- **User-facing behavior is unchanged.** An unexpected error shows no message on screen. A message would be a product decision with its own spec.
- **Checks** (rules 11 and 12 of `tools/check.js`):
  - no `catch` without its error, no empty `catch` block and no empty `.catch()` handler in `app/` and `tools/`;
  - in `app/`, no console use outside `ui/log.js`.

## Consequences

- An expected case is visible in the code, because it is named. An unexpected error is visible in the console, because it is logged. A bug can no longer hide behind a fallback.
- A few lines more per `catch`. The settings repository no longer promises that "nothing ever throws": only refused or full storage is silent.
- `log.js` sits in `ui/`, because only `ui/` and `main.js` log today. If `data/` needs to log later, it moves to a place every layer may import, and the layer rule in the check changes with it.
- Sending logs off the device, or showing errors to the user, stays a separate decision (privacy, spec).
