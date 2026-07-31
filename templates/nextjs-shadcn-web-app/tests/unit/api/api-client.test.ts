import { type AxiosAdapter, AxiosError, AxiosHeaders, type AxiosResponse } from "axios";
import { describe, expect, it, vi } from "vitest";

import { ApiClient, RequestInterceptor, ResponseInterceptor } from "@/api";

function response<T>(config: Parameters<AxiosAdapter>[0], data: T, status = 200): AxiosResponse<T> {
  return {
    config,
    data,
    headers: new AxiosHeaders(),
    status,
    statusText: status === 200 ? "OK" : "Error",
  };
}

describe("ApiClient", () => {
  it("默认返回响应数据而不是 AxiosResponse", async () => {
    const client = new ApiClient({
      adapter: async (config) => response(config, { status: "ok" }),
    });

    await expect(client.get<{ status: string }>("/health")).resolves.toEqual({ status: "ok" });
  });

  it("保留配置请求体，并让显式请求体优先", async () => {
    const client = new ApiClient({
      adapter: async (config) => response(config, config.data),
    });

    await expect(client.post<string, string>("/from-config", undefined, { data: "configured" })).resolves.toBe(
      "configured",
    );
    await expect(client.post<string, string>("/explicit", "explicit", { data: "configured" })).resolves.toBe(
      "explicit",
    );
  });

  it("可以单独卸载请求拦截器", async () => {
    const client = new ApiClient({
      adapter: async (config) => response(config, config.headers.get("X-Test") ?? null),
    });
    const eject = client.use(
      new RequestInterceptor((config) => {
        config.headers.set("X-Test", "enabled");
        return config;
      }),
    );

    await expect(client.get<string | null>("/first")).resolves.toBe("enabled");

    eject();

    await expect(client.get<string | null>("/second")).resolves.toBeNull();
  });

  it("可以单独卸载响应拦截器", async () => {
    const client = new ApiClient({
      adapter: async (config) => response(config, "original"),
    });
    const eject = client.use(
      new ResponseInterceptor((axiosResponse) => {
        axiosResponse.data = "intercepted";
        return axiosResponse;
      }),
    );

    await expect(client.get<string>("/first")).resolves.toBe("intercepted");

    eject();

    await expect(client.get<string>("/second")).resolves.toBe("original");
  });

  it("默认保留同一个 Axios 原始错误", async () => {
    const originalErrors: AxiosError[] = [];
    const client = new ApiClient({
      adapter: async (config) => {
        const originalError = new AxiosError(
          "Request failed",
          "ERR_BAD_RESPONSE",
          config,
          undefined,
          response(config, { message: "Service unavailable" }, 503),
        );
        originalErrors.push(originalError);

        throw originalError;
      },
    });
    let rejectedError: unknown;

    try {
      await client.get("/unavailable");
    } catch (error) {
      rejectedError = error;
    }

    expect(originalErrors).toHaveLength(1);
    expect(rejectedError).toBe(originalErrors[0]);
  });

  it("可以通过响应适配器解包项目响应体", async () => {
    const client = new ApiClient({
      adapter: async (config) => response(config, { code: 0, data: { id: "1" } }),
      responseAdapter: (axiosResponse) => (axiosResponse.data as { data: unknown }).data,
    });

    await expect(client.get<{ id: string }>("/resources/1")).resolves.toEqual({ id: "1" });
  });

  it("只对 Axios pipeline 错误执行一次错误标准化", async () => {
    const originalError = new Error("network failed");
    const normalizedError = new Error("normalized error", { cause: originalError });
    const errorNormalizer = vi.fn(async () => normalizedError);
    const client = new ApiClient({
      adapter: async () => {
        throw originalError;
      },
      errorNormalizer,
    });

    await expect(client.get("/unavailable")).rejects.toBe(normalizedError);
    expect(errorNormalizer).toHaveBeenCalledOnce();
    expect(errorNormalizer).toHaveBeenCalledWith(originalError);
  });

  it("不重复标准化响应适配器抛出的业务错误", async () => {
    const businessError = new Error("business failed");
    const errorNormalizer = vi.fn((error: unknown) => error);
    const client = new ApiClient({
      adapter: async (config) => response(config, { code: 1 }),
      errorNormalizer,
      responseAdapter: () => {
        throw businessError;
      },
    });

    await expect(client.get("/business-failure")).rejects.toBe(businessError);
    expect(errorNormalizer).not.toHaveBeenCalled();
  });
});
