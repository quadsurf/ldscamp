---
name: subagent-driven-development
author: obra/superpowers
decription: Dispatch fresh subagents per task with two-stage review (spec compliance, then code quality) in the current session.
---

Summary:
- Isolates each task to a dedicated subagent with precisely crafted context, preventing context pollution and keeping the controller focused on coordination
- Enforces a two-stage review cycle: spec compliance reviewer confirms the implementation matches requirements, then code quality reviewer checks for issues
- Handles implementer status signals (DONE, DONE_WITH_CONCERNS, NEEDS_CONTEXT, BLOCKED) with appropriate escalation or re-dispatch logic
- Recommends model selection by task complexity: cheap models for mechanical 1–2 file tasks, standard models for multi-file integration, most capable models for architecture and review
- Requires git worktree setup upfront and integrates with test-driven development and finishing-a-development-branch superpowers