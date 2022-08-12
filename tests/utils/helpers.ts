import type { Page } from "@playwright/test"

export async function repeatKey (page: Page, key: string, times: number) {
  for (let i = 0; i < times; i++) {
    await page.keyboard.press(key)
  }
}

export function moveToStart (page: Page) {
  return page.keyboard.press('Home')
}

export function moveToEnd (page: Page) {
  return page.keyboard.press('End')
}