# Contributing

## Development setup

```sh
corepack enable
yarn install
yarn dev
```

## Before committing

The pre-commit hook runs automatically:

- **lint-staged** — ESLint + Prettier on staged files
- **make typecheck** — full type check (`tsc --noEmit`; skipped while there are no `.ts`/`.tsx` files)

Fix any errors before pushing. To run them manually:

```sh
yarn lint
make typecheck
yarn test:coverage
yarn format:check
```

## Commit identity

Commits in a public repository carry the author email forever, and a force-push cannot recall copies already cloned. Use your
GitHub noreply address (`<id>+<username>@users.noreply.github.com`, shown under GitHub → Settings → Emails):

```sh
git config user.email "<id>+<username>@users.noreply.github.com"
```

On GitHub, also enable **Keep my email addresses private** and **Block command line pushes that expose my email** in the same
settings page, so a misconfigured clone is rejected instead of leaking.

## Pull requests

1. Branch from `main`
2. Keep PRs focused — one concern per PR
3. Ensure `make ci` (lint, typecheck, tests with coverage, build) passes before opening a PR
4. Update `CHANGELOG.md` under `[Unreleased]`
