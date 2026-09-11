---
paths:
  - "src/**/*.{ts,tsx}"
---

# React 代码模式

以下为关键结构伪代码，省略 imports、类型和封装；按真实业务接线，格式遵循 Biome。

## 组件组织

页面私有代码按需放 `_components/`、`_hooks/`；公共组件复用 `@/components/ui`、`@/components/custom`，类型复用相关模块已有定义。

```text
src/app/{xxx}/
├── _components/   # 当前路由及子路由共享的私有组件
├── _hooks/        # 路由私有 Hook
├── {yyy}/
│   └── page.tsx   # 子页面入口
└── page.tsx       # 当前页面入口

src/components/
├── ui/           # shadcn/ui 基础组件
└── custom/       # 自定义公共组件
```

## 状态管理

局部状态用 `useState`，局部跨层用 Context，跨组件或跨页面的客户端业务状态用 Zustand；服务端数据缓存用 TanStack Query。

```tsx
const createDraftStore = (initialName) => createStore((set) => ({
  name: initialName,
  setName: (name) => set({ name }),
}));

// 公共 layout 的 Provider 内创建，子组件通过 Context 获取 store。
const [store] = useState(() => createDraftStore(initialName));
const name = useStore(store, (state) => state.name);
const setName = useStore(store, (state) => state.setName);
setName(nextName);
```

服务端按请求隔离 store，浏览器在 Provider 生命周期内复用，水合初值保持一致；Server Component 不读写 store。控制器、reader、定时器不放业务 store，由所属组件或 Hook 管理并清理。

## 表单

React Hook Form + Zod，使用 `Controller` 连接现有 `Field` 组件：

```tsx
const schema = z.object({ name: z.string().trim().min(1, "名称必填") });
const form = useForm({ resolver: zodResolver(schema), defaultValues: { name: "" } });
const onSubmit = async (values) => {
  try { await save(values); form.reset(values); }
  catch { form.setError("root", { message: "保存失败，请重试" }); }
};

<form onSubmit={form.handleSubmit(onSubmit)}>
  <FieldGroup>
    <Controller control={form.control} name="name" render={({ field, fieldState }) => (
      <Field data-invalid={fieldState.invalid}>
        <FieldLabel htmlFor={nameId}>名称</FieldLabel>
        <Input {...field} id={nameId} aria-invalid={fieldState.invalid}
          aria-describedby={fieldState.invalid ? errorId : undefined} />
        <FieldError id={errorId} errors={[fieldState.error]} />
      </Field>
    )} />
    <FieldError errors={[form.formState.errors.root]} />
    <Button type="submit" disabled={form.formState.isSubmitting}>保存</Button>
  </FieldGroup>
</form>
```

编辑数据加载后用 `form.reset(values)` 初始化，后台刷新不覆盖未保存输入；切换对象前处理未保存修改。提交必须等待完成，提交期间保护输入并避免重复提交，失败保留输入；接口字段错误映射到对应字段，帮助说明遵循 UI 规则。
