import { test, expect } from '@playwright/experimental-ct-vue'
import Lotion from '../Lotion.vue'
import { BlockType } from '../../../tests/utils/testTypes.ts'
import { isBlockType } from '../../../tests/utils/helpers.ts'

const page = {
  name: '🧴 Lotion',
  blocks: [
    {
      id: 'f8296d43-7920-4ab8-a869-7d58439534b2',
      type: BlockType.Text,
      details: {
        value: '<p><strong><em>Text</em></strong> block</p>',
      },
    },
    {
      id: '9274a245-38b8-49fe-b4f4-3476fb23202c',
      type: BlockType.H1,
      details: {
        value: 'H1 Block',
      },
    },
    {
      id: '720f5772-0086-4054-8487-17ca5627123b',
      type: BlockType.Quote,
      details: {
        value: '<p>Quote Block</p>',
      },
    },
  ],
}

test.use({ viewport: { width: 1000, height: 800 } })

// Example of failing test w/ italic bold (nested) tags
test('converting within italic bold text should work', async ({ mount }) => {
  const component = await mount(Lotion, {
    props: {
      page: page,
    },
  })
  await expect(component).toContainText('Quote Block')
  let block = await component.locator('.ProseMirror').first()
  await block.click()
  let text = await block.innerHTML()
  expect(text).toBe('<p><strong><em>Text</em></strong> block</p>')
  await block.press('Home')
  await block.press('ArrowRight')
  await block.type('/quote')
  await block.press('Enter')
  const innerHTML = await block.innerHTML()
  expect(innerHTML).toBe('<p><strong><em>Text</em></strong> block</p>')
  await component.locator('text="ext block"').waitFor()
  let isQuote = await isBlockType(block, BlockType.Quote)
  expect(isQuote).toBe(true)
})
