import { ApiClient } from './core'

export const apiClient = new ApiClient({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30_000,
})
