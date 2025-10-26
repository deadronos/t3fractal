# DESIGN001 – Tech-Debt Refactor Target Assessment

**Related Task:** [TASK011](../tasks/TASK011-identify-refactor-targets.md)  
**Date:** 2025-10-26  
**Author:** GitHub Copilot (GPT-5-Codex Preview)

## Objective

Provide a repeatable assessment framework to identify five high-impact files or code paths that should be decomposed into smaller, more focused modules. The resulting recommendations will feed the tech-debt report requested by stakeholders.

## Confidence & Execution Strategy

- **Confidence Score:** 0.82 (Medium)
- **Implications:**
  - Establish a lightweight proof-of-concept by piloting the assessment criteria on one known complex file before auditing the broader codebase.
  - Refine scoring rubric based on the PoC outcome, then expand to remaining targets.
  - Document PoC findings within the analysis notes to demonstrate validation of the methodology.

## Assessment Methodology

### Evaluation Criteria

Each file/code path will be scored across the following dimensions (1–5 scale):

1. **Responsibility Spread:** Number of distinct concerns handled in a single file.
2. **Size & Complexity:** Lines of code, nested structures, and cyclomatic complexity indicators.
3. **Dependency Entanglement:** Degree of coupling to other systems, providers, or contexts.
4. **Change Frequency Alignment:** Relevance to active roadmap items (game state, rendering, UI polish).
5. **Testability:** Ease of unit testing and isolation of logic.

A composite score ≥ 15 flags the candidate for inclusion, subject to qualitative judgment.

### Data Flow Overview

1. **Inputs:** Repository source files, existing documentation, git history if needed.
2. **Processing:**
   - Parse file contents.
   - Apply evaluation criteria and capture observations.
   - Draft proposed modular decomposition.
3. **Outputs:** Structured recommendations incorporated into `/docs/tech-debt-refactor-report.md`.

### Interfaces & Artifacts

- **Requirements Register:** `memory/requirements.md`
- **Task Tracker:** `memory/tasks/TASK011-identify-refactor-targets.md`
- **Final Report:** `/docs/tech-debt-refactor-report.md`

## Error Handling Matrix

| Scenario | Detection Method | Response | Escalation |
| --- | --- | --- | --- |
| Fewer than five viable targets identified | Composite scores below threshold | Revisit evaluation criteria, broaden scope to supporting utilities | Loop back to Analyze phase and document in progress log |
| Ambiguous modular boundaries | Conflicting responsibilities in code review | Propose incremental refactor path with phased extraction | Flag follow-up task for deeper spike if needed |
| Missing context for proprietary imports (e.g., `.triplex`) | Imports unresolved during review | Document assumption and mark dependency risk in report | Notify maintainers; suggest mock or documentation follow-up |
| Outdated memory artifacts | Requirements/task files lacking latest info | Update relevant memory documents before final handoff | Coordinate with active task owners |

## Implementation Tasks

1. **PoC Audit (Fractal Viewer Page):** Validate scoring rubric and capture notes. *(Dependency: repository access)*
2. **Broad Audit:** Apply rubric to additional candidate files and summarize findings.
3. **Recommendation Synthesis:** For each chosen file, outline modularization approach, impacted systems, and testing strategy.
4. **Report Assembly:** Compose Markdown report with front matter, summary, and detailed sections per target.
5. **Validation Pass:** Ensure recommendations meet requirements, update task progress, and record open questions.

## Testing Strategy

- **Unit Testing:** Not applicable (analysis-only deliverable). Emphasize reasoning consistency and cross-referencing existing tests to ensure refactors remain feasible.
- **Peer Verification:** Internal self-review ensuring each recommendation maps to requirements and includes risk analysis.

## Open Questions

1. To what extent should upcoming Zustand refactors influence prioritization?  
2. Are there hidden dependencies in `.triplex` provider integrations that require additional investigation?

## Decision Log

- Adopted composite scoring rubric to balance qualitative judgment with measurable signals.
- Selected medium-confidence path with PoC validation due to moderate uncertainty about codebase evolution cadence.
