# [TASK012] - Implement Tech Debt Refactors

**Status:** In Progress  
**Added:** 2025-10-26  
**Updated:** 2025-10-26

## Original Request

Implement the refactoring recommendations documented in `/docs/tech-debt-refactor-report.md` by creating modularized versions of five identified code paths: StartHere component, FractalViewer component, inline CPU worker, cosmic events module, and StartHere CSS.

## Thought Process

The tech debt report identifies five high-impact refactor targets with clear modularization strategies. Rather than attempting all refactors simultaneously, we'll use a phased approach starting with low-risk data extraction, progressing through utility functions, worker externalization, component decomposition, and finally style modularization. This minimizes disruption while maximizing incremental value.

Key considerations:
- Maintain test coverage throughout the process
- Validate each phase before proceeding to next
- Keep changes minimal and focused
- Ensure no visual regressions
- Document any deviations from the plan

## Implementation Plan

Following the spec-driven workflow with 5 phases aligned to DESIGN002:

### Phase 1: Data and Configuration Extraction
- Extract cosmic events catalog and resolver
- Move game configuration data to dedicated modules
- Validate with existing tests

### Phase 2: Utility and Helper Extraction
- Create gameplay utility functions (production math, cost formulas, formatters)
- Extract shared fractal math utilities
- Add comprehensive unit tests

### Phase 3: Worker Externalization
- Create external worker file with typed interfaces
- Implement worker factory for lifecycle management
- Update build configuration if needed

### Phase 4: Component Decomposition
- Refactor FractalViewer with hooks and separate modules
- Split StartHere into focused subcomponents
- Validate with visual testing

### Phase 5: Style Modularization
- Create CSS modules for components
- Extract design tokens
- Migrate to Tailwind utilities

## Progress Tracking

**Overall Status:** In Progress - 25%

### Phase 1: Data and Configuration Extraction

| ID | Description | Status | Updated | Notes |
| --- | --- | --- | --- | --- |
| 1.1 | Extract cosmic events to /src/data/cosmicEvents.ts | Complete | 2025-10-26 | Successfully extracted |
| 1.2 | Create cosmicEventResolver in /src/lib/gameplay/ | Complete | 2025-10-26 | Utility functions exported |
| 1.3 | Move UPGRADE_CONFIG to /src/data/gameConfig.ts | Complete | 2025-10-26 | With types |
| 1.4 | Move FRACTAL_ZONES to /src/data/gameConfig.ts | Complete | 2025-10-26 | With types |
| 1.5 | Validate Phase 1 with tests | Complete | 2025-10-26 | All 22 tests passing ✅ |

### Phase 2: Utility and Helper Extraction

| ID | Description | Status | Updated | Notes |
| --- | --- | --- | --- | --- |
| 2.1 | Create /src/lib/gameplay/ directory structure | Not Started | 2025-10-26 | Foundation |
| 2.2 | Extract production math utilities | Not Started | 2025-10-26 | Priority 2 |
| 2.3 | Extract cost formula utilities | Not Started | 2025-10-26 | Priority 2 |
| 2.4 | Extract formatter utilities | Not Started | 2025-10-26 | Priority 2 |
| 2.5 | Create /src/lib/fractal/fractalMath.ts | Not Started | 2025-10-26 | Priority 2 |
| 2.6 | Add unit tests for gameplay utilities | Not Started | 2025-10-26 | Testing |
| 2.7 | Add unit tests for fractal math | Not Started | 2025-10-26 | Testing |
| 2.8 | Validate Phase 2 with full test suite | Not Started | 2025-10-26 | Checkpoint |

### Phase 3: Worker Externalization

| ID | Description | Status | Updated | Notes |
| --- | --- | --- | --- | --- |
| 3.1 | Create /src/workers/fractalCpu.worker.ts | Not Started | 2025-10-26 | Priority 3 |
| 3.2 | Define typed message interfaces | Not Started | 2025-10-26 | Type safety |
| 3.3 | Create worker factory in /src/lib/fractal/ | Not Started | 2025-10-26 | Lifecycle |
| 3.4 | Update FractalViewer to use external worker | Not Started | 2025-10-26 | Integration |
| 3.5 | Update build config for worker bundling | Not Started | 2025-10-26 | Config |
| 3.6 | Test CPU rendering mode manually | Not Started | 2025-10-26 | Validation |
| 3.7 | Validate Phase 3 with build and tests | Not Started | 2025-10-26 | Checkpoint |

