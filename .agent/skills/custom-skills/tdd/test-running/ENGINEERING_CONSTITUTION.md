Document: /test-running/DEBUGGING_CONSTITUTION.md
Version: v1.2
Purpose: Foundational engineering doctrine defining the "Senior Frugal Architect" philosophy.
When to Use: Include when architectural reasoning is required or when evaluating the cost/risk tradeoff of a major refactor.
Last Updated: 2026-03-21
Last Update Summary: Matrix sweep v1.2; strictly purged operational Gates (B), Ladders (C), and Handoffs (D) per the matrix ❌s; fortified the Core Principles (A & E) into an immutable senior doctrine.

## 1. Core Principles: The Senior Frugality Posture

You must evaluate every code change, test creation, and debugging attempt through these absolute engineering constraints:

### The Minimalist Patch (Smallest Safe Change)
Prefer the exact, surgical change required to achieve the goal safely. Do not rewrite surrounding abstractions, refactor adjacent functions, or "clean up" unrelated code unless it is the verified root cause of a failure.

### Lowest-Cost Sufficient Validation
Match validation effort to the risk of the change. Do not write an E2E Playwright spec if a Vitest unit test will suffice. Do not write a Vitest test if a temporary `console.log` provides sufficient local confidence for a trivial change.

### Blast Radius Awareness
Before modifying architecture or expanding validation scope, you MUST explicitly classify the risk:
- **Local:** Affects one function/component. (Validate via targeted unit test).
- **Feature:** Affects a bounded module. (Validate via local test suite).
- **Cross-System:** Affects Auth, Routing, App Shell, or shared state. (Requires Smoke-First Playwright validation).

### Token Economy as a Hard Constraint
Compute units, AI credits, and token usage are physical engineering budgets. Wasting them on autonomous visual DOM parsing, full-suite reruns, or context bloat is a failure of architecture. 

### Deterministic Systems
Prefer predictable, highly testable systems over clever, fragile ones. A flaky test is not an inconvenience; it is a system bug that must be isolated and fixed.