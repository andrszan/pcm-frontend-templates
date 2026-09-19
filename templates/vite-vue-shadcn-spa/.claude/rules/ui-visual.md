---
paths:
  - 'src/**/*.vue'
  - 'src/index.css'
  - 'public/**/*'
  - 'components.json'
  - 'package.json'
---

# 视觉表达与实现能力

## 组件与图标

- 主动复用本地 Empty、Skeleton、Spinner、Badge、Toggle、Dropdown Menu 等组件，不因不熟悉而手写替代或重复下载。
- 图标遵循 components.json 的 Lucide 配置，使用 `@lucide/vue`；装饰图标设置 `aria-hidden`，纯图标按钮提供可访问名称。
- 不覆盖基础组件已管理的图标尺寸和位置，除非当前组合确有需要。示例只参考结构，必须使用真实内容、操作和状态。
- 使用语义色、背景、填充和层级强化识别，不为局部装饰改写全局主题，也不把完整 OKLCH token 再包进 hsl()。

## 主题与动效

- 主题偏好区分 light、dark、system；system 实时跟随系统，但不能覆盖用户保存的偏好值。
- 动效用于反馈和空间关系，不强制每页装饰。简单变化优先 Tailwind transition，加载使用 Spinner 或 animate-spin，浮层复用现有组件动画。
- 动效快速、克制、可中断，优先 transform/opacity；避免无意义持续运动和长串逐项入场。
- 使用 motion-reduce、motion-safe 或等价 CSS 遵循 reduced motion，降级后仍保留状态文案。

## 媒体、图表与依赖

- 图片、插画、SVG 和图表只在帮助识别、理解或展示真实内容时使用，不伪造统计或为了“像 Dashboard”增加图表。
- 本地 chart 与 `@unovis/vue` 已安装不代表图表业务已接入；只在真实需求和真实数据存在时使用。
- 媒体检查许可、尺寸、裁剪、体积、替代文本和缺失表现，不交付临时外链、私有凭据或无关素材。
- 新增依赖前检查平台能力、本地组件和现有依赖；确认缺口后用 pnpm 增加并同步 lockfile，不为未来假设预装。
- 替换设计系统、主题、路由等高影响变更需单独确认；普通依赖变更不授权升级整个技术栈。
