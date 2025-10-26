---
post_title: "Tech Debt Refactor Targets – October 2025"
author1: "GitHub Copilot"
post_slug: "tech-debt-refactor-report"
microsoft_alias: "copilot"
featured_image: "/images/tech-debt-refactor.png"
categories:
  - engineering
tags:
  - tech-debt
  - refactoring
  - t3-stack
ai_note: "Generated with GPT-5-Codex (Preview)"
summary: "Assessment of five monolithic code paths ready for modular refactors within the T3 Fractal app."
post_date: 2025-10-26
---

<!-- markdownlint-disable-next-line MD041 -->
## Overview

This report documents five high-impact files or code paths that should be decomposed into smaller, focused modules. Candidates were selected using the rubric defined in `memory/designs/DESIGN001-tech-debt-refactor-targets.md`, balancing responsibility spread, complexity, coupling, roadmap alignment, and testability.

Key outcomes:

- Highlight 5 priority refactor targets spanning gameplay logic, rendering, data orchestration, and styling.
- Provide concrete modularization strategies with expected benefits, dependencies, and testing considerations.
- Capture quick-win follow-ups that align with ongoing Zustand state and rendering initiatives.

## Assessment Snapshot

| Candidate | Approx. LOC | Composite Score* | Primary Issues | Suggested Refactor Theme |
| --- | --- | --- | --- | --- |
| `src/app/pages/starthere.tsx` | 818 | 22 | Mixed game simulation, UI, and config | Extract hooks, move state to Zustand, split UI shells |
| `FractalViewer` component (`src/app/pages/fractalviewer.tsx`) | 512 | 20 | CPU/WebGL logic intertwined with React surface | Layer renderer adapters, isolate shader + hooks |
| Inline CPU worker string in `FractalViewer` | ~140 (string literal) | 18 | Hard-to-test stringified worker logic | Externalize worker module + typed messaging |
| `src/app/pages/cosmicEvents.ts` | 187 | 17 | Data definitions coupled to resolver logic | Split data catalog from resolver utilities |
| `src/styles/starthere.css` | 263 | 16 | Monolithic globals with overlapping responsibilities | Componentize styles via Tailwind utilities or CSS modules |

\*Composite Score = sum of 1–5 ratings across responsibility spread, complexity, dependency entanglement, roadmap alignment, and testability.

## Detailed Recommendations

### 1. `src/app/pages/starthere.tsx`

#### Current Pain Points – StartHere

- 20+ stateful hooks, derived selectors, and timers exist alongside >400 lines of JSX markup, making the component difficult to reason about or test.
- Business rules (production math, ascension loop, event cadence) are locked into component scope rather than a shared store, blocking the planned Zustand migration (TASK002).
- Constants such as `UPGRADE_CONFIG`, `FRACTAL_ZONES`, and formatting helpers are interwoven with UI logic, complicating reuse.

#### Suggested Modularization – StartHere

- Move long-lived state, derived selectors, and interval orchestration into a dedicated Zustand slice (e.g., `useFrontierSimulationStore`) with memoized selectors for UI consumption.
- Extract computational utilities (production math, cost formulas, formatters) into `/src/lib/gameplay/` to enable unit testing outside React.
- Split UI into subcomponents (`NavigationControls`, `ZoneList`, `AscensionPanel`, `MissionLog`) backed by props from the store, trimming the root component to layout and orchestration only.
- Relocate configuration data (`UPGRADE_CONFIG`, `FRACTAL_ZONES`) into JSON or TypeScript modules under `/src/data/` with explicit types.

#### Dependencies & Risks – StartHere

- Ensure refactor coordinates with TASK002 to avoid conflicting state sources.
- Large JSX extraction could introduce visual regressions; plan component snapshot or Playwright smoke tests.

#### Testing Impact – StartHere

- Unlocks targeted unit tests for production math and ascension rules.
- Simplifies future Playwright assertions by enabling component-level rendering in tests rather than the entire page.

### 2. `FractalViewer` Component (`src/app/pages/fractalviewer.tsx`)

#### Current Pain Points – FractalViewer Component

- WebGL shader setup, CPU canvas rendering, worker orchestration, and UI toggle controls coexist in a 500+ line file.
- Shared calculations (iteration counts, palette math) are duplicated between GPU and CPU paths, increasing the chance of drift.
- Canvas sizing and ResizeObserver handling are embedded inside the component rather than reusable hooks.

#### Suggested Modularization – FractalViewer Component

- Introduce a `useFractalRenderer` hook that encapsulates render-mode state, feature detection, and resize tracking.
- Move shader material definition to `src/lib/fractal/shaders.ts` and export parameters so the Canvas wrapper is declarative.
- Separate CPU renderer into a dedicated module (e.g., `CpuRendererSurface`) that accepts normalized props and delegates worker communication.
- Reuse shared math utilities by exporting them from a common `fractalMath.ts` helper.

