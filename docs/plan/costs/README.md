# Feature costs

How much AI work each feature took. The CEO uses this to see where the budget goes and to tune the harness.
One row per feature here; the step-by-step breakdown lives in one file per feature next to this one.

| Feature | Description | Mode | PR | Lead tokens | Lead time | CEO stops | QA findings (blocking / other) | Outcome |
|---|---|---|---|---|---|---|---|---|
| [Hello page (trial)](hello-page-trial.md) | Static sample view of a setlist (HTML + CSS) to test the harness | small | [#5](https://github.com/besnik/setlist/pull/5) | 282,794 | 10:32 | 4 | 4 / 6 | closed without merge (trial) |

Only lead runs are measured. The GM's own work cannot be measured from inside the session, so it is **not included** — no estimates.

## How to record (GM)

- **After every lead run:** add a row to the feature's file (`<feature>.md`, create it from the example) with the numbers the Agent tool reports when the lead finishes: tokens, duration, tool uses. Model = the lead's model (leads inherit the session model unless their definition sets one).
- **At the end of the feature:** add or update its row in the table above.
  - Lead tokens and lead time are the sums from the feature file.
  - CEO stops are the decisions the CEO was asked for.
  - QA findings are taken from the QA lead's report.
- **What drove cost:** one or two sentences in the feature file, so they can be turned into harness improvements.
- Never write numbers that were not measured.
