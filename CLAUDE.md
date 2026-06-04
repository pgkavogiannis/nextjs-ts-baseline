# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

{{PROJECT_NAME}} — describe what this project does in one or two sentences.

## Commands

```bash
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

```
/pages         # Next.js pages (or /app for App Router)
/components    # Shared UI components
/styles        # Global styles and Tailwind config
/public        # Static assets
```

## Key Patterns

<!-- Document non-obvious patterns here as the project evolves -->
<!-- Examples: per-page layouts, auth flow, data fetching strategy -->
