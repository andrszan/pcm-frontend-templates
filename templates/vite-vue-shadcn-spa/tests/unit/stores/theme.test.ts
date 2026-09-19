import { createPinia, disposePinia, setActivePinia, type Pinia } from 'pinia'
import { nextTick } from 'vue'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { useThemeStore } from '@/stores/theme'
import { setSystemDark } from '../../setup'

let pinia: Pinia

beforeEach(() => {
  pinia = createPinia()
  setActivePinia(pinia)
})

afterEach(() => disposePinia(pinia))

describe('theme store', () => {
  it('缺失或非法偏好时使用 system', () => {
    window.localStorage.setItem('theme', 'invalid')
    const store = useThemeStore()

    expect(store.preference).toBe('system')
    expect(store.resolvedTheme).toBe('light')
  })

  it('持久化用户偏好并同步文档主题', async () => {
    const store = useThemeStore()

    store.setPreference('dark')
    await nextTick()

    expect(window.localStorage.getItem('theme')).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.documentElement.style.colorScheme).toBe('dark')
  })

  it('system 跟随系统变化，显式偏好不被覆盖', async () => {
    const store = useThemeStore()
    store.setPreference('system')

    setSystemDark(true)
    await nextTick()
    expect(store.preference).toBe('system')
    expect(store.resolvedTheme).toBe('dark')
    expect(window.localStorage.getItem('theme')).toBe('system')

    store.setPreference('light')
    setSystemDark(false)
    setSystemDark(true)
    await nextTick()
    expect(store.preference).toBe('light')
    expect(store.resolvedTheme).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})
