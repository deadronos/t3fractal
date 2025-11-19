# [TASK014] - Add second prestige with Julia tab

**Status:** In Progress
**Added:** 2025-10-27
**Updated:** 2025-10-27

## Original Request

User request: "introduce 2nd prestige that opens up a new tab (rebuild the ui with original in 1 tab, new tab hidden until 2nd prestige) with a different fractal formula like julia sets as visualization to study/zoom and new mechanics and bonuses"

## Thought Process

- A second prestige layer should feel distinct from the existing Dimensional Ascension and unlock a new interaction space rather than just a larger number boost.
- Gating the new tab behind performing the second prestige keeps onboarding smooth while rewarding deeper progression.
- The Julia set makes sense as the visual anchor for the new tab; we can reuse the renderer with a formula switch and separate parameters.
- New prestige currency and Julia-specific mechanics should feed back into the core loop (e.g., production multiplier) to justify the effort and keep both layers connected.

## Implementation Plan

1. Extend the Zustand store with second-prestige state: transcendence counter, harmonic core currency, Julia research stats (flux, depth, constant), and actions for transcending and studying.
2. Update calculation hooks to include the new prestige bonuses, readiness checks, and Julia study costs/gains; integrate bonuses into production math.
3. Expand the fractal renderer (WebGL + CPU worker) to support a Julia formula mode so the new tab can display Julia sets.
4. Rebuild the `StartHere` layout into Radix tabs with the existing frontier view and a gated Julia lab tab, adding UI for the new prestige action and Julia study controls.
5. Wire activity log updates and persistence, then validate types/lint and ensure the new tab unlock flow works visually.

## Progress Tracking

**Overall Status:** In Progress - 75%

### Subtasks

| ID  | Description                                                         | Status       | Updated    | Notes |
| --- | ------------------------------------------------------------------- | ------------ | ---------- | ----- |
| 1.1 | Add new state fields/actions for transcendence and Julia research   | Completed    | 2025-10-27 | Added harmonic cores, Julia flux/depth/constants, new actions |
| 1.2 | Compute second-prestige readiness, yields, and production bonuses   | Completed    | 2025-10-27 | Calculations include new bonuses, study costs, and yields |
| 1.3 | Enable Julia formula rendering in CPU/WebGL paths                   | Completed    | 2025-10-27 | Renderer now switches between Mandelbrot and Julia formulas |
| 1.4 | Build tabbed UI with prestige card updates and Julia lab components | Completed    | 2025-10-27 | Tabs gate Julia Lab behind transcendence, new lab card created |
| 1.5 | Validate via lint/typecheck (and tests if feasible)                 | Not Started  | 2025-10-27 | Pending execution |

## Progress Log

### 2025-10-27

- Created task and outlined plan for second prestige and Julia lab integration.
- Implemented harmonic core prestige layer with Julia Lab unlocks and bonuses feeding production math.
- Added Julia formula rendering across WebGL/CPU paths plus new tabbed UI that reveals the lab after transcending.
