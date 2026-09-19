---
paths:
  - 'src/**/*.{ts,vue}'
---

# Vue 代码模式

## 组件与目录

- SFC 默认使用 `<script setup lang="ts">`；Props、Emits 和 Slots 使用类型声明，默认值使用 Vue 当前版本支持的类型安全方式。
- 双向绑定使用 `defineModel` 或明确的 `modelValue` / `update:modelValue` 契约，不修改 prop。
- Props 向下、Emits 向上，复杂派生值使用 `computed`；能由 computed 或显式事件完成时，不用 `watch` 模拟。
- Template 保持语义化 HTML、稳定 `:key` 和清楚的事件流，不堆复杂表达式。
- 监听器、计时器、observer 和外部订阅由所属组件或 composable 管理并在销毁时清理。
- 页面放在 `src/routes/<route>/` 并在 `src/app/router.ts` 显式注册。页面私有组件和 composable 与页面共置，确认跨页面复用后再提升，不预建空目录，也不按行数拆分。
- `src/components/ui/` 只保存 shadcn-vue/Reka UI primitive；稳定跨页面组合放 `src/components/custom/`。

## 状态所有权

- 组件局部 UI 状态使用 `ref`、`reactive`、`computed`。
- 可分享、可刷新恢复的筛选、分页、Tab 和对象定位使用 Vue Router params/query。
- 确认需要跨页面共享的客户端状态使用 Pinia；读取状态和 getter 使用 `storeToRefs`，action 直接调用 Store。
- 服务端数据、缓存和请求生命周期使用 TanStack Vue Query。
- 不把局部 Dialog、单页草稿、hover 状态放进 Pinia；不把 URL 状态、API 响应或 Query cache 再复制进 Pinia。
- Store 不持有 Axios endpoint、QueryClient cache、组件实例、DOM 节点、页面 ViewModel 或无明确生命周期的计时器。

## Router 与 Query

- 模板导航优先 `RouterLink`；脚本中使用 `useRoute`、`useRouter`。query/params 进入业务前必须解析和提供默认值。
- Query composable 放在页面附近或真实复用的 `src/composables/`，不放进 `src/api/`。
- Query key 包含影响结果的全部稳定参数；响应式参数保持为 ref、computed 或 getter，避免过早读取成静态快照。
- Query function 调用语义化 API 方法；Axios、endpoint 和响应 schema 仍由 API 模块负责。
- Mutation 成功后按真实数据关系失效或更新 cache，不机械全局刷新。乐观更新必须具备取消、旧值保存、回滚和并发方案。

## vee-validate + Zod 3

使用 `toTypedSchema`、`useForm` 和本地 Form 组件：

```ts
const schema = toTypedSchema(z.object({ name: z.string().trim().min(1, '名称必填') }))
const { handleSubmit, isSubmitting, resetForm, setFieldError } = useForm({
  validationSchema: schema,
  initialValues: { name: '' },
})
```

- `FormField` 通过 scoped slot 提供 `componentField`；输入按真实组件契约使用 `v-bind` 或 `v-model`，不复制 React 的 Controller、`{...field}`、formState 或 root error。
- `FormControl`、`FormLabel`、`FormDescription`、`FormMessage` 放在正确的 FormField/FormItem 上下文中。
- 服务端字段错误使用 `setFieldError`；表单整体错误放在表单内的 Alert、FieldError 或明确错误区域。
- 编辑数据首次加载后使用 `resetForm({ values })` 建立新的初始值；后台刷新不覆盖 dirty 输入，切换对象前处理未保存修改。
- 提交等待真实结果，pending 防重复；失败保留输入，成功后以服务端确认值重置并同步 Query cache。
- 表单 schema 描述用户输入，API schema 描述外部响应；契约真正相同时才复用。
