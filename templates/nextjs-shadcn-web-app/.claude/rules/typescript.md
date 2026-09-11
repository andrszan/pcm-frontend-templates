---
paths:
  - "**/*.ts"
  - "**/*.tsx"
  - "**/*.mts"
  - "**/*.cts"
---

# TypeScript 开发规则

- 使用 `@/` 别名；遵循 `erasableSyntaxOnly`，不使用 enum、constructor parameter property 等需要运行时转换的 TypeScript 语法。
- 不用 `any` 或不安全断言掩盖未确认的数据契约；信任边界需要运行时校验时，按真实协议添加最小校验。
