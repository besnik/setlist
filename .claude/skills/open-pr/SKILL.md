---
name: open-pr
description: Commit, push and open a pull request for the current branch in besnik/setlist, following the project's PR template and conventions. Use when work on a task is ready for CEO review.
---

# Open a pull request

1. **Check the branch.** You must not be on `main`. Branch name: `<type>/<short-description>` (see `CONTRIBUTING.md`).
2. **Check the definition of done** (`AGENTS.md`): specs, plan files (task status, PR link) and ADRs updated in the same branch.
3. **Commit** with a Conventional Commits message: `<type>: <summary>`. Add the attribution lines required by the session, if any.
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

7. If it fails, give the CEO the compare link instead: `https://github.com/besnik/setlist/compare/main...<branch>`.
8. Put the PR link into the task row in the milestone file and into the report to the CEO.
