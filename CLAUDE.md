# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server
npm run build        # Type check + production build (tsc && vite build)
npm run lint         # Run ESLint
npm run lint:fix     # Auto-fix ESLint issues
npm run typecheck    # TypeScript type checking only
npm run preview      # Preview production build
```

No test runner is configured.

## Architecture

**React 19 + TypeScript + Vite SPA** deployed to GitHub Pages via hash routing (`createHashRouter`). All routes are nested under `App` which provides the root layout.

### Path Alias
`@/` maps to `src/` — use this for all internal imports.

### Routing (`src/routes/index.tsx`)
Hash-based routing for GitHub Pages compatibility. `App.tsx` applies `max-w-200 px-6` to all routes except `/calendar-page`, which is full-width.

### Component Layers
- `src/components/ui/` — shadcn/ui base primitives (Button, Input, Drawer, Calendar, etc.)
- `src/components/common/` — project-specific reusable components built on top of ui/
- `src/features/` — feature modules (auth, health, calendar, groups, voice) each with their own components and hooks
- `src/pages/` — page-level components wired to routes

### Styling
- Tailwind CSS v4 via `@tailwindcss/vite` plugin
- Custom design tokens in `src/assets/styles/_colors.css` (oklch color format) and `_typography.css`
- `cn()` utility from `src/lib/utils.ts` (clsx + tailwind-merge) — use for conditional class merging
- Prettier with `prettier-plugin-tailwindcss` auto-sorts class names

### State & Data
- No global state management (store/ is empty)
- Form state via `react-hook-form`
- API layer (`src/api/`) is a stub — not yet implemented

### ESLint Config
Airbnb style guide with TypeScript. Import order is enforced: react → react-router-dom → third-party → `@/**` internal.

### Deployment
GitHub Actions deploys `dev` branch pushes to GitHub Pages. Vite base URL is `/seasons-care/` in CI, `/` locally (detected via `GITHUB_ACTIONS` env var).
