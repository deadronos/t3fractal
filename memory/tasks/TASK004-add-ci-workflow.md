# [TASK004] Add CI workflow for tests

**Status:** Pending  
**Added:** 2026-01-10

## Original Request

Add CI to run unit tests and Playwright e2e tests on pull requests and main branch.

## Thought Process

- A minimal CI should run `npm ci`, `npm run test`, and optionally `npm run e2e` for PRs or nightly runs.
- Use GitHub Actions with a matrix for Node versions and caches for node_modules to speed runs.

## Implementation Plan

- Add `.github/workflows/ci.yml` that runs unit tests on push/PR and e2e on PR merges or manually.
- Configure caching for `~/.npm` and `node_modules` where appropriate.
- Add artifacts or Playwright test reports to job artifacts if tests fail for debugging.

## Progress Tracking

**Overall Status:** Not Started - 0%

### Subtasks

1. Create basic Actions workflow with unit test step.
2. Add e2e job with service runners if needed.
3. Validate job runs on PR and main.

## Acceptance Criteria

- CI runs unit tests on PRs and reports status on GitHub.
- Optional: e2e run is configured and stable or gated behind a separate workflow.
