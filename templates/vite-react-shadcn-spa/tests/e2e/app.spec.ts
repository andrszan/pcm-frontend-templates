import { expect, test } from "@playwright/test"

test("开发服务器可访问并持久化主题", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" })
  const response = await page.goto("/")

  expect(response?.status()).toBe(200)
  await expect(page).toHaveTitle("Vite React SPA")
  await expect(page.getByRole("heading", { level: 1, name: "项目已启动" })).toBeVisible()

  await page.getByRole("button", { name: "主题" }).click()
  await expect(page.locator("html")).toHaveClass(/dark/)

  await page.reload()
  await expect(page.locator("html")).toHaveClass(/dark/)
})
