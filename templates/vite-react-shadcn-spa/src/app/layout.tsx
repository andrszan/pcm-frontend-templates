import { Outlet } from "react-router"

import { ThemeSelect } from "@/components/theme-select"

export function AppLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <header className="flex items-center justify-end border-b px-6 py-3">
        <ThemeSelect />
      </header>
      <main className="flex flex-1 items-center justify-center p-6">
        <Outlet />
      </main>
    </div>
  )
}
