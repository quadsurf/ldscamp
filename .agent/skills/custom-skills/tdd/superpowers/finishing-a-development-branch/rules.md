---
name: finishing-a-development-branch
description: Structured workflow for completing development branches with test verification and merge/PR options.
---

Summary:
 - Verifies all tests pass before presenting integration options, preventing broken code from being merged or submitted
 - Presents exactly four choices: merge locally, create a pull request, keep the branch as-is, or discard with confirmation
 - Executes the chosen workflow, including base branch detection, git operations, and worktree cleanup
 - Should attempt to work in harmony with Antigravity IDE