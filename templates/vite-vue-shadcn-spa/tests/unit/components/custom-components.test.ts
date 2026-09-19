import { CalendarDate } from '@internationalized/date'
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'

import DateRangePicker from '@/components/custom/DateRangePicker.vue'
import DeleteAlertDialog from '@/components/custom/DeleteAlertDialog.vue'
import LabelWithHelp from '@/components/custom/LabelWithHelp.vue'

const passthrough = (name: string, tag = 'div') =>
  defineComponent({ name, template: `<${tag}><slot /></${tag}>` })

const RangeCalendarStub = defineComponent({
  name: 'RangeCalendar',
  props: { numberOfMonths: Number },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h(
        'button',
        {
          'data-test': 'range-calendar',
          'data-months': props.numberOfMonths,
          onClick: () =>
            emit('update:modelValue', {
              start: new CalendarDate(2026, 9, 18),
              end: new CalendarDate(2026, 9, 20),
            }),
        },
        '选择范围',
      )
  },
})

const popoverStubs = {
  Popover: passthrough('Popover'),
  PopoverTrigger: passthrough('PopoverTrigger'),
  PopoverContent: passthrough('PopoverContent'),
  PopoverTitle: passthrough('PopoverTitle'),
  PopoverDescription: passthrough('PopoverDescription'),
}

function buttonByText(wrapper: ReturnType<typeof mount>, text: string) {
  const button = wrapper.findAll('button').find((candidate) => candidate.text() === text)
  if (!button) throw new Error(`找不到按钮：${text}`)
  return button
}

describe('DateRangePicker', () => {
  it('仅在完整范围确认后更新模型，并在窄屏显示单月', async () => {
    const wrapper = mount(DateRangePicker, {
      props: {
        ariaDescribedby: 'range-error',
        ariaInvalid: true,
      },
      global: { stubs: { ...popoverStubs, RangeCalendar: RangeCalendarStub } },
    })

    expect(wrapper.get('[data-test="range-calendar"]').attributes('data-months')).toBe('1')
    expect(wrapper.get('button[aria-describedby="range-error"]').attributes('aria-invalid')).toBe(
      'true',
    )

    await wrapper.get('[data-test="range-calendar"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    await buttonByText(wrapper, '确认').trigger('click')
    const range = wrapper.emitted('update:modelValue')?.[0]?.[0] as {
      start: CalendarDate
      end: CalendarDate
    }
    expect(range.start.toString()).toBe('2026-09-18')
    expect(range.end.toString()).toBe('2026-09-20')
  })

  it('清除后确认会提交空值', async () => {
    const wrapper = mount(DateRangePicker, {
      props: {
        modelValue: {
          start: new CalendarDate(2026, 9, 18),
          end: new CalendarDate(2026, 9, 20),
        },
      },
      global: { stubs: { ...popoverStubs, RangeCalendar: RangeCalendarStub } },
    })

    await buttonByText(wrapper, '清除').trigger('click')
    await buttonByText(wrapper, '确认').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([null])
  })

  it('取消编辑不更新外部模型', async () => {
    const wrapper = mount(DateRangePicker, {
      global: { stubs: { ...popoverStubs, RangeCalendar: RangeCalendarStub } },
    })

    await wrapper.get('[data-test="range-calendar"]').trigger('click')
    await buttonByText(wrapper, '取消').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})

describe('DeleteAlertDialog', () => {
  const alertDialogStubs = {
    AlertDialog: passthrough('AlertDialog'),
    AlertDialogTrigger: passthrough('AlertDialogTrigger'),
    AlertDialogContent: passthrough('AlertDialogContent'),
    AlertDialogHeader: passthrough('AlertDialogHeader'),
    AlertDialogTitle: passthrough('AlertDialogTitle'),
    AlertDialogDescription: passthrough('AlertDialogDescription'),
    AlertDialogFooter: passthrough('AlertDialogFooter'),
    AlertDialogCancel: defineComponent({
      name: 'AlertDialogCancel',
      props: { disabled: Boolean },
      template: '<button type="button" :disabled="disabled"><slot /></button>',
    }),
  }

  it('pending 时防重复并在成功后关闭', async () => {
    let resolveAction!: () => void
    const action = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveAction = resolve
        }),
    )
    const wrapper = mount(DeleteAlertDialog, {
      props: { action, open: true },
      slots: { trigger: '<button>打开</button>' },
      global: { stubs: alertDialogStubs },
    })

    const confirm = buttonByText(wrapper, '删除')
    await confirm.trigger('click')
    await confirm.trigger('click')
    expect(action).toHaveBeenCalledOnce()
    expect(buttonByText(wrapper, '删除中…').attributes('disabled')).toBeDefined()

    resolveAction()
    await nextTick()
    await Promise.resolve()

    expect(wrapper.emitted('success')).toHaveLength(1)
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])
  })

  it('失败时保持打开、显示错误并允许重试', async () => {
    const action = vi
      .fn()
      .mockRejectedValueOnce(new Error('private failure'))
      .mockResolvedValueOnce(undefined)
    const wrapper = mount(DeleteAlertDialog, {
      props: { action, open: true },
      slots: { trigger: '<button>打开</button>' },
      global: { stubs: alertDialogStubs },
    })

    await buttonByText(wrapper, '删除').trigger('click')
    await Promise.resolve()
    await nextTick()

    expect(wrapper.get('[role="alert"]').text()).toBe('删除失败，请稍后重试。')
    expect(wrapper.text()).not.toContain('private failure')
    expect(wrapper.emitted('update:open')).toBeUndefined()

    await buttonByText(wrapper, '删除').trigger('click')
    await Promise.resolve()
    await nextTick()
    expect(action).toHaveBeenCalledTimes(2)
    expect(wrapper.emitted('success')).toHaveLength(1)
  })
})

describe('LabelWithHelp', () => {
  it('关联字段并提供可访问的帮助入口和 slots', () => {
    const wrapper = mount(LabelWithHelp, {
      props: { for: 'project-name', helpLabel: '查看项目名称说明' },
      slots: {
        default: '项目名称',
        help: '此名称会展示给项目成员。',
        icon: '<span data-test="custom-icon">?</span>',
      },
      global: { stubs: popoverStubs },
    })

    expect(wrapper.get('label').attributes('for')).toBe('project-name')
    expect(wrapper.get('button').attributes('aria-label')).toBe('查看项目名称说明')
    expect(wrapper.get('[data-test="custom-icon"]').text()).toBe('?')
    expect(wrapper.text()).toContain('此名称会展示给项目成员。')
  })
})
