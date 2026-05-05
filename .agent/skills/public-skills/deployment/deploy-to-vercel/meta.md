---
name: deploy-to-vercel
author: vercel-labs/agent-skills
decription: Deploy applications and websites to Vercel with automatic git integration and preview URLs.
---

Summary:
- Supports three deployment paths: git-push (ideal for linked projects), direct CLI deployment, and no-auth fallback for sandboxed environments
- Automatically detects project state (linked via .vercel/project.json or .vercel/repo.json, git remote presence, CLI authentication) and chooses the best deployment method
- Handles team selection for multi-team accounts and uses --scope to deploy to the correct team
- Provides preview URLs for all deployments; linked projects with git remotes enable automatic deployments on future pushes
- Includes fallback scripts for claude.ai and Codex sandboxes that require no authentication, returning both preview and claim URLs