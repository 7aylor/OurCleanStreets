import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // lets you use `describe`, `it`, etc. without imports
    environment: 'jsdom', // simulate browser
    setupFiles: './src/setupTests.ts', // custom setup
    testTimeout: 60000,
    hookTimeout: 60000,
    coverage: {
      reporter: ['text', 'lcov'], // text in console + lcov for detailed report
      all: true, // include all files, not just tested ones
      include: ['src/**/*.{ts,tsx}'], // only include source files
    },
  },
});
