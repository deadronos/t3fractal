# Tech Stack & Conventions

Architecture and coding standards for this repository.

## Core Stack

- **Framework**: Next.js (App Router).
- **Styling**: Tailwind CSS.
- **Rendering**: React Three Fiber (R3F) for 3D.
- **State**: Zustand (`src/store/gameStore.ts`).

## Conventions

- **Logic vs. UI**: Keep heavy calculations in `src/lib/*`. Keep components focused on rendering in `src/app/components/*`.
- **Imports**: Use the `@/*` alias for all internal imports.
- **Client Components**: Always include `"use client"` at the top of files using hooks or R3F.
- **Game Loop**: Use `useGameLoop` for periodic updates; ensure all state changes go through Zustand actions.
