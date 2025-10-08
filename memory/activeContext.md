# Active Context: Fractal Frontier

## Current Work Focus

### Primary Focus Areas

**Fractal Rendering Engine**: Implementing the core fractal visualization system using Three.js/React Three Fiber. This involves:

- Setting up the basic Canvas/WebGL rendering pipeline
- Implementing Mandelbrot set calculations
- Creating zoom and pan controls
- Optimizing performance for real-time exploration

**Game State Management**: Establishing the foundational game state structure with Zustand, including:

- Resource tracking (Fractal Data)
- Upgrade system architecture
- Persistence layer for game progress
- State synchronization across components

### Secondary Focus Areas

**UI Component Library**: Building reusable UI components following atomic design principles:

- Basic atoms (buttons, inputs, displays)
- Molecule components (resource counters, upgrade cards)
- Organism components (control panels, navigation)

**Testing Infrastructure**: Setting up comprehensive testing with Vitest and Playwright:

- Unit tests for utility functions and hooks
- Component integration tests
- E2E tests for critical user journeys

## Recent Changes

### Last Week (October 2025)

**Project Setup**:

- ✅ Initialized T3 Stack project with Next.js 14, TypeScript, Tailwind CSS
- ✅ Configured Vitest for unit testing with jsdom environment
- ✅ Set up Playwright for E2E testing with base configuration
- ✅ Established basic project structure and folder organization

**Initial Components**:

- ✅ Created basic layout components (`layout.tsx`, `page.tsx`)
- ✅ Set up environment validation with `@t3-oss/env-nextjs`
- ✅ Configured path aliases for clean imports
- ✅ Added basic styling with Tailwind CSS

**Development Environment**:

- ✅ Configured ESLint with Next.js rules
- ✅ Set up Prettier with Tailwind CSS plugin
- ✅ Created npm scripts for development workflow
- ✅ Verified build and test commands work correctly

### Current State

**Working Features**:

- Basic Next.js application structure
- Development server running on `npm run dev`
- TypeScript compilation and type checking
- Tailwind CSS styling system
- Basic component architecture

**Known Issues**:

- Fractal rendering not yet implemented
- Game state management not connected
- No interactive gameplay elements
- Missing core game mechanics

## Next Steps

### Immediate Priorities (Next 1-2 Days)

**Fractal Viewer Component**:

1. Create `FractalViewer` component with Canvas element
2. Implement basic Mandelbrot set calculation function
3. Add simple color mapping for iteration counts
4. Integrate with React Three Fiber for 3D capabilities

**Basic Game State**:

1. Set up Zustand store with initial game state
2. Define TypeScript interfaces for game entities
3. Implement basic resource tracking
4. Add localStorage persistence

### Short-term Goals (Next Week)

**Core Gameplay Loop**:

1. Implement zoom mechanics with resource costs
2. Add exploration rewards system
3. Create upgrade purchase functionality
4. Build basic automation (passive resource generation)

**UI Polish**:

1. Design fractal-themed UI components
2. Implement responsive layouts
3. Add visual feedback for user actions
4. Create loading states and error boundaries

### Medium-term Goals (Next Month)

**Advanced Features**:

1. Multiple fractal types (Julia sets, other formulas)
2. Prestige system with dimensional ascension
3. Achievement system and progression tracking
4. Performance optimizations for deep zoom levels

**Quality Assurance**:

1. Comprehensive test coverage (80%+)
2. Performance benchmarking and optimization
3. Cross-browser compatibility testing
4. Accessibility improvements

## Active Decisions and Considerations

### Technical Decisions

**State Management Choice**:

- **Current**: Zustand selected for lightweight, TypeScript-friendly state management
- **Considerations**: Redux considered but rejected due to boilerplate overhead
- **Rationale**: Better developer experience, automatic TypeScript inference, simpler API

**Rendering Technology**:

- **Current**: Three.js/React Three Fiber for fractal visualization
- **Alternatives Considered**: Pure Canvas 2D, WebGL direct usage
- **Rationale**: Better performance for complex 3D fractals, React integration, active community

**Testing Strategy**:

- **Current**: Vitest for unit tests, Playwright for E2E
- **Considerations**: Jest vs Vitest (Vitest chosen for faster execution)
- **Rationale**: Modern tooling, better TypeScript support, faster test runs

### Design Decisions

**UI Theme**:

- **Current**: Space exploration theme with fractal aesthetics
- **Considerations**: How to balance educational content with engaging gameplay
- **Rationale**: Theme reinforces the "exploration of infinite complexity" narrative

**Game Balance**:

- **Current**: Exponential scaling for resources and costs
- **Considerations**: Finding the right balance between challenge and accessibility
- **Rationale**: Classic idle game progression with mathematical foundations

### Architecture Considerations

**Component Organization**:

- **Current**: Atomic design pattern with clear separation of concerns
- **Considerations**: How to structure components for maximum reusability
- **Rationale**: Scalable architecture that supports future feature additions

**Performance Optimization**:

- **Current**: Planning for Web Workers and progressive loading
- **Considerations**: Memory management for large fractal datasets
- **Rationale**: Ensuring smooth performance during deep fractal exploration

## Open Questions

### Technical Questions

1. How to optimize fractal calculations for real-time rendering?
2. What's the best approach for handling very large numbers (beyond JavaScript's Number type)?
3. How to implement smooth zooming transitions without performance drops?

### Design Questions

1. What fractal parameters should be user-adjustable?
2. How to balance educational tooltips with gameplay flow?
3. What visual feedback is most effective for exploration actions?

### User Experience Questions

1. How to make fractal exploration intuitive for non-mathematicians?
2. What onboarding flow best introduces the game concepts?
3. How to prevent the game from feeling too abstract or confusing?

## Risk Assessment

### High-Risk Items

- **Fractal Performance**: Complex calculations may cause browser freezing
- **Mathematical Accuracy**: Ensuring correct fractal implementations
- **User Engagement**: Risk of game feeling too abstract or educational

### Mitigation Strategies

- **Performance**: Implement progressive rendering and worker threads
- **Accuracy**: Reference mathematical literature and test against known implementations
- **Engagement**: User testing and iteration on game feel and visual design

## Dependencies and Blockers

### External Dependencies

- **Three.js/React Three Fiber**: Required for 3D fractal rendering
- **Zustand**: Core state management dependency
- **Tailwind CSS**: UI styling framework

### Internal Dependencies

- **Game State Design**: Must be completed before implementing UI components
- **Fractal Engine**: Foundation for all exploration mechanics
- **Resource System**: Required for upgrade and automation systems

### Potential Blockers

- **Browser Compatibility**: WebGL support requirements
- **Performance Constraints**: Mobile device limitations
- **Mathematical Complexity**: Ensuring accessible yet accurate implementations
