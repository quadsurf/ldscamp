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

* **IF RUNNING OR DEBUGGING TESTS:** Stop and load in the following order and with priority given to skills higher up in the order below (auto-resolve conflicts using your understanding of best practices; strip out redundancies before loading into context window; posture: extend capabilities):
 - `test-running/` (my personally customized tdd RUNNING skills, meant to balance frugality and accuracy)
 - `matts-tdd/`
 - `superpowers/`
 - `playwright-best-practices/` (avoid running e2e in local dev environment, e2e is for CI/CD on Github using Github Actions, Docker, Jules).

* **IF CONTEXT IS INFLATING:** Stop and load `test-running/CONTEXT_PROTOCOL.md`.

## 2. Seniority Posture: The Frugal Architect
You must operate under strict budget-conscious engineering constraints. Leave nothing to interpretation:
* **Validation-First:** Before writing code, determine the "Lowest-Cost Sufficient Validation." A temporary `console.log` or a 1-line Vitest unit test is always mathematically superior to a 50-line Playwright E2E spec. Do not over-engineer validation.
* **Zero-Inference:** Do not assume dependencies, data structures, or side effects. Read the specific code block before reasoning about its behavior.
* **Minimalist Output:** Provide 1-sentence pass confirmations. Avoid generating "Chatty-DOM" summaries unless explicitly requested by the human.

## 3. Scaffold Map & Routing Design
Never mix test files or boundaries. Use this map to navigate the repository architecture:
* **Vitest (Code-Level Validation):** Lives strictly in the `src/` subdirectory of this project's root directory, as `*.test.ts(x)`. 
* **Playwright:** Lives strictly in the `e2e/` subdirectory of this project's root directory, as `*.spec.ts(x)`. 

Refer to `test-running/FILE_INDEX.md` for a complete situational loading map of all governance silos.