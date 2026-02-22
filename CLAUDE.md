# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## IMPORTANT: Documentation First

**Before generating any code**, always check the `/docs` directory for relevant documentation files. Read and follow any applicable docs before writing or modifying code. The `/docs` directory is the authoritative reference for this project's conventions, patterns, and requirements:

- /docs/ui.md
- /docs/data-fetching.md
- /docs/data-mutations.md
- /docs/auth.md

## Commands

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
```

No test framework is configured.

## Architecture

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript 5 · Tailwind CSS v4

**Routing:** File-based via `src/app/`. All routes are Server Components by default. Add `"use client"` only when client-side interactivity is needed.

**Styling:** Tailwind CSS v4 utility classes. Theme tokens are defined as CSS custom properties in `src/app/globals.css` under `@theme inline`. Dark mode uses `prefers-color-scheme` media query.

**Path alias:** `@/*` maps to `src/*`.

**Config files:** `next.config.ts` (empty/default), `tsconfig.json` (strict mode), `eslint.config.mjs` (ESLint v9 flat config with Next.js rules).
