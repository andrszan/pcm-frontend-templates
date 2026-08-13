"use client";

import { useTheme } from "next-themes";

// ⚠️ 占位组件：仅保证主题切换功能可用，外观未设计。
// 请替换为你自己的主题切换 UI，不要直接沿用这个占位。
// ThemeProvider 已就绪（见 src/app/providers.tsx），用 useTheme() 的 setTheme 接入即可。
export function ThemeSelect() {
  const { setTheme, theme } = useTheme();

  return (
    <button type="button" aria-label="主题" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      {theme === "dark" ? "深色" : "浅色"}
    </button>
  );
}
