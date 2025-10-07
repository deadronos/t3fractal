# GitHub Copilot / AI Agent Instructions for t3fractal

Purpose
- Short, actionable guidance so an AI agent can become productive in this repository quickly.

Quick context (big picture)
- This is a T3-stack Next.js app using the app router (files under `src/app`). Primary UI code lives in `src/app/*` and global styles in `src/styles/globals.css`.
- Key libraries: Next.js, React 19, Tailwind CSS, Three.js + react-three-fiber, Zustand, and `@t3-oss/env-nextjs` for runtime env validation.

How to run & test (concrete commands)
- Start dev server: `npm run dev` (uses `next dev --turbo`).
- Build for production: `npm run build` and `npm run start` for preview/serve.
- Unit tests: `npm run test` (Vitest). Vitest config: `vitest.config.mts` — environment `jsdom` and `vite-tsconfig-paths` plugin are used.
- End-to-end tests: `npm run e2e` (Playwright). Playwright config lives at `playwright.config.ts` and points at `tests/e2e`. Note: `webServer` and `baseURL` are commented out — start `npm run dev` manually or enable `webServer` before running E2E locally.

Repository-specific conventions & gotchas
- ESM / TS: package.json sets `type: "module"`. Use ESM imports and mind default exports in TS/React components.
- Path aliases: Tests and dev tooling use `vite-tsconfig-paths` (see `vitest.config.mts`), so prefer using tsconfig `paths` when adding new aliases.
- Environment validation: `src/env.js` uses `@t3-oss/env-nextjs` with `emptyStringAsUndefined: true`. To bypass validation for Docker/CI builds use `SKIP_ENV_VALIDATION=1`.
- Dot-folders and optional providers: `src/app/page.tsx` imports `../../.triplex/provider`. That directory may be generated, external, or intentionally gitignored — handle missing imports gracefully in automation and document where `.triplex` comes from if adding features that depend on it.

Tests & examples (what to look for)
- Unit tests live under `tests/unit` (example: `tests/unit/page.test.tsx`). Tests render Next components directly using `@testing-library/react` and Vitest + jsdom. Watch out for stale expectations: the test expects a heading named `Home` but `src/app/page.tsx` currently renders `Create T3 App` — update test or component accordingly.
- E2E tests live under `tests/e2e` (example: `tests/e2e/example.spec.ts`). Follow the existing pattern: role-based locators (`page.getByRole(...)`) and auto-retrying assertions (e.g., `await expect(locator).toHaveText()`).
- Playwright config: traces enabled on first retry (`trace: 'on-first-retry'`), reporter set to `html`, and multiple browser projects (chromium, firefox, webkit).

When changing tests or pages
- If updating UI text, update unit tests that assert exact strings (search `tests/unit` for exact matches).
- When adding E2E tests, either: 1) un-comment/configure the `webServer` block in `playwright.config.ts` to auto-start the app, or 2) document in the test that the dev server must be running and use full `http://localhost:3000` URLs in `page.goto(...)`.
- Prefer role-based selectors in Playwright tests (existing examples use `getByRole`). Keep tests resilient by avoiding brittle text-only selectors.

Formatting, linting, and style
- Formatting: use Prettier (`npm run format:write` / `npm run format:check`) — repo uses `prettier-plugin-tailwindcss` to order classes.
- Linting: `npm run lint` / `npm run lint:fix` (Next.js ESLint config is in use).

Files to reference when editing or adding features
- `package.json` — scripts and dependencies
- `playwright.config.ts` — E2E runner settings (traces, projects, commented webServer)
- `vitest.config.mts` — unit test environment & plugins
- `src/env.js` — environment schema and runtime behavior
- `src/app/page.tsx` and `src/app/layout.tsx` — canonical app components and patterns
- `tests/unit/*` and `tests/e2e/*` — concrete test examples to copy patterns from

Final notes for AI agents
- Be conservative: run `npm run test` and `npm run e2e` locally (or in CI) after changes. If e2e fails because the server isn't running, either start `npm run dev` or update `playwright.config.ts` to use `webServer`.
- Search for dot-prefixed folders (e.g. `.triplex`) before assuming imports exist; if missing, add simple provider mocks in tests or note missing dependency in PR.
- If you touch env handling, maintain `emptyStringAsUndefined: true` semantics and honor `SKIP_ENV_VALIDATION` used by the project.

If any of these areas are unclear (for example: where `.triplex/provider` should come from, or a canonical list of required environment variables), please tell me which area you want expanded and I will iterate on this file.