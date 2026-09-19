<script setup lang="ts">
import type { DateRange, DateValue } from 'reka-ui'
import { getLocalTimeZone } from '@internationalized/date'
import { CalendarDays } from '@lucide/vue'
import { useMediaQuery } from '@vueuse/core'
import { computed, ref, shallowRef } from 'vue'

import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover'
import { RangeCalendar } from '@/components/ui/range-calendar'

const props = withDefaults(
  defineProps<{
    id?: string
    disabled?: boolean
    locale?: string
    placeholder?: string
    label?: string
    minValue?: DateValue
    maxValue?: DateValue
    numberOfMonths?: 1 | 2
    ariaInvalid?: boolean | 'true' | 'false'
    ariaDescribedby?: string
  }>(),
  {
    disabled: false,
    locale: 'zh-CN',
    placeholder: '选择日期范围',
    label: '日期范围',
    numberOfMonths: 2,
  },
)

const emit = defineEmits<{
  blur: [event: FocusEvent]
}>()
const model = defineModel<DateRange | null>({ default: null })
const open = ref(false)
const draft = shallowRef<DateRange>(cloneRange(model.value))
const wide = useMediaQuery('(min-width: 640px)')
const displayedMonths = computed(() => (wide.value ? props.numberOfMonths : 1))
const draftEmpty = computed(() => !draft.value.start && !draft.value.end)
const canConfirm = computed(() => draftEmpty.value || Boolean(draft.value.start && draft.value.end))
const displayValue = computed(() => formatRange(model.value))

function cloneRange(value: DateRange | null | undefined): DateRange {
  return { start: value?.start, end: value?.end }
}

function formatDate(value: DateValue): string {
  return new Intl.DateTimeFormat(props.locale, { dateStyle: 'medium' }).format(
    value.toDate(getLocalTimeZone()),
  )
}

function formatRange(value: DateRange | null): string {
  if (!value?.start || !value.end) return ''
  const start = formatDate(value.start)
  const end = formatDate(value.end)
  return value.start.compare(value.end) === 0 ? start : `${start} – ${end}`
}

function handleOpenChange(next: boolean) {
  if (next && !props.disabled) draft.value = cloneRange(model.value)
  if (!next) draft.value = cloneRange(model.value)
  open.value = next && !props.disabled
}

function updateDraft(value: DateRange | null) {
  draft.value = cloneRange(value)
}

function clear() {
  draft.value = { start: undefined, end: undefined }
}

function confirm() {
  if (!canConfirm.value) return
  model.value = draftEmpty.value ? null : cloneRange(draft.value)
  open.value = false
}
</script>

<template>
  <Popover :open="open" @update:open="handleOpenChange">
    <PopoverTrigger as-child>
      <Button
        :id="id"
        variant="outline"
        type="button"
        :disabled="disabled"
        :aria-label="`${label}：${displayValue || placeholder}`"
        :aria-invalid="ariaInvalid"
        :aria-describedby="ariaDescribedby"
        class="max-w-full justify-start font-normal"
        @blur="emit('blur', $event)"
      >
        <CalendarDays aria-hidden="true" />
        <span class="truncate" :class="{ 'text-muted-foreground': !displayValue }">
          {{ displayValue || placeholder }}
        </span>
      </Button>
    </PopoverTrigger>
    <PopoverContent
      align="start"
      class="max-h-(--reka-popover-content-available-height) w-auto max-w-[calc(100vw-1rem)] overflow-auto p-3 motion-reduce:animate-none"
    >
      <PopoverTitle>{{ label }}</PopoverTitle>
      <PopoverDescription>选择开始和结束日期后确认。</PopoverDescription>
      <RangeCalendar
        :model-value="draft"
        :min-value="minValue"
        :max-value="maxValue"
        :locale="locale"
        :number-of-months="displayedMonths"
        initial-focus
        class="p-0"
        @update:model-value="updateDraft"
      />
      <div class="flex flex-wrap items-center justify-end gap-2 border-t pt-3">
        <Button type="button" variant="ghost" size="sm" @click="clear">清除</Button>
        <Button type="button" variant="outline" size="sm" @click="handleOpenChange(false)">
          取消
        </Button>
        <Button type="button" size="sm" :disabled="!canConfirm" @click="confirm"> 确认 </Button>
      </div>
    </PopoverContent>
  </Popover>
</template>
