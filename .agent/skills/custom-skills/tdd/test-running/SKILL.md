Document: /test-running/SKILL.md
Version: v4.4
Purpose: Surgical execution rules for running tests, handling failures, and minimizing quota/token burn during debug loops. 
When to Use: Include strictly when executing validation commands, running tests, or diagnosing immediate CI/local test failures.
Last Updated: 2026-03-21
Last Update Summary: Matrix sweep v4.4; pruned creation/tie-breaker logic (relocated to test-creation); injected Test Running Cost Ladder (C) and Runner Permission Gates (B); strengthened targeted execution and Agentic Handoffs (D).

## 1. Seniority Posture: The Frugal Runner
**Constraint:** Your primary directive during execution is Token Economy. You must execute the "Lowest-Cost Sufficient Validation". An agent that runs an entire test suite to verify a one-line function change is failing its architectural mandate.

## 2. Test Execution Cost-Priority Ladder
When running tests or evaluating failures, strictly match the AI Model Tier to the execution risk:
*   **Tier 1 (Light):** Default execution state. Use for running targeted Vitest commands, reading single-assertion failures, and applying single-file syntax fixes.
*   **Tier 2 (Core):** Escalate here to run targeted Playwright E2E suites, analyze multi-file stack traces, or execute the "Silent Smoke" protocol.
*   **Tier 3 (Reasoning):** Escalate here ONLY when a test has failed >3 times despite targeted patching, indicating a deep architectural root cause. 

## 3. Runner Permission Gating (The Hard Stop)
**Rule:** Stop and request explicit human authorization before executing any of the following terminal commands:
1.  **Full Suite Reruns:** Executing `npm run test:unit` or `npm run test:e2e` without a targeted file path or `.only` tag.
2.  **Visual DOM / UI Mode:** Launching Playwright's UI mode, trace viewers, or autonomous visual DOM rendering. 
3.  **Global Environment Changes:** Running package installations or modifying global test setups to "fix" a test failure.

## 4. Execution Command Triage
When instructed to run tests to verify your work, use the correct CLI command based on the test type:
*   **Unit/Code-Level:** `npm run test:unit` (executes Vitest). **EXECUTION:** Target specific files/tests only; avoid full suite reruns.
*   **E2E/Network-Level:** `npm run test:e2e` (executes Playwright). **EXECUTION:** Use `--project=smoke` for high-impact routing/auth changes first.

## 5. Targeted Debugging Policy (Assertion-Only)
**Rule:** One failing assertion does NOT trigger a full-suite rerun. Follow this strict token-saving loop:
- **Step 1:** Run only the single failing test.
- **Step 2:** Load ONLY the specific `it/test` block from the file, not the whole file.
- **Step 3:** Broaden only if the local pass fails to explain the risk.

## 6. Failure Ownership & Isolation
**Rule:** You MUST classify the failure layer before patching. Identify if the failure originates from:
*   **Application Code:** The core logic is flawed.
*   **Test Logic:** The assertion or expectation is stale/incorrect.
*   **Fixtures:** The mock data, seeds, or setup environment is corrupted.
*   **Configuration:** The runner (`vitest.config.ts`) is misconfigured.
**EXECUTION:** Modify ONLY the single responsible layer. Never alter a valid test to accommodate broken application code.

## 7. Blast Radius & Escalation Triage
**Rule:** You MUST define the regression scope before expanding your validation commands.
*   **Level 1 (Function):** Rerun only the specific `it/test` block.
*   **Level 2 (Module):** Rerun only the specific `*.test.ts` file.
*   **Level 3 (System/Feature):** Expand to cross-file suites or trigger Playwright.
**EXECUTION:** Never jump to Level 3 without Level 1 and 2 explicitly failing to explain the regression risk.

## 8. Flakiness Prevention Protocol
**Enforcement:** All AI-generated tests must be 100% deterministic and isolated.
*   **State Management:** Isolate state per test (use `beforeEach` for teardown).
*   **Timing:** Absolutely NO arbitrary `sleep()` or `setTimeout`. You must use Playwright's auto-waiting or Vitest's `waitFor` to handle asynchronous DOM updates.

## 9. Agentic Handoffs (The Baton)
**Constraint:** Do not remain in this file if the task scope expands. Pass the baton:
*   **IF A NEW TEST IS NEEDED:** Stop running and load `test-creation/SKILL.md` to design it properly.
*   **IF DEBUGGING FAILS > 2 TIMES:** Stop execution and load `DEBUGGING_PLAYBOOK.md` for structured repair loops.
*   **IF RUNNER CONFIG FAILS:** If you must modify `*.config.ts(x)`, load `CONTEXT_PROTOCOL.md` to ensure Configuration Integrity against blueprints.

## 10. Output Contract
Every execution response must include the Carry-Forward Summary:
- **Current Failure:** [The specific failing assertion]
- **Attempted Fix:** [Summary of change]
- **Verification Result:** [Pass/Fail]
- **Next Step:** [Hypothesis for next loop]