import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'

import type {
  ApiClientOptions,
  ApiInterceptor,
  EjectInterceptor,
  ErrorNormalizer,
  ResponseAdapter,
} from './types'

const defaultResponseAdapter: ResponseAdapter = (response) => response.data
const defaultErrorNormalizer: ErrorNormalizer = (error) => error

export class ApiClient {
  private readonly instance: AxiosInstance
  private readonly responseAdapter: ResponseAdapter
  private readonly errorNormalizer: ErrorNormalizer

  constructor(options: ApiClientOptions = {}) {
    const {
      responseAdapter = defaultResponseAdapter,
      errorNormalizer = defaultErrorNormalizer,
      ...config
    } = options

    this.instance = axios.create(config)
    this.responseAdapter = responseAdapter
    this.errorNormalizer = errorNormalizer
  }

  use(interceptor: ApiInterceptor): EjectInterceptor {
    return interceptor.register(this.instance)
  }

  async request<TResponse, TBody = unknown>(config: AxiosRequestConfig<TBody>): Promise<TResponse> {
    let response: AxiosResponse<unknown, TBody>

    try {
      response = await this.instance.request<unknown, AxiosResponse<unknown, TBody>, TBody>(config)
    } catch (error) {
      throw await this.errorNormalizer(error)
    }

    return (await this.responseAdapter(response)) as TResponse
  }

  get<TResponse>(url: string, config?: AxiosRequestConfig): Promise<TResponse> {
    return this.request<TResponse>({ ...config, method: 'GET', url })
  }

  post<TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig<TBody>,
  ): Promise<TResponse> {
    return this.request<TResponse, TBody>({
      ...config,
      data: body === undefined ? config?.data : body,
      method: 'POST',
      url,
    })
  }

  put<TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig<TBody>,
  ): Promise<TResponse> {
    return this.request<TResponse, TBody>({
      ...config,
      data: body === undefined ? config?.data : body,
      method: 'PUT',
      url,
    })
  }

  patch<TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig<TBody>,
  ): Promise<TResponse> {
    return this.request<TResponse, TBody>({
      ...config,
      data: body === undefined ? config?.data : body,
      method: 'PATCH',
      url,
    })
  }

  delete<TResponse>(url: string, config?: AxiosRequestConfig): Promise<TResponse> {
    return this.request<TResponse>({ ...config, method: 'DELETE', url })
  }
}
