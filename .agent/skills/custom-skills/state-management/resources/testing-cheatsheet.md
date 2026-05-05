Document: /resources/testing-cheatsheet.md
Version: v1.0
Last Updated: 2026-03-23
Last Update Summary: 
Purpose: Testing as it Relates to State Management
When to Use: 

## Vitest (Unit)
- **File Location:** `src/stores/__tests__/[storeName].test.ts`
- **Key Utility:** `useStore.getState()` to check values; `useStore.setState()` to mock conditions.
- **Rule:** Never mock the entire Zustand module; just mock the data *within* the store.

## Playwright (E2E)
- **File Location:** `e2e/[feature].spec.ts`
- **Key Utility:** `page.route()` to intercept APIs that feed Zustand.
- **Key Utility:** `localStorage.setItem` via `addInitScript` to bypass login/setup.
- **Rule:** Assertions must be `expect(page.getBy...)`. No `store.getState()` assertions in E2E.