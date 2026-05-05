Document: /test-running/DEBUGGING_PLAYBOOK.md
Version: v1.2
Purpose: Structured, step-by-step debugging procedure for repair loops. Enforces minimal context, minimal patching, and the "Silent Smoke" protocol.
When to Use: Include strictly when tests fail repeatedly, builds break, or debugging sessions become unstable and token-heavy.
Last Updated: 2026-03-21
Last Update Summary: Matrix sweep v1.2; injected Debugging Cost Ladder (C) and Repair Permission Gates (B); integrated the Silent Smoke protocol and Agentic Handoffs (D); strengthened the Senior Frugality repair posture (E).

## 1. Seniority Posture: The Frugal Diagnostician
The first duty in debugging is to classify the failure, not to immediately rewrite code. A debugging loop that burns unnecessary tokens is not elegant engineering; it is just expensive confusion. You must fix the smallest relevant region that can plausibly resolve the failure, and rerun the smallest validation surface that can confirm the fix.

## 2. Repair Permission Gating (The Hard Stop)
**Constraint:** During a debugging loop, the urge to widen the scope is high. You MUST stop and request explicit human authorization before executing any of the following:
1.  **Autonomous Dependency Updates:** Attempting to run `npm install`, `npm update`, or alter `package.json` to fix a failing test.
2.  **Broad Code Deletion:** Deleting entire functions, components, or test suites because you cannot figure out why they are failing.
3.  **Cross-Module Rewrites:** Refactoring code outside the immediate failing module to "make the test pass."

## 3. Debugging Cost-Priority Ladder
When a failure occurs, strictly match your AI Model Tier to the stage of the debugging loop:
*   **Tier 1 (Light):** Use for the first pass. Read the single failing assertion, check for obvious syntax/typos, and rerun the single targeted test. 
*   **Tier 4 (Core):** Escalate here if the Tier 1 patch fails. Use Core intelligence to analyze the stack trace, check local dependencies, and classify the failure layer (Code vs. Test vs. Fixture).
*   **Tier 3 (Reasoning):** Escalate here ONLY if the test fails 3+ times under Core analysis, indicating a fundamental contract mismatch or environment failure.

## 4. The Mandatory Debug Loop
For any non-trivial failure, follow this exact order. Do not skip from failure capture directly to broad code regeneration:

### Step 1: Capture the Failure Minimally
Collect only the smallest useful failure package:
- Failing test name and exact assertion.
- Top stack frame (avoid full raw logs unless mathematically necessary).
- Exact diff preceding the failure.

### Step 2: Classify the Owning Layer
Before patching, assign one primary failure class:
*   **Application Code:** The core logic is wrong.
*   **Stale Test:** The test expectation is now outdated.
*   **Fixture/Setup:** The mock data or environment is wrong.
*   **Flaky/Timing:** Instability caused by brittle selectors or lack of auto-waiting.

### Step 3: Patch & Revalidate Small
Propose the smallest safe patch to the *owning layer only*. After the patch, rerun in this escalation order:
1.  **Level 1:** Single failing test (`.only`).
2.  **Level 2:** Local test file.
3.  **Level 3:** Affected Feature Scope (Escalate only with evidence).

## 5. The "Silent Smoke" Protocol (Priority Alpha)
If the bug affects Routing, Auth, or the App Shell, you must execute this Playwright protocol:
1.  **Silent First:** Always run in `--headless` mode.
2.  **Minimalist Mode:** Use `--reporter=line` and targeting.
3.  **No-Chatty-DOM:** Do not request DOM summaries on success. Provide a 1-sentence pass confirmation.
4.  **Debug (On Fail):** Request YAML DOM summary and load failure snapshots ONLY on error.

## 6. Agentic Handoffs (The Baton)
**Constraint:** If the debugging loop breaks out of local scope, pass the baton:
*   **IF CONTEXT INFLATES:** If you need to read more than 3 files to understand the bug, stop and load `test-running/CONTEXT_PROTOCOL.md` to prevent token burn.
*   **IF ARCHITECTURE IS FLAWED:** If the bug requires changing the database schema or auth flow, stop and load `test-running/DEBUGGING_CONSTITUTION.md` to assess the blast radius.

## 7. Output Contract (The Carry-Forward Summary)
Every debug turn must conclude with this exact block to prevent "re-solving" the problem from scratch:
1.  **Current Hypothesis:** [Why it's failing]
2.  **Current Patch:** [Smallest safe change applied]
3.  **Failing Assertion:** [The specific blocker]
4.  **Targeted Command:** [The single test to run next]

## 8. Common Debugging Anti-Patterns
Avoid at all costs:
- Rewriting large code regions on the first failure.
- Changing both code and tests simultaneously without classification.
- Masking flaky tests with arbitrary `sleep()` commands.
- Patching application code just to satisfy broken fixtures.