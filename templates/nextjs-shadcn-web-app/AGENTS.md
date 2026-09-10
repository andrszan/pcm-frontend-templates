# 项目开发规则

<!-- BEGIN:nextjs-agent-rules -->

## Next.js 文档

涉及 Next.js 行为、约定或配置时，先在 `node_modules/next/dist/docs/` 阅读对应文档；以当前安装版本的文档为准，不凭过时记忆推断。

<!-- END:nextjs-agent-rules -->

## 阅读与导航

- 修改前阅读直接涉及的源码、调用方、相邻实现、测试和配置；不要仅凭目录名或已安装依赖推断能力已经接入。
- 初始化、环境、脚本和部署以 `README.md` 与 `package.json` 为准；格式和静态检查以实际配置为准。
- 进入包含子级 `AGENTS.md` 的目录时先阅读并遵循子级规则；修改 `src/api/` 时还必须阅读该目录的 `README.md`。
- 涉及 shadcn/ui 组件、样式、组合、注册表、预设或 `components.json` 时，先检查现有源码 `src/components/ui` 并使用可用的 shadcn skill。

## 架构边界

- 除非需求明确，不新增未确认的业务域、业务协议、示例数据、未来目录或预留抽象。
- 项目使用 Next.js App Router：根页面为 `src/app/page.tsx`，嵌套路由为 `src/app/<route>/page.tsx`；路由入口负责页面组合、路由级数据获取和 metadata。
- 页面默认使用 Server Component；只有需要事件处理、浏览器 API 或客户端 Hook 的部分才进入最小 `"use client"` 边界。
- 页面私有组件仅在确实需要拆分时就近放在同路由的 `_components/`；确认跨路由复用后再提升到 `src/components/`。
- 只为已确认的应用级行为增加全局 Provider；已安装依赖不代表认证、国际化、全局状态或 Query hooks 已接入。
- API 的目录职责、DTO、endpoint、协议适配、认证和错误策略只遵循 `src/api/AGENTS.md` 与 `src/api/README.md`。
- 所有 `NEXT_PUBLIC_` 环境变量都会进入客户端 bundle，不能保存 Token、密码、API Key 或其他敏感信息。
- 本地联调本机后端时：`NEXT_PUBLIC_API_URL` 留空不够；还需按真实后端路径在 `next.config.ts` 配置 `rewrites`（见 `README.md`「环境变量」）。未确认后端路径前不要预置重写。默认 Node Server 部署下 `rewrites` 开发与生产均可生效；也可改用绝对 `NEXT_PUBLIC_API_URL`（需处理 CORS）或服务端私有基址。
- 优先复用现有代码、平台能力和已安装依赖；没有真实复用点时不增加共享层、包装层、新依赖或空目录。

## UI 与可访问性

- 从截图或图片还原 UI 时，在响应式和可访问性约束下严格遵循其视觉方向：布局、层次、间距、组件结构和重要细节；不要用自己的设计替代参考。截图只定义视觉，不自动定义业务行为，交互和数据以需求及现有契约为准。
- 优先使用现有 `src/components/ui/` 组件和语义化主题令牌；页面和组件中不得直接写任意十六进制、RGB、HSL、OKLCH 或其他颜色值。主题令牌缺失，或需求明确要求非主题色时，使用 Tailwind 默认调色板中的命名颜色。
- 使用 Base UI `Select` 时，必须以同一份 `readonly SelectOption<Value>[]` 作为选项的唯一数据源：将其传给 Root 的 `items`，并据此映射 `SelectItem`；不得只渲染 `SelectItem` 而省略 `items`，否则 `SelectValue` 会回退显示内部 `value`。所有 `SelectItem` 和 `SelectLabel` 必须位于 `SelectGroup` 内，即使只有一组选项也不得直接放在 `SelectContent` 下；需要多组时，由各组分别拥有对应的 `SelectGroup` 和可选的 `SelectLabel`。`value` 仅承载稳定的状态、URL、表单和 API 编码，用户可见内容统一来自 `label`；非空 option 的 React `key` 使用 `value`，`null` option 使用与其业务语义对应的稳定 key。筛选中的“全部”应建模为带明确 `label` 的 `null` option，表单中的“未选择”则使用 `SelectValue` 的 `placeholder`；远程、历史或失效的当前项必须保留可读名称及必要状态说明，不得默认暴露内部 code。多选 option 不使用 `null` value。
- 选择器默认使用自定义 `Select`（`src/components/ui/select.tsx`），不要默认使用 `NativeSelect`（原生 `<select>` 封装）。`NativeSelect` 的价值在于移动端原生系统提供的选择器交互（滚轮、原生弹层），只在应用真正运行于移动端设备原生环境（混合应用、WebView 或强依赖原生选择器的 PWA）时才成立。纯浏览器 Web 应用，各宽度响应式布局均在浏览器渲染，不会进入移动端原生选择器；
- 一次性定制放在调用处或组合组件中；确有跨页面组件需求时才修改共享 UI 源码，并验证受影响行为。
- UI 变更覆盖响应式布局、亮暗主题和基本可访问性：语义结构、可访问名称、键盘操作、可见焦点、对比度和必要的 reduced motion。

### UI 任务的结果约束与可选辅助

- 涉及用户可见界面的新增、改版或审查时，以已确认的产品与设计事实、现有业务契约、真实内容、共享组件和语义令牌为基础。可以按任务需要使用当前可用的设计、品牌、可视化或组件辅助 Skill，但不要求任何具名第三方 Skill，也不得因其缺失而阻塞工作。
- 高影响的核心任务、信息架构、Shell、主导航或视觉方向存在多个实质方案时，先用能够解决当前疑问的最低成本证据比较，例如任务流、关键状态草图、可抛弃原型或真实项目窄范围预览；普通局部修改不机械制作原型。
- 辅助 Skill 的输出只是候选建议。需求、当前代码、真实界面、项目规则和实际运行证据始终优先；不得为了套用推荐风格改变业务功能、权限、数据或交互契约，引入无关依赖，重写基础组件或扩大任务范围。
- 调用过 Skill、使用了组件库、通过了静态检查或生成了截图，都不能单独证明 UI 合格。完成判断必须来自真实用户任务、关键状态、目标视口、实际读取的渲染结果，以及相关控制台、网络和服务状态；无法取得的证据明确列为未验证范围。

## TypeScript 与质量

- TypeScript 严格模式和 `erasableSyntaxOnly` 已启用，使用 `@/` 别名。避免 enum、constructor parameter property 等需要运行时降级的 TypeScript 语法。
- 避免 `any` 或不安全断言掩盖未确认的数据契约；信任边界需要运行时校验时，按真实协议添加最小校验。
- 行为变化时增加或更新最小相关测试：纯逻辑和 API core 用 unit，Provider/Router 组合用 integration，用户可见流程和 production SPA 行为用 E2E。
- 优先在共享根因处修复问题，不在多个消费方重复打补丁。

## 验证与完成标准

- 使用 `package.json` 中已有的 pnpm 脚本；完整序列以 README 为准。
- 代码变更至少执行类型检查、Biome 检查和直接相关测试。
- 影响构建、路由、Provider 或生产运行行为时执行 build；改变用户可见流程时，使用项目当前可用的 Playwright 或等价真实浏览器通道，覆盖适用的桌面、手机、动态交互和真实渲染结果。是否新增永久 E2E 测试，根据场景稳定性和长期回归价值决定。
- 前端依赖后端的最终验收必须连接真实后端和真实数据；Mock 只用于局部测试，不能替代完成证据。
- 交付时明确列出已执行、失败及因环境未执行的验证，不得把未运行表述为已通过。