---
paths:
  - 'src/**/*.{ts,vue}'
---

# 用户文案与表单

## 内容设计

- 使用目标用户的任务语言，同一对象称呼一致，不展示 API 字段名、数据库术语、内部枚举或研发说明。
- 正式界面不混入“测试功能”“后续接入”等占位文案；标题说明对象或任务，按钮说明动作，空态说明原因和下一步。
- 删除重复介绍、含糊操作名和不必要字段；用默认值、自动推导和高级选项渐进展示减负，不让用户填写系统可确定的 ID 或技术配置。
- 不使用虚构数据、无效按钮或只为展示组件而存在的业务表单。

## 输入、帮助与错误

- Input、Textarea 内容或格式不自明时提供简短 placeholder 示例；placeholder 不替代可见 Label、关键约束、单位或错误。
- 使用 Select、日期和单位附加区等合适控件减少自由输入。
- vee-validate 表单使用 FormLabel、FormDescription、FormMessage，并置于 FormField/FormItem 上下文；独立布局可使用 Field 组件族，不混淆 FieldError 与 FormMessage。
- 低频短解释可使用 LabelWithHelp 或 Tooltip；链接、交互和较长内容使用 Popover。关键要求直接可见，不藏进悬浮提示。
- Label、帮助、错误和字段建立程序化关联；帮助入口支持键盘和触屏，不仅依赖 hover。
- 服务端字段错误使用 setFieldError 映射；表单整体错误放在表单内明确区域，不复制 React Hook Form 的 root error。
- 初始化和后台刷新不能覆盖未保存输入。custom 输入组件通过 props、emits、slots 工作，不读取隐式 vee-validate context。
