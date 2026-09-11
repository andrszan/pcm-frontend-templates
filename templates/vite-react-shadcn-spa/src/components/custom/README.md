# 自定义组件

基于现有 `ui` 组件封装的常用交互。详细参数见各文件导出的 `Props` 类型。

## DateRangePicker

适合表单或筛选中的日期范围选择。

- 用 `value={{ start, end }}` 和 `onChange` 管理选中值；点击确认才提交，取消或关闭弹层丢弃草稿，清除后确认提交 `{}`。
- 支持单日范围、日期上下限、中英文和手机单月布局；默认不限制未来日期。
- 日期按浏览器本地自然日处理，接口格式和时区转换由调用方负责。

## DeleteAlertDialog

适合需要二次确认的异步删除操作。

- `trigger` 传入一个 `Button` 或原生按钮，`onConfirm` 返回完整删除操作的 Promise。
- 内置等待态和防重复提交；成功关闭，失败保留弹窗并显示错误提示。
- 可自定义标题、说明、按钮文案，也可通过 `open` / `onOpenChange` 控制开关；不负责接口请求和列表刷新。

## LabelWithHelp

适合复杂表单中的字段解释、术语说明和补充示例：标签旁显示帮助图标，按需展开，不把所有说明平铺在页面上。

- 传入 `label`、`helpText`，用 `htmlFor` 关联输入控件；`helpLabel` 可区分不同字段的帮助按钮。
- 支持 hover、键盘 focus、触屏点击及 Escape 关闭，基于 `FieldLabel`，不依赖表单上下文。
- 填写时必须常驻的要求用 `FieldDescription`，校验错误用 `FieldError`；含链接或按钮的帮助直接使用 `Popover`。
