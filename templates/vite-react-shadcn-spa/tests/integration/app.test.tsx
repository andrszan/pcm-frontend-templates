import { useQueryClient } from "@tanstack/react-query"
import { render, screen } from "@testing-library/react"
import { useTheme } from "next-themes"
import { createMemoryRouter, RouterProvider } from "react-router"
import { describe, expect, it } from "vitest"

import { AppProviders } from "@/app/providers"
import { routes } from "@/app/router"

function renderRoute(initialEntry: string) {
  const router = createMemoryRouter(routes, { initialEntries: [initialEntry] })
  return render(
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>,
  )
}

function ProviderProbe() {
  const queryClient = useQueryClient()
  const { setTheme } = useTheme()
  const queries = queryClient.getDefaultOptions().queries

  return (
    <p>
      {queries?.staleTime === 5 * 60 * 1000 && queries.gcTime === 10 * 60 * 1000 && typeof setTheme === "function"
        ? "providers-ready"
        : "providers-missing"}
    </p>
  )
}

describe("应用集成", () => {
  it("使用生产路由渲染首页", () => {
    renderRoute("/")
    expect(screen.getByRole("heading", { level: 1, name: "模板已启动" })).toBeInTheDocument()
  })

  it("提供 Query 默认策略和主题上下文", () => {
    render(
      <AppProviders>
        <ProviderProbe />
      </AppProviders>,
    )
    expect(screen.getByText("providers-ready")).toBeInTheDocument()
  })
})
