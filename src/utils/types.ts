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
