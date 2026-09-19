<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'

import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'

const error = ref<unknown>(null)
const retryKey = ref(0)

onErrorCaptured((capturedError, _instance, info) => {
  console.error('Vue component error captured', { error: capturedError, info })
  error.value = capturedError
  return false
})

function retry() {
  error.value = null
  retryKey.value += 1
}
</script>

<template>
  <Empty v-if="error" class="min-h-64">
    <EmptyHeader>
      <EmptyTitle>页面暂时无法显示</EmptyTitle>
      <EmptyDescription>应用遇到了意外问题，请重试。</EmptyDescription>
    </EmptyHeader>
    <EmptyContent>
      <Button type="button" @click="retry">重试</Button>
    </EmptyContent>
  </Empty>
  <div v-else :key="retryKey">
    <slot />
  </div>
</template>
