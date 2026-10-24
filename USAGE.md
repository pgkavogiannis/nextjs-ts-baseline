# USAGE — Non-obvious config rationale

## .yarnrc.yml

**`npmMinimalAgeGate: 7`**
New packages must be at least 7 days old before Yarn will install them. Mitigates supply-chain
attacks where a malicious package is published and immediately depended on.

**`nodeLinker: node-modules`**
Uses the classic `node_modules` layout instead of Yarn PnP. PnP has better performance and
stricter hoisting, but many Next.js tooling integrations (PostCSS plugins, ESLint) still assume
`node_modules` resolution. Switch to PnP only when all tools in the chain support it.

**`enableScripts: false`**
Prevents lifecycle scripts (`preinstall`, `postinstall`) from running automatically during
`yarn install`. This blocks a common malware vector. Re-enable per-package with
`dependenciesMeta.<pkg>.scripts: true` if a package genuinely needs it.

**No `yarnPath`**
The `yarnPath` entry points at a vendored binary (`.yarn/releases/yarn-4.16.0.cjs`) that isn't
shipped in this template. After bootstrapping, run `yarn set version 4.16.0` to vendor the
binary and regenerate the entry.

---

## .gitleaks.toml

The allowlist covers `.yarn/releases/` because Yarn Berry vendors its own release bundle there.
The file is large and binary-like, triggering false positives in secret scanners. It's
third-party code, not developer-authored secrets.

---

## .husky/pre-commit

Runs two commands:

1. `yarn lint-staged` — runs ESLint + Prettier only on staged files (fast)
2. `make typecheck` — type-checks the entire program with `yarn tsc --noEmit`

These are separate by design. `lint-staged` only sees staged files, so it can't catch
cross-file type errors introduced by the current change. The full `tsc` run catches those.

The hook calls `make typecheck` rather than `tsc` directly so it shares the Makefile's guard:
with no `.ts`/`.tsx` file, `tsc` exits 2 with TS18003 ("No inputs were found"), which would
block every commit to the template and to a fresh project before its first source file.

---

## eslint.config.js — dropped overrides

The source project disabled two rules for portfolio-specific reasons:

- `'react/no-unescaped-entities': 'off'` — the portfolio content had apostrophes and quotes
  in JSX text. Re-add this if your JSX contains prose with unescaped entities.

- `'react-hooks/set-state-in-effect': 'warn'` — used `localStorage` in a `useEffect` without
  the `useSyncExternalStore` pattern, which triggers this rule. Re-add as `'warn'` if you have
  legitimate one-time mount initialization from client storage.

The base flat config (spread `core-web-vitals` + register `react-hooks` plugin) is retained
so both rules are active by default in new projects.

---

## next.config.js

`output: 'export'` + `images.unoptimized: true` is required for GitHub Pages static hosting.
For SSR (Vercel, self-hosted), remove `output: 'export'` and `images.unoptimized`.

`basePath` is commented out. Set it when deploying to a project page (e.g. `/repo-name`);
omit it for a username page (`username.github.io`).

---

## renovate.json — why Renovate over Dependabot

Dependabot is GitHub-only. Renovate works on GitHub, GitLab, Bitbucket, Azure DevOps,
Gitea, Forgejo, and others. The config lives in `renovate.json` at the repo root and is
identical across platforms — only the hosting differs.

The template enables automerge for patch/minor devDependency updates on a Monday morning
schedule. For production dependencies or major bumps, a PR is opened for manual review.

---

## commitlint — scope is optional

The config ships with `scope` as optional. This avoids friction on solo projects where
enforcing `feat(auth): ...` adds ceremony with no benefit. For team projects, tighten it:

```js
'scope-empty': [2, 'never'],  // make scope required
```

---

## Makefile — platform-agnostic CI entry point

Every CI platform has a different YAML format. A `Makefile` is the lowest common denominator:
GitHub Actions, GitLab CI, Jenkins, Circle CI, and Buildkite can all invoke `make ci`.

Your CI config becomes a thin wrapper:

```yaml
# GitHub Actions
-   run: make ci

# GitLab CI
script: make ci

# Jenkinsfile
    sh 'make ci'
```

Changing the CI platform means updating one line, not rewriting the whole pipeline.

`make ci` runs lint, typecheck, `yarn test:coverage` and build. `examples/github-actions/deploy.yml`
calls it rather than listing its own steps, so CI cannot drift from the local check.

The `typecheck` target skips `tsc` while the tree has no `.ts`/`.tsx` file, which is why the Vitest
config and setup files are `.mts`: a `.ts` config would make `tsc` run on an otherwise empty template.

---

## vitest.config.mts and vitest.setup.mts

**`coverage.include`**
Without it, Vitest reports only files some test imported, so an untested module is absent from the
report instead of showing 0%. The glob covers both a root layout (`app/`, `components/`, …) and a
`src/` layout; extend it if sources live elsewhere.

**Thresholds at 80%**
They sit in the config and `make ci` runs coverage, so the number is enforced rather than advisory.
With no sources the report is 0/0, which passes.

**`passWithNoTests: true`**
Keeps `make ci` green in the template and in a fresh project before the first test exists.

**Globals off, cleanup in a setup file**
Tests import `test`/`expect` from `'vitest'`, so `tsc` needs no ambient test types in
`tsconfig.json`. Testing Library unmounts between tests on its own only when `afterEach` is a
global, so `vitest.setup.mts` registers `cleanup` explicitly.

**`vite` as a direct devDependency**
Vitest 5 and `@vitejs/plugin-react` declare `vite` as a peer dependency and do not install it.

---

## .node-version

Volta is not the only version manager: GitHub Actions (`node-version-file`), mise, nodenv, fnm and
hosts such as Cloudflare Pages read `.node-version` and ignore the `volta` block. The file and
`volta.node` must name the same version. Renovate bumps both (its `nodenv` manager handles
`.node-version`), but possibly in separate PRs; merge them together.
