import type { Locator, Page } from '@playwright/test'
import { BlockType } from './testTypes.ts'

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

export async function isBlockType (locator: Locator, type: BlockType) {
  let result = false
  switch (type) {
    case BlockType.H1:
      result = await locator.evaluate((el) => el.classList.contains('text-4xl'))
      break
    case BlockType.H2:
      result = await locator.evaluate((el) => el.classList.contains('text-3xl'))
      break
    case BlockType.H3:
      result = await locator.evaluate((el) => el.classList.contains('text-2xl'))
      break
    case BlockType.Text:
      let isTextType = await locator.evaluate((el) => el.classList.length === 0)
      // Parent of parent
      let isQuote = await locator.locator('..').locator('..').evaluate(((el) => el.classList.contains('border-black')))
      result = isTextType && !isQuote
      break
    case BlockType.Quote:
      let isTextType2 = await locator.evaluate((el) => el.classList.length === 0)
      // Parent of parent
      let isQuote2 = await locator.locator('..').locator('..').evaluate(((el) => el.classList.contains('border-black')))
      result = isTextType2 && isQuote2
      break
    case BlockType.OrderedList:
      result = await locator.evaluate((el) => el.classList.contains('list-decimal'))
      break
    case BlockType.UnorderedList:
      result = await locator.evaluate((el) => el.classList.contains('list-disc'))
      break
  }
  return result
}