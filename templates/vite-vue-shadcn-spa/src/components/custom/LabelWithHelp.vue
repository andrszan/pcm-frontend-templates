<script setup lang="ts">
import { CircleHelp } from '@lucide/vue'

import { Button } from '@/components/ui/button'
import { FieldLabel } from '@/components/ui/field'
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover'

const props = withDefaults(
  defineProps<{
    for?: string
    helpLabel?: string
    side?: 'top' | 'right' | 'bottom' | 'left'
    align?: 'start' | 'center' | 'end'
  }>(),
  {
    helpLabel: '查看帮助',
    side: 'top',
    align: 'center',
  },
)
</script>

<template>
  <div class="flex w-fit items-center gap-1">
    <FieldLabel :for="props.for">
      <slot />
    </FieldLabel>
    <Popover>
      <PopoverTrigger as-child>
        <Button variant="ghost" size="icon-xs" type="button" :aria-label="helpLabel">
          <slot name="icon">
            <CircleHelp aria-hidden="true" />
          </slot>
        </Button>
      </PopoverTrigger>
      <PopoverContent :side="side" :align="align" class="w-fit max-w-xs">
        <PopoverTitle class="sr-only">{{ helpLabel }}</PopoverTitle>
        <PopoverDescription class="text-popover-foreground text-pretty text-xs leading-relaxed">
          <slot name="help" />
        </PopoverDescription>
      </PopoverContent>
    </Popover>
  </div>
</template>
