import { beforeEach } from 'vitest';
import type { Mutate, StoreApi } from 'zustand';

/**
 * Senior AI Engineer Pattern:
 * Automatically captures all created stores and resets them before every test.
 */
const storeResetHandlers = new Set<() => void>();

export const createResetableStore = <T>(
  storeFactory: (set: any, get: any, api: any) => T
) => {
  const store = create<T>(storeFactory);
  const initialState = store.getState();
  storeResetHandlers.add(() => store.setState(initialState, true));
  return store;
};

// Global hook for vitest.setup.ts
export const setupGlobalStoreResets = () => {
  beforeEach(() => {
    storeResetHandlers.forEach((reset) => reset());
  });
};