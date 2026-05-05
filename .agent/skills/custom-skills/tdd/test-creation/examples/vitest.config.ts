import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react'; // Or your specific framework plugin

export default defineConfig({
  // reminder that src/ and /e2e paths are relative to this project's root directory
  plugins: [react()],
  test: {
    // 1. Enforcement: Only look for tests in src/ with the .test extension
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['e2e/**/*', 'node_modules/**/*'],
    
    // 2. Environment: Use jsdom for high-speed component/logic testing
    environment: 'jsdom',
    
    // 3. Type Regression: Enable the expectTypeOf features
    typecheck: {
      enabled: true,
      include: ['src/**/*.test-d.ts'], // Optional: separate files for type tests
    },
    
    // 4. Global Setup: Useful for MSW or global mocks
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    
    // 5. Performance: Ensure rapid HMR during TDD
    watch: true,
  },
});