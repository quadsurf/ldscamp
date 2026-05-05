Document: /test-running/FILE_INDEX.md
Version: v1.3
Purpose: Master directory of AI governance files, mapping situational context loads to strict cost-tiers and permission gates.
When to Use: Include when deciding which governance files to load, determining the appropriate AI model tier, or verifying architectural boundaries.
Last Updated: 2026-03-21
Last Update Summary: Matrix sweep v1.3; strictly pruned Agentic Handoff language (D); fortified the Cost Ladder (C) and Permission Gates (B) into a unified master reference table; reinforced Senior Frugality (E).

# 1. Seniority Posture: The Frugal Directory
**Constraint:** Do not blindly load the entire governance stack into your context window. That is a massive waste of tokens. Use this index to identify the *minimum sufficient governance* required for your current task, and load only those specific files.

# 2. Governance File Index

| File Path | Purpose / Doctrine | When to Use |
| :--- | :--- | :--- |
| `/SKILL.md` | **Root Switchboard:** Master cost-management router. | Always at session start to establish the senior frugality posture. |
| `/test-creation/SKILL.md` | **Design & Rules:** "Validation-First" creation logic. | When evaluating if a test is needed, and writing new Vitest/Playwright tests. |
| `/test-running/SKILL.md` | **Execution Room:** Surgical runner triage and assertion rules. | When executing commands to run tests and verify code. |
| `DEBUGGING_SYSTEM.md` | **Runtime Bundle:** Lean synthesis for context discipline. | Default load for all standard coding sessions. |
| `DEBUGGING_PLAYBOOK.md` | **Repair Loops:** Strict evidence-based debugging procedure. | When tests fail or the Silent Smoke protocol is triggered. |
| `CONTEXT_PROTOCOL.md` | **Token Firewall:** Context compression and architecture boundaries. | When debugging loops inflate or the token budget is at risk. |
| `DEBUGGING_CONSTITUTION.md` | **Engineering Doctrine:** Blast-radius and architecture rules. | When making cross-system architectural decisions or refactors. |
| `SESSION_BOOTSTRAP.md` | **Session Start Guide:** Initial loading ladder and briefings. | When bootstrapping a brand new AI-assisted workspace loop. |

---

# 3. Situational Loading & Cost Matrix

**Constraint:** You must use this matrix to match the correct governance files to the lowest sufficient **Model Tier** (Light, Core, Reasoning) to preserve compute/tokens. Obey all **Permission Gates**.

| Situation | Files to Load | Model Tier (Ladder) | Permission Gate (Human Auth) |
| :--- | :--- | :--- | :--- |
| **Bootstrapping Session** | `SESSION_BOOTSTRAP` + `/SKILL.md` | Tier 1 (Light) | None |
| **Normal Coding** | `DEBUGGING_SYSTEM` | Tier 1 or Tier 2 | None |
| **Creating/Modifying Tests** | `DEBUGGING_SYSTEM` + `/test-creation/SKILL.md` | Tier 2 (Core) | None |
| **Running/Executing Tests** | `DEBUGGING_SYSTEM` + `/test-running/SKILL.md` | Tier 1 (Light) | **YES:** If running full E2E suite. |
| **Debugging Local Failures** | `SYSTEM` + `/test-running/SKILL` + `PLAYBOOK` | Tier 2 (Core) | None |
| **Context Bloat Detected** | `DEBUGGING_SYSTEM` + `CONTEXT_PROTOCOL` | Tier 1 (Light) | None |
| **Visual UI Debugging** | `DEBUGGING_PLAYBOOK` | Tier 2 (Core) | **YES:** Before launching Browser Tools. |
| **Major Refactor/Architecture** | `DEBUGGING_CONSTITUTION` | Tier 3 (Reasoning) | **YES:** Mandatory prior to execution. |
