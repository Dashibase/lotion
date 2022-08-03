import TextBlock from '@/components/blocks/TextBlock.vue'
import DividerBlock from '@/components/blocks/DividerBlock.vue'
import HeadingBlock from '@/components/blocks/HeadingBlock.vue'
import QuoteBlock from '@/components/blocks/QuoteBlock.vue'


export interface Block {
  type: BlockType;
  details: Details;
}

export enum BlockType {
  Text = 'TEXT',
  H1 = 'H1',
  H2 = 'H2',
  H3 = 'H3',
  Divider = 'DIVIDER',
  Quote = 'QUOTE'
}

export interface Details {
  value?: string;
}

export const BlockComponents = {
  [BlockType.Text]: TextBlock,
  [BlockType.H1]: TextBlock,
  [BlockType.H2]: HeadingBlock,
  [BlockType.H3]: HeadingBlock,
  [BlockType.Divider]: DividerBlock,
  [BlockType.Quote]: QuoteBlock,
}

export const blockTagMap = {
  [BlockType.Text]: 'p',
  [BlockType.H1]: 'h1',
  [BlockType.H2]: '',
  [BlockType.H3]: '',
  [BlockType.Quote]: 'p',
  [BlockType.Divider]: '',
}
