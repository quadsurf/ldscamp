Document: /test-running/DEBUGGING_SYSTEM.md
Version: v1.3
Purpose: Lean runtime synthesis and default operational rules for daily AI-assisted development sessions.
When to Use: Default. Run always in conjunction with test execution and standard coding tasks.
Last Updated: 2026-03-21
Last Update Summary: Matrix sweep v1.3; injected Runtime Permission Gates (B); consolidated routing into strict Agentic Handoffs (D); pruned redundant creation logic; strengthened Senior Frugality posture (E).

## 1. Seniority Posture: The Frugal Runtime
During routine development, you must operate with strict token discipline. Do not over-engineer solutions, do not expand context without evidence, and do not execute massive test suites for localized component changes. Token efficiency is a core engineering constraint.

## 2. Runtime Model Tiering (Cost-Priority Ladder)
**Constraint:** You must operate at the lowest possible intelligence tier to conserve quota and tokens during routine development. Always evaluate the task complexity before executing.

*   **Tier 1 (Light/Fast):** Your default operating state. Use for running existing tests, syntax formatting, writing boilerplate, and summarizing local errors.
*   **Tier 2 (Core):** Escalate here only when Tier 1 fails to grasp the business logic, when writing net-new complex feature code, or for the first pass of a debug loop.
*   **Tier 3 (Reasoning):** **STOP.** Do not use Reasoning/Thinking models for standard daily debugging. Escalate to this tier *only* for cross-system architectural failures, and only with explicit human permission.

## 3. Runtime Permission Gating (The Hard Stop)
**Constraint:** As the daily runtime agent, you must not execute high-risk operations autonomously. Stop and ask for explicit human permission before:
1.  **Dependency Mutating:** Running `npm install`, `npm update`, or altering `package.json`.
2.  **Bulk Deletion:** Removing files or ripping out large blocks of existing architecture.
3.  **Suite Execution:** Running the full Vitest or Playwright suite without targeting a specific file or block.

## 4. Compact Context Discipline
This runtime bundle enforces strict context discipline to reduce token waste and prevent debugging-loop inflation. 
*   **Load Minimal First:** Start with task request, code diff, relevant function, and short error summary.
*   **Prefer Diffs:** Avoid full file replay or entire logs when failure slices are sufficient.
*   **Expand Incrementally:** Local function -> local test -> direct dependency -> feature boundary. Never expand multiple layers simultaneously without evidence.
*   **Compress Loops:** Carry forward only the task summary, current diff, failing test, and current hypothesis.

## 5. Agentic Handoffs (The Baton)
**Constraint:** This file provides *lean runtime guidance*. When tasks escalate in complexity, you MUST pass the baton to the specialized governance files:

*   **IF CREATING TESTS:** Use coding best practices to determine if a test is even needed. If it is, **STOP** and load `test-creation/SKILL.md` to establish tool selection and boundaries before writing the new test.
*   **IF DEBUGGING FAILS:** When tests fail, execute a tight loop (identify -> inspect -> patch -> rerun). If the loop exceeds 2 attempts, **STOP** and load `DEBUGGING_PLAYBOOK.md`.
*   **IF PRIORITY ALPHA:** If a change affects Routing, Authentication, or the App Shell, you MUST immediately load `DEBUGGING_PLAYBOOK.md` and execute the Silent Smoke Protocol.
*   **IF CONTEXT INFLATES:** If you are pasting entire files repeatedly or reloading the same logs across iterations, **STOP** and load `CONTEXT_PROTOCOL.md`.