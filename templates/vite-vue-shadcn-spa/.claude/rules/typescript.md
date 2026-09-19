---
paths:
  - '**/*.ts'
  - '**/*.vue'
  - '**/*.mts'
  - '**/*.cts'
---

# TypeScript 开发规则

- 使用 `@/` 别名并保持严格类型；项目启用了 `noUncheckedIndexedAccess`，索引读取必须处理缺失值。
- 不用 `any`、双重断言或 `@ts-ignore` 掩盖契约问题；优先 `unknown` 加类型收窄，必要例外应缩小范围并说明原因。
- 外部响应、存储值和 URL 输入等信任边界按真实协议使用运行时校验；TypeScript 类型不能代替校验。
- 项目使用 Zod 3，示例和 API 必须兼容其 API；vee-validate 通过 `@vee-validate/zod` 的 `toTypedSchema` 接入，不使用 `zodResolver`。
- 使用 `import type` 表达纯类型依赖。类型与唯一消费模块共置，出现真实稳定复用后再提升。
- 优先可辨识联合、字面量联合和平台类型，不为一个实现创建接口、工厂或与 schema 脱节的重复 DTO。
- Vue props、emits、slots 和 composable 返回值保持推断友好，不为显式而重复声明同一类型。
