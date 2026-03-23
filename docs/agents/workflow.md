# Agent Workflow

This guide covers the operational standards for an AI agent in this repository.

## Spec-Driven Workflow

1. **Design**: Draft ideas in `idea.md` or a feature-specific spec.
2. **Implement**: Write code in small, testable chunks.
3. **Validate**: Run tests and linters before proposing changes.

## Memory Bank

Maintain documentation in `/memory/` to track project state:

- Update `/memory/tasks/` when starting or finishing work.
- Update `memory/progress.md` for major state changes.
- Refer to `.github/instructions/memory-bank.instructions.md` for details.

## Pull Request Standards

- **Title**: `Feature: description` or `Fix: description`.
- **Body**:
  - **Goal**: One-sentence purpose.
  - **Key Changes**: List of files/functions modified.
  - **Validation**: List of tests or commands run successfully.
- **Dependency**: Justify any new runtime dependencies.
