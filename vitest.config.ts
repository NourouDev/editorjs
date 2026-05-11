import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/__tests__/**/*.test.ts'],
    environment: 'node',
    typecheck: { tsconfig: './tsconfig.test.json' },
  },
  resolve: {
    alias: { '~': '/home/ismael/Documents/GitHub/editorjs/src' },
  },
});
