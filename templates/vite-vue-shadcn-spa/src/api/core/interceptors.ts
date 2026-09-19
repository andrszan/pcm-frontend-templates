import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

import type { ApiInterceptor, EjectInterceptor } from './types'

type InterceptorRejected = (error: unknown) => unknown
type RequestFulfilled = (
  config: InternalAxiosRequestConfig,
) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>
type ResponseFulfilled = (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>

export class RequestInterceptor implements ApiInterceptor {
  private readonly onFulfilled?: RequestFulfilled
  private readonly onRejected?: InterceptorRejected

  constructor(onFulfilled?: RequestFulfilled, onRejected?: InterceptorRejected) {
    this.onFulfilled = onFulfilled
    this.onRejected = onRejected
  }

  register(instance: AxiosInstance): EjectInterceptor {
    const id = instance.interceptors.request.use(this.onFulfilled, this.onRejected)
    return () => instance.interceptors.request.eject(id)
  }
}

export class ResponseInterceptor implements ApiInterceptor {
  private readonly onFulfilled?: ResponseFulfilled
  private readonly onRejected?: InterceptorRejected

  constructor(onFulfilled?: ResponseFulfilled, onRejected?: InterceptorRejected) {
    this.onFulfilled = onFulfilled
    this.onRejected = onRejected
  }

  register(instance: AxiosInstance): EjectInterceptor {
    const id = instance.interceptors.response.use(this.onFulfilled, this.onRejected)
    return () => instance.interceptors.response.eject(id)
  }
}
