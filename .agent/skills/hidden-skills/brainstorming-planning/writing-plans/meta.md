---
name: writing-plans
author: obra/superpowers
decription: Comprehensive implementation plans for multi-step tasks, breaking down specs into bite-sized, testable steps.
---

Summary:
- Decomposes requirements into focused tasks (2–5 minutes each) following TDD: write failing test, verify failure, implement, verify pass, commit
- Maps file structure upfront with clear boundaries and responsibilities, ensuring each file has one purpose and files that change together stay together
- Includes exact file paths, complete code samples, and specific commands with expected outputs for each step
- Requires plan review via subagent before execution; supports two execution modes (subagent-driven per task or inline batch execution)