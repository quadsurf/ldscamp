Document: /test-running/CONTEXT_PROTOCOL.md
Version: v1.3
Purpose: Strict rules for controlling context expansion, preventing token waste, mapping context loads to AI cost tiers, and defining agentic handoffs.
When to Use: Include especially when debugging loops grow large, context inflation appears, or broad codebase searches are required.
Last Updated: 2026-03-21
Last Update Summary: Matrix sweep v1.3; injected Context Permission Gates (B) relocated from Root; merged the Loading Ladder with the Universal Cost Tiers (C); strengthened Senior Frugality rules (E).

This protocol defines how AI coding agents should manage context during app development so they do not waste tokens, inflate the working set, or drag irrelevant history into active coding loops.

Its goal is simple: keep context windows small, relevant, and budget-conscious.

---

## 1. Context Permission Gating (The Hard Stop)
**Constraint:** Context expansion is not free. Stop and request explicit human authorization before executing any of the following "High-Unit" context operations:
1. **Broad Scans:** Any operation requesting to read or scan > 5 files simultaneously.
2. **Full Log Dumps:** Loading entire raw CI/terminal logs instead of extracting the "Failure Slice".
3. **Unbounded Directory Searches:** Running recursive `grep` or `find` commands across the entire `src/` or `e2e/` tree without strict file-type or path narrowing.

## 2. Primary Context Rules (The Frugal Architect)

### Load by Need, Not by Habit
Do not preload large amounts of repository context by default. Always ask yourself: *What is the absolute minimum I need to solve this specific task safely?*

### Prefer Local Context First
Start with the smallest local surface that can explain the issue: the changed function, the relevant component, or the relevant error output. Only expand outward if local context is mathematically insufficient.

### Prefer Diffs Over Full Files
If the task is about a change, the diff is more valuable than the whole file. Avoid reposting entire files when only a few lines changed.

### Compress Before Expanding
Before loading more context, first summarize what is already known. A concise summary often buys more clarity than dumping raw content into the window.

### The "Assertion-Only" Rule
When a test fails, DO NOT load the full test file. Use targeted reading to load only the specific `it/test` block containing the failure.

### Configuration Integrity (Self-Healing)
**EXECUTION:** Before modifying `*.config.ts(x)`, you MUST compare against `test-creation/examples/` to prevent architectural drift.

---

## 3. Context & Cost-Tier Loading Ladder
When handling a development task, load context in this exact order. **You must match your AI Model Tier to the depth of the context you are loading:**

### Tier 1 (Light/Fast) - Localized Context
*   **Level 1: Task Statement:** The user request and expected output.
*   **Level 2: Immediate Change Surface:** The diff, or the specific function/component.
*   **Level 3: Immediate Validation Surface:** The specific failing assertion and command output summary.
*(Stop here if the issue is clear. Do not escalate tiers or context unnecessarily).*

### Tier 2 (Core) - Feature Context
*   **Level 4: Local Dependencies:** Directly imported helpers, schemas, or related configs.
*   **Level 5: Feature Boundaries:** Route files, parent components, or API contracts.
*(Use Core intelligence to synthesize multi-file relationships without generating internal monologues).*

### Tier 3 (Reasoning) - Architectural Context (Requires Permission)
*   **Level 6: Cross-Cutting Context:** Auth/session rules, app shell behavior, or global state.
*   **Level 7: Repository Doctrine:** Architecture discipline or regression triage rules.
*(Escalate to Reasoning/Thinking models ONLY when reaching Level 6/7, as processing global architecture requires maximum intelligence and token spend).*

---

## 4. Agentic Handoffs (The Baton)
**Constraint:** Context expansion does not happen in a vacuum. If you reach a point where local context is insufficient, pass the baton:
*   **Escalating to Level 6/7:** If you must expand context to Cross-Cutting Architecture, you MUST load `DEBUGGING_CONSTITUTION.md` to justify the token spend against the "Lowest-Cost Sufficient Validation" principle. Do not expand blindly.
*   **Transitioning to Execution:** If context gathering reveals a need to execute tests or commands, stop gathering and load `test-running/SKILL.md` to acquire the targeted execution triage rules.
*   **Priority Alpha Triggers:** If context reveals a failure affecting Routing, Auth, or the App Shell, load `DEBUGGING_PLAYBOOK.md` immediately for "Silent Smoke" tactics.

---

## 5. Debugging Context Protocol
Debugging loops are the biggest context-bloat risk. Follow this strict loop:
1. **Capture Minimally:** Collect failing test name, exact assertion, and exact changed diff.
2. **Summarize Before Expanding:** State what changed, what failed, and the likely owning layer.
3. **Expand One Ring at a Time:** Implementation excerpt -> test excerpt -> dependency. Never three at once.
4. **Patch & Revalidate Small:** Rerun the smallest relevant validation set.
5. **Re-summarize:** If it fails again, summarize what was learned before adding more context.

## 6. Context Compression Rules
*   **Use Summaries Aggressively:** Replace raw repeated context with compact summaries (Task, Current Patch, Current Failure, Constraints, Next Local Question).
*   **Replace Large Logs:** Provide "Failure Slices" (Failing test names, exact assertions, top 3 stack frames).
*   **Replace Repeated Files:** Reference stable files; do not resend them in full.

## 7. Context Anti-Patterns (Zero-Tolerance)
Avoid:
- Pasting full unchanged files repeatedly.
- Replaying entire conversations inside debugging loops.
- Loading broad repo context for local fixes.
- Restating stable policy docs every turn once they are already known.
- Confusing "available context" with "useful context."

---

## 8. Final Summary
Context bloat is the largest hidden token drain in AI-assisted development. 
The right context strategy is: **Local first. Minimal first. Compressed first.**
Treat context the way a senior engineer treats dependencies: only add more when the current system can no longer do the job sufficiently.
