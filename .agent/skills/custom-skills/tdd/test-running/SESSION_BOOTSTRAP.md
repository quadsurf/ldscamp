Document: /test-running/SESSION_BOOTSTRAP.md
Version: v1.3
Purpose: Lightweight surgical briefing document, session-start permission gate, and Cost-Tier initializer. Establishes the agent's initial posture, governance loading strategy, and operational boundaries.
When to Use: Often. Include at the exact moment a new AI-assisted coding session begins.
Last Updated: 2026-03-21
Last Update Summary: Matrix sweep v1.3; injected Universal Cost-Priority Ladder (C) relocated from Root; fortified Session-Start Permission Gates (B) and Handoff Routing (D); strengthened Senior Frugality posture (E).

## 1. Seniority Posture: The Frugal Bootstrapper
Before writing a single line of code or running a single command, you must establish strict token and compute discipline. Do not assume high-compute models or broad workspace context are required by default. 

## 2. Session-Start Permission Gate (The Hard Boundary)
**Constraint:** Upon initializing a new workspace session, you must acknowledge and abide by these immediate permission gates. You do not have the authority to bypass these without explicit human approval:
*   **No Broad Workspace Scans:** Do not recursively read the `src/` or `e2e/` directories. Only load files explicitly requested by the human or dictated by the Loading Logic below.
*   **No Autonomous Test Execution:** Do not automatically trigger Vitest or Playwright suites upon session start. Wait for a specific command.
*   **No Autonomous Browser Usage:** Integrated visual DOM parsing and browser tools are strictly disabled by default to prevent quota burn.

## 3. Universal Cost-Priority Ladder
**Constraint:** You must match model brainpower to task complexity at the very start of the session. Before executing tasks, evaluate your required Tier:
*   **Tier 1: Light (Fast/Budget)**
    *   **Scope:** File summaries, boilerplate, single-file typo fixes, or routine Vitest runs.
    *   **Goal:** Maximum token economy. This is your default state.
*   **Tier 2: Core (Advanced Intelligence)**
    *   **Scope:** Feature development, cross-file refactoring, and initial debug loops.
    *   **Goal:** High precision without "internal monologue" token drain.
*   **Tier 3: Reasoning (Deep Thought)**
    *   **Scope:** Complex architectural roadblocks or persistent, unclassified test failures.
    *   **Goal:** Last resort solution. **MANDATORY:** Ask for human permission before switching to Tier 3.

## 4. Situational Loading Logic & Routing (Agentic Handoffs)
**Rule:** Do not load all governance files at once. Assess the human's first prompt and strictly load ONLY the required subset of governance files dictated by the situation below.

### Situation A: Normal Feature Coding
**Trigger:** Building standard UI components, basic functions, or minor refactors.
**Load:**
- `test-running/DEBUGGING_SYSTEM.md` (for lean runtime context discipline)

### Situation B: Test Creation, Modification, or Configuration
**Trigger:** Writing net-new tests, modifying existing test logic, or touching `*.config.ts(x)` files.
**Load:**
- `test-running/DEBUGGING_SYSTEM.md`
- `test-creation/SKILL.md` (for tool selection and Validation-First boundaries)
*Important: If modifying configuration files, you MUST also load `test-running/CONTEXT_PROTOCOL.md` to adhere to Self-Healing directory rules.*

### Situation C: Debugging Failures & High-Impact Changes
**Trigger:** A test is failing, a build is broken, or you are touching Priority Alpha features (Routing, Auth, or App Shell).
**Load:**
- `test-running/DEBUGGING_SYSTEM.md`
- `test-running/SKILL.md` (for surgical execution commands)
- `test-running/DEBUGGING_PLAYBOOK.md` (for the mandatory Silent Smoke protocol)

### Situation D: Context Bloat & Token Inflation
**Trigger:** The debugging loop has exceeded 3 turns, the context window is filled with raw logs, or the human specifically warns about token burn.
**Load:**
- `test-running/CONTEXT_PROTOCOL.md` (to execute aggressive context compression)

### Situation E: Major Architecture Decisions
**Trigger:** The human requests a cross-module refactor, a database schema change, or a fundamental shift in the tech stack.
**Consult:**
- `test-running/DEBUGGING_CONSTITUTION.md` (for Senior Frugality posture and blast-radius assessment)