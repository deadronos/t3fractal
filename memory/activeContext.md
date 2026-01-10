# Active Context

**Current focus (2026-01-10):**

- Populate the Memory Bank with core artifacts (this task).
- Stabilize L-system tests and ensure safety clamps are adequate.
- Improve unit coverage for `src/lib/lsystem.ts` and `src/lib/gameData.ts`.

**Recent changes:**

- Branch `rewrite` contains refactor and reorganization of UI and hooks.
- Project uses R3F for tree rendering and extracted pure logic to `src/lib`.

**Next steps:**

1. Add unit tests covering `generateSentence` and `interpretSentence` behaviors.
2. Add tasks for performance tuning and Playwright e2e scenarios.
3. Implement a minimal CI workflow to run unit and e2e tests on PRs.

**Notes:**

- When adding new L-system rules (e.g., in `RULE_LIBRARY`), ensure cost & yield math is updated and accompanied by tests.
