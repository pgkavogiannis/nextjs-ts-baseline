# nextjs-ts-baseline

A configs-only template for bootstrapping Next.js + TypeScript projects with a proven tooling baseline.

## What's included

| File                                 | Purpose                                                                                        |
|--------------------------------------|------------------------------------------------------------------------------------------------|
| `package.json`                       | Scripts, lint-staged, Volta pins, tooling deps                                                 |
| `next.config.js`                     | Static export, strict mode, unoptimized images                                                 |
| `tsconfig.json`                      | ES2020, strict, bundler resolution, react-jsx                                                  |
| `eslint.config.js`                   | Flat config: Next.js core-web-vitals + react-hooks                                             |
| `postcss.config.js`                  | Tailwind CSS v4 + autoprefixer                                                                 |
| `LICENSE`                            | MIT license — fill in `{{YEAR}}` and `{{AUTHOR}}`                                              |
| `CHANGELOG.md`                       | Keep a Changelog format starter                                                                |
| `CONTRIBUTING.md`                    | Dev setup, pre-commit hooks, PR guidelines                                                     |
| `.editorconfig`                      | Editor-agnostic indent/charset rules                                                           |
| `commitlint.config.js`               | Conventional commit message enforcement                                                        |
| `CLAUDE.md`                          | Claude Code project instructions starter                                                       |
| `.env.example`                       | Documents required env vars; safe to commit                                                    |
| `renovate.json`                      | Automated dependency updates (platform-agnostic)                                               |
| `SECURITY.md`                        | Vulnerability disclosure policy                                                                |
| `Makefile`                           | Platform-agnostic CI entry point (`make ci`)                                                   |
| `.prettierrc`                        | 4-space indent, single quotes, 140 print width                                                 |
| `.prettierignore`                    | Ignores build dirs, lockfiles, .claude/                                                        |
| `.gitignore`                         | Node, Next.js, Yarn Berry, env files, scan output                                              |
| `.gitleaks.toml`                     | Allowlist for Yarn Berry release bundle                                                        |
| `.yarnrc.yml`                        | Yarn Berry: node-modules linker, scripts disabled                                              |
| `.claudeignore`                      | Claude Code ignore patterns                                                                    |
| `.husky/pre-commit`                  | lint-staged + tsc --noEmit on every commit                                                     |
| `examples/github-actions/deploy.yml` | GitHub Pages deploy workflow (platform example — copy to `.github/workflows/` if using GitHub) |

## Platform examples

`examples/` contains CI/deploy workflow snippets for specific platforms. They are **not active** — copy and adapt whichever matches your
host:

| File                                 | Platform                                        |
|--------------------------------------|-------------------------------------------------|
| `examples/github-actions/deploy.yml` | GitHub Actions — build + deploy to GitHub Pages |

For any platform, `make ci` (lint → typecheck → build) is the canonical CI entry point.

## Prerequisites

- [Volta](https://volta.sh/) for Node/Yarn version management
- Node 24+ (pinned in `package.json` via Volta)

## Bootstrap

1. Copy this directory into your new project root
2. Find-replace `{{PROJECT_NAME}}` (package.json, CLAUDE.md), `{{AUTHOR}}` and `{{YEAR}}` (LICENSE), `{{RELEASE_DATE}}` (CHANGELOG.md),
   `{{SECURITY_EMAIL}}` (SECURITY.md)
3. Set `cname:` in `.github/workflows/deploy.yml` or remove it
4. Run:
   ```sh
   corepack enable
   yarn set version 4.16.0
   yarn install
   ```
5. Scaffold your `pages/` or `app/` directory separately

## Notes

- Template is **configs-only** — no source files, no `pages/`, no `app/`
- See `USAGE.md` for rationale behind non-obvious choices
- `output: 'export'` targets static GitHub Pages; remove it for SSR
