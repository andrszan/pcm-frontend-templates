# Vite + Vue + shadcn-vue 单页应用项目

面向不需要服务端渲染或搜索引擎优化的独立 Web 应用，包含 TypeScript、Vue Router、Pinia、TanStack Vue Query、Axios、Zod、vee-validate、Tailwind CSS 4、shadcn-vue、Vitest 和 Playwright。

## 要求

- Node.js `^22.22.2 || ^24.15.0 || >=26.0.0`（以 [package.json](package.json) 为准）
- pnpm `11.17.0`（由 [package.json](package.json) 固定）

启用 Corepack：

```bash
corepack enable
```

## 快速开始

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

打开 <http://localhost:5173>，从 [src/routes/home/HomePage.vue](src/routes/home/HomePage.vue) 开始构建应用。

## 项目入口

- [src/main.ts](src/main.ts)：安装 Pinia、Vue Router 与 TanStack Vue Query。
- [src/App.vue](src/App.vue)：应用壳、TooltipProvider、Toaster 与组件错误边界。
- [src/app/router.ts](src/app/router.ts)：集中维护路由表。
- [src/app/query-client.ts](src/app/query-client.ts)：远程状态缓存默认值。
- [src/api/README.md](src/api/README.md)：Axios API 层职责与扩展方式。
- [src/components/ui/](src/components/ui/)：由 shadcn-vue CLI 管理的 UI primitive 源码。
- [src/components/custom/README.md](src/components/custom/README.md)：跨页面通用组合组件。

页面入口统一放在 `src/routes/<route>/`。页面私有组件仅在确需拆分时与页面共置；确认跨页面复用后，再提升到 `src/components/custom/`。

## 状态和数据边界

- 组件局部状态：`ref`、`reactive`、`computed`。
- URL 可分享状态：Vue Router params/query。
- 跨页面客户端状态：Pinia。
- 服务端数据、缓存和请求生命周期：TanStack Vue Query。
- HTTP 传输：Axios；外部响应按实际契约在 API 模块边界使用 Zod。
- 表单：vee-validate + `@vee-validate/zod` + Zod 3。

API 传输层不依赖 Vue、Router、Pinia、TanStack Vue Query 或 UI；Query composable 调用语义化 API 方法，但不进入 `src/api/`。模板只用 Pinia 保存主题偏好，不包含用户、Token、权限或菜单 Store。

## 主题

项目支持 `light`、`dark`、`system` 三种偏好，保存在 localStorage 的 `theme` key 中：

- [index.html](index.html) 在应用挂载前同步解析偏好并设置 `<html>.dark`，减少首帧主题闪烁。
- [src/stores/theme.ts](src/stores/theme.ts) 使用 Pinia 保存偏好，并通过 VueUse `usePreferredDark` 在 system 模式下实时响应系统变化。
- [src/components/ThemeToggle.vue](src/components/ThemeToggle.vue) 提供可键盘操作的三态菜单。

localStorage 保存的是用户偏好 `system`，而不是当时解析出的 light/dark。

## 应用级 UI 基础设施

[src/App.vue](src/App.vue) 已接入：

- 唯一的 TooltipProvider；
- 唯一的 Sonner Toaster；
- [AppErrorBoundary](src/components/AppErrorBoundary.vue) 组件错误兜底。

AppErrorBoundary 处理 Vue 能通过 `onErrorCaptured` 交付的后代组件错误，并提供中性重试页面。它不替代网络错误、Vue Router 导航错误、TanStack Query error state、边界自身错误或浏览器全局异常处理。

## 通用组合组件

[src/components/custom/](src/components/custom/) 提供：

- `DateRangePicker`：基于 RangeCalendar 的确认式日期范围草稿；
- `DeleteAlertDialog`：异步危险操作的 pending、防重复、失败保留和成功关闭；
- `LabelWithHelp`：关联输入字段、兼容键盘和触屏的帮助 Popover。

这些组件通过 props、emits、`v-model` 和 slots 工作，不隐式依赖表单、Router、Pinia、Query 或 API。详细契约见其 README。

## 环境变量

`VITE_API_URL` 配置浏览器请求的后端基础地址；留空时 Axios 使用同源相对 URL。

所有 `VITE_` 变量都会在构建时写入浏览器 bundle，不能存放 Token、密码、API Key 或其他敏感信息。`.env.local` 只用于本地配置，不能提交。

### 本地联调后端

模板默认不配置 `server.proxy`。如需本机联调，按真实 API 路径在 [vite.config.ts](vite.config.ts) 增加 Vite proxy；生产环境应由网关保持同源，或配置可访问的绝对后端地址并正确处理 CORS。

## shadcn-vue

项目使用 [components.json](components.json) 中的 Vite、Reka UI、Lucide 和 Tailwind CSS 4 配置。当前 registry 的 66 个基础 UI 组件已经全部保存在 [src/components/ui/](src/components/ui/)；开发时先检查并复用本地实现，不需要再次下载。

以下文档名称不是独立 registry 组件：

- Date Picker：由 Calendar/RangeCalendar、Popover 和 Button 组合；模板已经提供通用 DateRangePicker。
- Data Table：由 Table 与项目实际列定义、排序和筛选逻辑组合。
- Typography：使用语义 HTML 与 Tailwind 排版，不存在 `typography` 组件目录。
- Toast：当前通知实现是 Sonner，不存在 `toast` 组件目录。

只有 registry 后续新增本地不存在的组件，或明确需要升级组件源码时，才执行：

```bash
pnpm dlx shadcn-vue@2.8.2 add <component>
```

更新已有组件前必须查看 diff，不要无审查全量覆盖。

## 本地验证

```bash
pnpm format:check
pnpm type-check
pnpm lint
pnpm test:unit
pnpm test:integration
pnpm test:run
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
```

`pnpm test` 为 Vitest watch 模式。测试覆盖 API core、主题 Store、通用组合组件、Router/Query/Toaster/错误边界集成，以及 Chromium 中的首页、404、三态主题、系统主题变化、刷新持久化、键盘和窄屏路径。

## 预览与部署

```bash
pnpm build
pnpm preview
```

`vite preview` 只用于本地检查，不是生产服务器。部署 `dist/` 到静态宿主时，必须把不存在的页面路径回退到 `/index.html`，让 Vue Router 接管；真实缺失的 JavaScript、CSS、图片和 API 路径仍应返回 404。

## 明确不包含

模板不预置认证、权限、动态菜单、国际化、Mock Server、PWA、微前端、WebSocket、业务图表、富文本、通用 DataTable/CRUD、Repository 基类、Provider 仿制层、Error Store 或客户业务。派生项目只按已确认需求增加能力。
