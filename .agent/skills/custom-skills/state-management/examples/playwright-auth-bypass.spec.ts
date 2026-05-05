import { test, expect } from '@playwright/test';

/**
 * Senior AI Engineer Pattern: Auth Bypass
 * 
 * Instead of logging in via the UI for every test, we tell Playwright to 
 * load a pre-saved browser context (which includes cookies and localStorage).
 * 
 * Because Zustand's 'persist' middleware reads from localStorage, 
 * the Zustand store will automatically hydrate with this saved state.
 */

// Override the global clean state just for the tests in this file
test.use({ storageState: '.auth/admin-user.json' });

test.describe('Authenticated Dashboard Flow', () => {
  
  test('loads user profile from persisted Zustand state without logging in', async ({ page }) => {
    // We go straight to the protected route. 
    // Zustand wakes up, sees the token in localStorage, and allows access.
    await page.goto('/dashboard');
    
    // Assert that the UI reflects the authenticated state
    await expect(page.getByRole('heading', { name: 'Welcome back, Admin' })).toBeVisible();
    
    // Check that a specific Zustand slice (e.g., User Preferences) hydrated correctly
    await expect(page.locator('body')).toHaveClass(/theme-dark/);
  });
  
});