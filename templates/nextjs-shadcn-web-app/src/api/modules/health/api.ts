import type { AxiosRequestConfig } from "axios";

import { apiClient } from "../../client";
import type { HealthCheckParams, HealthCheckResponse } from "./types";

export const healthApi = {
  check(params?: HealthCheckParams, config?: Omit<AxiosRequestConfig, "params">): Promise<HealthCheckResponse> {
    return apiClient.get<HealthCheckResponse>("/health", {
      ...config,
      params,
    });
  },
};
