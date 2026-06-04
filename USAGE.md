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
2. `yarn tsc --noEmit` — type-checks the entire program

These are separate by design. `lint-staged` only sees staged files, so it can't catch
cross-file type errors introduced by the current change. The full `tsc` run catches those.

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
