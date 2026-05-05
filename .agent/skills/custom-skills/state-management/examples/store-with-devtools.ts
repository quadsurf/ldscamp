import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { StateCreator } from 'zustand';

interface AuthState {
  user: string | null;
  login: (user: string) => void;
  logout: () => void;
}

/**
 * Senior AI Engineer Pattern:
 * Always place `devtools` as the outermost middleware (closest to create).
 * Pass a distinct `name` so it's easily identifiable in the Redux DevTools tab.
 */
const storeApi: StateCreator<AuthState> = (set) => ({
  user: null,
  
  // Note the third argument to `set` for devtools action naming
  login: (user) => set({ user }, false, 'auth/login'),
  logout: () => set({ user: null }, false, 'auth/logout'),
});

export const useAuthStore = create<AuthState>()(
  devtools(storeApi, { name: 'AuthStore' })
);