import { z } from 'zod'

export const healthCheckResponseSchema = z.object({
  status: z.string(),
})

export type HealthCheckResponse = z.infer<typeof healthCheckResponseSchema>

export interface HealthCheckParams {
  verbose?: boolean
}
