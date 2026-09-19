<script setup lang="ts">
import { Trash2 } from '@lucide/vue'
import { ref } from 'vue'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

const props = withDefaults(
  defineProps<{
    action: () => Promise<void> | void
    title?: string
    description?: string
    subjectName?: string
    confirmText?: string
    cancelText?: string
    errorText?: string
    disabled?: boolean
  }>(),
  {
    title: '确认删除',
    confirmText: '删除',
    cancelText: '取消',
    errorText: '删除失败，请稍后重试。',
    disabled: false,
  },
)

const emit = defineEmits<{
  success: []
}>()
const open = defineModel<boolean>('open', { default: false })
const pending = ref(false)
const failed = ref(false)

const defaultDescription = () =>
  props.subjectName
    ? `确定要删除“${props.subjectName}”吗？此操作可能无法撤销。`
    : '确定要删除此项吗？此操作可能无法撤销。'

function handleOpenChange(next: boolean) {
  if (pending.value && !next) return
  if (next) failed.value = false
  open.value = next
}

async function confirm() {
  if (props.disabled || pending.value) return

  pending.value = true
  failed.value = false
  try {
    await props.action()
    open.value = false
    emit('success')
  } catch {
    failed.value = true
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <AlertDialog :open="open" @update:open="handleOpenChange">
    <AlertDialogTrigger as-child>
      <slot name="trigger" />
    </AlertDialogTrigger>
    <AlertDialogContent :aria-busy="pending" class="motion-reduce:animate-none">
      <AlertDialogHeader>
        <AlertDialogTitle class="flex items-center gap-2">
          <Trash2 aria-hidden="true" class="text-destructive size-5" />
          <slot name="title">{{ title }}</slot>
        </AlertDialogTitle>
        <AlertDialogDescription>
          <slot name="description">{{ description ?? defaultDescription() }}</slot>
        </AlertDialogDescription>
      </AlertDialogHeader>

      <p v-if="failed" role="alert" class="text-destructive text-sm">
        {{ errorText }}
      </p>

      <AlertDialogFooter>
        <AlertDialogCancel :disabled="pending">{{ cancelText }}</AlertDialogCancel>
        <Button
          type="button"
          variant="destructive"
          :disabled="disabled || pending"
          @click="confirm"
        >
          <Spinner v-if="pending" aria-hidden="true" />
          {{ pending ? '删除中…' : confirmText }}
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
