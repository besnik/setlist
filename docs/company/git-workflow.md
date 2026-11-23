# Git workflow

How agents work with branches, commits and pull requests. (The public version for outside contributors is [CONTRIBUTING.md](../../CONTRIBUTING.md); keep both in sync.)

## Branches

- Never push to `main`. Every change goes through a pull request; the CEO squash-merges.
- Branch name: `<type>/<short-description>`, always from `main`, e.g. `feat/gig-mode`, `fix/offline-save`, `chore/harness-setup`. This applies even if the environment suggests another branch name.
- **One open topic = one branch = one PR.** While a PR on the same topic is open, add commits to its branch. No branches stacked on other branches.
- What a topic is depends on the feature mode (see the `new-feature` skill): in small mode the whole feature; in big mode the spec is one topic and each task is another. Any other change (fix, harness, docs) is one topic.

## Commits and PR titles

[Conventional Commits](https://www.conventionalcommits.org): `<type>: <short summary in imperative mood>`.

| Type | Use for |
|---|---|
| `feat` | A new feature for users |
| `fix` | A bug fix |
| `docs` | Documentation only |
| `chore` | Maintenance, tooling, configuration, harness — no change in app behavior |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `test` | Adding or fixing tests only |
| `style` | Formatting only |
| `perf` | Performance improvement |

## Pull requests

- Open a PR (skill `open-pr`) **only when it is ready for the CEO's review**: the work and QA are done. No draft PRs.
- Keep the PR description true: when new commits change what the PR does, update the description.
- If the CEO's review comments are being worked on, say so in the report ("do not merge yet").

## Harness and process trials

A trial of the harness or the process uses a `chore/trial-<name>` branch. It adds no tasks or specs to `main`, and its PR is closed without merging. Its costs are still recorded in [docs/plan/costs/](../plan/costs/).
