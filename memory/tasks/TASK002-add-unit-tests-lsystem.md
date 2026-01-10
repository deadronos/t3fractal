# [TASK002] Add unit tests for L-system

**Status:** Completed  
**Added:** 2026-01-10  
**Updated:** 2026-01-10

## Original Request

Add deterministic unit tests for L-system generation and interpretation (`src/lib/lsystem.ts`) and cost/yield functions in `src/lib/gameData.ts`.

## Thought Process

- L-system generation and interpreter are core, deterministic algorithms that must be covered by unit tests.
- Start with unit tests for `generateSentence` and `interpretSentence` covering edge cases and safety clamps (`maxSegments`, `maxSentenceLength`).
- Add tests for `getIterationCost` and `getSeedYield` to assert expected numeric behavior.

## Implementation Plan

- Create unit tests in `tests/unit/lsystem.spec.ts` and `tests/unit/gameData.spec.ts`.
- Target deterministic inputs: small grammars, explicitly recorded expected outputs.
- Ensure tests fail on regressions and add to CI when available.

## Progress Tracking

**Overall Status:** Completed - 100%

### Subtasks

1. Write tests for `generateSentence` with multiple iterations and ensure result length and contents match expectations. - Completed
2. Test `interpretSentence` to ensure segments/leaves are produced and obey clamp limits. - Completed
3. Add tests for cost/yield math in `gameData.ts`. - Completed
4. Run tests locally and add to the test suite. - Completed

## Progress Log

### 2026-01-10

- Implemented `tests/unit/lsystem.spec.ts` and `tests/unit/gameData.spec.ts` covering generation, interpretation, iteration cost, seed yield and axiom cost.
- Added minimal test setup `tests/setup.ts` to satisfy the Vitest config.
- Ran `npm run test` — all unit tests pass locally (9 tests).


## Acceptance Criteria

- Tests for L-system generation and interpretation are present and pass locally.
- Numeric cost/yield functions have coverage and document expected behavior.
