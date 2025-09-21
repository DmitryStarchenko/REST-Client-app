import path from 'path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    coverage: {
      enabled: true,
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/types/**',
        'commitlint.config.js',
        'eslint.config.mj',
        'next.config.ts',
        'vitest.config.ts',
        // Исключает папку 'types' на любом уровне
      ],
      // Другие настройки покрытия, если они есть
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
