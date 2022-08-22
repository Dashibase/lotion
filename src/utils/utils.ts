import { turnIntoOptions } from './menu'
import { BlockComponents } from './types'

export function registerBlock(id:string, label:string, component:any, icon:string='bi-text-left') {
  (BlockComponents as any)[id] = component
  turnIntoOptions.push({
    type: 'Turn into',
    icon,
    label,
    blockType: id,
  })
}
