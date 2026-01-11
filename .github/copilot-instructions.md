# GitHub Copilot instructions — t3fractal

Purpose: Short, actionable rules so AI coding agents (Copilot/assistants) can be immediately productive in this repository.

## Quick overview ✅
- Architecture: Next.js (App Router) + React + React Three Fiber for 3D scene rendering. Heavy logic lives in `src/lib/*` (notably `lsystem.ts` and `gameData.ts`). UI components live in `src/app/components/*` and panels in `src/app/components/panels/`.
- State: Global game state uses **Zustand** (`src/store/gameStore.ts`). Game loop runs via `useGameLoop` (requestAnimationFrame) and updates state with `addResources`.
- Rendering: `TreeScene` (R3F) consumes segments/leaves from `useLSystem` and is a client component (`"use client"`).
- Build/test: see `package.json` scripts (dev, build, test=vitest, e2e=playwright, lint/format).

## Core rules for automated edits 🔧
- Always prefer modifying logic in `src/lib/*` (pure functions) and add unit tests under `tests/unit/` for behavior changes (Vitest). Example candidates: `generateSentence`, `interpretSentence` (`src/lib/lsystem.ts`) and resource math in `src/lib/gameData.ts`.
- Avoid expensive work during render: heavy L-system processing must stay in `useLSystem` (uses `useMemo`) or `lib/lsystem.ts` and respect safety limits (`maxSegments`, `maxSentenceLength`). Guard new features against infinite growth.
- When working with 3D code, keep changes in `Tree`, `TreeScene`, or `@react-three/fiber`-friendly patterns; do not introduce DOM APIs into server components. Client components use `"use client"` at file top.
- State updates should use `useGameStore` actions. Do not mutate state directly; use the provided setters (`buyIteration`, `applyAxiom`, `harvest`, etc.).
- Use path alias `@/*` (maps to `src/*`) for imports. Maintain TypeScript typings and keep `strict: true` compatibility.

## Tests & safety 🧪
- Run unit tests with: `npm run test` (Vitest). Add tests for deterministic algorithms (e.g., L-system sentence generation, `getIterationCost`, `getSeedYield`).
- E2E: Playwright is configured — run `npm run e2e` for integration flows if you add UI changes.
- Lint/format before committing: `npm run lint` and `npm run format:write`.

## Common files to inspect for context 📁
- src/lib/lsystem.ts — L-system generation & interpreter (performance-critical)
- src/lib/gameData.ts — rules, costs, seasons, and helper cost functions
- src/store/gameStore.ts — central game state & domain actions
- src/app/hooks/useLSystem.ts — memoization & safety defaults (maxSegments/maxSentenceLength)
- src/app/hooks/useGameLoop.ts — requestAnimationFrame loop and auto-tuner logic
- src/app/components/TreeScene.tsx, Tree.tsx — R3F scene and rendering details
- src/env.js — env validation (SKIP_ENV_VALIDATION can skip during builds)
- .github/prompts/* — existing repo-specific prompts (use as reference when crafting new instructions)

## Project conventions & gotchas ⚠️
- Configs: TS path alias, strict TypeScript, Prettier + Tailwind plugin, and ESLint (use provided configs).
- Client vs Server: Respect React Server Component boundaries in the `app/` router. When adding stateful interactions or hooks, mark files with `"use client"`.
- Resource and geometry limits: L-system can explode; tests or runtime checks must guard new axiom/rule inputs.
- Memory bank & spec-driven workflow: This repository uses a Memory Bank (`/memory/`) and `.github/instructions/*.md` for standards. If you add features, update `memory/tasks/` and `memory/progress.md` per the spec-driven workflow.

## Pull request expectations ✅
- Small, test-backed commits. Include unit tests for logic, a short description of behavioral change, and performance impact notes if relevant.
- Update `memory/tasks` or `.github/prompts` if you change conventions or create reusable prompts.
- If adding a runtime dependency, justify it in the PR description and document its usage.

## Examples (how to change safely)
- To add a new tree rule: add definition to `RULE_LIBRARY` in `src/lib/gameData.ts`, update costs, add tests asserting `getAxiomCost`/`getSeedYield` interactions, and ensure UI exposes unlock via `seedUpgrades` or rules panels.
- To optimize L-system: move pure computations to `src/lib/lsystem.ts`, add deterministic unit tests for `generateSentence`, and ensure `useLSystem` still clamps outputs using `maxSegments` and `maxSentenceLength`.

---
If anything is unclear or you want this shortened/extended, tell me which sections to change and I will iterate. Thanks — ready to apply your edits. ✨