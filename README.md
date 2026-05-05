# Your Global AI Brain (Skills)

This directory is the single source of truth for your AI's domain expertise, coding standards, and project constraints. It is shared across **Antigravity (Gemini)**, **Claude Code**, and **Codex/Copilot**.

## 🏗️ The Taxonomy
- **15+ Specialized Skills**: Covering everything from `state-management` to `testing`.
- **Standardized Headers**: Every file contains a name and description (typical yaml style header).
- **3-Tier Optimization**: Designed to minimize token usage by lazy-loading heavy documentation only when required.

## 🚀 Portability & Syncing
This directory is a **Git Repository**. To carry this to another machine:
1. **GitHub**: Push this local repo to a private GitHub repository.
2. **The `brain` Alias**: Use your `brain` shortcut in the terminal to auto-commit and sync your changes across sessions.
   - Command: `brain` [may receive an optional git commit message after it]
   - Action: Commits all changes with a timestamp and pushes to your remote.

## 🛠️ Integration
- **Antigravity**: Symlinked to `~/.gemini/antigravity/skills`.
- **Claude Code**: Symlink this into any project `.claude/skills` folder.
- **Cursor/Copilot**: Reference these absolute paths in your global `.cursorrules`.

---
*Created by Antigravity - 2026-03-12* - v7.11