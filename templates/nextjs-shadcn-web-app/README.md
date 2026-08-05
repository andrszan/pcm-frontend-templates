# Next.js + shadcn/ui 前端项目

适合独立项目起步的 Next.js App Router 项目起点，包含 TypeScript、Tailwind CSS、shadcn/ui、TanStack Query、Axios、Vitest 和 Playwright。

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

打开 <http://localhost:3000>，从 [src/app/page.tsx](src/app/page.tsx) 开始构建应用。

`.env.local` 仅用于本地配置，不能提交。`NEXT_PUBLIC_` 开头的变量会被打包到浏览器，不能存放密钥。

## 本地验证

```bash
pnpm type-check
pnpm lint
pnpm test:run
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
```

`test:e2e` 只在本地 Chromium 中验证首页可访问、metadata 正确且主标题可见。

## 部署

默认 Node Server 部署方式：

```bash
pnpm build
pnpm start
```

Docker 或 Next.js Standalone 输出不是当前项目默认配置；确认实际部署需求后再添加。

## 文档

- [当前使用指南](docs/项目使用前置环境准备.md)：环境、依赖、组件更新与本地验证。
- [历史搭建教程](docs/项目架构搭建说明文档.md)：项目形成过程，仅供学习和追溯，不能替代本 README 的初始化步骤。
- [API 层设计](src/api/README.md)：HTTP 基础设施与业务模块扩展边界。
