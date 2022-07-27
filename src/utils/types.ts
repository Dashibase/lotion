import TextBlock from '@/components/blocks/TextBlock.vue'
import DividerBlock from '@/components/blocks/DividerBlock.vue'
import H1Block from '@/components/blocks/H1Block.vue'
import H2Block from '@/components/blocks/H2Block.vue'

export interface Block {
  type: BlockType;
  details: Details;
}

export enum BlockType {
  Text = 'TEXT',
  H1 = 'H1',
  H2 = 'H2',
  Divider = 'DIVIDER',
}

export interface Details {
  value?: string;
}

export const BlockComponents = {
  [BlockType.Text]: TextBlock, 
  [BlockType.H1]: H1Block,
  [BlockType.H2]: H2Block,
  [BlockType.Divider]: DividerBlock,
}
