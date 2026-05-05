---
name: verification-before-completion
author: obra/superpowers
description: Enforce verification commands before claiming work completion, fixes, or test passes—no success assertions without fresh evidence.
---

Summary:
- Requires running the actual verification command (not assumptions or partial checks) and confirming output before making any completion or correctness claims
- Applies to all success-related statements: test passes, builds succeeding, bugs fixed, requirements met, regressions verified, and agent task completion
- Blocks common shortcuts like trusting agent reports, relying on linter passes as build proof, or using confidence/assumptions instead of actual command output
- Includes a five-step gate function: identify the proof command, run it fresh, read full output and exit code, verify the claim matches evidence, then state the result with evidence attached