# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

> **Template repo.** This is a configs-only Next.js/TypeScript starter — no `pages/`, `app/`,
> or `components/` exist yet (see [README.md](README.md)). This same CLAUDE.md is also the
> starter file copied into bootstrapped projects, so `{{PROJECT_NAME}}` below is an
> intentional placeholder, not an unfilled field.

## Project Overview

{{PROJECT_NAME}} — describe what this project does in one or two sentences.

## Commands

```bash
corepack enable && yarn set version 4.16.0 && yarn install  # One-time bootstrap
yarn dev          # Start development server
yarn build        # Production build
yarn lint         # Run ESLint
yarn format       # Format all files with Prettier
yarn format:check # Check formatting without writing
make ci           # Full CI check: lint + typecheck + build
```

## Tech Stack

- **Next.js** with static export (`output: 'export'`)
- **React** with TypeScript
- **Tailwind CSS** with PostCSS
- **Yarn Berry** (node-modules linker)

## Architecture

No source tree exists in this template. After scaffolding `pages/` or `app/` (see
README.md → Bootstrap), a typical layout looks like:

```
/pages         # Next.js pages (or /app for App Router)
/components    # Shared UI components
/styles        # Global styles and Tailwind config
/public        # Static assets
```

## Key Patterns

See [USAGE.md](USAGE.md) for the rationale behind non-obvious config choices (Yarn
`npmMinimalAgeGate`, `enableScripts: false`, split husky lint-staged/tsc steps).

<!-- Document project-specific patterns here as the project evolves -->
<!-- Examples: per-page layouts, auth flow, data fetching strategy -->
