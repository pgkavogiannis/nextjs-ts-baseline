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

## Pull requests

1. Branch from `main`
2. Keep PRs focused — one concern per PR
3. Ensure `make ci` (lint, typecheck, tests with coverage, build) passes before opening a PR
4. Update `CHANGELOG.md` under `[Unreleased]`
