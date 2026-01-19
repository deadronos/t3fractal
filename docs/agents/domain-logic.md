# Domain Logic: L-Systems

Specific constraints and rules for the fractal engine.

## Performance & Safety

- **Guard Limits**: Always respect `maxSegments` and `maxSentenceLength` in L-system generation.
- **Caching**: Use `useMemo` in hooks for expensive geometry or sentence processing.
- **Deterministic**: Logic in `src/lib/lsystem.ts` must be pure and deterministic to ensure consistency across renders.

## Extending the Engine

- **Rules**: Add new axioms or rules to the `RULE_LIBRARY` in `src/lib/gameData.ts`.
- **Verification**: Assert costs and yields in unit tests when changing game balancing.
