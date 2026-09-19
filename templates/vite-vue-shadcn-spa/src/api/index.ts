export { apiClient } from './client'
export type {
  ApiClientOptions,
  ApiInterceptor,
  EjectInterceptor,
  ErrorNormalizer,
  ResponseAdapter,
} from './core'
export { ApiClient, RequestInterceptor, ResponseInterceptor } from './core'
export {
  healthApi,
  healthCheckResponseSchema,
  type HealthCheckParams,
  type HealthCheckResponse,
} from './modules/health'
