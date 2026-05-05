Document: /test-creation/SKILL.md
Version: v1.3
Purpose: Operational boundaries for test creation, enforcing the "Validation-First" posture and strict Vitest vs. Playwright tool selection.
When to Use: Load when deciding if a test is needed, and when generating, modifying, or architecting tests.
Last Updated: 2026-03-21
Last Update Summary: Matrix sweep v1.3; injected Test Generation Decision Tree (E); added Test Creation Cost Ladder (C) and Permission Gates (B); integrated Agentic Handoff to the runner (D).

## 1. Seniority Posture: Validation-First & Decision Tree
**Constraint:** Do not write useless tests. Before generating a new test, you must ask: "Can this change be verified by a simple log statement or by running an existing test with a temporary modification?". You MUST follow this exact evaluation order to prevent token waste:
1.  **Bypass:** Is the feature trivial, temporary, or easily verified locally? (No test needed).
2.  **Adopt:** Can an existing test be slightly modified to cover this? (Update existing).
3.  **Creation:** If a new test is strictly required, default to Vitest. Escalate to Playwright only if real-browser validation is mandatory.

## 2. Test Creation Cost-Priority Ladder
When writing or modifying tests, match the AI Model Tier to the complexity of the test:
*   **Tier 1 (Light):** Use for scaffolding standard Vitest component tests, basic utility unit tests, or writing snapshot updates.
*   **Tier 2 (Core):** Use for writing Playwright E2E flows, complex MSW network mocks, or cross-component integration tests.
*   **Tier 3 (Reasoning):** Use ONLY when designing net-new testing infrastructure or architecting a deeply complex test harness.

## 3. Creation Permission Gating (The Hard Stop)
**Rule:** Stop and request explicit human authorization before executing any of the following during test creation:
1.  **Mass Generation:** Attempting to write or scaffold more than two test files at once.
2.  **Visual Regression Initialization:** Writing tests that require massive pixel-matching baselines (`toHaveScreenshot()`), as these consume heavy storage and compute.
3.  **New Fixtures:** Generating large, mock-data seed files (e.g., >50 lines of JSON/TS data).

## 4. Tool Selection & Scope
When authorized to write a test, determine the appropriate tool based on the required environment:
*   **Use Vitest (Primary):** For unit tests (including pure business logic and custom hooks), code-level integration, state management, utility functions, and standard component testing. Assume Vitest is the default.
*   **Use Playwright (Secondary):** ONLY for user-level end-to-end (E2E) flows, Smoke Testing, multi-page routing, authentication flows, or tests requiring accurate CSS rendering, complex browser APIs, real viewport sizes, or real network requests.

## 5. Directory Structure & Configuration Integrity
Never mix test files. Place generated tests in their designated locations using the correct extensions:
*   **Vitest:** Co-locate tests next to the source files inside the `src/` directory. (Extension: `*.test.ts(x)`).
*   **Playwright:** Isolate all E2E, Smoke, and network-level tests inside the root-level `e2e/` directory. Do not place Playwright tests in `src/`. (Extension: `*.spec.ts(x)`).
*   **Configuration Integrity (Self-Healing):** If you must modify `vitest.config.ts` or `playwright.config.ts`, you MUST first compare against the blueprints in `test-creation/examples/` to prevent architectural drift.

## 6. Architectural Tie-Breakers
When the line is blurry, strictly enforce these boundaries:
*   **Component Testing:** Use Vitest (alongside React Testing Library) for 95% of component tests. Do NOT use Playwright unless testing WebGL, Canvas, complex CSS animations, or exact layout measurements.
*   **Integration Testing:** Use Vitest for "Code-Level" Integration (e.g., internal modules, MSW mocks). Use Playwright (`request` context) for "Network-Level" Integration against a live/local backend.
*   **Webhooks:** Use Vitest + MSW to test Outbound webhooks (Firing). Use Playwright to test Inbound webhooks (Receiving).
*   **Smoke Tests:** 100% owned by Playwright. Must verify Navigation, Global Auth, and Critical API Responses.
*   **Regression Boundaries:** Type/Unit regression belongs to Vitest. Visual, Cross-Browser, and full-page Accessibility (`@axe-core/playwright`) regression belongs to Playwright.

## 7. Agentic Handoffs (The Baton)
**Constraint:** This file governs *creation*, not *execution*. 
*   Once your test is written and ready to be run, you MUST stop using this file and load `test-running/SKILL.md` to acquire the proper targeted CLI commands and assertion-only debugging rules.

## 8. Output Contract (The Carry-Forward Summary)
To prevent "re-solving from scratch," every creation response must conclude with a compact status block:
- **Task:** [Current goal]
- **Current Patch:** [Summary of logic changes]
- **Constraints:** [Active boundaries]
- **Next Validation:** [Specific test/command to run]