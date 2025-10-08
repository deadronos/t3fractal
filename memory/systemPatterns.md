# System Patterns: Fractal Frontier

## System Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React UI      │    │  Game Logic     │    │  Fractal        │
│   Components    │◄──►│  State Mgmt    │◄──►│  Rendering      │
│                 │    │  (Zustand)     │    │  Engine         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Input    │    │  Resource       │    │  Canvas/WebGL   │
│   Handlers      │    │  Calculations   │    │  Rendering      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Component Hierarchy

```
App (Next.js)
├── Layout
│   ├── Navigation
│   ├── GameHUD
│   └── FractalViewer
│       ├── Controls
│       ├── Canvas
│       └── InfoPanel
├── GameState Provider
└── UI Providers
```

## Key Technical Decisions

### State Management Strategy

**Decision**: Use Zustand for client-side state management

- **Rationale**: Lightweight, TypeScript-friendly, less boilerplate than Redux
- **Benefits**: Simple API, automatic TypeScript inference, middleware support
- **Trade-offs**: Less ecosystem maturity than Redux, manual persistence handling

**Implementation**:

```typescript
interface GameState {
  resources: Resources;
  upgrades: Upgrades;
  fractal: FractalState;
}

const useGameStore = create<GameState & Actions>()(
  persist(
    (set, get) => ({
      // state and actions
    }),
    { name: 'fractal-frontier-storage' }
  )
);
```

### Fractal Rendering Approach

**Decision**: Canvas/WebGL-based rendering with progressive detail loading

- **Rationale**: Direct control over rendering performance, WebGL for complex fractals
- **Benefits**: Better performance than DOM-based approaches, hardware acceleration
- **Trade-offs**: Complex implementation, browser compatibility considerations

**Architecture**:

- **Canvas Layer**: Primary rendering surface
- **Worker Pool**: Offload calculations to prevent UI blocking
- **LOD System**: Level-of-detail rendering based on zoom level

### Component Design Patterns

#### Atomic Design Pattern

**Atoms**: Basic UI elements (Button, Input, Icon)
**Molecules**: Composite UI elements (ResourceDisplay, UpgradeCard)
**Organisms**: Complex UI sections (GameHUD, FractalControls)
**Templates**: Page layouts (GameLayout, MenuLayout)
**Pages**: Complete pages (HomePage, GamePage)

#### Custom Hooks Pattern

```typescript
// Business logic extraction
const useFractalExploration = () => {
  const zoom = useGameStore(state => state.fractal.zoom);
  const explore = useGameStore(state => state.explore);

  const canZoom = useMemo(() => zoom < MAX_ZOOM, [zoom]);
  const zoomCost = useMemo(() => calculateZoomCost(zoom), [zoom]);

  return { zoom, canZoom, zoomCost, explore };
};
```

## Design Patterns in Use

### Observer Pattern (State Management)

**Context**: Game state changes need to update multiple UI components
**Solution**: Zustand store with selectors and subscribers
**Implementation**: Components subscribe to relevant state slices

### Strategy Pattern (Fractal Algorithms)

**Context**: Different fractal types (Mandelbrot, Julia, etc.) with different calculation methods
**Solution**: Strategy pattern for fractal computation

```typescript
interface FractalStrategy {
  calculate(x: number, y: number, params: FractalParams): number;
  getColor(iterations: number): Color;
}

const mandelbrotStrategy: FractalStrategy = {
  calculate: (x, y, params) => { /* Mandelbrot calculation */ },
  getColor: (iterations) => { /* Mandelbrot coloring */ }
};
```

### Factory Pattern (Game Entities)

**Context**: Creating different types of upgrades, resources, and game entities
**Solution**: Factory functions for consistent object creation

```typescript
const createUpgrade = (type: UpgradeType, level: number): Upgrade => ({
  id: generateId(),
  type,
  level,
  cost: calculateCost(type, level),
  effect: calculateEffect(type, level)
});
```

### Command Pattern (Game Actions)

**Context**: Complex game actions that need undo/redo capability
**Solution**: Command pattern for encapsulating actions

```typescript
interface GameCommand {
  execute(): void;
  undo(): void;
  canExecute(): boolean;
}

class ExploreCommand implements GameCommand {
  constructor(private gameState: GameState) {}

  execute() {
    this.gameState.explore();
  }

  undo() {
    this.gameState.retreat();
  }

  canExecute() {
    return this.gameState.canExplore();
  }
}
```

## Component Relationships

### Data Flow Architecture

```
User Input → Event Handlers → State Updates → UI Re-renders
    ↓              ↓              ↓              ↓
Validation → Business Logic → Persistence → Visual Feedback
```

### State Update Flow

1. **User Action**: Click, keyboard input, or timer event
2. **Input Validation**: Check if action is allowed
3. **State Calculation**: Compute new state values
4. **State Update**: Atomic state change via Zustand
5. **Side Effects**: Persistence, animations, sound effects
6. **UI Update**: React re-renders affected components

### Component Communication

- **Props Down**: Parent components pass data to children
- **Events Up**: Child components emit events to parents
- **Context**: Global state accessed via React Context or Zustand hooks
- **Callbacks**: Function props for child-to-parent communication

## Performance Patterns

### Rendering Optimization

**Memoization**:

```typescript
const FractalCanvas = memo(({ zoom, center }: Props) => {
  // Expensive calculations here
  return <canvas ref={canvasRef} />;
});
```

**Virtual Scrolling**: For large upgrade lists
**Debouncing**: For frequent state updates (resource counters)
**Web Workers**: For fractal calculations

### Memory Management

- **Object Pooling**: Reuse fractal calculation objects
- **Garbage Collection**: Explicit cleanup of large data structures
- **Lazy Loading**: Load fractal assets on demand
- **Cache Strategy**: Cache computed fractal regions

## Error Handling Patterns

### Error Boundaries

```typescript
class GameErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <GameErrorFallback />;
    }
    return this.props.children;
  }
}
```

### Graceful Degradation

- **Feature Detection**: Check for WebGL support
- **Fallback Rendering**: Canvas 2D fallback for WebGL
- **Progressive Enhancement**: Core features work without advanced features

## Testing Patterns

### Unit Testing Structure

```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   └── index.ts
│   └── ...
├── hooks/
│   ├── useGameState/
│   │   ├── useGameState.ts
│   │   ├── useGameState.test.tsx
│   │   └── index.ts
└── lib/
    ├── gameLogic/
    │   ├── calculations.ts
    │   ├── calculations.test.ts
    │   └── index.ts
```

### Integration Testing

- **Component Integration**: Test component interactions
- **Hook Integration**: Test custom hooks with real state
- **E2E Scenarios**: Critical user journeys

## Deployment Patterns

### Build Optimization

- **Code Splitting**: Route-based and component-based splitting
- **Asset Optimization**: Image compression, font subsetting
- **Bundle Analysis**: Regular bundle size monitoring

### Environment Configuration

- **Build-time Config**: Environment-specific builds
- **Runtime Config**: Client-side configuration loading
- **Feature Flags**: Runtime feature toggling
