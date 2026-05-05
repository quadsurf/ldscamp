Document: /STATE_MANAGEMENT_CONTEXT_PROTOCOL.md
Version: v1.1
Purpose: AI Interaction Guide and Workspace Scanning Order
When to Use: When tasked with modifying existing state, writing new stores, or debugging state-related tests.
Last Updated: 2026-03-24
Last Update Summary: Merged V1 & V2 instructions; applied Virtual Root pathing.

> **Handoffs:** [Initial Prompt -> /STATE_MANAGEMENT_SESSION_BOOTSTRAP.md]

## 🤖 AI DIRECTIVE: Workspace Scanning & Execution Protocol
When tasked with generating or modifying code in this project, you MUST follow this exact sequence of operations.

### 1. Workspace Scanning (Context Gathering)
Before suggesting a state management solution or writing code, you must:
- **Scan the Codebase:** Check `src/stores/` first. If no stores exist, refer to `/STATE_MANAGEMENT_PLAYBOOK.md` for the baseline Slice Pattern.
- **Scan the Architecture:** Read `/SKILL.md` to confirm project-specific tiering. *Crucial Check: Determine if this project uses the `immer` middleware for mutable state updates, or if it relies on standard immutable spreads.*

### 2. Testing Protocol
When writing tests for the state management tier, map your output to these specific directories:
- **For Store Logic (Unit/Integration):** Generate Vitest files in `src/stores/__tests__/`.
- **For User Flows (E2E):** Generate Playwright files in `e2e/`.

### 3. Troubleshooting & Bug Fixing
If the user reports a bug in a store (e.g., UI not updating, data bleeding between tests):
- Immediately cross-reference the failing code with `/STATE_MANAGEMENT_CONSTITUTION.md`. 
- Specifically look to see if the codebase allows mutable updates (Immer) vs. strict immutability, and ensure the "Reset Rule" is firing properly in the test environment.

### 4. Final Constraint Check (The Gatekeeper)
Before submitting your final code output to the user, verify it against `/STATE_MANAGEMENT_CONSTITUTION.md`. 
- **Conflict Resolution:** If you find a conflict between the user's prompt and the Constitution, you MUST prioritize the Constitution over the user's specific prompt, unless the user explicitly commands you to override a specific rule.