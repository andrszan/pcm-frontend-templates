# AGENTS.md

## 阅读与导航

- 修改前阅读任务直接触及的源码、调用方、相邻实现、测试和配置；不要把已安装但未接线的依赖描述成模板能力。
- 初始化、环境、脚本和部署以 `README.md` 与 `package.json` 为准；格式和静态检查以 `biome.json` 与 TypeScript 配置为准。
- 进入包含子级 `AGENTS.md` 的目录时先读取子级规则。修改 `src/api/` 时还必须阅读该目录的 `README.md`。
- 涉及 shadcn/ui 组件、样式、组合、注册表或 `components.json` 时，先检查项目现有组件，并使用可用的 shadcn skill 和 CLI；不要未经审查批量覆盖生成源码。

## 架构边界

- 保持模板业务中立，不加入客户业务页面、领域模型、流程或示例数据。
- 项目是 Vite 浏览器 SPA，使用 React Router 7 Data Mode。路由树集中在 `src/app/router.tsx`；页面入口统一为 `src/routes/<route>/page.tsx`。
- 页面私有组件仅在页面确实需要拆分时创建，并就近放在同路由的 `_components/`；不要预建空目录。确认跨路由复用后，再提升到 `src/components/` 等共享位置。
- 应用级 Provider 集中在 `src/app/providers.tsx`。只为已确认的全局行为增加 Provider，不预建认证、国际化或全局 Store。
- TanStack Query 负责远程数据缓存；API 传输层不依赖 React，不把 Query Hook 放入 `src/api/`。
- API 的 DTO、endpoint、认证和错误策略只遵循 `src/api/AGENTS.md` 与 `src/api/README.md`。
- 所有 `VITE_` 环境变量都会进入客户端 bundle，不能保存秘密。
- 优先复用现有代码、平台能力和已安装依赖；没有真实复用点时不增加共享层、包装层、新依赖或空目录。

## UI 与可访问性

- 优先复用 `src/components/ui/` 中的组件和语义主题令牌，不重复实现基础控件。
- 一次性页面定制放在调用处；确认跨页面复用后再创建共享组件。
- UI 变更应覆盖响应式布局、亮暗主题和基本可访问性，包括语义结构、可访问名称、键盘操作和可见焦点。

## TypeScript 与质量

- TypeScript 严格模式和 `erasableSyntaxOnly` 已启用，使用 `@/` 别名。避免 enum、constructor parameter property 等需要运行时降级的 TypeScript 语法。
- 避免 `any` 或不安全断言掩盖未确认的数据契约；信任边界需要运行时校验时，按真实协议添加最小校验。
- 行为变化时增加或更新最小相关测试：纯逻辑和 API core 用 unit，Provider/Router 组合用 integration，用户可见流程和 production SPA 行为用 E2E。
- 优先在共享根因处修复问题，不在多个消费方重复打补丁。

## 验证与完成标准

- 使用 `package.json` 中已有的 pnpm 脚本；完整序列以 README 为准。
- 代码变更至少执行类型检查、Biome 检查和直接相关测试。
- 影响构建、路由、Provider 或生产运行行为时执行 build；改变用户可见流程时执行对应 Playwright E2E。
- E2E 使用 Playwright 启动隔离的 Vite 开发服务器，验证模板当前用户流程；生产构建由独立的 `pnpm build` 覆盖。
- 交付时明确列出已执行、失败及因环境未执行的验证，不得把未运行表述为已通过。