#### Dependencies & Risks – FractalViewer Component

- Requires careful handling of Three.js context and ensuring shader registration (`extend`) still runs before Canvas usage.
- Worker bundling may need Vite configuration to support module workers.

#### Testing Impact – FractalViewer Component

- Enables focused unit tests for the hook (e.g., verifying mode switching) and integration tests that mock renderer modules independently.

### 3. Inline CPU Worker String in `FractalViewer`

#### Current Pain Points – Inline Worker

- Worker code lives inside a template literal within a `useEffect`, hampering linting, type checking, and editor tooling.
- Message contracts between React and the worker are implicit; any changes risk runtime failures with no compile-time feedback.
- Termination and cleanup logic is duplicated whenever the effect reruns, raising resource-leak risks.

#### Suggested Modularization – Inline Worker

- Extract worker logic into `src/workers/fractalCpu.worker.ts` leveraging Vite’s worker bundling. Export strongly typed request/response interfaces.
- Wrap worker lifecycle in a `createFractalWorker()` factory that handles instantiation, message subscription, and teardown, returning typed APIs.
- Introduce a small event queue utility to replace the ad-hoc `pendingTiles` array and `scheduled` flag combination, improving determinism.

#### Dependencies & Risks – Inline Worker

- Requires ensuring build pipeline recognizes `.worker.ts` files; update Vite/Next config accordingly.
- Must provide fallbacks for environments without module worker support.

#### Testing Impact – Inline Worker

- Allows unit tests to target the worker module directly using Vitest and mocked `postMessage`/`onmessage` behaviors.

### 4. `src/app/pages/cosmicEvents.ts`

#### Current Pain Points – Cosmic Events Module

- Event catalog, weighting logic, and resolver live in one file, blurring boundaries between data and behavior.
- Mixed concerns make it hard to extend with new events or swap randomization strategies without touching shared logic.
- Utility helpers (`clampWeight`, `meetsRequirement`) are private, so tests duplicate context to reach them.

#### Suggested Modularization – Cosmic Events Module

- Split static event definitions into `src/data/cosmicEvents.ts`, exposing typed DTOs that can be imported by other systems.
- Move selection logic into `src/lib/gameplay/cosmicEventResolver.ts` with explicit inputs/outputs and injectable RNG implementation.
- Export helper functions for requirement checking and weighting so they can be unit tested and reused by simulation services.
- Consider JSON-driven event descriptors to enable content iteration without code changes.

#### Dependencies & Risks – Cosmic Events Module

- Ensure resolver consumers (e.g., StartHere) update imports accordingly; provide migration utility to avoid runtime breakage.
- When moving to JSON, maintain TypeScript schema validation to catch malformed content.

#### Testing Impact – Cosmic Events Module

- Simplifies unit tests by enabling direct imports of resolver helpers and event catalogs without pulling in production dependencies.

### 5. `src/styles/starthere.css`

#### Current Pain Points – StartHere Stylesheet

- Single stylesheet controls layout, typography, and component-specific visuals, leading to tightly coupled selectors and duplication.
- Custom classes (e.g., `.zone-entry`, `.cosmic-meter`) mirror component names but lack co-location, complicating future design system evolution.
- Direct DOM mutations (dark mode toggle) rely on these global selectors, hindering a shift toward composable, theme-aware styling.

#### Suggested Modularization – StartHere Stylesheet

- Migrate repeated styles to Tailwind utility classes or Radix Tokens, reducing custom CSS footprint.
- For bespoke visuals, introduce CSS Modules or `@layer`-scoped partials per component (e.g., `StartHere.module.css`, `EventCard.module.css`).
- Extract shared gradients/animations into design tokens under `/src/styles/tokens.css` for reuse across pages.

#### Dependencies & Risks – StartHere Stylesheet

- Tailwind refactor requires auditing existing class usage to avoid regressions; coordinate with design stakeholders.
- CSS Modules demand updates to JSX class names and potentially new build configuration.

#### Testing Impact – StartHere Stylesheet

- Reduced global CSS lowers the chance of unintended side effects in Playwright visual flows.
- Modular styles make component snapshot tests more predictable.

## Next Steps

1. Schedule paired refactor of `StartHere` and Zustand store work (TASK002) to consolidate simulation logic.  
2. Spike on module-worker extraction for the CPU renderer to validate bundler support.  
3. Break out cosmic event data to a dedicated module and update unit tests to target the new resolver API.  
4. Begin incremental CSS modularization by moving the mission log and zone cards to component-scoped styles.  
5. Track follow-up tasks in the Memory Bank once owners are assigned and timeboxed.

## Validation Checklist

- ✅ Five distinct targets documented with modularization strategies.  
- ✅ Recommendations align with EARS requirements in `memory/requirements.md`.  
- ✅ Error-handling and confidence approach recorded in design artifact `DESIGN001`.  
- ⏳ Implementation tasks pending creation after prioritization alignment.
