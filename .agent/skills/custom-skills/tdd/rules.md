---
name: rules
description: tdd governance
---

## 1. Agentic Handoffs
**Constraint:** This file is a router, not an execution manual. Do not attempt to write, run, or debug tests using only this Root Switchboard. You MUST "pass the baton" to the specialized governance file for the current task:

* **IF CREATING OR MODIFYING TESTS:** Stop and load in the following order and with priority given to skills higher up in the order below (auto-resolve conflicts using your understanding of best practices; strip out redundancies before loading into context window; posture: extend capabilities):
 - `test-creation/` (my personally customized tdd CREATION/MODIFYING skills, meant to balance frugality and accuracy)
 - `matts-tdd/`
 - `superpowers/`
 - `playwright-best-practices/`

Place emphasis on behavioral testing, as follows:
 - Enforce the Cycle: Strictly adhere to the Red-Green-Refactor cycle. Ensuring a failing test is written before the implementation guarantees the test is actually verifying the logic, preventing useless, retroactive "filler" tests.
 - When generating a new utility function or component, always generate an accompanying `.test.ts` or `.test.tsx` file beforehand.
 - Target State and Data, Not UI Fluff: Focus unit tests (e.g., using Vitest) heavily on core state transformations, such as Zustand stores, data fetching logic, or GraphQL mutations. Avoid testing third-party component libraries or standard UI rendering that is better caught by end-to-end tools like Playwright.
 - Mock Ruthlessly but Strategically: Instruct the AI to mock heavy external dependencies to save tokens and execution time, but ensure the contracts between your frontend and backend remain strictly tested.
 - Test the "Happy Path" and Critical Edge Cases: Mandate tests for the primary intended behavior and the most destructive edge cases. Skip testing every single permutation of a minor utility function unless it handles highly volatile data.
 - Tests must assert on user-visible behavior (e.g., text on screen, aria-roles) rather than implementation details.
 - Always mock external network calls and database queries. Never hit live endpoints in tests.

Strictly Enforce the TDD "Red" Phase Strategy for Forms, for example:
When implementing a new feature (for example, an intake form), the "Red" phase of the TDD cycle should focus on the Zod schema's failure points.
Because React Hook Form relies on the schema for the "Source of Truth," the agent can write a Vitest suite that validates the schema independently of the UI first. This ensures that the business logic is locked in before any Tailwind or shadcn code is even generated. This separation of concerns makes the subsequent "Green" phase (writing the actual React component) much faster for the agent to complete successfully.

* **IF DEBUGGING AND/OR RUNNING TESTS:** Stop and load in the following order and with priority given to skills higher up in the order below (auto-resolve conflicts using your understanding of best practices; strip out redundancies before loading into context window; your posture is to extend capabilities):
 - `test-running/` (my personally customized tdd RUNNING skills, meant to balance frugality and accuracy)
 - `matts-tdd/`
 - `superpowers/`
 - `playwright-best-practices/` (avoid running e2e in local dev environment, e2e is for CI/CD on Github using Github Actions, Docker, Jules).

Use Vitest as the test runner.

* **IF CONTEXT IS INFLATING:** Stop and load `test-running/CONTEXT_PROTOCOL.md`.

## 2. Seniority Posture: The Frugal Yet Accurate Architect
You must operate under strict budget-conscious engineering constraints. Leave nothing to interpretation:
* **Validation-First:** Before writing code, determine the "Lowest-Cost Sufficient Validation" that produces value to the codebase. A temporary `console.log` or a 1-line Vitest unit test is usually always mathematically superior to a 50-line Playwright E2E spec. Do not over-engineer validation.
* **Zero-Inference:** Do not assume dependencies, data structures, or side effects. Read the specific code block before reasoning about its behavior.
* **Minimalist Output:** Provide 1-sentence pass confirmations. Avoid generating "Chatty-DOM" summaries unless explicitly requested by the human.
* While avoiding needless and/or excessive token-burn is extremely important, it is not more important than creating and running tests that lead to producing high-quality UX code that functions extremely well and consistently, SO INTERNALIZE THIS POSTURE!

## 3. Scaffold Map & Routing Design
Never mix test files or boundaries. Use this map to navigate the repository architecture:
* **Vitest (Code-Level Validation):** Lives strictly in the `src/` subdirectory of this project's root directory, as `*.test.ts(x)`. 
* **Playwright:** Lives strictly in the `e2e/` subdirectory of this project's root directory, as `*.spec.ts(x)`. 

Refer to `test-running/FILE_INDEX.md` for a complete situational loading map of all governance instruction.