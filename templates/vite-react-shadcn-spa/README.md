# Vite + React + shadcn/ui 单页应用模板

面向不需要服务端渲染或搜索引擎优化的 Web 应用起步，包含 TypeScript、React Router、Tailwind CSS、shadcn/ui、TanStack Query、Axios、Vitest 和 Playwright。

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

打开 <http://localhost:5173>，从 [src/routes/home/page.tsx](src/routes/home/page.tsx) 开始构建应用。

## 项目入口

- [src/app/router.tsx](src/app/router.tsx)：React Router Data Mode 路由树。
- [src/app/providers.tsx](src/app/providers.tsx)：TanStack Query 与主题 Provider。
- [src/api/README.md](src/api/README.md)：Axios API 层职责与扩展方式。
- [src/components/ui/](src/components/ui/)：由 shadcn CLI 管理的 UI 组件源码。

每个页面入口统一放在 `src/routes/<route>/page.tsx`。页面私有组件仅在需要拆分时创建，放在同路由的 `_components/`；不要预建空目录。确认跨路由复用后，再提升到共享组件。

## 环境变量

`VITE_API_URL` 配置浏览器请求的后端基础地址；留空时 Axios 使用同源相对 URL。

所有 `VITE_` 变量都会在构建时写入浏览器 bundle，不能存放 Token、密码或其他敏感信息。`.env.local` 只用于本地配置，不能提交。

## 本地验证

```bash
pnpm type-check
pnpm lint
pnpm test:run
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
```

`pnpm test` 为 Vitest watch 模式，`pnpm test:ui` 打开 Vitest UI，`pnpm test:coverage` 生成覆盖率。`pnpm test:e2e` 会启动隔离的 Vite 开发服务器，并在 Chromium 中验证首页和主题持久化；production 构建由 `pnpm build` 单独验证。

## 预览与部署

本地预览生产构建：

```bash
pnpm build
pnpm preview
```

`vite preview` 仅用于本地检查，不是生产服务器。部署 `dist/` 到静态宿主时，必须把不存在的页面路径回退到 `/index.html`，让 React Router 接管；真实缺失的 JavaScript、CSS、图片等静态资源仍应返回 404，不能统一改写为 HTML。

例如 Nginx 可将页面请求配置为 `try_files $uri $uri/ /index.html`，实际规则仍应按部署平台的静态资源策略调整。

## shadcn/ui

项目使用 [components.json](components.json) 中已有的 Vite、Base UI 和 Tailwind CSS 4 配置。新增或更新组件时使用 pnpm：

```bash
pnpm dlx shadcn@latest add <component>
```

更新已有组件前先查看 diff，不要无审查执行全量覆盖。

## 文档

- [当前使用指南](docs/项目使用前置环境准备.md)：环境、安装、组件更新与验证。
- [API 层设计](src/api/README.md)：HTTP 基础设施与业务模块扩展边界。
