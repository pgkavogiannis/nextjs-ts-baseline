# Project Stack Rules

> Project-specific. Builds on the ECC `common/` rules at user level (`~/.claude/rules/ecc/common/`) and the
> vendored ECC `react/`, `typescript/` and `web/` packs in this directory. Where they disagree, this file wins.

The vendored packs are kept identical to ECC upstream except for their `common/` links, which point at the
user-level copy. Put project overrides here, not in them, so a pack can be re-copied from ECC without losing them.

## Package manager

- **Yarn 4 (Berry), not pnpm or npm.** `packageManager` in `package.json` pins it; run it through corepack.
  Translate any `pnpm …` or `npm run …` in the packs to `yarn …`.
- `.yarnrc.yml` sets `enableScripts: false` and `npmMinimalAgeGate: 7`. A dependency that needs its install
  script gets `dependenciesMeta.<pkg>.scripts: true`; do not turn scripts back on globally. See `USAGE.md`.

## Runtime: static export

`next.config.js` sets `output: 'export'`, so there is no server at runtime. Until that line is removed, the
pack sections on these do not apply:

- Server Actions, `'use server'` and middleware.
- Per-request CSP nonces and response headers set from Next.js (`headers()` in `next.config.js` is ignored on
  export). Security headers belong to the host; where the host cannot set them (GitHub Pages), use a
  `<meta http-equiv="Content-Security-Policy">` with hashes, not nonces.

Removing `output: 'export'` for an SSR host brings those sections back into force.

## Testing

- **Vitest + happy-dom + Testing Library.** Use happy-dom APIs, not JSDOM. Config: `vitest.config.mts`.
- **Globals are off.** Import `describe`/`test`/`expect`/`vi` from `'vitest'`. `vitest.setup.mts` runs
  Testing Library's `cleanup` after each test, which it would otherwise do only with globals on.
- Coverage thresholds (80% lines, functions, branches, statements) live in `vitest.config.mts`, and `make ci`
  runs `yarn test:coverage`, so they are enforced, not advisory. Extend `coverage.include` if sources live
  outside `app/`, `pages/`, `components/`, `hooks/`, `lib/` or `src/`.
- Playwright and MSW, which the packs mention, are not installed. Add them when the project needs E2E tests or
  API mocking, and record the choice here.

## Claude Code hooks

The examples in `web/hooks.md` call `pnpm` and use a flat `{matcher, command}` entry with a `$FILE_PATH`
variable. Claude Code's hook config nests commands (`{"matcher": …, "hooks": [{"type": "command", "command": …}]}`)
and passes the tool input as JSON on stdin. Adapt the examples to that shape and to Yarn rather than copying
them, and put project hooks in `.claude/settings.json`, not the user-level file.
