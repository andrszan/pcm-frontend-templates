import { expect, test, type Page } from '@playwright/test'

async function selectTheme(page: Page, name: '浅色' | '深色' | '跟随系统') {
  await page.getByRole('button', { name: '选择主题' }).click()
  await page.getByRole('menuitemradio', { name }).click()
}

test('首页可访问并持久化显式主题', async ({ page }) => {
  let response = await page.goto('/')
  await page.evaluate(() => window.localStorage.clear())
  response = await page.reload()

  expect(response?.status()).toBe(200)
  await expect(page).toHaveTitle('Vite + Vue + shadcn-vue')
  await expect(page.getByRole('heading', { level: 1, name: '项目已启动' })).toBeVisible()

  await selectTheme(page, '深色')
  await expect(page.locator('html')).toHaveClass(/dark/)
  await expect.poll(() => page.evaluate(() => window.localStorage.getItem('theme'))).toBe('dark')

  await page.reload()
  await expect(page.locator('html')).toHaveClass(/dark/)

  await selectTheme(page, '浅色')
  await expect(page.locator('html')).not.toHaveClass(/dark/)
  await expect.poll(() => page.evaluate(() => window.localStorage.getItem('theme'))).toBe('light')
})

test('system 主题在首帧和运行期间跟随系统', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.addInitScript(() => window.localStorage.setItem('theme', 'system'))
  await page.goto('/')

  await expect(page.locator('html')).toHaveClass(/dark/)
  await expect.poll(() => page.evaluate(() => window.localStorage.getItem('theme'))).toBe('system')

  await page.emulateMedia({ colorScheme: 'light' })
  await expect(page.locator('html')).not.toHaveClass(/dark/)
})

test('主题菜单支持键盘且窄屏不横向溢出', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')

  const trigger = page.getByRole('button', { name: '选择主题' })
  await trigger.focus()
  await page.keyboard.press('Enter')
  const system = page.getByRole('menuitemradio', { name: '跟随系统' })
  await expect(system).toBeVisible()
  await system.focus()
  await page.keyboard.press('Enter')

  await expect.poll(() => page.evaluate(() => window.localStorage.getItem('theme'))).toBe('system')
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
    .toBe(true)
})

test('未知路径显示 404 并可返回首页', async ({ page }) => {
  await page.goto('/missing')

  await expect(page.getByRole('heading', { level: 1, name: '页面不存在' })).toBeVisible()
  await page.getByRole('link', { name: '返回首页' }).click()
  await expect(page).toHaveURL('/')
  await expect(page.getByRole('heading', { level: 1, name: '项目已启动' })).toBeVisible()
})
