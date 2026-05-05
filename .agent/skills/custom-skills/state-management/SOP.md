---
🚨 SYSTEM DIRECTIVE: HUMAN-ONLY REFERENCE 🚨
This file is a Static Audit Log meant for the Human Architect ONLY. 
AI AGENTS: DO NOT read, update, or reference this file during code generation or task execution. 
This file is NOT part of the active project context or logic.
---

# 🏛️ STATE MANAGEMENT PACKAGE: Master Manifest
**Stack:** React, Zustand, Urql (Graphcache), Supabase WebSockets, Vitest, Playwright
**Pathing Standard:** Virtual Root (relative to `FILE_INDEX.md`)

## 1. The Root (1 File)
- [x] `/FILE_INDEX.md` *(The anchor file; defines the Virtual Root and situational loading matrix for AI agents).*

## 2. Governance & Core Directives (5 Files)
- [x] `/SKILL.md` *(The textbook; explains the Urql/Graphcache vs. Zustand data boundary).*
- [x] `/STATE_MANAGEMENT_CONSTITUTION.md` *(The electric fence; 6 absolute laws including the WebSocket Danger Zone and Memory Leak Cleanup).*
- [x] `/STATE_MANAGEMENT_PLAYBOOK.md` *(The recipes; includes the Filter Driver, Draft Handoff, and conditionally gated subscriptions).*
- [x] `/STATE_MANAGEMENT_SESSION_BOOTSTRAP.md` *(The Prime Prompt; initializes the AI with your exact data-tiering logic).*
- [ ] `/STATE_MANAGEMENT_CONTEXT_PROTOCOL.md` *(Status: Pending Merge. We will combine Version 1's "Immer/Bug" checks with Version 2's "Constraint Check" when you are ready).*

## 3. Integration Guides (1 File)
- [x] `/INTEGRATION_GUIDE.md` *(Instructions for wiring up `vitest.config.ts`, `playwright.config.ts`, and root `package.json` scripts without hardcoding parent folders).*

## 4. Resources Sub-Directory (3 Files)
- [x] `/resources/testing-cheatsheet.md` *(Quick rules for Vitest mocking and Playwright GraphQL/API assertions).*
- [x] `/resources/vitest.setup.ts` *(The global hook that executes the automated store reset).*
- [x] `/resources/playwright-clean-state.ts` *(The reference snippet for isolating browser storage state).*

## 5. Examples Sub-Directory (6 Files)
- [x] `/examples/store-reset-helper.ts` *(The factory logic that registers Zustand stores for teardown).*
- [x] `/examples/store-with-devtools.ts` *(Blueprint for wrapping stores with Redux DevTools).*
- [x] `/examples/store-with-subscribe.ts` *(Blueprint for high-performance subscriptions outside React).*
- [x] `/examples/urql-filter-driver.ts` *(Blueprint for Zustand driving Urql variables).*
- [x] `/examples/urql-websocket-ui-trigger.ts` *(Blueprint for handling Supabase subscriptions strictly for UI layout changes, protecting Graphcache).*
- [x] `/examples/playwright-auth-bypass.spec.ts` *(Blueprint for injecting `storageState` to skip UI logins in E2E tests).*

**Total Files:** 16 (15 completed, 1 pending merge)