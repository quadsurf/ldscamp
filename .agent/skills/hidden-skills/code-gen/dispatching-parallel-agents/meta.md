---
name: dispatching-parallel-agents
description: Delegate independent tasks to specialized agents working concurrently with isolated context.
---

Summary:
 - Dispatch one agent per problem domain when facing 3+ unrelated failures across different test files or subsystems
 - Each agent receives focused scope, clear goal, and constraints—no inherited session context or history
 - Agents work in parallel on independent investigations, then you review summaries and integrate non-conflicting fixes
 - Best for timing issues, subsystem bugs, and exploratory fixes where root causes are unrelated; avoid when failures are connected or require shared state