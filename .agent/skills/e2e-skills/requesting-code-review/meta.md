---
name: requesting-code-review
author: obra/superpowers
decription: Dispatch code review subagents with focused context to catch issues before they compound.
---

Summary:
- Integrates with subagent-driven development workflows, triggering review after each task or before merging to main
- Provides code-reviewer subagent with precise git SHAs, implementation details, and requirements, keeping reviewer focused on work product rather than session history
- Categorizes feedback into Critical (fix immediately), Important (fix before proceeding), and Minor (note for later) severity levels
- Includes template-based dispatch mechanism using Task tool with placeholders for implementation summary, requirements, commit range, and description