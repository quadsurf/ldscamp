import { defineConfig } from '@playwright/test';

/**
 * AI REFERENCE ONLY - DO NOT RUN DIRECTLY.
 * 
 * This shows the required configuration for playwright.config.ts 
 * to ensure localStorage and sessionStorage are cleared between tests.
 * Without this, Zustand's persist middleware might bleed state across E2E tests.
 */
export default defineConfig({
  use: {
    // Setting storageState to undefined ensures a clean browser context per test
    contextOptions: {
      storageState: undefined, 
    },
  },
});