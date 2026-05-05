Document: /FILE_INDEX.md
Version: v1.0
Purpose: Master Directory and Pathing Authority for the State Management Skills Package
When to Use: Always read first. This file dictates the directory structure, pathing rules, and contextual loading sequence for all state management tasks.
Last Updated: 2026-03-24
Last Update Summary: Initialized index with Urql/Zustand situational loading matrix.

## 🛑 SYSTEM DIRECTIVE: The "Virtual Root" (Pathing Law)
Treat the directory housing this `FILE_INDEX.md` file as the **absolute root (`/`)** for this skills package. 
- **DO NOT** attempt to guess the parent folder name (e.g., `.ai/`, `ai-skills/`, etc.). 
- **ALL paths** in this package are written relative to this directory.
- Examples: `/resources/vitest.setup.ts`, `/examples/urql-filter-driver.ts`, `/STATE_MANAGEMENT_CONSTITUTION.md`.

---

## 🏛️ Governance File Index

| File Path | Purpose / Doctrine | When to Use |
| :--- | :--- | :--- |
| `/SKILL.md` | The textbook. Defines the strict boundaries between Urql (Server/WebSockets) and Zustand (Client UI). | When architecting a new feature, deciding where data should live, or explaining *why* a pattern is used. |
| `/STATE_MANAGEMENT_CONSTITUTION.md` | The electric fence. Absolute binary laws regarding state resets, cache protection, and WebSocket constraints. | **MANDATORY** validation check before outputting any code or tests. |
| `/STATE_MANAGEMENT_PLAYBOOK.md` | The recipe book. Contains exact implementation patterns (Filter Driver, Draft Handoff, DevTools). | When actively writing code for a new store, feature, or testing flow. |
| `/STATE_MANAGEMENT_CONTEXT_PROTOCOL.md` | The AI interaction guide. Defines the scanning order for the workspace. | When tasked with modifying existing state or tests. |
| `/STATE_MANAGEMENT_SESSION_BOOTSTRAP.md` | The Prime Prompt. Initializes the AI with the project's state tiering logic. | At the beginning of a new AI chat session. |
| `/INTEGRATION_GUIDE.md` | Wiring instructions for `package.json`, Vitest, and Playwright configurations. | When setting up the project environment or debugging test pipeline config. |

---

## 📂 Code Examples & Resources Index

| File Path | Type | Description |
| :--- | :--- | :--- |
| `/resources/testing-cheatsheet.md` | Reference | Quick rules for Vitest mocking and Playwright assertions. |
| `/resources/vitest.setup.ts` | Config | Global hook to trigger automated store resets. |
| `/resources/playwright-clean-state.ts` | Config | Reference snippet for clearing browser storage state. |
| `/examples/store-reset-helper.ts` | Logic | The factory function that registers stores for global teardown. |
| `/examples/store-with-devtools.ts` | Pattern | Demonstrates proper middleware nesting for Redux DevTools. |
| `/examples/store-with-subscribe.ts` | Pattern | Demonstrates conditional, high-performance external subscriptions. |
| `/examples/urql-filter-driver.ts` | Pattern | Demonstrates Zustand acting as a variable driver for an Urql query. |
| `/examples/playwright-auth-bypass.spec.ts`| Pattern | Demonstrates injecting `storageState` to bypass UI login. |

---

## ⚙️ Situational Loading & Cost Matrix
**Constraint:** To preserve context window limits and maintain focus, the AI must use this matrix to load ONLY the files necessary for the current situation. 

| Situation | Files to Load into Context | Attention Focus |
| :--- | :--- | :--- |
| **Architecting new data flow** | `/SKILL.md`, `/STATE_MANAGEMENT_CONSTITUTION.md` | Enforcing the Urql vs. Zustand boundary. |
| **Writing a new UI Component** | `/STATE_MANAGEMENT_PLAYBOOK.md`, `/STATE_MANAGEMENT_CONSTITUTION.md` | Implementing proper selectors; keeping local state in `useState`. |
| **Writing Vitest Unit Tests** | `/resources/testing-cheatsheet.md`, `/STATE_MANAGEMENT_CONSTITUTION.md` | Enforcing the "Reset Rule" to prevent state bleed. |
| **Writing E2E Tests (Playwright)** | `/INTEGRATION_GUIDE.md`, `/examples/playwright-auth-bypass.spec.ts` | Managing `storageState` and avoiding UI assertions on internal store data. |
| **Handling Supabase WebSockets** | `/SKILL.md`, `/STATE_MANAGEMENT_CONSTITUTION.md`, `/STATE_MANAGEMENT_PLAYBOOK.md` | **PERMISSION GATE:** Must prompt user before implementing `subscribeWithSelector`. Must obey the "WebSocket Danger Zone" rule. |