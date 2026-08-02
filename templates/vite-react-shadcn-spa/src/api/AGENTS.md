# API 目录协作规则

修改本目录前先阅读 `README.md`，其中定义了当前能力、目录职责和项目接入顺序。

- `core/` 只放业务无关的 Axios 基础设施，不放业务 DTO、Token 存储、响应协议或 UI 行为。
- `modules/health/` 是展示 endpoint、DTO 和模块出口组织方式的中性示例，不代表后端必然实现 `/health`；其余模块只在真实后端域出现后创建。
- endpoint URL 只能出现在对应模块的 `api.ts`；页面和组件调用语义化 API 方法。
- 请求参数、请求体和响应 DTO 默认与模块共置，不堆到根 `types.ts`。
- 仅当同一个稳定后端契约被两个及以上模块使用时，才创建或提升到 `shared/`。
- 不把表单状态、组件 Props、页面 ViewModel 或数据库模型放进 API DTO。
- 不在模板中假设认证、统一响应体、业务成功码或全局错误行为；确认协议后分别使用 interceptor、`ResponseAdapter` 和 `ErrorNormalizer`。
- 未确认协议前，不新增 `protocol/`、统一响应 DTO、业务错误类或空目录。
- 新增非平凡 API 基础设施行为时，在 `tests/unit/api/` 留最小回归测试。
