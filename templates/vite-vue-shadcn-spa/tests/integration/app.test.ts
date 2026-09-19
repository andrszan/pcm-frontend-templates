import { VueQueryPlugin, useQueryClient } from '@tanstack/vue-query'
import { createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import App from '@/App.vue'
import { queryClient } from '@/app/query-client'
import { routes } from '@/app/router'
import AppErrorBoundary from '@/components/AppErrorBoundary.vue'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'

async function mountApp(path: string) {
  const router = createRouter({ history: createMemoryHistory(), routes })
  await router.push(path)
  await router.isReady()

  return mount(App, {
    global: {
      plugins: [createPinia(), router, [VueQueryPlugin, { queryClient }]],
    },
  })
}

describe('应用基础设施', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.classList.remove('dark')
    queryClient.clear()
  })

  it('使用生产路由渲染首页和未知路径', async () => {
    const home = await mountApp('/')
    expect(home.get('h1').text()).toBe('项目已启动')
    expect(home.findAllComponents(TooltipProvider)).toHaveLength(1)
    expect(home.findAllComponents(Toaster)).toHaveLength(1)
    home.unmount()

    const missing = await mountApp('/missing')
    expect(missing.get('h1').text()).toBe('页面不存在')
  })

  it('向组件树提供具有默认缓存策略的 QueryClient', () => {
    const Probe = defineComponent({
      setup() {
        const client = useQueryClient()
        return () => h('span', String(client.getDefaultOptions().queries?.staleTime))
      },
    })

    const wrapper = mount(Probe, {
      global: { plugins: [[VueQueryPlugin, { queryClient }]] },
    })

    expect(wrapper.text()).toBe(String(5 * 60 * 1000))
  })

  it('组件错误显示中性兜底并可重新挂载恢复', async () => {
    let shouldThrow = true
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const ThrowOnce = defineComponent({
      setup() {
        return () => {
          if (shouldThrow) throw new Error('private render failure')
          return h('p', '页面已恢复')
        }
      },
    })
    const wrapper = mount(AppErrorBoundary, {
      slots: { default: () => h(ThrowOnce) },
    })
    await nextTick()

    expect(wrapper.text()).toContain('页面暂时无法显示')
    expect(wrapper.text()).not.toContain('private render failure')

    shouldThrow = false
    await wrapper.get('button').trigger('click')
    await nextTick()

    expect(wrapper.text()).toContain('页面已恢复')
    expect(errorSpy).toHaveBeenCalledOnce()
    errorSpy.mockRestore()
  })
})
