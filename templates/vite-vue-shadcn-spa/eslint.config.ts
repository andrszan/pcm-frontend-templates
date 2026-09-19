import pluginVitest from '@vitest/eslint-plugin'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import skipFormatting from 'eslint-config-prettier/flat'
import { globalIgnores } from 'eslint/config'
import pluginPlaywright from 'eslint-plugin-playwright'
import pluginVue from 'eslint-plugin-vue'

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,ts,mts}'],
  },
  globalIgnores([
    '**/dist/**',
    '**/coverage/**',
    '**/node_modules/**',
    '**/playwright-report/**',
    '**/test-results/**',
    'src/components/ui/**',
  ]),
  ...pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  {
    ...pluginPlaywright.configs['flat/recommended'],
    files: ['tests/e2e/**/*.{test,spec}.ts'],
  },
  {
    ...pluginVitest.configs.recommended,
    files: ['tests/{unit,integration}/**/*.{test,spec}.ts'],
  },
  skipFormatting,
)
