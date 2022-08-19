import { isTextBlock, BlockType } from '@/utils/types'
import { test, expect } from 'vitest'

test('isTextBlock should work for text blocks', () => {
  // Keep as reminder to update textBlockMap in @/utils/types
  const knownTextBlocks = [
    BlockType.Text,
    BlockType.Quote,
  ] 
  for (let type in BlockType) {
    if (knownTextBlocks.includes(type as BlockType)) expect(isTextBlock(type)).toBeTruthy()
    else expect(isTextBlock(type)).toBeFalsy()
  }
})
