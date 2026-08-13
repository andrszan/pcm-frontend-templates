# 项目开发规则

## 阅读与导航

- 修改前阅读直接涉及的源码、调用方、相邻实现、测试和配置；不要仅凭目录名或已安装依赖推断能力已经接入。
- 初始化、环境、脚本和部署以 `README.md` 与 `package.json` 为准；格式和静态检查以 `biome.json` 与 TypeScript 配置为准。
- 进入包含子级 `AGENTS.md` 的目录时先阅读并遵循子级规则；修改 `src/api/` 时还必须阅读该目录的 `README.md`。
- 涉及 shadcn/ui 组件、样式、组合、注册表或 `components.json` 时，先检查现有源码并使用可用的 shadcn skill 和 CLI；不要未经审查批量覆盖生成源码。

## 架构边界

- 除非需求明确，不新增未确认的业务域、业务模型、流程、示例数据、未来目录或预留抽象。
- 项目是 Vite 浏览器 SPA，使用 React Router 7 Data Mode：路由树集中在 `src/app/router.tsx`，页面入口统一为 `src/routes/<route>/page.tsx`。
- 页面私有组件仅在确实需要拆分时就近放在同路由的 `_components/`；确认跨路由复用后再提升到 `src/components/`。
- 应用级 Provider 集中在 `src/app/providers.tsx`；只为已确认的全局行为增加 Provider。
- TanStack Query 负责远程数据缓存；API 传输层不依赖 React，不把 Query Hook 放入 `src/api/`。
- API 的 DTO、endpoint、认证和错误策略只遵循 `src/api/AGENTS.md` 与 `src/api/README.md`。
- 所有 `VITE_` 环境变量都会进入客户端 bundle，不能保存 Token、密码、API Key 或其他敏感信息。
- 本地联调本机后端时：`VITE_API_URL` 留空不够；还需按真实后端路径在 `vite.config.ts` 配置 `server.proxy`（见 `README.md`「环境变量」）。未确认后端路径前不要预置代理。proxy 只覆盖开发服务器，生产同源或绝对 `VITE_API_URL` 另行处理。
- 优先复用现有代码、平台能力和已安装依赖；没有真实复用点时不增加共享层、包装层、新依赖或空目录。

## UI 与可访问性

- 从截图或图片还原 UI 时，在响应式和可访问性约束下严格遵循其视觉方向：布局、层次、间距、组件结构和重要细节；不要用自己的设计替代参考。截图只定义视觉，不自动定义业务行为，交互和数据以需求及现有契约为准。
- 优先使用现有 `src/components/ui/` 组件和语义化主题令牌；页面和组件中不得直接写任意十六进制、RGB、HSL、OKLCH 或其他颜色值。主题令牌缺失，或需求明确要求非主题色时，使用 Tailwind 默认调色板中的命名颜色。
- 选择器默认使用自定义 `Select`（`src/components/ui/select.tsx`），不要默认使用 `NativeSelect`（原生 `<select>` 封装）。`NativeSelect` 的价值在于移动端原生系统提供的选择器交互（滚轮、原生弹层），只在应用真正运行于移动端设备原生环境（混合应用、WebView 或强依赖原生选择器的 PWA）时才成立。纯浏览器 Web 应用，桌面、平板、移动布局均在浏览器渲染，不会进入移动端原生选择器；不要因页面有响应式移动端布局就改用 `NativeSelect`，否则反而损失视觉一致性与自定义内容能力。仅在确有原生环境运行需求时才使用 `NativeSelect`。
- 一次性定制放在调用处或组合组件中；确有跨页面组件需求时才修改共享 UI 源码，并验证受影响行为。
- UI 变更覆盖响应式布局、亮暗主题和基本可访问性：语义结构、可访问名称、键盘操作、可见焦点、对比度和必要的 reduced motion。

## TypeScript 与质量

- TypeScript 严格模式和 `erasableSyntaxOnly` 已启用，使用 `@/` 别名；避免 `enum`、constructor parameter property、`any` 或不安全断言掩盖未确认的数据契约。
- 信任边界需要运行时校验时，按真实协议添加最小校验。
- 行为变化时增加或更新最小相关测试：纯逻辑和 API core 用 unit，Provider/Router 组合用 integration，用户可见流程和 production SPA 行为用 E2E。
- 优先在共享根因处修复问题，不在多个消费方重复打补丁。

## 验证与完成标准

- 使用 `package.json` 中已有的 pnpm 脚本；完整验证序列以 `README.md` 为准。
- 代码变更至少执行类型检查、Biome 检查和直接相关测试。
- 影响构建、路由、Provider 或生产运行行为时执行 build；改变用户可见流程时执行对应 Playwright E2E。
- E2E 使用 Playwright 启动隔离的 Vite 开发服务器，生产构建由独立的 `pnpm build` 覆盖。
- 交付时明确列出已执行、失败及因环境原因未执行的验证；不得把未运行表述为已通过。
