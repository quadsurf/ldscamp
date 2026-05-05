import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // 1. Enforcement: Only look in the e2e directory
  testDir: './e2e',
  testMatch: '**/*.spec.ts',
  
  // 2. Priority Alpha: 10s timeout for smoke tests (global timeout here is 30s)
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
    // Visual Regression: Default threshold for toHaveScreenshot()
    toHaveScreenshot: { maxDiffPixels: 100 },
  },

  // 3. Execution: Run in headless mode by default
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list', // Minimalist reporting as per Skill Rule #5

  use: {
    // 4. Speed: Use persisted auth state to skip repetitive logins
    storageState: 'e2e/.auth/user.json',
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry', // Only record traces when things break
    headless: true,
  },

  // 5. Cross-Browser Regression: The three pillars
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});