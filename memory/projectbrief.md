# Project Brief — L-System Arboretum

**Purpose:** Provide the canonical project summary and scope for the L-System Arboretum (aka t3fractal).

**Short description:** A web-based incremental idle game where players cultivate procedural fractal trees using L-System genetics. The app is implemented with Next.js (App Router) and renders trees using React Three Fiber. Game state and progression mechanics are implemented in TypeScript and tested with Vitest and Playwright.

## Primary goals

- Provide an approachable, playable incremental game around generative L-systems.
- Keep the core L-system logic deterministic and testable outside rendering code.
- Maintain strong developer ergonomics (tests, linting, memory docs) for maintainability.

## Scope & Out of Scope

- In scope: L-system generation & interpretation, seed & upgrade mechanics, UI panels for gameplay, resource math, accessibility and resilient test coverage.
- Out of scope: deployment orchestration beyond typical static builds, native apps, complex multiplayer sync.

## Key stakeholders

- Owner / Maintainer: deadronos
- Contributors: repository collaborators (see GitHub project)

## Repo location & branches

- Repository: deadronos/t3fractal
- Current working branch: `rewrite` (as of 2026-01-10)
- Default branch: `main`

## Acceptance criteria for project health

- Deterministic L-system algorithms with unit tests.
- CI runs tests and e2e Playwright checks.
- Memory Bank contains core artifacts: requirements, design, tasks, active context and progress.
