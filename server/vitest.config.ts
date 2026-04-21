import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['controllers/**/*.ts', 'routes/**/*.ts', 'middleware/**/*.ts'],
    },
    // Mocking global settings if needed
    setupFiles: ['./tests/setup.ts'],
  },
})
