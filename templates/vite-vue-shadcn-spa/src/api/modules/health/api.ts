import type { AxiosRequestConfig } from 'axios'

import { apiClient } from '../../client'
import {
  healthCheckResponseSchema,
  type HealthCheckParams,
  type HealthCheckResponse,
} from './schema'

export const healthApi = {
  async check(
    params?: HealthCheckParams,
    config?: Omit<AxiosRequestConfig, 'params'>,
  ): Promise<HealthCheckResponse> {
    const response = await apiClient.get<unknown>('/health', { ...config, params })
    return healthCheckResponseSchema.parse(response)
  },
}
