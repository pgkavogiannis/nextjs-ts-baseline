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
- **tsc --noEmit** — full type check

Fix any errors before pushing. To run them manually:

```sh
yarn lint
yarn tsc --noEmit
yarn format:check
```

## Pull requests

1. Branch from `main`
2. Keep PRs focused — one concern per PR
3. Ensure `yarn build` passes before opening a PR
4. Update `CHANGELOG.md` under `[Unreleased]`
