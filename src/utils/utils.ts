import { BlockComponents, availableBlockTypes } from './types'

export function registerBlock(id:string, label:string, component:any, icon:string='bi-text-left', canSplit:boolean=false) {
  (BlockComponents as any)[id] = component
  availableBlockTypes.push({
    type: 'Turn into',
    icon,
    label,
    blockType: id,
    canSplit,
  })
}

export function markdownToHtml (mdString:string) {
  // Adapted from https://randyperkins2k.medium.com/writing-a-simple-markdown-parser-using-javascript-1f2e9449a558
  return mdString
		.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
		.replace(/\*(.*?)\*/gim, '<em>$1</em>')
	  .trim()
}

export function htmlToMarkdown (htmlString:string) {
  return htmlString
    .replaceAll('<p>', '')
    .replaceAll('</p>', '')
    .replaceAll('<strong>', '**')
    .replaceAll('</strong>', '**')
    .replaceAll('<em>', '*')
    .replaceAll('</em>', '*')
    .replaceAll(/\<br.*?\>/g, '')
}
