# Agents — t3fractal

This short guide tells automated agents (Copilot, Claude, etc.) how to behave in this repository. Read this first, then follow the referenced instruction files.

## Read first 📚

- **Primary project guide:** `.github/copilot-instructions.md` (required reading)
- **Policy & workflow files:** `.github/instructions/*` (notable files)
  - `spec-driven-workflow-v1.instructions.md` — design→implement→validate loop
  - `memory-bank.instructions.md` — where and how to update project context and tasks
  - `playwright-typescript.instructions.md` — e2e test style & conventions
  - `self-explanatory-code-commenting.instructions.md` — comment style rules
  - `markdown.instructions.md` — docs/PR content guidelines

## Quick agent checklist ✅

1. Read `.github/copilot-instructions.md` and any relevant `.github/instructions/*.md` for the feature area.
2. Run tests & linters locally before proposing changes:
   - `npm run test` (Vitest)  
   - `npm run lint`  
   - `npm run format:write` (Prettier)  
   - `npm run e2e` (Playwright) for UI changes
3. Make small, test-backed commits. Prefer pure logic changes in `src/lib/*` and put UI in `src/app/components/*`.
4. Respect project constraints: use `@/*` import alias, `"use client"` in client components, and **guard the L-system** (use `maxSegments`/`maxSentenceLength`).
5. Update the Memory Bank when adding features or making design decisions (`/memory/tasks/` and `memory/progress.md`) per `memory-bank.instructions.md`.
6. Create PRs with: short exec summary, changed files, tests added, and a validation checklist (see `spec-driven-workflow-v1.instructions.md`).

## When to ask a human 🆘

- Ambiguous UX decisions (game balance, visuals, or copy).  
- Breaking or wide surface-area refactors without tests.  
- When adding a runtime dependency — ask for justification before committing.

## PR Expectations & quick template ✍️

- Title: `Feature: short description` or `Fix: short description`  
- Body (3 lines): 1) Goal: one-liner. 2) Key changes: files/functions. 3) Validation: tests/commands run.  
- Include performance notes if change affects `useLSystem` or L-system generation.

---

If you want this shortened into a one-line checklist or extended with a PR checklist template and unit-test snippets, tell me which and I will update it.
