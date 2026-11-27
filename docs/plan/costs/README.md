# Feature costs

How much AI work each feature took. The CEO uses this to see where the budget goes and to tune the harness.
One row per feature here; the step-by-step breakdown lives in one file per feature in [details/](details/) — click the feature name.

| Feature | Description | Mode | PR | Lead tokens | Lead time | CEO stops | QA findings (blocking / other) | Outcome |
|---|---|---|---|---|---|---|---|---|
| [Hello page (trial)](details/hello-page-trial.md) | Static sample view of a setlist (HTML + CSS) to test the harness | small | [#5](https://github.com/besnik/setlist/pull/5) | 282,794 | 10:32 | 4 | 4 / 6 | closed without merge (trial) |
| [Gig mode (trial)](details/gig-mode-trial.md)* | Static gig mode screen (HTML + CSS) to test the harness after its improvements | small | [#10](https://github.com/besnik/setlist/pull/10) | 83,112 | 0:49 | 1 | 0 / 4 | closed without merge (trial) |
| [MVP plan](details/mvp-plan.md)* | MVP milestones, architecture and tooling ADRs, M1 specs and tasks | big (spec PR) | [#14](https://github.com/besnik/setlist/pull/14) | 92,953 | 1:09 | 3 | — (engineering review: 2 / 13) | proposed |
| [M1 — Foundation and song list](details/m1-foundation-song-list.md) | Design foundation, project skeleton and tooling, deployment, app shell, safe rendering, song list | big (task PRs) | [#15](https://github.com/besnik/setlist/pull/15), [#16](https://github.com/besnik/setlist/pull/16), [#19](https://github.com/besnik/setlist/pull/19), [#23](https://github.com/besnik/setlist/pull/23), [#25](https://github.com/besnik/setlist/pull/25) | 528,643 | 14:28 | 0 | 3 / 29 (so far) | in progress |
| [M2 spec — Install and offline](details/m2-spec.md)* | Spec of install, offline and updates, tasks T-021–T-023 | big (spec PR) | [#30](https://github.com/besnik/setlist/pull/30) | 94,316 | 1:34 | 0 | 2 / 10 | proposed |
| [M3 spec — Song view](details/m3-spec.md)* | Spec of the song view, tasks T-024–T-027 | big (spec PR) | [#36](https://github.com/besnik/setlist/pull/36) | 95,312 | 1:36 | 1 | 1 / 8 | proposed |
| [M3 — Song view](details/m3-song-view.md)* | Song view tasks T-024–T-027 | big (task PRs) | [#41](https://github.com/besnik/setlist/pull/41), [#42](https://github.com/besnik/setlist/pull/42) | 359,062 | 2:37 | 0 | 0 / 2 (architecture checks: 0 / 6; milestone check: 3 cleanup tasks) | done |
| [Error handling and logging](details/error-handling-logging.md) | Rules, ADR 0007, app log, narrowed catches, check rules (T-031) | small (task PR) | [#44](https://github.com/besnik/setlist/pull/44) | 100,357 | 1:29 | 1 | 1 / 4 | in progress |
| [M4 spec — Song format](details/m4-spec.md)* | ADR 0008, song format spec (plain and ChordPro, notation, source line), tasks T-033–T-037 | big (spec PR) | [#47](https://github.com/besnik/setlist/pull/47) | 36,033 | 0:46 | 4 | 2 / 6 | proposed |
| [M4 — Song format](details/m4-song-format.md)* | Song format tasks T-033–T-037 | big (task PRs) | T-033 | 27,465 | 0:25 | 0 | 0 / 2 (so far) | in progress |

Lead tokens count every token a lead read, and most of them are cheap cache reads, so they are **not a price** — compare them only with each other. The real price is in the session costs below. In the detail files, GM steps show `n/a`.

## Session costs

What a whole session cost (the main session and its leads together), at list prices in USD. The source is `total_cost_usd` in the session's last `result` event (session tools: `list_events` with kinds `result`); it is cumulative for the session. Filled in at each cost review, not in every session — reading the numbers costs tokens too.

| Date | Session | PRs | Leads | Model tier | USD | Note |
|---|---|---|---|---|---|---|
| 2026-11-26 | M2 spec | [#30](https://github.com/besnik/setlist/pull/30) | 1 QA | strong | 3.04 | |
| 2026-11-26 | M2: T-021, T-022 | [#31](https://github.com/besnik/setlist/pull/31), [#32](https://github.com/besnik/setlist/pull/32), [#33](https://github.com/besnik/setlist/pull/33), [#34](https://github.com/besnik/setlist/pull/34) | 0 | strong | 4.24 | |
| 2026-11-26 | M2: T-023 | [#35](https://github.com/besnik/setlist/pull/35) | 0 | strong | 1.68 | ended with an M3 overview |
| 2026-11-26 | M3 spec | [#36](https://github.com/besnik/setlist/pull/36), [#38](https://github.com/besnik/setlist/pull/38) | 1 QA | strong | 2.89 | |
| 2026-11-26 | M3: T-024 | [#37](https://github.com/besnik/setlist/pull/37) | 0 | strong | 7.49 | a build-tool discussion in the same session; context grew to ~245k tokens |
| 2026-11-26 | M3: T-025 | [#40](https://github.com/besnik/setlist/pull/40) | 0 | strong | 1.49 | |
| 2026-11-26 | M3: T-026 | [#41](https://github.com/besnik/setlist/pull/41) | 1 architecture check | strong | 2.89 | |
| 2026-11-26 | M3: T-027, M3 close, T-031 | [#42](https://github.com/besnik/setlist/pull/42), [#43](https://github.com/besnik/setlist/pull/43), [#44](https://github.com/besnik/setlist/pull/44) | 2 architecture checks, 2 QA | strong | 8.20 | three topics in one session |

**Cost review 2026-11-27:** the main session is most of the cost — every tool call re-reads the whole context (in the $8.20 session, cache reads alone were $3.68). Changes made: [Reviews](../../company/operating-model.md#reviews) run by the kind of change, leads on fixed model tiers ([.claude/models.md](../../../.claude/models.md)) with fewer tools, short sessions, no PR watching unless asked (T-032).

\* Marks a feature prepared mainly by the GM (light feature): its lead numbers cover only the delegated parts, usually QA.

## How to record (GM)

- **After every lead run:** add a row to the feature's file `details/<feature>.md` (create it from an existing one) with the numbers the Agent tool reports when the lead finishes: tokens, duration, tool uses. Model = the lead's tier from [.claude/models.md](../../../.claude/models.md).
- **At the end of the feature:** add or update its row in the table above.
  - Lead tokens and lead time are the sums from the feature file.
  - CEO stops = how many times the work waited for the CEO.
  - QA findings are taken from the QA lead's report.
- **What drove cost:** one or two sentences in the feature file, so they can be turned into harness improvements.
- **At a cost review:** add the sessions since the last review to *Session costs*, then propose harness changes.
- Never write numbers that were not measured.
