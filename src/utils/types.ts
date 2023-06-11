import { Component } from 'vue'
import TextBlock from '@/components/blocks/TextBlock.vue'
import DividerBlock from '@/components/blocks/DividerBlock.vue'
import HeadingBlock from '@/components/blocks/HeadingBlock.vue'
import QuoteBlock from '@/components/blocks/QuoteBlock.vue'

export interface Block {
  id: string,
  type: BlockType;
  details: Details;
}

export enum BlockType {
  Text = 'TEXT',
  H1 = 'H1',
  H2 = 'H2',
  H3 = 'H3',
  Divider = 'DIVIDER',
  Quote = 'QUOTE',
  UnorderedList = 'UNORDERED_LIST',
  OrderedList = 'ORDERED_LIST',
}

export interface Details {
  value?: string;
  blockTypes?: BlockType[];
}

export const BlockComponents: Record<string, Component> = {
  [BlockType.Text]: TextBlock,
  [BlockType.H1]: HeadingBlock,
  [BlockType.H2]: HeadingBlock,
  [BlockType.H3]: HeadingBlock,
  [BlockType.Divider]: DividerBlock,
  [BlockType.Quote]: QuoteBlock,
  [BlockType.UnorderedList]: TextBlock,
  [BlockType.OrderedList]: TextBlock,
}

export const textBlockMap = [BlockType.Text, BlockType.Quote, BlockType.UnorderedList, BlockType.OrderedList]

export const isTextBlock = (type: string) => {
  return textBlockMap.some(textBlock => textBlock === type)
}

export const availableBlockTypes = [
  {
    type: 'Turn into',
    icon: 'bi-text-left',
    label: 'Text',
    blockType: BlockType.Text,
    canSplit: true,
  }, {
    type: 'Turn into',
    icon: 'bi-type-h1',
    label: 'Heading 1',
    blockType: BlockType.H1,
    canSplit: true,
  }, {
    type: 'Turn into',
    icon: 'bi-type-h2',
    label: 'Heading 2',
    blockType: BlockType.H2,
    canSplit: true,
  }, {
    type: 'Turn into',
    icon: 'bi-type-h3',
    label: 'Heading 3',
    blockType: BlockType.H3,
    canSplit: true,
  }, {
    type: 'Turn into',
    icon: 'bi-hr',
    label: 'Divider',
    blockType: BlockType.Divider,
    canSplit: false,
  }, {
    type: 'Turn into',
    icon: 'bi-quote',
    label: 'Quote',
    blockType: BlockType.Quote,
    canSplit: true,
  }, {
    type: 'Turn into',
    icon: 'bi-list-ol',
    label: 'Ordered List',
    blockType: BlockType.OrderedList,
    canSplit: false,
  }, {
    type: 'Turn into',
    icon: 'bi-list-ul',
    label: 'Unordered List',
    blockType: BlockType.UnorderedList,
    canSplit: false,
  },
] as { type:string, icon:string, label:string, blockType:BlockType|string, canSplit:boolean }[]
