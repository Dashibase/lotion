import { BlockType } from "./types"

/*
Menu options
*/
export const turnIntoOptions = [
  {
    type: 'Turn into',
    icon: 'bi-text-left',
    label: 'Text',
    blockType: BlockType.Text,
  }, {
    type: 'Turn into',
    icon: 'bi-type-h1',
    label: 'Heading 1',
    blockType: BlockType.H1,
  }, {
    type: 'Turn into',
    icon: 'bi-type-h2',
    label: 'Heading 2',
    blockType: BlockType.H2,
  }, {
    type: 'Turn into',
    icon: 'bi-type-h3',
    label: 'Heading 3',
    blockType: BlockType.H3,
  }, {
    type: 'Turn into',
    icon: 'bi-hr',
    label: 'Divider',
    blockType: BlockType.Divider,
  },
] as { type:string, icon:string, label:string, blockType:BlockType|string}[]
