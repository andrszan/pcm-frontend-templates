---
paths:
  - 'src/**/*.vue'
  - 'src/index.css'
  - 'components.json'
---

# UI 开发规则

## 设计与组件

- `components.json` 是 shadcn-vue 配置，只能交给 Vue/shadcn-vue 工具链；不得运行 React `shadcn` CLI，也不得复制 React TSX、React Hook Form、Base UI/Radix React API 或 `lucide-react` 示例。
- 涉及 shadcn-vue、Reka UI、组件组合或 `components.json` 时，先检查本地 `src/components/ui/`；当前 registry 组件已完整预置，不重复下载、复制 primitive、手写低配替代或引入另一套 UI 库。
- 优先复用 `src/components/ui/`、`src/components/custom/` 和语义主题 token；业务组件不散落任意颜色值，也不为单页需求修改基础组件 API。
- 从截图还原时遵循布局、层次、间距和重要视觉细节；业务交互和数据仍以需求及现有契约为准。
- UI 变更覆盖语义结构、可访问名称、键盘操作、可见焦点、对比度、亮暗主题及必要的 reduced motion。
- primitive base 是 Reka UI，图标使用 `@lucide/vue`；通知使用 Sonner，不存在独立 `toast` 目录。组件源码或依赖存在不代表入口已接线。
- Date Picker 是 Calendar/RangeCalendar、Popover 和 Button 的组合；Data Table 是 Table 加真实列、排序和筛选契约；Typography 使用语义 HTML 与 Tailwind 排版。

## Select

- 默认使用 `@/components/ui/select`；只有明确需要并验证平台原生体验时才使用 NativeSelect，不按视口机械切换。
- 使用 `<Select v-model="value">` 和 `<SelectItem :value="option.value">`，不复制 Base UI 的 `items`、render 或 React API。
- 可见名称放在 SelectItem 内容中；状态、URL、表单和 API 使用稳定编码，循环 `:key` 使用稳定值。
- SelectGroup/SelectLabel 只用于真实分组；未选择状态使用 SelectValue placeholder 和清楚的模型空值约定。
- 表单、URL 和 API 场景优先稳定标量；对象值需要稳定身份并按 Reka API 配置 `by`。
- “全部”等筛选项可使用明确的 null 或稳定 sentinel，但要与表单未选择区分；远程、历史或失效值保留可读名称和必要说明。
