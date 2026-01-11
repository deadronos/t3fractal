# Technical Context

## Technologies

- Language: TypeScript (strict)
- Framework: Next.js (App Router)
- UI/Rendering: React, React Three Fiber
- State: Zustand
- Testing: Vitest (unit), Playwright (e2e)
- Tooling: ESLint, Prettier, Tailwind CSS

## Developer workflow & scripts

- Install: `npm install`
- Dev server: `npm run dev`
- Unit tests: `npm run test` (Vitest)
- E2E tests: `npm run e2e` (Playwright)
- Lint / format: `npm run lint`, `npm run format:write`

## Environment & configs

- `env.js` performs env validation; `SKIP_ENV_VALIDATION` can be used for local convenience.
- Keep `tsconfig.json` and path aliases (`@/*`) in sync when adding new packages or directories.

## Contribution notes

- Place performance-sensitive logic in `src/lib` and add unit tests in `tests/unit`.
- For UI changes, add Playwright tests under `tests/` and prefer role-based selectors.
- Document design and task-level decisions in `/memory` (designs/, tasks/), following the Spec-Driven Workflow instructions.
