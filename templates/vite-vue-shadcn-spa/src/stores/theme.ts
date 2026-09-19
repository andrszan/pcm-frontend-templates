import { usePreferredDark } from '@vueuse/core'
import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'

export type ThemePreference = 'light' | 'dark' | 'system'
export type ResolvedTheme = Exclude<ThemePreference, 'system'>

const storageKey = 'theme'
const preferences: readonly ThemePreference[] = ['light', 'dark', 'system']

function isThemePreference(value: unknown): value is ThemePreference {
  return typeof value === 'string' && preferences.includes(value as ThemePreference)
}

function readPreference(): ThemePreference {
  try {
    const value = window.localStorage.getItem(storageKey)
    return isThemePreference(value) ? value : 'system'
  } catch {
    return 'system'
  }
}

function savePreference(preference: ThemePreference) {
  try {
    window.localStorage.setItem(storageKey, preference)
  } catch {
    // Storage can be unavailable in private or restricted browser contexts.
  }
}

function applyTheme(theme: ResolvedTheme) {
  const dark = theme === 'dark'
  document.documentElement.classList.toggle('dark', dark)
  document.documentElement.style.colorScheme = theme
}

export const useThemeStore = defineStore('theme', () => {
  const preferredDark = usePreferredDark()
  const preference = ref<ThemePreference>(readPreference())
  const resolvedTheme = computed<ResolvedTheme>(() => {
    if (preference.value === 'system') return preferredDark.value ? 'dark' : 'light'
    return preference.value
  })
  const isDark = computed(() => resolvedTheme.value === 'dark')

  watch(resolvedTheme, applyTheme, { immediate: true })

  function setPreference(next: ThemePreference) {
    preference.value = next
    savePreference(next)
  }

  return { isDark, preference, resolvedTheme, setPreference }
})
