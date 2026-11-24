# Feature costs

How much AI work each feature took. The CEO uses this to see where the budget goes and to tune the harness.
One row per feature here; the step-by-step breakdown lives in one file per feature in [details/](details/) — click the feature name.

| Feature | Description | Mode | PR | Lead tokens | Lead time | CEO stops | QA findings (blocking / other) | Outcome |
|---|---|---|---|---|---|---|---|---|
| [Hello page (trial)](details/hello-page-trial.md) | Static sample view of a setlist (HTML + CSS) to test the harness | small | [#5](https://github.com/besnik/setlist/pull/5) | 282,794 | 10:32 | 4 | 4 / 6 | closed without merge (trial) |
| [Gig mode (trial)](details/gig-mode-trial.md)* | Static gig mode screen (HTML + CSS) to test the harness after its improvements | small | [#10](https://github.com/besnik/setlist/pull/10) | 83,112 | 0:49 | 1 | 0 / 4 | closed without merge (trial) |
| [MVP plan](details/mvp-plan.md)* | MVP milestones, architecture and tooling ADRs, M1 specs and tasks | big (spec PR) | [#14](https://github.com/besnik/setlist/pull/14) | 92,953 | 1:09 | 3 | — (engineering review: 2 / 13) | proposed |
| [M1 — Foundation and song list](details/m1-foundation-song-list.md) | Design foundation, project skeleton and tooling, deployment, app shell, safe rendering, song list | big (task PRs) | [#15](https://github.com/besnik/setlist/pull/15), [#16](https://github.com/besnik/setlist/pull/16), [#19](https://github.com/besnik/setlist/pull/19), T-015 | 424,298 | 11:30 | 0 | 1 / 26 (so far) | in progress |

Only lead runs are measured. The GM's own work cannot be measured from inside the session, so it is **not included** — no estimates. In the detail files, GM steps show `n/a`.

\* Marks a feature prepared mainly by the GM (light feature): its lead numbers cover only the delegated parts, usually QA.

## How to record (GM)

- **After every lead run:** add a row to the feature's file `details/<feature>.md` (create it from an existing one) with the numbers the Agent tool reports when the lead finishes: tokens, duration, tool uses. Model = the lead's model (leads inherit the session model unless their definition sets one).
- **At the end of the feature:** add or update its row in the table above.
  - Lead tokens and lead time are the sums from the feature file.
  - CEO stops = how many times the work waited for the CEO.
  - QA findings are taken from the QA lead's report.
- **What drove cost:** one or two sentences in the feature file, so they can be turned into harness improvements.
- Never write numbers that were not measured.
