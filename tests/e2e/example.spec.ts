import { test, expect } from '@playwright/test'
import { BlockType } from '../utils/testTypes.ts'
import { repeatKey, isBlockType } from '../utils/helpers.ts'

test('basic typing and editing should work', async ({ page }) => {
  await page.goto('/')
  expect(page).toHaveTitle(/Lotion/)

  const block = await page.locator('p:has-text("Give these things a try:")')
  await block.click()
  // Test insert & delete
  await page.keyboard.type('lorem ipsum')
  let text = await block.innerHTML()
  expect(text).toBe('Give these things a try:lorem ipsum')
  await repeatKey(page, 'Backspace', 'lorem ipsum'.length)
  text = await block.innerHTML()
  expect(text).toBe('Give these things a try:')

  // Test bold & italic
  await page.keyboard.type(' **bold**')
  text = await block.innerHTML()
  expect(text).toBe('Give these things a try: <strong>bold</strong>')
  await page.keyboard.type(' *italics*')
  text = await block.innerHTML()
  expect(text).toBe('Give these things a try: <strong>bold</strong> <em>italics</em>')
})

test('converting between types via mouse should work', async ({ page }) => {
  await page.goto('/')
  expect(page).toHaveTitle(/Lotion/)

  const block = await page.locator('text="Get Started"')
  // Convert to H2
  await page.locator('data-test-id=openmenu').nth(0).click()
  await page.locator('text=Heading 2').nth(0).click()
  let text = await block.innerHTML()
  expect(text).toBe("Get Started")
  const isH2 = await isBlockType(block, BlockType.H2)
  expect(isH2).toBe(true)

  // Convert to H3
  await page.locator('data-test-id=openmenu').nth(0).click()
  await page.locator('text=Heading 3').nth(0).click()
  text = await block.innerHTML()
  expect(text).toBe("Get Started")
  const isH3 = await isBlockType(block, BlockType.H3)
  expect(isH3).toBe(true)

  // Convert to Text
  await page.locator('data-test-id=openmenu').nth(0).click()
  await page.locator('text="Text"').nth(0).click()
  text = await block.innerHTML()
  expect(text).toBe("Get Started")
  const isText = await isBlockType(block, BlockType.Text)
  expect(isText).toBe(true)

  // Convert to Quote
  await page.locator('data-test-id=openmenu').nth(0).click()
  await page.locator('text="Quote"').nth(0).click()
  text = await block.innerHTML()
  expect(text).toBe("Get Started")
  const isQuote = await isBlockType(block, BlockType.Quote)
  expect(isQuote).toBe(true)
})
