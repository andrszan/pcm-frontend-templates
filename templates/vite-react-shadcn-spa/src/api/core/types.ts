import type { AxiosInstance, AxiosResponse, CreateAxiosDefaults } from "axios"

export type EjectInterceptor = () => void

export interface ApiInterceptor {
  register(instance: AxiosInstance): EjectInterceptor
}

export type ResponseAdapter = (response: AxiosResponse<unknown>) => unknown | Promise<unknown>

export type ErrorNormalizer = (error: unknown) => unknown | Promise<unknown>

export type ApiClientOptions = CreateAxiosDefaults & {
  responseAdapter?: ResponseAdapter
  errorNormalizer?: ErrorNormalizer
}
