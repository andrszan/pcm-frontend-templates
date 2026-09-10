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

## 通用页面

[src/app/not-found.tsx](src/app/not-found.tsx)、[src/app/error.tsx](src/app/error.tsx) 与 [src/app/global-error.tsx](src/app/global-error.tsx) 只提供 404 和错误边界的机制接线，视觉尚未设计。派生项目必须结合自身品牌与交互自行设计后才算完成，不得直接上线占位页；加载页面应在出现真实异步路由或数据加载场景时按需设计。

## 环境变量

`NEXT_PUBLIC_API_URL` 配置浏览器请求的后端基础地址；留空时 Axios 使用同源相对 URL。

所有 `NEXT_PUBLIC_` 变量都会在构建时写入浏览器 bundle，不能存放 Token、密码、API Key 或其他敏感信息。`.env.local` 只用于本地配置，不能提交。服务端私有地址不要使用 `NEXT_PUBLIC_` 前缀。

### 本地联调后端（rewrites）

项目默认**不**配置 `rewrites`。`NEXT_PUBLIC_API_URL` 留空只表示浏览器打到当前站点；若本机另有后端，还需在 [next.config.ts](next.config.ts) 按真实路径配置重写，否则请求仍由 Next.js 处理，不会转到后端。

推荐：保持 `NEXT_PUBLIC_API_URL` 留空，用 `rewrites` 把同源路径转到本机后端（避免浏览器 CORS）。路径与 `destination` 按实际后端填写，不要照搬未确认的约定：

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:8000/api/:path*",
      },
      {
        source: "/health",
        destination: "http://127.0.0.1:8000/health",
      },
    ];
  },
};

export default nextConfig;
```

说明：

- 在默认 Node Server 部署（`pnpm build` + `pnpm start`）下，`rewrites` 在开发与生产均可生效；若改为纯静态导出等形态，需另行确认是否仍适用。
- 也可直接把 `NEXT_PUBLIC_API_URL` 设为后端绝对地址（如 `http://127.0.0.1:8000`）；此时一般不再依赖 `rewrites`，但浏览器请求需后端允许跨域。
- 仅在服务端发起的请求可改用非 `NEXT_PUBLIC_` 的私有基址，不受浏览器 CORS 约束；不要把密钥放进 `NEXT_PUBLIC_` 变量。

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

- [API 层设计](src/api/README.md)：HTTP 基础设施与业务模块扩展边界。
