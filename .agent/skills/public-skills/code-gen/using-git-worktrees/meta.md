---
name: using-git-worktrees
description: Isolated git worktrees with smart directory selection and safety verification.
---

Summary:
 - Automatically detects worktree directory location by checking existing directories, CLAUDE.md preferences, or asking the user; supports both project-local (.worktrees) and global (~/.config/superpowers/worktrees) storage
 - Verifies project-local directories are git-ignored before creation to prevent accidentally committing worktree contents
 - Auto-detects and runs project setup (npm install, cargo build, pip install, go mod download) based on detected project files
 - Runs baseline tests to ensure a clean starting state before proceeding with feature work
 - Integrates with brainstorming, subagent-driven-development, and plan execution workflows to provide isolated workspaces