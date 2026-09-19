<script setup lang="ts">
import { RouterView } from 'vue-router'

import AppErrorBoundary from '@/components/AppErrorBoundary.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
</script>

<template>
  <TooltipProvider :delay-duration="300">
    <div class="min-h-svh">
      <header class="border-b">
        <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <RouterLink class="font-semibold tracking-tight" to="/">Vue SPA</RouterLink>
          <ThemeToggle />
        </div>
      </header>
      <main class="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20">
        <AppErrorBoundary>
          <RouterView />
        </AppErrorBoundary>
      </main>
    </div>
    <Toaster :theme="themeStore.preference" position="top-right" rich-colors />
  </TooltipProvider>
</template>
