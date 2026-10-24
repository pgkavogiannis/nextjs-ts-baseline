# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Vitest with happy-dom and Testing Library (`vitest.config.mts`, `vitest.setup.mts`), `test`, `test:run` and
  `test:coverage` scripts, and coverage over every source file with 80% thresholds
- `.node-version` for CI and version managers other than Volta
- `.claude/rules/stack.md` with project overrides of the vendored rule packs (Yarn, static export, testing, hook schema)

### Changed

- `make ci` now runs `yarn test:coverage` between typecheck and build
- `examples/github-actions/deploy.yml` runs `make ci` instead of separate lint and build steps (it skipped typecheck)
  and reads Node from `.node-version` instead of a hardcoded version
- `.claude/rules/` packs link to the user-level ECC `common/` rules (`~/.claude/rules/ecc/common/`) instead of a
  `../common/` directory that does not exist

### Deprecated

### Removed

### Fixed

- Pre-commit hook runs `make typecheck` instead of `tsc --noEmit`, which failed every commit with TS18003 while the
  tree had no `.ts`/`.tsx` file

### Security

- Bump `next` and `eslint-config-next` to 16.3.8 (critical RCE advisories affecting <16.3.6)
- Bump `postcss` floor to ^8.5.28 (sourceMappingURL path traversal advisories)

## [0.1.0] - {{RELEASE_DATE}}

### Added

- Initial release
