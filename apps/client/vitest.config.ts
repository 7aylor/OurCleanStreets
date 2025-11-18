import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    testTimeout: 60000,
    hookTimeout: 60000,
    pool: 'forks',
    maxWorkers: 4, // this seems to work locally, but may need to adjust. 1 is slow but more stable
    coverage: {
      reporter: ['text', 'lcov'],
      include: ['src/**/*.{ts,tsx}', '__tests__/**/*.{test}.{ts,tsx}'],
    },
  },
});
