Document: /AI_INTEGRATION_GUIDE.md
Version: v1.2
Purpose: Wiring Up The Test Environment
When to Use: When configuring tests, CI/CD pipelines, or running test scripts.
Last Updated: 2026-03-24
Last Update Summary: Migrated to virtual root pathing; integrated package.json script definitions.

> **Handoffs:** [Testing Recipes -> /AI_STATE_MANAGEMENT_PLAYBOOK.md] | [Auth Bypass Example -> /examples/playwright-auth-bypass.spec.ts]

## 🤖 AI DIRECTIVE: Path Resolution for Root Configs
The paths provided in the code blocks below use the Virtual Root format (e.g., `/resources/...`). When injecting these paths into the project's root configuration files (like `vitest.config.ts`), you MUST dynamically resolve the path based on the actual folder name where this skills package resides in the user's workspace (e.g., `./.ai/resources/...` or `./ai-skills/resources/...`).

## 1. Vitest Configuration (`vitest.config.ts` or `vite.config.ts`)
To enforce the global state reset, ensure the `setupFiles` array in the project's Vitest configuration points to our custom setup script.

```typescript
export default defineConfig({
  test: {
    // Inject the resolved path to the setup file here:
    setupFiles: ['/resources/vitest.setup.ts'],
    environment: 'jsdom', // or 'happy-dom'
  },
});
```

## 2. Playwright Configuration (`playwright.config.ts`)
Ensure the project's Playwright config is isolating state properly. Verify that `storageState` is not inadvertently persisting across discrete test blocks. 
- For the global "clean slate" baseline, refer to `/resources/playwright-clean-state.ts`.
- When a specific test suite *needs* to bypass login and inherit a pre-populated Zustand/localStorage state, refer to `/examples/playwright-auth-bypass.spec.ts`.

## 3. Package.json Scripts
Do not create a dummy `package.json` inside this skills package. Instead, ensure the project's root `package.json` contains the following standard scripts. Use these exactly as written when executing test suites.

```json
"scripts": {
  "test": "vitest",
  "test:ui": "vitest --ui",
  "test:e2e": "playwright test"
}
```