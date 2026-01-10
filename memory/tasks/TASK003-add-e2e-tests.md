# [TASK003] Add Playwright e2e scenarios

**Status:** Pending  
**Added:** 2026-01-10

## Original Request

Create Playwright tests for critical user flows: purchasing seeds, applying iterations, harvesting yields, and verifying UI panels.

## Thought Process

- Prioritize role-based locators and auto-retrying assertions per Playwright guidelines.
- Start with smoke flows that confirm seed purchase -> iteration -> harvest.

## Implementation Plan

- Add tests in `tests/e2e/` or `tests/` following repository Playwright patterns.
- Use `test.step()` for grouping and clear test titles.
- Ensure tests run headless in CI and can be run locally with debugging options.

## Progress Tracking

**Overall Status:** Not Started - 0%

### Subtasks

- Create basic smoke tests for critical flows.
- Add additional accessibility snapshots (optional) if stable.
- Integrate e2e into CI once unit tests are green.

## Acceptance Criteria

- Playwright tests run locally and on CI without flakiness for the smoke scenarios.
