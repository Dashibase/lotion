import { test, expect } from '@playwright/test'

test('basic tests', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Lotion/)
})
