# Progress

**Overview (as of 2026-01-10):**

- The app scaffold is in place with core gameplay, rendering, and state management implemented.
- Tests exist but key deterministic algorithms (L-system sentence generation and interpretation) need more unit coverage.
- Memory Bank was not present prior to this change and has now been added with core files and an initial completed task.

**What's left / Next milestones:**

- TASK002: Add unit tests for `src/lib/lsystem.ts` (generate/interpret) and `src/lib/gameData.ts` (cost/yield functions) — **Completed: tests added and passing locally**.
- TASK003: Add Playwright scenarios for critical flows (seed purchase, iteration, harvest) — task created.
- TASK004: Add CI to run unit tests and e2e tests on pull requests — task created.
- [ ] Add design docs for any non-trivial new mechanics or changes to grammar rules.

**Known issues:**

- Dev server exit code 1 may indicate a local setup or env issue on some machines — reproduce and capture logs.
- L-system safety clamps need to be validated under a wide variety of rule sets to avoid performance regressions.

**Next action:**

- Create task files for the items above and prioritize unit tests for deterministic logic.
