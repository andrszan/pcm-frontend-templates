# 自定义公共组件

本目录存放由本地 shadcn-vue primitive 组合而成、已经确认具有跨页面复用价值的交互组件。它们不隐式依赖 Router、Pinia、TanStack Vue Query、API client 或 vee-validate 上下文。

## DateRangePicker

日期范围选择器，模型使用 Reka UI 的 `DateRange` / `DateValue`：

```vue
<DateRangePicker
  v-model="range"
  :min-value="minimumDate"
  :max-value="maximumDate"
  aria-describedby="range-error"
/>
```

- 打开时从外部值建立草稿，只有开始和结束日期完整且点击确认后才更新 `v-model`。
- 取消、Escape 或点击外部关闭会丢弃草稿；清除只清除当前草稿，仍需确认。
- 窄屏显示一个月，`sm` 及以上按配置显示一到两个月。
- 日期按自然日保存为 DateValue；接口格式、时区转换和业务范围校验由调用方负责。
- 可通过普通 `v-model` 接入筛选器，也可以由 vee-validate 的字段值桥接，不读取表单 context。

## DeleteAlertDialog

异步危险操作确认组件：

```vue
<DeleteAlertDialog v-model:open="open" :action="remove" subject-name="当前条目">
  <template #trigger>
    <Button variant="destructive">删除</Button>
  </template>
</DeleteAlertDialog>
```

- `action` 是组件可等待的命令函数，而不是事件监听器。
- pending 期间防重复并阻止关闭；成功后关闭并触发 `success`，失败时保留弹窗和用户输入并允许重试。
- 组件不发请求、不刷新 Query cache、不弹 Toast；调用方拥有删除动作和成功后的数据同步。
- `title`、`description` slots 与同名文案 props 可覆盖默认删除语义。

## LabelWithHelp

字段 Label 与可点击帮助 Popover 的组合：

```vue
<LabelWithHelp for="project-name">
  项目名称
  <template #help>此名称会展示给项目成员。</template>
</LabelWithHelp>
```

- `for` 关联真实输入控件，帮助按钮不嵌套在 Label 内。
- 帮助入口支持鼠标、键盘和触屏，不依赖 hover；默认图标可通过 `icon` slot 替换。
- `helpLabel` 为帮助按钮和 Popover 标题提供可访问名称。
- 必须常驻的约束使用 FormDescription 或 FieldDescription，校验错误使用 FormMessage 或 FieldError，不把关键信息隐藏在帮助浮层中。
