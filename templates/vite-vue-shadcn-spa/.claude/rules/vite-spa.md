---
paths:
  - 'src/app/**/*.ts'
  - 'src/main.ts'
  - 'src/routes/**/*.{ts,vue}'
  - 'vite.config.ts'
  - 'index.html'
  - '.env*'
---

# Vite SPA 开发规则

- 项目是浏览器 SPA，使用 Vue Router；路由表集中在 `src/app/router.ts`，页面目录不会自动生成路由，新页面必须显式注册。
- 使用 `createRouter`、`createWebHistory(import.meta.env.BASE_URL)`、RouterView、RouterLink、`useRoute` 和 `useRouter`，不复制 React Router Data Mode 约定。
- 守卫、路由 meta 和动态路由只在真实需求出现后增加，不预建认证框架。
- Pinia、Vue Router 与 VueQueryPlugin 在 `src/main.ts` 通过 `.use(...)` 集中安装，不创建 Provider 仿制层。
- Tooltip、Toaster、错误边界等 UI 树能力放在明确的 App 壳位置；组件源码存在不代表应用能力已经接线。
- TanStack Vue Query 管理远程状态；`src/api/` 保持与 Vue、Router、Pinia、Query 和 UI 无关。Query composable 不放入 API 传输层。
- `VITE_API_URL` 留空只表示同源请求，不会自动代理到本机后端；未确认真实后端路径前不预置 proxy。
- Vite proxy 只服务开发环境；生产环境必须明确网关转发、绝对 API 地址或 CORS。
- 部署 `dist/` 时页面导航回退到 `index.html`，缺失 JS、CSS、图片和 API 仍返回真实 404。`vite preview` 仅供本地检查。
- `index.html` 只承载必要的首屏同步逻辑，不演变为第二个应用入口。
