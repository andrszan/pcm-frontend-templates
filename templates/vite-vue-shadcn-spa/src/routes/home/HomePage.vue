<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
</script>

<template>
  <Card class="mx-auto max-w-2xl">
    <CardHeader>
      <CardTitle><h1 class="text-2xl">项目已启动</h1></CardTitle>
      <CardDescription>
        Vue 3、Vite、Vue Router 与 shadcn-vue 单页应用基础设施已经就绪。
      </CardDescription>
    </CardHeader>
    <CardContent class="text-muted-foreground">
      从 <code class="font-mono text-foreground">src/routes/home/HomePage.vue</code> 开始构建应用。
    </CardContent>
  </Card>
</template>
