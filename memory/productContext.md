# Product Context — L-System Arboretum

## Why this project exists

The L-System Arboretum demonstrates how generative grammars (L-systems) can power emergent, playable mechanics in an incremental game. It is intended as both an experimental toy and a polished web experience for players who enjoy procedural content and optimization.

## Target users

- Casual players who enjoy idle/incremental mechanics and visual progression.
- Developers and researchers exploring procedural generation and L-system visualizations.

## Problems it solves

- Provides a testbed for deterministic L-system algorithms that are safe to run in a browser.
- Makes resource and upgrade progression discoverable and testable.

## User experience goals

- Smooth, low-latency rendering of procedural trees.
- Clear progression: seeds, iterations, upgrades, seasons, and harvest.
- Accessible UI and resilient tests that assert gameplay rules.

## Acceptance criteria

- The app renders a playable tree scene on desktop and modern mobile browsers.
- Rules for costs, yields, and upgrades are documented and covered by unit tests.