### Phase 4: Component Decomposition

| ID | Description | Status | Updated | Notes |
| --- | --- | --- | --- | --- |
| 4.1 | Create useFractalRenderer hook | Not Started | 2025-10-26 | Priority 4 |
| 4.2 | Move shaders to /src/lib/fractal/shaders.ts | Not Started | 2025-10-26 | Modularization |
| 4.3 | Create separate CPU renderer component | Not Started | 2025-10-26 | Separation |
| 4.4 | Update FractalViewer to use new structure | Not Started | 2025-10-26 | Refactor |
| 4.5 | Create /src/components/starthere/ directory | Not Started | 2025-10-26 | Structure |
| 4.6 | Extract NavigationControls component | Not Started | 2025-10-26 | UI split |
| 4.7 | Extract ZoneList component | Not Started | 2025-10-26 | UI split |
| 4.8 | Extract AscensionPanel component | Not Started | 2025-10-26 | UI split |
| 4.9 | Extract MissionLog component | Not Started | 2025-10-26 | UI split |
| 4.10 | Update StartHere to use subcomponents | Not Started | 2025-10-26 | Integration |
| 4.11 | Visual validation of all components | Not Started | 2025-10-26 | Testing |
| 4.12 | Run E2E tests | Not Started | 2025-10-26 | Testing |
| 4.13 | Validate Phase 4 completely | Not Started | 2025-10-26 | Checkpoint |

### Phase 5: Style Modularization

| ID | Description | Status | Updated | Notes |
| --- | --- | --- | --- | --- |
| 5.1 | Create /src/styles/tokens.css | Not Started | 2025-10-26 | Design system |
| 5.2 | Extract shared design tokens | Not Started | 2025-10-26 | Standards |
| 5.3 | Create component CSS modules | Not Started | 2025-10-26 | Modular styles |
| 5.4 | Migrate StartHere to Tailwind utilities | Not Started | 2025-10-26 | Migration |
| 5.5 | Update component class names | Not Started | 2025-10-26 | Integration |
| 5.6 | Visual validation with screenshots | Not Started | 2025-10-26 | Testing |
| 5.7 | Validate Phase 5 completely | Not Started | 2025-10-26 | Checkpoint |

### Final Validation

| ID | Description | Status | Updated | Notes |
| --- | --- | --- | --- | --- |
| 6.1 | Run full test suite | Not Started | 2025-10-26 | All tests |
| 6.2 | Run lint checks | Not Started | 2025-10-26 | Code quality |
| 6.3 | Build production bundle | Not Started | 2025-10-26 | Build verification |
| 6.4 | Manual smoke testing | Not Started | 2025-10-26 | User flows |
| 6.5 | Update memory bank documentation | Not Started | 2025-10-26 | Documentation |
| 6.6 | Create summary report | Not Started | 2025-10-26 | Handoff |

## Progress Log

### 2025-10-26

- Created TASK012 with comprehensive implementation plan
- Established 5-phase approach aligned with DESIGN002
- Created detailed subtask breakdown (40+ subtasks)
- Set priority levels for incremental delivery
- Ready to begin Phase 1 implementation

**Phase 1 Completed:**
- Extracted cosmic events catalog to /src/data/cosmicEvents.ts
- Created cosmic event resolver in /src/lib/gameplay/cosmicEventResolver.ts
- Exported clampWeight and meetsRequirement utility functions for testability
- Moved UPGRADE_CONFIG to /src/data/gameConfig.ts with types
- Moved FRACTAL_ZONES to /src/data/gameConfig.ts with FractalZone type
- Moved DIMENSIONAL_TARGET to gameConfig
- Updated cosmicEvents.ts to re-export from new modules for backward compatibility
- Updated starthere.tsx imports to use new configuration modules
- Validated: All 22 tests passing, linting clean (only pre-existing warnings)
- Phase 1 complete - data extraction successful with zero breaking changes
