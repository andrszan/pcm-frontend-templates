---
paths:
  - "src/**/*.{ts,tsx}"
  - "vite.config.ts"
  - "index.html"
  - ".env*"
---

# Vite SPA 开发规则

- 项目是浏览器 SPA，使用 React Router 7 Data Mode；路由树集中在 `src/app/router.tsx`，页面入口为 `src/routes/<route>/page.tsx`，目录本身不自动生成路由。
- 页面私有组件和 Hook 按需放在同路由的 `_components/`、`_hooks/`；确认跨路由复用后再提升到公共目录，不预建空目录。
- 应用级 Provider 集中在 `src/app/providers.tsx`。
- TanStack Query 负责远程数据缓存；API 传输层保持与 React 无关，Query Hook 不放入 `src/api/`。客户端状态与表单示例见 [React 代码模式](react-style.md)。
- `VITE_API_URL` 留空只表示同源请求，不会自动代理到本机后端；按 README 的环境变量说明配置 `server.proxy`，未确认真实后端路径前不预置代理。生产 API 转发或绝对基址另行配置，不依赖开发代理。
- 部署 `dist/` 时，页面路由需回退到 `index.html`，缺失的真实静态资源仍返回 404；API 请求不得落入页面回退。`vite preview` 仅供本地预览，不作为生产服务器。
