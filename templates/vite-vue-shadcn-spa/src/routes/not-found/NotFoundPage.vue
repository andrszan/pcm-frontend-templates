<script setup lang="ts">
import { Button } from '@/components/ui/button'
</script>

<template>
  <section class="mx-auto max-w-xl space-y-5 text-center">
    <p class="text-muted-foreground text-sm font-medium">404</p>
    <h1 class="text-3xl font-semibold tracking-tight">页面不存在</h1>
    <p class="text-muted-foreground">请求的页面可能已经移动，或者地址输入有误。</p>
    <Button as-child>
      <RouterLink to="/">返回首页</RouterLink>
    </Button>
  </section>
</template>
