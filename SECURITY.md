# Security policy

Setlist is in early development and has no releases yet.

## Reporting a vulnerability

Please **do not** open a public issue for security problems.
Report them privately via GitHub: **Security → Report a vulnerability** on this repository.

We will acknowledge the report as soon as possible and keep you informed about the fix.

## Security principles

- **Your data stays on your device.** Setlist has no backend and does not send your songs anywhere.
- **No secrets in the repository** — no passwords, tokens, API keys, private keys, certificates, `.env` files, connection strings or personal data, in code, config, tests, docs or examples. Use obvious placeholders (e.g. `YOUR_API_KEY`). Files that typically hold secrets are listed in `.gitignore`.
- **Few dependencies** — every dependency is a deliberate decision, which keeps the attack surface small.

## If a secret was committed

Deleting it in a new commit is not enough — git history and forks keep it.

1. **Revoke or rotate the secret immediately** at its issuer. Treat it as public from that moment.
2. Remove it from the code and replace it with a placeholder.
3. Tell the repository owner, who decides whether the history must be cleaned.
