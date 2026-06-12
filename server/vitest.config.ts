import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/tests/**/*.test.ts'],
    exclude: ['src/tests/integration/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/features/**/controllers/*.ts', 'src/features/**/routes/*.ts', 'src/shared/middleware/*.ts'],
    },
    // Mocking global settings if needed
    setupFiles: ['./src/tests/setup.ts'],
  },
})
