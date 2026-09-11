---
paths:
  - "src/**/*.tsx"
  - "src/**/*.css"
  - "components.json"
---

# UI 开发规则

## 设计与组件

- 涉及 shadcn/ui 组件、样式、组合、注册表、预设或 `components.json` 时，先检查 `src/components/ui/` 现有实现；有可用的 shadcn skill 时使用，缺失不阻塞。
- 优先复用 `src/components/ui/`、`src/components/custom/` 的组件和语义化主题令牌；页面和组件中不直接写任意颜色值。令牌缺失或需求明确要求非主题色时，使用 Tailwind 默认调色板的命名颜色。
- 从截图还原 UI 时，在响应式和可访问性约束下遵循参考的布局、层次、间距、组件结构与重要细节，不自行替换视觉方向；截图不定义业务行为，交互和数据以需求及现有契约为准。
- 核心任务、信息架构、Shell、主导航或视觉方向存在多个实质方案时，用最低成本的任务流、关键状态草图、原型或真实项目预览比较；普通局部修改不机械制作原型。
- UI 变更覆盖响应式布局、亮暗主题和基本可访问性：语义结构、可访问名称、键盘操作、可见焦点、对比度及必要的 reduced motion。
- 表单补充解释优先用 `LabelWithHelp`，常驻要求用 `FieldDescription`，校验错误用 `FieldError`；组合组件的使用方式见 `src/components/custom/README.md`。
- React Hook Form + Zod 的 `Field` 组合示例、初始化和提交约束见 [React 代码模式](react-style.md)。

## Select

- 默认使用 `src/components/ui/select.tsx` 的自定义 `Select`；只有明确需要并验证过平台原生选择体验时才使用 `NativeSelect`，不要仅根据视口宽度切换。
- 以同一份 `readonly SelectOption<Value>[]` 同时提供 Root 的 `items` 和映射生成的 `SelectItem`，避免显示内部编码而不是可读名称。
- `SelectItem` 和 `SelectLabel` 必须位于 `SelectGroup` 内，单组也不例外；多组各自拥有 `SelectGroup` 和可选的 `SelectLabel`。
- `value` 仅承载稳定的状态、URL、表单和 API 编码，用户可见内容来自 `label`；非空选项的 React key 用 `value`，`null` 选项用与其语义对应的稳定 key。
- 筛选中的“全部”使用带明确 `label` 的 `null` 选项；表单“未选择”使用 `SelectValue` 的 `placeholder`；多选选项不使用 `null` value。
- 远程、历史或失效的当前项保留可读名称及必要状态说明，不默认暴露内部 code。
