import { expect, test } from "@playwright/test";

test("renders the template home page", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");

  await expect(page).toHaveTitle("Next.js Web App");
  await expect(page.getByRole("heading", { level: 1, name: "模板已启动" })).toBeVisible();

  await page.getByRole("combobox", { name: "主题" }).selectOption("dark");
  await expect(page.locator("html")).toHaveClass(/dark/);
});
