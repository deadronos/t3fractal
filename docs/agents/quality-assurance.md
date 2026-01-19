# Quality Assurance

Testing and maintenance rules.

## Core Commands

- `npm run test`: Run Vitest unit tests (crucial for logic in `src/lib/`).
- `npm run e2e`: Run Playwright tests for UI/integration flows.
- `npm run lint`: Check for code style and potential errors.
- `npm run format:write`: Apply Prettier formatting.

## Standards

- **Small Commits**: Prefer atomic changes with descriptive messages.
- **Automated Checks**: Never propose a PR that fails linting or unit tests.
- **New Tests**: Any logic change in `src/lib/` requires a corresponding unit test.
