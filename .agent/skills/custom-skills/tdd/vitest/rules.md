---
name: rules
description: universal rules integration and unit testing
---

Rule #1, Integration Testing Protocol:
Avoiding the infamous AI Echo Chamber and Confirmation Bias
A single agent cannot be both the Code Writer and the Test Writer. Two separate/Independent Agents are required for all integration tests (e.g. tests that cover API boundaries, inputs, expected state changes, etc)
Agent A writes the code to implement a feature.
Agent B writes a complete and rigorous Vitest integration test suite that tries really hard to break that new feature’s code and find edge cases. Agent B fixes, then refactors, then reruns tests for this feature until it passes with green.

Rule #2, The Autonomous Loop:
 - The agent will write the code, run npx vitest, read the stack trace, fix its own bugs, and run the test again. It will keep grinding through this loop autonomously until the terminal shows green.

Rule #3:
 - Agent A and Agent B both using the same context, must not be allowed under any circumstance.