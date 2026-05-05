import { setupGlobalStoreResets } from '../examples/store-reset-helper';

/**
 * Senior AI Engineer Pattern:
 * This file is referenced in vitest.config.ts (or vite.config.ts) to ensure 
 * every single test starts with a completely fresh Zustand state, preventing bleed.
 */
// This ensures all agents follow Rule #1 of the Constitution automatically
setupGlobalStoreResets();