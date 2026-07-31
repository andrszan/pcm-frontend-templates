# API 目录协作规则

修改本目录前先阅读 `README.md`，其中定义了当前完成度、目录职责和项目接入步骤。

- `core/` 只放与业务无关的 Axios 基础设施，不放业务 DTO、Token 存储或响应协议。
- 新后端业务域放在 `modules/<domain>/`，至少包含 `api.ts`、`types.ts` 和 `index.ts`。
- endpoint URL 只能出现在对应模块的 `api.ts` 中；页面、组件和状态层调用语义化 API 方法。
- 请求参数、请求体和响应 DTO 默认放在对应模块的 `types.ts`，不要堆到根 `types.ts`。
- 仅当同一个稳定的后端契约被两个及以上模块使用时，才创建或提升到 `shared/`。
- 不把表单状态、组件 Props、页面 ViewModel 或数据库模型放进 API DTO。
- 不在模板中假设认证方式、统一响应体、业务成功码或全局错误行为；项目确认后，认证等 Axios pipeline 行为使用拦截器，响应解包与错误转换分别使用 `ResponseAdapter` 和 `ErrorNormalizer`。
- 未确认后端协议前，不新增 `protocol/`、统一响应 DTO、业务错误类或空目录。
- 新增非平凡 API 基础设施行为时，在 `tests/unit/api/` 留下最小回归测试。
