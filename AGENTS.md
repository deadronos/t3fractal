# Agents and Project Structure Guide

This repository uses an explicit Memory Bank to store ongoing decisions, designs, and task tracking for AI agents. Please read this document before contributing or asking an agent to make changes.

## Important: Memory Bank (use early)

- Agents MUST use the `/memory` folder to store and consult project context.

- Key subfolders to use:
  - `/memory/tasks` — create and update task files for each work item (use unique TASKIDs and update `_index.md`).
  - `/memory/designs` — store design docs and architecture diagrams (use unique design IDs and archive completed designs under `/memory/designs/COMPLETED`).

Refer to the repository instruction file `#file:memory-bank.instructions.md` for the full Memory Bank guidance and conventions.

Also see `#file:copilot-instructions.md` for quick repo-specific guidance for AI agents (run/test commands, patterns, and gotchas).

## App structure (high level)

- `src/app/` — Next.js app router components and pages (app-level layout, pages, and components)
  - `src/app/layout.tsx` — global layout and providers
  - `src/app/page.tsx` — homepage
  - `src/app/t3starterpage.tsx` — starter example page
  - `src/app/components/` — shared React components
  - `src/app/pages/` — additional pages (e.g., `fractalviewer.tsx`, `starthere.tsx`, `startheremenu.tsx`)
  - `src/app/providers/` — React providers used by the app

- `src/env.js` — runtime environment validation using `@t3-oss/env-nextjs`

- `src/styles/` — global stylesheets (e.g., `globals.css`, `starthere.css`)

## Tests

- `tests/unit/` — Vitest unit tests (jsdom)

- `tests/e2e/` — Playwright end-to-end tests

## Tooling and config

- `package.json` — scripts and dependency manifest

- `vitest.config.mts` — unit test config

- `playwright.config.ts` — Playwright config for e2e tests

- `tsconfig.json`, `next.config.js`, `postcss.config.js` — project configs

## Contributing and Agent Workflow

1. Before making changes, consult `/memory/activeContext.md` and tasks in `/memory/tasks/_index.md`.

2. Create a new task file in `/memory/tasks/` for non-trivial changes. Follow the Memory Bank task template.

3. When implemented, add validation notes and move tasks to `/memory/tasks/COMPLETED` as appropriate.

## Where to find more guidance

- See `#file:memory-bank.instructions.md` for the canonical Memory Bank rules and templates.

- See `.github/copilot-instructions.md` for repository-specific guidance for AI agents.

---

Short checklist for agents:

- [ ] Read `/memory/activeContext.md` before starting.

- [ ] Create or update a task in `/memory/tasks/` for work items.

- [ ] Add a design doc to `/memory/designs/` when adding architecture or non-trivial changes.
