# 项目开发规则

## 阅读与导航

- 修改前阅读相关源码、调用方、相邻实现、测试和配置；进入有子级 `AGENTS.md` 的目录时先遵循子级规则。
- 初始化、环境、pnpm 命令和部署以 `README.md`、`package.json` 与实际配置为准。
- 按任务范围主动阅读以下规则，不必全文加载；UI/UX 设计阶段也应读取相关主题，不等待源码路径触发：
  - 组件、样式与 Select：[UI 规则](.claude/rules/ui.md)。
  - 页面、浏览编辑与响应式：[布局与交互层次](.claude/rules/ui-composition.md)。
  - 请求、提交、结果与恢复：[操作反馈](.claude/rules/ui-feedback.md)。
  - 文案、字段、帮助与错误：[内容与表单](.claude/rules/ui-content.md)。
  - 图标、动效、媒体与依赖：[视觉表达](.claude/rules/ui-visual.md)。
  - Vue Router、插件、代理和部署：[Vite SPA 规则](.claude/rules/vite-spa.md)。
  - TypeScript 代码：[TypeScript 规则](.claude/rules/typescript.md)。
  - Vue 组件、状态、Query 和表单：[Vue 代码模式](.claude/rules/vue-style.md)。
- 修改 `src/api/` 前阅读该目录的 `AGENTS.md` 与 `README.md`，API 分层和协议策略以其为准。

## 全局边界

- 需求、现有业务契约和源码事实优先；Skill 按需使用，建议不得覆盖实际证据、改变契约或扩大范围。
- 优先复用现有实现、平台能力和已安装依赖；不新增未经确认的业务、模型、流程、协议、示例数据、抽象、依赖或空目录。
- 已安装依赖或组件源码不代表能力已经接入；只为已确认的应用行为增加全局能力。
- 本项目是 Vue 3 + shadcn-vue + Reka UI 工程，不是 React shadcn/ui 工程；根 `components.json` 只供 shadcn-vue 使用。不得运行 React `shadcn` CLI、引入 React JSX/Hook/Form API、Base UI/Radix React 组件或 `lucide-react`。只有明确需要本地不存在的 registry 组件或升级源码时，才按 README 使用固定版本的 `pnpm dlx shadcn-vue@2.8.2`，并先检查本地组件和预览变更。
- `VITE_` 变量按公开客户端信息处理，不得保存 Token、密码、API Key 等敏感信息。
- 优先在共享根因处修复问题，不在多个消费方重复打补丁。

## 验证与交付

- 执行与改动范围匹配的格式、类型、Lint、测试和构建命令，完整验证序列见 README。
- 用户可见行为使用 Playwright 或等价真实浏览器完成任务并实际查看代表性结果；静态检查或截图本身不等于验收通过。
- 依赖后端的最终验收使用真实后端和真实数据；Mock 只用于局部测试。
- 明确列出已执行、失败和未验证范围，不把未验证表述为已通过。
