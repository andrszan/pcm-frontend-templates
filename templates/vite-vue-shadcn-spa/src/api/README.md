# API 调用层设计与扩展规范

本目录提供不绑定后端业务的 Axios 传输层。它只解决稳定、通用的问题，并把认证、响应协议和错误策略留给派生项目决定。

## 已有能力

- `ApiClient` 创建独立 Axios 实例，并提供 `request/get/post/put/patch/delete`。
- 默认返回 `response.data`；请求和响应拦截器可独立注册、独立卸载。
- `ResponseAdapter` 和 `ErrorNormalizer` 用于接入已经确认的项目协议。
- 项目级 `apiClient` 读取 `VITE_API_URL`，默认超时 30 秒。
- `modules/health/` 展示 endpoint、Zod 响应校验和模块出口的组织方式；页面不会自动调用它。

本项目故意不实现 Token、刷新流程、统一 envelope、业务成功码、401/403 跳转、Toast、重试、请求去重、OpenAPI 或通用 CRUD。

## 目录职责

```text
src/api/
├── client.ts
├── core/
└── modules/
    └── health/
```

- `core/` 只放业务无关的 HTTP 基础设施，不依赖 Vue、Router、Pinia、TanStack Query 或 UI。
- `modules/<domain>/` 按真实后端资源组织 URL、schema 和 DTO，不按页面组织。
- 页面和组件调用语义化 API 方法，不直接书写 endpoint URL。
- 外部响应在模块边界按需要使用 Zod 校验；不要把具体协议塞进通用 client。

## 与 TanStack Vue Query 配合

页面或 feature 层负责远程状态：

```ts
useQuery({
  queryKey: ['users', params],
  queryFn: ({ signal }) => usersApi.list(params, { signal }),
})
```

只有多个调用方重复同一查询配置时才提取共享 composable；不要把 Query composable 放进 API 传输层，也不要把 Query cache 复制到 Pinia。

## 项目接入顺序

1. 配置 `VITE_API_URL`；留空表示同源相对请求，不代表已经配置 Vite proxy。
2. 确认真实响应结构后，在模块边界增加 schema 或在项目级 client 注入 adapter。
3. 确认认证生命周期后再使用请求拦截器。
4. 按真实后端域创建 module；DTO 默认与模块共置。
5. 非平凡基础设施行为在 `tests/unit/api/` 留最小回归测试。
