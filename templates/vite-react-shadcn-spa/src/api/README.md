# API 调用层设计与扩展规范

本目录提供不绑定后端业务的 Axios 传输层。它只解决稳定、通用的问题，并把认证、响应协议和错误策略留给真实项目决定。

## 已完成能力

- `ApiClient` 创建独立 Axios 实例，并提供 `request/get/post/put/patch/delete`。
- 默认返回 `response.data`；泛型只表达调用方预期，不校验真实响应。
- 请求和响应拦截器可独立注册、独立卸载。
- `ResponseAdapter` 可集中解析确认过的响应协议。
- `ErrorNormalizer` 可集中转换 Axios pipeline 错误。
- 项目级 `apiClient` 读取 `VITE_API_URL`，默认超时 30 秒。
- `modules/health/` 提供最小 endpoint、DTO 和模块出口组织示例；它假定后端存在 `/health`，模板页面不会自动调用。
- unit tests 覆盖数据提取、请求体优先级、拦截器生命周期和错误边界。

模板故意不实现 Token、Cookie、刷新流程、统一 envelope、业务成功码、401/403 跳转、Toast、重试、请求去重、OpenAPI 或运行时响应校验。

## 当前结构

```text
src/api/
├── AGENTS.md
├── README.md
├── client.ts
├── index.ts
├── core/
│   ├── client.ts
│   ├── interceptors.ts
│   ├── types.ts
│   └── index.ts
└── modules/
    └── health/
        ├── api.ts
        ├── types.ts
        └── index.ts
```

`client.ts` 是项目级组装入口。确认统一响应体或错误协议后，只在这里注入策略，不修改 `core/` 或每个 endpoint。

`core/` 只放所有业务域都可复用的 HTTP 基础设施，不放业务 DTO、Token、页面跳转或后端响应结构。

`modules/health/` 是中性的结构示例，展示 URL、请求参数、响应 DTO 和模块出口如何共置；如果真实后端没有 `/health`，派生项目应删除或替换它。除这个示例外，不预建其他空模块。

出现真实后端业务域后，按同一结构创建：

```text
src/api/modules/users/
├── api.ts
├── types.ts
└── index.ts
```

业务域按后端资源和接口边界划分，不按页面划分。URL 只写在模块 `api.ts`；请求参数、请求体和响应 DTO 默认放在模块 `types.ts`。只有同一个稳定契约被两个及以上模块使用时，才提升到 `src/api/shared/`。

## 与 TanStack Query 配合

API 层不依赖 React。页面或 feature 层负责缓存和状态：

```ts
useQuery({
  queryKey: ["users", params],
  queryFn: ({ signal }) => usersApi.list(params, { signal }),
})
```

只有多个调用方确实重复同一查询配置时，才在 feature 层封装 Query Hook；不要把 Hook 放入 API 传输层。

## 项目接入顺序

1. 配置 `VITE_API_URL`。留空表示浏览器同源相对请求，不代表已经存在可用后端。
2. 确认接口直接返回数据还是统一 envelope；没有 envelope 就保持默认 adapter。
3. 确认认证来源和生命周期，再用请求拦截器接入。
4. 需要统一错误类型时，在 `client.ts` 注入 `ErrorNormalizer`。
5. 按真实后端域创建 module；页面不直接书写 URL。
6. DTO 先就近放置，出现真实跨域复用后再提升。
7. 非平凡基础设施行为在 `tests/unit/api/` 留最小回归测试。
8. 再由调用场景决定 Query key、重试和失效策略。

## 扩展响应和错误

默认 `ResponseAdapter` 返回 `response.data`；默认 `ErrorNormalizer` 保留原始错误对象。

确认项目协议后，可以在 `src/api/client.ts` 注入策略：

```ts
export const apiClient = new ApiClient({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30_000,
  responseAdapter: projectResponseAdapter,
  errorNormalizer: projectErrorNormalizer,
})
```

adapter 负责检查已确认的业务 envelope，业务失败时抛出项目错误；normalizer 只处理 Axios pipeline 的 HTTP、网络、超时和取消错误。adapter 抛出的业务错误不会再次经过 normalizer，避免重复包装。

不要定义同时猜测 `data`、`result`、`payload` 的通用 envelope。Toast、路由跳转和表单字段错误属于消费层。

## 约束

- 页面、组件和 Store 中不写 endpoint URL。
- `core/` 不依赖业务模块。
- 不建立容纳全部 DTO 的根 `types.ts`。
- 不把 API DTO、表单状态、组件 Props、ViewModel 或数据库模型混成一个类型。
- 不为未来预建 BaseApi、repository、factory、`protocol/`、`shared/` 或空目录。
