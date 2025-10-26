# DESIGN002 – Tech-Debt Refactor Implementation Strategy

**Related Task:** [TASK012](../tasks/TASK012-implement-tech-debt-refactors.md)  
**Date:** 2025-10-26  
**Author:** GitHub Copilot Agent

## Objective

Execute the modularization recommendations from `/docs/tech-debt-refactor-report.md` in a phased, incremental approach that maintains stability while reducing technical debt across five key areas: StartHere component, FractalViewer component, inline CPU worker, cosmic events module, and StartHere CSS.

## Confidence & Execution Strategy

- **Confidence Score:** 0.75 (Medium-High)
- **Implications:**
  - Use incremental refactoring with test validation after each phase
  - Prioritize extracting pure functions and data before complex UI components
  - Maintain backward compatibility during transition
  - Validate with existing test suite and manual verification

## Implementation Phases

### Phase 1: Data and Configuration Extraction (Low Risk)
**Priority:** Highest  
**Rationale:** Pure data extraction with minimal behavioral changes

1. **Cosmic Events Data Split**
   - Extract event catalog from `cosmicEvents.ts` to `/src/data/cosmicEvents.ts`
   - Create typed interfaces for event definitions
   - Move resolver logic to `/src/lib/gameplay/cosmicEventResolver.ts`
   - Export helper functions for testing
   - **Risk:** Low - primarily moving static data
   - **Validation:** Existing tests should pass without modification

2. **StartHere Configuration Extraction**
   - Move `UPGRADE_CONFIG` and `FRACTAL_ZONES` to `/src/data/gameConfig.ts`
   - Export with TypeScript types
   - Update imports in `starthere.tsx`
   - **Risk:** Low - configuration data only
   - **Validation:** Visual inspection + test run

### Phase 2: Utility and Helper Extraction (Medium Risk)
**Priority:** High  
**Rationale:** Extract computational logic to enable unit testing

1. **Gameplay Utilities**
   - Create `/src/lib/gameplay/` directory
   - Extract production math functions from `starthere.tsx`
   - Extract cost formulas and formatters
   - Add unit tests for each utility function
   - **Risk:** Medium - must ensure exact behavioral match
   - **Validation:** New unit tests + integration with existing component

2. **Fractal Math Utilities**
   - Create `/src/lib/fractal/fractalMath.ts`
   - Extract shared calculations between GPU/CPU paths
   - Document expected inputs/outputs
   - **Risk:** Medium - critical for rendering accuracy
   - **Validation:** Visual comparison + unit tests

### Phase 3: Worker Externalization (Medium-High Risk)
**Priority:** Medium  
**Rationale:** Improves maintainability but requires build config

1. **CPU Worker Module**
   - Create `/src/workers/fractalCpu.worker.ts`
   - Define typed message interfaces
   - Implement worker factory in `/src/lib/fractal/workerFactory.ts`
   - Update Vite/Next config for worker bundling if needed
   - **Risk:** Medium-High - requires build tooling changes
   - **Validation:** Manual testing of CPU rendering mode + build verification

### Phase 4: Component Decomposition (High Risk)
**Priority:** Medium-Low  
**Rationale:** Most visible changes, requires careful UI validation

1. **FractalViewer Refactor**
   - Create `useFractalRenderer` hook
   - Move shader definitions to `/src/lib/fractal/shaders.ts`
   - Create separate CPU renderer component
   - **Risk:** High - affects core rendering functionality
   - **Validation:** Visual testing + Playwright E2E tests

2. **StartHere Component Split**
   - Create subcomponents: `NavigationControls`, `ZoneList`, `AscensionPanel`, `MissionLog`
   - Extract UI logic to component files
   - Maintain existing behavior
   - **Risk:** High - largest component, most complex state
   - **Validation:** Comprehensive visual testing + existing unit tests

### Phase 5: Style Modularization (Low-Medium Risk)
**Priority:** Low  
**Rationale:** Visual changes that can be validated easily

1. **CSS Module Migration**
   - Create component-scoped CSS modules
   - Extract design tokens to `/src/styles/tokens.css`
   - Migrate to Tailwind utilities where appropriate
   - **Risk:** Low-Medium - visual changes only
   - **Validation:** Visual comparison + Playwright screenshot tests

## Data Flow & Architecture

### Before Refactor
```
src/app/pages/starthere.tsx (800+ LOC)
  ├─ Mixed: State + Logic + Config + UI
  └─ Tightly coupled

src/app/pages/fractalviewer.tsx (500+ LOC)
  ├─ Mixed: Rendering + State + Worker + UI
  └─ Inline worker code
```

### After Refactor
```
src/
├── data/
│   ├── gameConfig.ts (extracted configs)
│   └── cosmicEvents.ts (event catalog)
├── lib/
│   ├── gameplay/
│   │   ├── productionMath.ts
│   │   ├── costFormulas.ts
│   │   ├── formatters.ts
│   │   └── cosmicEventResolver.ts
│   └── fractal/
│       ├── fractalMath.ts
│       ├── shaders.ts
│       ├── workerFactory.ts
│       └── hooks/
│           └── useFractalRenderer.ts
├── workers/
│   └── fractalCpu.worker.ts
├── components/ (new)
│   └── starthere/
│       ├── NavigationControls.tsx
│       ├── ZoneList.tsx
│       ├── AscensionPanel.tsx
│       └── MissionLog.tsx
└── styles/
    ├── tokens.css (design system)
    └── components/ (CSS modules)
```

## Error Handling Matrix

| Scenario | Detection Method | Response | Escalation |
| --- | --- | --- | --- |
| Test failures after refactor | Automated test suite | Rollback specific change, debug issue | Document in progress log if blocker |
| Visual regression | Manual inspection | Compare before/after screenshots | Create follow-up task if minor |
| Build configuration issues | Build process failure | Review Vite/Next config for worker support | Check documentation, seek maintainer input |
| Type errors after extraction | TypeScript compiler | Add proper type definitions | Ensure backward compatibility |
| Performance degradation | Manual testing | Profile and optimize extracted code | Revert if significant impact |
| Missing dependencies | Runtime errors | Check import paths and module resolution | Update tsconfig paths if needed |

## Testing Strategy

### Unit Tests
- Add tests for extracted utility functions in `/src/lib/gameplay/` and `/src/lib/fractal/`
- Test cosmic event resolver independently
- Test worker message interfaces with mocked postMessage

### Integration Tests
- Verify existing component tests still pass
- Add tests for new hooks (useFractalRenderer)
- Test worker factory lifecycle

### Visual/E2E Tests
- Manual comparison before/after for each component refactor
- Run existing Playwright E2E tests
- Take screenshots for visual regression detection

## Migration Path

### For Each Refactor:
1. Create new module/component structure
2. Implement with backward compatibility
3. Update imports incrementally
4. Run tests after each change
5. Visual verification
6. Commit when stable

### Rollback Strategy:
- Each phase is independently reversible
- Keep original code until new code is validated
- Use feature flags for risky changes if needed

## Open Questions

1. Should we introduce a feature flag system for gradual rollout of refactored components?
2. Are there performance benchmarks we should establish before starting?
3. Should CSS migration wait for design system standardization?
4. Do we need to coordinate with any ongoing Zustand refactor work?

## Decision Log

- Chose phased approach starting with low-risk data extraction
- Deferred StartHere component split until later phase due to complexity
- Prioritized worker externalization for developer experience improvement
- Will validate each phase before moving to next
- Will maintain existing test coverage as baseline
