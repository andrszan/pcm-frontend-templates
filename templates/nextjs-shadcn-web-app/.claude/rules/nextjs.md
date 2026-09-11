---
paths:
  - "src/app/**/*"
  - "src/**/*.tsx"
  - "next.config.ts"
  - ".env*"
---

# Next.js 开发规则

- 使用 App Router；路由入口负责页面组合、路由级数据获取和 metadata。
- 页面默认使用 Server Component；只有需要事件处理、浏览器 API 或客户端 Hook 的部分才进入最小 `"use client"` 边界。
- 页面私有组件和 Hook 仅在需要拆分时就近放在同路由的 `_components/`、`_hooks/`；确认跨路由复用后再提升到公共目录，不预建空目录。
- React 状态作用域、Zustand 生命周期及示例见 [React 代码模式](react-style.md)。
- 后端地址与代理配置遵循 `README.md` 的环境变量说明；`NEXT_PUBLIC_API_URL` 留空只表示同源请求，不会自动代理到本机后端。未确认真实后端路径前，不预置 `rewrites`。
