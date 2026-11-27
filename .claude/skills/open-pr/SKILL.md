---
name: open-pr
description: Commit, push and open a pull request for the current branch in besnik/setlist, following the project's PR template and conventions. Use when the work (and its review) is done and ready for CEO review, and to update the description of an open PR.
---

# Open a pull request

Open a PR only when it is ready for the CEO's review — the work and its review are done ([git workflow](../../../docs/company/git-workflow.md#pull-requests)).

1. **Check the branch.** You must not be on `main`. Branch name: `<type>/<short-description>` (see the [git workflow](../../../docs/company/git-workflow.md)).
2. **Check the definition of done** (`AGENTS.md`): specs, plan files (task status, PR link) and ADRs updated in the same branch; the review the change needs is done — pick its row in [Reviews](../../../docs/company/operating-model.md#reviews) and name it under *How it was verified*.
3. **Commit** with a Conventional Commits message: `<type>: <summary>`. No attribution trailers, no links to AI sessions or other private tools (see the *No private links* rule in `AGENTS.md`).
4. **Push:** `git -c push.negotiate=true push -u origin <branch>`. Retry network errors up to 4 times with backoff.
5. **Write the PR body** to a temporary file, following `.github/pull_request_template.md` (What / Why / How it was verified / Decisions made / Needs from CEO / Checklist). Reference the task ID (`T-NNN`).
6. **Open the PR via the REST API** (`gh pr create` does not work here — GraphQL is blocked):

   ```bash
   gh api repos/besnik/setlist/pulls \
     -f title='<type>: <summary>' \
     -f head='<branch>' \
     -f base='main' \
     -f body="$(cat <body-file>)" \
     --jq '.html_url'
   ```

   For a trial PR (`chore/trial-*` branch), add `-F draft=true`.

7. If it fails, give the CEO the compare link instead: `https://github.com/besnik/setlist/compare/main...<branch>`.
8. Put the PR link into the task row in the milestone file and into the report to the CEO.

## Later commits to an open PR

When new commits change what the PR does, update its description:

```bash
gh api -X PATCH repos/besnik/setlist/pulls/<number> -f body="$(cat <body-file>)" --jq '.html_url'
```
