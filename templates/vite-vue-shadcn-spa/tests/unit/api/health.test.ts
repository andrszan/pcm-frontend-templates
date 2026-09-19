import { describe, expect, it } from 'vitest'

import { healthCheckResponseSchema } from '@/api'

describe('healthCheckResponseSchema', () => {
  it('接受合法健康检查响应', () => {
    expect(healthCheckResponseSchema.parse({ status: 'ok' })).toEqual({ status: 'ok' })
  })

  it('拒绝缺失状态的响应', () => {
    expect(() => healthCheckResponseSchema.parse({})).toThrow()
  })
})
