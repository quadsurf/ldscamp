---
🚨 SYSTEM DIRECTIVE: HUMAN-ONLY REFERENCE 🚨
This file is a Static Audit Log meant for the Human Architect ONLY. 
AI AGENTS: DO NOT read, update, or reference this file during code generation or task execution. 
This file is NOT part of the active project context or logic.
---

# Master Manifest: AI-Assisted TDD & Debugging Ecosystem

This document serves as the final Standard Operating Procedure (SOP) and architectural audit for the 9-file governance system established during "Operation Revamp." It defines the "Senior Frugal Architect" posture, ensuring all AI-assisted development is bound by token economy, strict permission gating, and modular agentic handoffs.

## 1. The Core Philosophy (The Five Pillars)

Every file in this ecosystem is engineered to enforce these five non-negotiable constraints on AI coding agents:

1. **The Cost-Priority Ladder:** AI model "brainpower" is treated as a strict financial budget. Agents must default to Tier 1 (Light/Fast) for routine tasks and only escalate to Tier 2 (Core) or Tier 3 (Reasoning) with explicit architectural justification or human permission.
2. **Permission Gating (The Hard Stop):** High-risk operations—such as broad codebase scans, autonomous dependency updates, or full-suite test reruns—are physically blocked until a human provides explicit authorization.
3. **Agentic Handoffs (The Baton):** Files are modularized by domain. Once a task shifts from "Design" to "Execution," the agent is strictly required to stop, drop its current context, and load the specialized governance file for that new domain.
4. **Context Discipline (The Token Firewall):** The system absolutely forbids "context dumping." Agents must use diffs over full files, "failure slices" over raw logs, and localized context rings over broad directory searches.
5. **Validation-First Posture:** Before writing code, the agent must determine the "Lowest-Cost Sufficient Validation." A `console.log` or a single Vitest unit test is always mathematically preferred over generating a heavy Playwright E2E spec.

## 2. Directory & Governance Map

### The Routing Layer
* **`/SKILL.md` (The Switchboard):** The entry point for every session. It establishes the frugal mindset and routes the agent to either the Creation or Running silos.
* **`test-running/FILE_INDEX.md` (The Map):** A situational loading matrix that tells the agent exactly which files to load and which model tier to use for any given development scenario.
* **`test-running/SESSION_BOOTSTRAP.md` (The Initializer):** The "Wake-Up" protocol. It sets the session-start permission gates and establishes the model tier ladder immediately.

### The Specialized Silos
* **`test-creation/SKILL.md` (The Design Room):** Rules for writing new tests. Contains the Tool Selection Tree (Vitest vs. Playwright), co-location boundaries, and configuration integrity checks.
* **`test-running/SKILL.md` (The Execution Room):** The surgical manual for running tests. Contains the CLI commands, targeted execution rules (e.g., using `.only`), and assertion-only debugging policies.

### The Operational Guardrails
* **`test-running/DEBUGGING_SYSTEM.md` (The Runtime):** The daily-driver bundle. Keeps the agent lean during standard coding loops and prevents context inflation.
* **`test-running/DEBUGGING_PLAYBOOK.md` (The Repair Loop):** The emergency procedure for when things break. Enforces the "Silent Smoke" protocol and strict failure classification (Code vs. Test vs. Fixture).
* **`test-running/CONTEXT_PROTOCOL.md` (The Firewall):** Advanced rules for context compression. Used when debugging loops become unstable or token-heavy.
* **`test-running/DEBUGGING_CONSTITUTION.md` (The Doctrine):** The immutable "Why." Defines blast-radius assessment and the architectural principles of minimalist patching.

## 3. Standard Operating Procedures (SOPs)

### SOP 1: Starting a New Workday
1. The agent loads `SESSION_BOOTSTRAP.md` and `/SKILL.md`.
2. The agent acknowledges the Session-Start Permission Gates (no autonomous scanning or browser launches).
3. The agent sets the initial Model Tier (Defaulting to Tier 1).

### SOP 2: Developing a New Feature
1. The agent operates using `DEBUGGING_SYSTEM.md`.
2. If a test is needed, the agent must pass the baton to `test-creation/SKILL.md`.
3. Once the test is written, the agent passes the baton to `test-running/SKILL.md` to execute the validation.

### SOP 3: Fixing a Broken Test
1. The agent captures the "Failure Slice" (Targeted assertion and exact diff).
2. If the targeted fix fails twice, the agent MUST escalate and load `DEBUGGING_PLAYBOOK.md`.
3. If the failure involves Priority Alpha features (Routing or Auth), the agent MUST execute the "Silent Smoke" protocol via Playwright.

## 4. Next Phase: Security Transition

The next stage of the project involves duplicating this meta-architecture for **Security Governance**. 

**Key Shift:** Unlike the TDD ecosystem, which is strictly **Frugal-First**, the Security ecosystem will be **Zero-Trust-First**. Token economy will be intentionally deprioritized in favor of exhaustive attack-surface mapping, deep reasoning for auth flows, and comprehensive data-flow context.