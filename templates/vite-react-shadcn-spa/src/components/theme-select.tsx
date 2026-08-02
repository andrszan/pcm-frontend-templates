import { useTheme } from "next-themes"

import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"

const themes = ["light", "dark", "system"] as const

type Theme = (typeof themes)[number]

function isTheme(value: string): value is Theme {
  return themes.some((theme) => theme === value)
}

export function ThemeSelect() {
  const { setTheme, theme } = useTheme()

  return (
    <NativeSelect
      aria-label="主题"
      size="sm"
      value={theme ?? "system"}
      onChange={(event) => {
        if (isTheme(event.currentTarget.value)) {
          setTheme(event.currentTarget.value)
        }
      }}
    >
      <NativeSelectOption value="light">浅色</NativeSelectOption>
      <NativeSelectOption value="dark">深色</NativeSelectOption>
      <NativeSelectOption value="system">跟随系统</NativeSelectOption>
    </NativeSelect>
  )
}
