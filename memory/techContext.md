# Technical Context: Fractal Frontier

## Technology Stack

### Core Framework

- **Next.js 14+**: React framework with App Router for modern web development
- **React 19**: Latest React version with concurrent features and improved performance
- **TypeScript**: Type-safe JavaScript for robust development and better developer experience

### Styling and UI

- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **PostCSS**: CSS processing with autoprefixing and optimization

### 3D Graphics and Visualization

- **Three.js**: JavaScript 3D library for fractal rendering
- **React Three Fiber**: React renderer for Three.js with declarative components
- **React Three Drei**: Useful helpers and abstractions for React Three Fiber

### State Management

- **Zustand**: Lightweight state management solution for game state persistence
- **Local Storage**: Client-side persistence for game progress

### Development Tools

- **Vitest**: Fast unit testing framework with Jest compatibility
- **Playwright**: End-to-end testing for web applications
- **ESLint**: Code linting with Next.js configuration
- **Prettier**: Code formatting with Tailwind CSS plugin

### Build and Deployment

- **Next.js Build System**: Optimized production builds with static generation
- **Vercel**: Recommended deployment platform for Next.js applications

## Development Environment

### Prerequisites

- **Node.js**: Version 18.0.0 or higher
- **npm/yarn/pnpm**: Package manager for dependency management
- **Git**: Version control system

### Environment Setup

```bash
# Clone repository
git clone https://github.com/deadronos/t3fractal.git
cd t3fractal

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development Scripts

- `npm run dev`: Start development server with Turbo mode
- `npm run build`: Create production build
- `npm run start`: Start production server
- `npm run test`: Run unit tests with Vitest
- `npm run e2e`: Run end-to-end tests with Playwright
- `npm run lint`: Run ESLint for code quality
- `npm run format`: Format code with Prettier

## Technical Constraints

### Performance Constraints

- **Fractal Rendering**: Complex mathematical calculations must run smoothly in browser
- **Real-time Updates**: Game state updates should maintain 60fps for smooth experience
- **Memory Management**: Large fractal datasets need efficient memory usage
- **Mobile Compatibility**: Performance optimizations for mobile devices

### Browser Compatibility

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **WebGL Support**: Required for Three.js fractal rendering
- **ES2020+ Features**: Modern JavaScript features supported in target browsers

### Security Constraints

- **Client-side Only**: No server-side authentication or data validation initially
- **Local Storage**: Game data stored locally with no server persistence
- **Content Security**: No external script loading beyond allowed CDNs

## Dependencies and Libraries

### Core Dependencies

```json
{
  "next": "^14.0.0",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "typescript": "^5.0.0",
  "tailwindcss": "^3.0.0",
  "three": "^0.150.0",
  "@react-three/fiber": "^8.0.0",
  "@react-three/drei": "^9.0.0",
  "zustand": "^4.0.0"
}
```

### Development Dependencies

```json
{
  "@types/node": "^20.0.0",
  "@types/react": "^19.0.0",
  "@types/react-dom": "^19.0.0",
  "@types/three": "^0.150.0",
  "vitest": "^1.0.0",
  "@playwright/test": "^1.0.0",
  "eslint": "^8.0.0",
  "eslint-config-next": "^14.0.0",
  "prettier": "^3.0.0",
  "prettier-plugin-tailwindcss": "^0.5.0"
}
```

## Architecture Patterns

### Component Architecture

- **Atomic Design**: Components organized by complexity (atoms, molecules, organisms)
- **Custom Hooks**: Business logic extracted into reusable hooks
- **Provider Pattern**: Context providers for global state management

### Game State Management

- **Zustand Stores**: Separate stores for game state, UI state, and settings
- **Immer Integration**: Immutable state updates with immer middleware
- **Persistence**: Automatic localStorage synchronization

### Fractal Rendering

- **Canvas-based Rendering**: HTML5 Canvas or WebGL for fractal visualization
- **Progressive Loading**: Load fractal details incrementally to maintain performance
- **Worker Threads**: Offload heavy calculations to web workers

## Code Quality Standards

### TypeScript Configuration

- **Strict Mode**: All strict TypeScript checks enabled
- **Path Aliases**: Configured for clean imports (`@/components/*`, `@/lib/*`)
- **Type Definitions**: Comprehensive types for game entities and state

### Testing Strategy

- **Unit Tests**: Component and utility function testing with Vitest
- **Integration Tests**: Feature-level testing with React Testing Library
- **E2E Tests**: Critical user journeys tested with Playwright
- **Test Coverage**: Aim for 80%+ coverage on critical paths

### Code Style

- **ESLint Rules**: Next.js recommended rules with custom additions
- **Prettier Config**: Consistent formatting with Tailwind CSS support
- **Import Order**: Organized imports with type imports separated

## Deployment and Infrastructure

### Build Optimization

- **Static Generation**: Use Next.js static generation where possible
- **Code Splitting**: Automatic code splitting for optimal loading
- **Image Optimization**: Next.js Image component for fractal assets

### Environment Variables

- **Runtime Validation**: @t3-oss/env-nextjs for type-safe environment variables
- **Build-time Checks**: Environment validation during build process
- **Development Overrides**: SKIP_ENV_VALIDATION for local development

### Monitoring and Analytics

- **Error Tracking**: Client-side error monitoring (future implementation)
- **Performance Monitoring**: Core Web Vitals tracking
- **User Analytics**: Basic usage analytics for game engagement
