import { fileURLToPath } from 'node:url'

import { mergeConfig, configDefaults, defineConfig } from 'vitest/config'

import viteConfig from './vite.config.ts'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      environmentOptions: { jsdom: { url: 'http://localhost/' } },
      exclude: [...configDefaults.exclude, 'tests/e2e/**'],
      include: ['tests/{unit,integration}/**/*.test.ts'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      setupFiles: ['./tests/setup.ts'],
    },
  }),
)
