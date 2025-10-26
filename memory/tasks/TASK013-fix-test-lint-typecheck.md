# [TASK013] - Fix test, lint, and typecheck commands

**Status:** Completed  
**Added:** 2025-10-26  
**Updated:** 2025-10-26

## Original Request

User request: "check and fix npm run test / npm run lint / and npm run typecheck"

## Thought Process

- Need to understand current failure modes by running each script in the local environment.
- Determine whether issues come from configuration drift, code regressions, or missing dependencies.
- Apply targeted fixes with minimal scope while keeping existing functionality intact.
- Re-run commands to confirm all three scripts succeed and document validation.

## Implementation Plan

1. Execute `npm run test`, `npm run lint`, and `npm run typecheck` to collect current errors and logs.
2. Diagnose and resolve failures (update code, configs, or tooling as needed).
3. Re-run all commands to verify green status and capture notes for validation.

## Progress Tracking

**Overall Status:** Completed - 100%

### Subtasks

| ID  | Description                                                | Status       | Updated    | Notes |
| --- | ---------------------------------------------------------- | ------------ | ---------- | ----- |
| 1.1 | Run all three commands and capture failing output          | Completed    | 2025-10-26 | Test/typecheck passed, lint warned about hooks + unused setters |
| 1.2 | Implement fixes for any failing command(s)                 | Completed    | 2025-10-26 | Added missing dependency + removed unused setters |
| 1.3 | Re-run commands and document pass/fail plus follow-up items| Completed    | 2025-10-26 | Test/lint/typecheck all green (tests emit expected canvas warnings) |

## Progress Log

### 2025-10-26

- Task created and initial plan drafted.
- Captured baseline: unit tests and typecheck were already green; ESLint warned about a missing dependency in `FractalViewer` and unused setters in `StartHere`.
- Added `canvasRef` to the CPU renderer effect dependencies and removed unused `setDepth`, `setResonance`, and `setAnomalies` selectors to silence lint.
- Re-ran `npm run test`, `npm run lint`, and `npm run typecheck`; all pass (Vitest still logs jsdom canvas warnings, which are expected without mocking `getContext`).
