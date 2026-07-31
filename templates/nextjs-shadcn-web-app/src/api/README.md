# API 调用层设计与扩展规范

本目录提供一套不绑定后端业务的 Axios API 调用层骨架。它解决稳定、通用的问题，并为项目保留认证、响应协议和错误策略的决策空间。

## 当前设计完成度

### 已完成，可直接使用

- `ApiClient`：创建独立 Axios 实例，提供 `request/get/post/put/patch/delete` 方法。
- 泛型响应标注：API 方法返回 `Promise<TResponse>`，运行时返回 adapter 结果；泛型不会校验真实响应结构。
- 泛型请求体：支持 JSON、`FormData`、`Blob`、字符串等 Axios 可接受的数据。
- 可组合拦截器：请求和响应拦截器可独立注册、独立卸载。
- 可选响应适配器：项目可集中解析统一响应体，默认返回 `response.data`。
- 可选错误标准器：项目可集中转换 Axios pipeline 错误，默认保留原错误对象。
- 项目组装入口：`client.ts` 集中配置基础地址、超时和项目协议策略。
- 默认客户端：读取 `NEXT_PUBLIC_API_URL`，默认超时 30 秒。
- 模块组织规范：endpoint 与该业务域的请求/响应 DTO 共置。
- 基础回归测试：验证数据返回、拦截器卸载和 Axios 原始错误保留。

### 故意不做，由具体项目决定

模板无法替项目猜测以下协议，因此没有默认实现：

- Token、Cookie、Session 或其他认证方式；
- Token 存储位置和刷新流程；
- `{ code, message, data }` 等统一响应体；
- 业务成功码与业务错误类型；
- 401/403 跳转、Toast、埋点和日志上报；
- 重试、幂等、限流、请求去重；
- 文件上传进度、下载命名和流式响应；
- OpenAPI 代码生成或运行时响应校验。

这不是功能缺失，而是模板的扩展边界。项目确认后端契约后，应在现有结构上增加对应策略，而不是修改每个 endpoint。

## 目录职责

```text
src/api/
├── AGENTS.md
├── README.md
├── index.ts
├── client.ts
├── core/
│   ├── client.ts
│   ├── interceptors.ts
│   ├── types.ts
│   └── index.ts
└── modules/          # 真实业务出现后按域创建
```

### `client.ts`

项目级组装入口，负责创建业务模块共同使用的 `apiClient`。真实项目确认统一响应体和错误协议后，只在这里注入 `responseAdapter` 与 `errorNormalizer`，不修改 `core/` 或每个业务模块。

### `core/`

只放所有业务域都可复用的 HTTP 基础设施：

- Axios 客户端；
- 拦截器注册机制；
- 与基础设施直接相关的 TypeScript 类型。

不要放入用户、订单、文件等业务 DTO，也不要硬编码 Token、后端响应结构或页面跳转。

### `modules/<domain>/`

每个后端业务域一个目录。例如：

```text
modules/
├── auth/
├── users/
├── files/
└── orders/
```

业务域按后端资源和接口边界划分，不按页面划分。多个页面使用同一组用户接口时，仍然只有一个 `modules/users/`。

模块内文件：

```text
modules/users/
├── api.ts       # URL 和请求方法
├── types.ts     # 该域的请求参数、请求体、响应 DTO
└── index.ts     # 该域公共导出
```

当一个模块确实增长后，再按资源拆分：

```text
modules/users/
├── api.ts
├── types.ts
├── permissions.api.ts
├── permissions.types.ts
└── index.ts
```

不要在一开始为每个 endpoint 创建一个文件。

### `shared/` 何时创建

模板不预建空的 `shared/`。只有同一个稳定后端契约被两个及以上模块使用时才创建：

```text
src/api/shared/
├── pagination.ts
└── types.ts
```

优先共置，确认复用后再提升。不要因为字段长得相似就合并不同业务语义的类型。

## 类型放置规则

| 类型 | 放置位置 |
|---|---|
| endpoint 查询参数 | 对应模块的 `types.ts` |
| endpoint 请求体 | 对应模块的 `types.ts` |
| 后端响应 DTO | 对应模块的 `types.ts` |
| 多模块共用的稳定 API 契约 | `src/api/shared/`，需要时再创建 |
| Axios 拦截器等基础设施类型 | `src/api/core/types.ts` |
| 表单值、组件 Props、页面状态 | 不属于 API 层，放在使用它的功能或组件附近 |
| 前端组合后的 ViewModel | 不属于 API DTO，放在页面、feature 或转换层附近 |

API DTO 描述后端边界，不等于数据库模型，也不等于 UI 模型。不要为了少写转换代码让同一个类型横跨后端、表单和组件三层。

## 新增业务域

以 `users` 为例。

### 1. 创建模块

```text
src/api/modules/users/
├── api.ts
├── types.ts
└── index.ts
```

### 2. 定义 DTO

```ts
// modules/users/types.ts
export interface ListUsersParams {
  page?: number;
  pageSize?: number;
}

export interface UserSummary {
  id: string;
  name: string;
}

export interface ListUsersResponse {
  items: UserSummary[];
  total: number;
}

export interface CreateUserBody {
  name: string;
}
```

### 3. 定义 endpoint

