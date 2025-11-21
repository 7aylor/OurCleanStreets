import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    testTimeout: 60000,
    hookTimeout: 60000,
    coverage: {
      provider: 'v8',
      reporter: ['text-summary', 'text', 'html', 'lcov', 'json'],
      include: ['src/**/*.{ts,tsx}'],
    },
  },
});
