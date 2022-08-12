import { test, expect } from '@playwright/test'

test("page loads correctly", async ({page}) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Lotion/)
})