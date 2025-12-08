# [TASK015] - Fix CPU Renderer Aspect Ratio Bug

**Status:** Completed
**Added:** October 26, 2025
**Updated:** 2025-10-26

## Original Request

Find and fix a single, verifiable bug. The CPU fractal renderer (Web Worker) calculates the real (horizontal) component of the complex plane coordinate using the canvas `width` for normalization, while the imaginary (vertical) component uses `height`. This causes distortion on non-square canvases.

## Thought Process

The CPU renderer logic in `src/lib/fractal/workerCodeGenerator.ts` generates worker code as a string. The coordinate calculation for `realComponent` uses `width` in the divisor:
`const realComponent = (px - width/2) / (0.5 * zoom * width) + centerReal;`
It should use `height` (or the same dimension as `imaginaryComponent`) to ensure 1 pixel in X and Y represents the same distance in the complex plane, preserving aspect ratio.

## Implementation Plan

- [x] Create reproduction test case `tests/unit/workerCodeGenerator.test.ts`
- [x] Verify test fails
- [x] Fix the bug in `src/lib/fractal/workerCodeGenerator.ts`
- [x] Verify test passes
- [x] Run regression tests

## Progress Tracking

**Overall Status:** Completed - 100% Complete

### Subtasks

| ID  | Description           | Status                                     | Updated | Notes                |
| --- | --------------------- | ------------------------------------------ | ------- | -------------------- |
| 15.1 | Create test case | Complete | 2025-10-26 | tests/unit/workerCodeGenerator.test.ts created |
| 15.2 | Fix bug | Complete | 2025-10-26 | Updated src/lib/fractal/workerCodeGenerator.ts |
| 15.3 | Verify fix | Complete | 2025-10-26 | Test passes |
