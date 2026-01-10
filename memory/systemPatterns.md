# System Patterns

## Architecture

- Next.js (App Router) + React — server and client components split by file directives.
- Rendering: React Three Fiber (`@react-three/fiber`) is used for the 3D tree scene (`TreeScene`, `Tree`).
- Game logic: Pure functions in `src/lib/*` (notably `lsystem.ts` and `gameData.ts`) and hooks in `src/app/hooks/*`.
- State: Global game store implemented using **Zustand** (`src/store/gameStore.ts`).

## Design patterns & conventions

- Keep pure deterministic logic (L-system generation, sentence interpretation, resource math) in `src/lib` so it's testable and isolated from React rendering.
- Use `useMemo` and guardrails in `useLSystem` to avoid runaway sentence/segment growth (`maxSegments`, `maxSentenceLength`).
- Prefer role-based selectors in tests and UI (accessibility-first) and group test steps with `test.step` in Playwright tests.
- Use path alias `@/*` mapped to `src/*` for imports throughout the project.

## Safety constraints and limits

- L-system generation must be defensively clamped to avoid infinite growth or performance spikes.
- All game-state updates must use provided actions in the game store (no direct state mutation).

## File locations of interest

- `src/lib/lsystem.ts` — grammar generation and interpreter
- `src/lib/gameData.ts` — rules, costs, seasons and helper math
- `src/app/hooks/useLSystem.ts` — runtime memoization and safety defaults
- `src/app/components/TreeScene.tsx` and `Tree.tsx` — R3F scene and render concerns
- `src/store/gameStore.ts` — central actions and persisted state
