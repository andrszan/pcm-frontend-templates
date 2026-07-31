import { ApiClient } from "./core";

export const apiClient = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30_000,
});