```ts
// modules/users/api.ts
import type { AxiosRequestConfig } from "axios";

import { apiClient } from "../../client";
import type {
  CreateUserBody,
  ListUsersParams,
  ListUsersResponse,
  UserSummary,
} from "./types";

export const usersApi = {
  list(
    params?: ListUsersParams,
    config?: Omit<AxiosRequestConfig, "params">,
  ): Promise<ListUsersResponse> {
    return apiClient.get<ListUsersResponse>("/users", { ...config, params });
  },

  create(body: CreateUserBody): Promise<UserSummary> {
    return apiClient.post<UserSummary, CreateUserBody>("/users", body);
  },
};
```

### 4. 导出模块

```ts
// modules/users/index.ts
export { usersApi } from "./api";
export type {
  CreateUserBody,
  ListUsersParams,
  ListUsersResponse,
  UserSummary,
} from "./types";
```

再按项目需要决定是否从根 `src/api/index.ts` 导出。应用内部可以统一从 `@/api` 导入；模块很多时，也可以直接从 `@/api/modules/users` 导入，避免根出口过大。

## 与 TanStack Query 配合

API 层不依赖 React。页面或 feature 层负责缓存和状态管理：

```ts
useQuery({
  queryKey: ["users", params],
  queryFn: ({ signal }) => usersApi.list(params, { signal }),
});
```

如果 endpoint 需要传递 `signal`，在其方法参数中接受合适的 `AxiosRequestConfig` 子集。只有多个页面确实重复同一查询配置时，再在 feature 层封装 `useUsersQuery()`；不要把 React Hook 放入 API 传输层。

## 项目接入顺序

基于本模板启动真实项目时，人或 AI Agent 应按顺序完成：

1. **确认后端基础地址**：配置 `NEXT_PUBLIC_API_URL`；服务端私有地址不要使用 `NEXT_PUBLIC_`。该变量为空时 Axios 使用相对 URL，请求会发往当前宿主；这只适用于同源 API 或本地代理，不是可用后端的默认值。
2. **确认返回协议**：接口是直接返回数据，还是统一 envelope。没有 envelope 就保持默认行为。
3. **确认认证来源**：浏览器 Token、HttpOnly Cookie、服务端 Session 或每请求 Header。
4. **配置项目协议策略**：需要统一响应体或错误类型时，在 `client.ts` 注入 `ResponseAdapter` 与 `ErrorNormalizer`；不要把响应解包塞进响应拦截器。
5. **按业务域建模块**：不要在页面中直接调用 `apiClient` 或书写 URL。
6. **按模块定义 DTO**：先共置，出现真实跨域复用后再提升到 `shared/`。
7. **增加回归测试**：基础设施策略测试放在 `tests/unit/api/`；具体 endpoint 是否测试取决于是否有转换逻辑。
8. **再接入 TanStack Query**：缓存键、重试和失效策略属于调用场景，不塞进 Axios 客户端。

## 扩展认证

模板不读取 Web Storage。浏览器项目可以注册请求拦截器：

```ts
import { apiClient, RequestInterceptor } from "@/api";

export const ejectAuthInterceptor = apiClient.use(
  new RequestInterceptor((config) => {
    const token = getAccessToken();

    if (token && !config.headers.has("Authorization")) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    return config;
  }),
);
```

服务端不要把用户 Token、租户标识、请求级 Header、Trace 信息或其他可变状态写入全局 `apiClient`，否则并发请求可能互相污染。应为当前请求创建独立客户端：

```ts
const client = new ApiClient({
  baseURL: process.env.API_URL,
  headers: { Authorization: authorization },
});
```

## 扩展响应和错误

默认 `ResponseAdapter` 返回 `response.data`，默认 `ErrorNormalizer` 原样抛出 Axios pipeline 的错误，因此不使用统一响应体的项目无需额外配置。

项目确认统一响应协议后，再按规模创建 `src/api/protocol/` 或少量策略文件，定义真实的 envelope、项目错误类型和转换函数，并只在 `src/api/client.ts` 组装：

```ts
import { ApiClient } from "./core";
import { projectErrorNormalizer, projectResponseAdapter } from "./protocol";

export const apiClient = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30_000,
  responseAdapter: projectResponseAdapter,
  errorNormalizer: projectErrorNormalizer,
});
```

`projectResponseAdapter` 负责检查后端 envelope、判断业务成功并返回业务数据；业务失败时抛出项目错误。`projectErrorNormalizer` 只负责 Axios pipeline 的 HTTP、网络、超时和取消错误。adapter 抛出的业务错误不会再次经过 normalizer，避免重复包装。消费层因此可能收到这两个入口产生的错误；项目若要求统一错误形状，应让两种策略构造同一个项目错误类，而不是让 normalizer 再包装 adapter 错误。

项目策略至少应明确：

- 哪些值代表业务成功；
- 业务数据字段在哪里；
- 错误消息和错误码从哪里读取；
- 是否保留原始 `AxiosError` 作为 `cause`；
- HTTP 错误与业务错误如何区分；
- 取消请求是否需要静默处理。

不要定义同时兼容 `data`、`result` 和 `payload` 的猜测型 envelope。项目协议应准确对应真实后端；Toast、路由跳转和表单字段错误仍由消费层处理。

## 约束

- 组件、页面和 store 中不写 endpoint URL。
- `core/` 不依赖 `modules/`。
- 模块之间避免直接依赖；真正共享的契约提升到 `shared/`。
- 不建立一个容纳全部业务 DTO 的根 `types.ts`。
- 不为了“以后可能需要”预建 BaseApi、repository、factory 或空目录。
- 不在请求拦截器中无条件访问 `window`、`localStorage` 等浏览器对象。
- 不在响应拦截器中返回与 Axios 静态类型不一致的值；业务数据统一由 `ApiClient.request()` 提取。
