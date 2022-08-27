import { test, expect } from '@playwright/test'
import { BlockType } from '../utils/testTypes.ts'
import { repeatKey, isBlockType } from '../utils/playwright.ts'

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
  await page.locator('data-test-id=block-menu').nth(0).click()
  await page.locator('text=Heading 2').nth(0).click()
  let text = await block.innerHTML()
  expect(text).toBe("Get Started")
  const isH2 = await isBlockType(block, BlockType.H2)
  expect(isH2).toBe(true)

  // Convert to H3
  await page.locator('data-test-id=block-menu').nth(0).click()
  await page.locator('text=Heading 3').nth(0).click()
  text = await block.innerHTML()
  expect(text).toBe("Get Started")
  const isH3 = await isBlockType(block, BlockType.H3)
  expect(isH3).toBe(true)

  // Convert to Text
  await page.locator('data-test-id=block-menu').nth(0).click()
  await page.locator('text="Text"').nth(0).click()
  text = await block.innerHTML()
  expect(text).toBe("Get Started")
  const isText = await isBlockType(block, BlockType.Text)
  expect(isText).toBe(true)

  // Convert to Quote
  await page.locator('data-test-id=block-menu').nth(0).click()
  await page.locator('text="Quote"').nth(0).click()
  text = await block.innerHTML()
  expect(text).toBe("Get Started")
  const isQuote = await isBlockType(block, BlockType.Quote)
  expect(isQuote).toBe(true)
})

test('converting between types via keyboard should work and maintain caret position', async ({ page, browserName }) => {
  await page.goto('/')
  expect(page).toHaveTitle(/Lotion/)

  // Convert H1 to H2
  let block = await page.locator('text="Get Started"')
  await block.click()
  // Move caret between "t" and "e"
  await repeatKey(page, 'ArrowLeft', 2)
  await page.keyboard.type('/heading 2')
  await page.keyboard.press('Enter')
  // Wait for text to update to "Get Started"
  await block.waitFor()
  // Testing caret position
  await page.keyboard.press('s')
  block = await page.locator('text="Get Startsed"')
  const isH2 = await isBlockType(block, BlockType.H2)
  expect(isH2).toBe(true)

  // Convert H2 to H3
  await page.keyboard.press('Backspace')
  await page.keyboard.type('/heading 3')
  await page.keyboard.press('Enter')
  block = await page.locator('text="Get Started"')
  await block.waitFor()
  await page.keyboard.press('d')
  block = await page.locator('text="Get Startded"')
  const isH3 = await isBlockType(block, BlockType.H3)
  expect(isH3).toBe(true)

  test.skip(browserName === 'chromium', 'Chromium specific heading bug - to fix in the future')

  // Convert H3 to Quote
  await page.keyboard.press('Backspace')
  await page.keyboard.type('/quote')
  await page.keyboard.press('Enter')
  block = await page.locator('text="Get Started"')
  await block.waitFor()
  await page.keyboard.press('f')
  block = await page.locator('text="Get Startfed"')
  const isQuote = await isBlockType(block, BlockType.Quote)
  expect(isQuote).toBe(true)

  // Convert Quote to Text
  await page.keyboard.press('Backspace')
  await page.keyboard.type('/text')
  await page.keyboard.press('Enter')
  block = await page.locator('text="Get Started"')
  await block.waitFor()
  await page.keyboard.press('g')
  block = await page.locator('text="Get Startged"')
  const isText = await isBlockType(block, BlockType.Text)
  expect(isText).toBe(true)
})

test('creating and breaking lines should work correctly', async ({ page }) => {
  await page.goto('/')
  expect(page).toHaveTitle(/Lotion/)

  let block = await page.locator('text="Get Started"')
  await block.click()
  await page.keyboard.press('Enter')
  // Wait for new line to be created
  await page.waitForSelector('.ProseMirror-trailingBreak', {state: 'attached'})
  await page.keyboard.type('New Line')
  const newLine = await page.locator('text="New Line"')
  let isText = await isBlockType(newLine, BlockType.Text)
  expect(isText).toBe(true)

  await block.click()
  await repeatKey(page, 'ArrowLeft', 2)
  await page.keyboard.press('Enter')
  block = await page.locator('text="ed"')
  await block.waitFor()
  isText = await isBlockType(block, BlockType.Text)
  expect(isText).toBe(true)
})

test('merging should work correctly', async ({ page, browserName }) => {
  await page.goto('/')
  expect(page).toHaveTitle(/Lotion/)

  let block = await page.locator('text="1. Hover on the left of each line for quick actions"')
  await block.click()
  await page.keyboard.press('Home')
  await page.keyboard.press('Backspace')
  block = await page.locator('text="Give these things a try:1. Hover on the left of each line for quick actions')
  
  block = await page.locator('text="2. Click on the + button to add a new line"')
  await block.click()
  // Convert to H3
  await page.keyboard.type('/heading 3')
  await page.keyboard.press('Enter')
  await block.waitFor()
  let isH3 = await isBlockType(block, BlockType.H3)
  expect(isH3).toBe(true)
  // Merge next block into H3
  block = await page.locator('text="3. Drag the ⋮⋮ button to reorder"')
  await block.click()
  await page.keyboard.press('Home')
  await page.keyboard.press('Backspace')
  block = await page.locator('text="2. Click on the + button to add a new line3. Drag the ⋮⋮ button to reorder"')
  await block.waitFor()
  isH3 = await isBlockType(block, BlockType.H3)
  expect(isH3).toBe(true)

  test.skip(browserName === 'chromium', 'Chromium specific heading bug - to fix in the future')

  // H3 should convert into text on backspace at start of line
  await page.keyboard.press('Home')
  await page.keyboard.press('Backspace')
  await block.waitFor()
  let isText = await isBlockType(block, BlockType.Text)
  expect(isText).toBe(true)

})
