---
name: rules
description: Pre-Flight Pruning Rules to apply to any skill in this subdir before it is loaded into any context window
---

Status: supposedly, all the superpowers skills have already been stripped of orchestration/harness/governance capabilities that would otherwise attempt to fight you for control over your built-in loops or my custom BATON.json handoff mechanics. Therefore, do not exhaust too much compute and/or tokens trying to prune these skills. Cursory, surface level scans/analysis/pruning for honoring the rules provided below, are preferred. Avoid deep scanning/analysis since these skills have for the most part, already been stripped of their over-reaching governance capabilities.

Scope: Apply to all files within the /superpowers subdir.
Objective: Extract and retain only the skill-layer logic from each file.

Exclusion Rule:
- Identify and remove any content related to orchestration, including:
  - Instructions that control agent coordination, routing, or execution flow
  - Constraints that override or interfere with Antigravity’s orchestration
  - Any directives that assume control over task delegation or sequencing

Preservation Rule:
- Do not discard an entire skill due to the presence of orchestration logic.
- Instead, surgically remove only the orchestration-related sections and retain all valid, non-orchestration skill content.

Output Requirement:
  - Return a cleaned version of each skill containing only the filtered skill-layer content.
  - Ensure the remaining content is coherent and functional without orchestration dependencies.

Exception Rule:
 - the "finishing-a-development-branch" skill should employ both the skills and protocols/procedures/orchestration found within.
 - if issues arise between this "exception" skill, and how Antigravity IDE prefers to handle finishing a development branch, then prompt me and work with me to resolve it together