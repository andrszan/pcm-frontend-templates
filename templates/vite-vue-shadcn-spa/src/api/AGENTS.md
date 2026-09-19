# API 目录协作规则

修改本目录前先阅读 `README.md`。

- `core/` 只放业务无关的 Axios 基础设施，不依赖 Vue、Router、Pinia、TanStack Query 或 UI。
- `modules/health/` 是 endpoint、Zod schema 和模块出口的中性示例，不代表后端必然实现 `/health`。
- endpoint URL 只出现在对应模块的 `api.ts`；页面和组件调用语义化 API 方法。
- 外部响应需要运行时保证时，在模块边界使用 Zod；不要把具体协议塞进通用 client。
- 不假设认证、统一响应体、业务成功码或全局错误行为。
- 不预建 BaseApi、repository、factory、`protocol/`、`shared/` 或空目录。
- 新增非平凡基础设施行为时，在 `tests/unit/api/` 留最小回归测试。
