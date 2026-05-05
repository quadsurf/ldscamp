---
name: executing-plans
author: obra/superpowers
description: Execute a written implementation plan with critical review and task checkpoints.
---

Summary:
- Requires loading and critically reviewing the plan before execution; raises concerns with the human partner if issues are identified
- Executes tasks sequentially, marking progress and running verifications as specified in the plan
- Stops immediately on blockers (missing dependencies, test failures, unclear instructions) rather than guessing; asks for clarification
- Integrates with git-worktrees for isolated workspaces and finishing-a-development-branch to complete the work after all tasks verify
- Works best on platforms with subagent support; recommends subagent-driven-development skill as the preferred alternative when available