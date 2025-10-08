# Fractal Frontier

An idle game that explores the infinite complexity of fractal universes, blending space exploration with pure mathematics. Dive into fractals like the Mandelbrot set, collect resources through exploration, automate your progress, and ascend through dimensions in this educational and entertaining idle experience.

## Game Overview

Fractal Frontier presents fractals as "universes" to explore. Start at a coarse level and invest in deeper exploration to reveal intricate details and yield resources. Each zoom into the fractal represents venturing into a strange new world, where mathematical patterns become your cosmic landscapes.

## Core Gameplay

### Exploration and Zooming

- The primary action is "zooming" into the fractal to gather Fractal Data.
- Deeper levels yield exponentially more data but require more time and resources without upgrades.
- Manual zooming satisfies the clicker aspect while automation handles the idle progression.

### Resource Management

- **Fractal Data**: Primary resource collected through exploration.
- Spend data to build automation tools like fractal probes and dimension algorithms.
- These generators continuously produce data, simulating automated mathematical processes.

### Unlocking New Areas

- Discover different "zones" or patterns within fractals (e.g., minibrot sets in the Mandelbrot).
- Unlock new fractal formulas (like Julia sets) that act as new worlds with unique bonuses.
- Secondary resources like Chaos Tokens provide production boosts.

### Prestige Mechanics

- Perform "Dimensional Ascension" to reset progress and gain Dimensional Points.
- Use points for permanent upgrades, such as increased data yield or starting at deeper zoom levels.
- Each ascension represents discovering a new dimension or meta-fractal, offering replayability.

## Features

- **Mathematical Education**: Intuitive feel for fractals, limits, and chaos theory through gameplay.
- **Idle Automation**: Deploy "exploration drones" to gather resources passively.
- **Visual Fractal Display**: Interactive canvas rendering of fractal patterns.
- **Progressive Complexity**: Exponential challenges that reward strategic investment.
- **Replayability**: Multiple fractal universes with unique characteristics.

## Tech Stack

This project is built with the T3 Stack:

- **Next.js**: React framework for the web application.
- **TypeScript**: Type-safe JavaScript for robust development.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Vitest**: Unit testing framework.
- **Playwright**: End-to-end testing.
- **Three.js + React Three Fiber**: For advanced 3D fractal visualizations.
- **Zustand**: State management for game state.

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/deadronos/t3fractal.git
   cd t3fractal
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to start playing.

## Development

### Available Scripts

- `npm run dev`: Start the development server with Turbo.
- `npm run build`: Build the application for production.
- `npm run start`: Start the production server.
- `npm run test`: Run unit tests with Vitest.
- `npm run e2e`: Run end-to-end tests with Playwright.
- `npm run lint`: Run ESLint for code quality.
- `npm run format`: Format code with Prettier.

### Project Structure

- `src/app/`: Next.js app router pages and components.
- `src/components/`: Reusable React components.
- `src/providers/`: Context providers for state management.
- `src/styles/`: Global styles and CSS files.
- `tests/`: Unit and end-to-end tests.

### Environment Variables

Create a `.env.local` file in the root directory with:

```bash
# Add your environment variables here
```

Note: The app uses `@t3-oss/env-nextjs` for runtime environment validation.

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`.
3. Make your changes and add tests.
4. Run the test suite: `npm run test && npm run e2e`.
5. Commit your changes: `git commit -m 'Add some feature'`.
6. Push to the branch: `git push origin feature/your-feature-name`.
7. Open a pull request.

Please ensure your code follows our coding standards and includes appropriate tests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

Inspired by idle games and the beauty of fractal mathematics. Special thanks to the T3 Stack community for the excellent development tools.
