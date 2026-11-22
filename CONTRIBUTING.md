# Contributing to Setlist

Thanks for your interest! Setlist is in early development, but ideas and feedback are always welcome.

## Workflow

1. Create a branch from `main` (direct pushes to `main` are blocked).
2. Make a small, focused change — one topic per pull request.
3. Open a pull request and fill in the template.
4. Pull requests are merged with **squash merge**, so the PR title becomes the commit on `main`.

## Branch names

```
<type>/<short-description>
```

Examples: `feat/gig-mode`, `fix/offline-save`, `docs/readme-screenshots`, `chore/harness-setup`.

## Commit messages and PR titles

We follow [Conventional Commits](https://www.conventionalcommits.org):

```
<type>: <short summary in imperative mood>
```

Example: `feat: add drag-and-drop reordering of setlist songs`

| Type | Use for | Example |
|---|---|---|
| `feat` | A new feature for users | add a setlist |
| `fix` | A bug fix | song is not saved offline |
| `docs` | Documentation only | update README |
| `chore` | Maintenance, tooling, configuration — no change in app behavior | set up CI, agent harness |
| `refactor` | Code change that neither fixes a bug nor adds a feature | split a large module |
| `test` | Adding or fixing tests only | add setlist tests |
| `style` | Formatting only, no code meaning change | run the formatter |
| `perf` | Performance improvement | faster song search |

Why: the type tells at a glance whether a change affects users, and enables automatic changelogs and versioning later (`feat` → minor version, `fix` → patch version).

## Planning and decisions

- What the app does is described in [docs/product-specs/](docs/product-specs/).
- Work is planned in [docs/plan/](docs/plan/) (roadmap, milestones, tasks).
- Code structure: [ARCHITECTURE.md](ARCHITECTURE.md); coding rules: [docs/golden-principles.md](docs/golden-principles.md).
- Important decisions are recorded in [docs/decisions/](docs/decisions/).

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
