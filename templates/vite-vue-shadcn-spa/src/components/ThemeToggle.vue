<script setup lang="ts">
import type { Component } from 'vue'
import { Monitor, Moon, Sun } from '@lucide/vue'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useThemeStore, type ThemePreference } from '@/stores/theme'

const themeStore = useThemeStore()
const { preference, resolvedTheme } = storeToRefs(themeStore)

const themeIcon = computed<Component>(() => {
  if (preference.value === 'system') return Monitor
  return resolvedTheme.value === 'dark' ? Moon : Sun
})

function selectTheme(value: unknown) {
  if (value === 'light' || value === 'dark' || value === 'system') {
    themeStore.setPreference(value satisfies ThemePreference)
  }
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline" size="icon" type="button" aria-label="选择主题">
        <component :is="themeIcon" aria-hidden="true" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-36">
      <DropdownMenuRadioGroup :model-value="preference" @update:model-value="selectTheme">
        <DropdownMenuRadioItem value="light">
          <Sun aria-hidden="true" />
          浅色
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="dark">
          <Moon aria-hidden="true" />
          深色
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="system">
          <Monitor aria-hidden="true" />
          跟随系统
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
