import { test, expect, chromium } from '@playwright/test'

test.describe('Excel Add-in E2E Tests', () => {
  let browser: any
  let page: any

  test.beforeAll(async () => {
    browser = await chromium.launch()
    page = await browser.newPage()
  })

  test.afterAll(async () => {
    await browser.close()
  })

  test('should login successfully', async () => {
    await page.goto('http://localhost:3000/login')
    await page.fill('input[name="username"]', 'testuser')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button:has-text("Login")')
    await page.waitForNavigation()
    expect(page.url()).toContain('/dashboard')
  })

  test('should display data items', async () => {
    await page.goto('http://localhost:3000/dashboard')
    const items = await page.locator('[data-testid="data-item"]').count()
    expect(items).toBeGreaterThan(0)
  })

  test('should create new data item', async () => {
    await page.goto('http://localhost:3000/dashboard')
    await page.click('button:has-text("Add Item")')
    await page.fill('input[name="name"]', 'E2E Test Item')
    await page.fill('input[name="value"]', '999')
    await page.click('button:has-text("Create")')
    await page.waitForSelector('[data-testid="success-message"]')
    expect(await page.locator('text=E2E Test Item').isVisible()).toBeTruthy()
  })

  test('should sync data with server', async () => {
    await page.goto('http://localhost:3000/dashboard')
    const initialCount = await page.locator('[data-testid="data-item"]').count()
    await page.click('button:has-text("Sync All")')
    await page.waitForSelector('[data-testid="sync-complete"]', { timeout: 30000 })
    const finalCount = await page.locator('[data-testid="data-item"]').count()
    expect(finalCount).toBeGreaterThanOrEqual(initialCount)
  })

  test('should filter data items', async () => {
    await page.goto('http://localhost:3000/dashboard')
    await page.fill('input[placeholder="Search..."]', 'Test')
    const items = await page.locator('[data-testid="data-item"]').count()
    expect(items).toBeGreaterThanOrEqual(0)
  })

  test('should export data as Excel', async () => {
    await page.goto('http://localhost:3000/dashboard')
    const downloadPromise = page.waitForEvent('download')
    await page.click('button:has-text("Export")')
    const download = await downloadPromise
    expect(download.suggestedFilename()).toContain('.xlsx')
  })

  test('should logout successfully', async () => {
    await page.goto('http://localhost:3000/dashboard')
    await page.click('[data-testid="user-menu"]')
    await page.click('button:has-text("Logout")')
    await page.waitForNavigation()
    expect(page.url()).toContain('/login')
  })
})
