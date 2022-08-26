<template>
  <div class="group flex w-full rounded"
    :class="{
      // Add top margin for headings
      'pt-12 first:pt-0': block.type === BlockType.H1,
      'pt-4 first:pt-0': block.type === BlockType.H2,
    }">
    <div class="h-full pl-4 pr-2 text-center cursor-pointer transition-all duration-150 text-neutral-300 flex"
      :class="{
        'invisible': props.readonly,
        'py-3.5': block.type === BlockType.H1,
        'py-3': block.type === BlockType.H2,
        'py-2.5': block.type === BlockType.H3,
        'py-1.5': ![BlockType.H1, BlockType.H2, BlockType.H3].includes(block.type),
      }">
      <Tooltip value="<span class='text-neutral-400'><span class='text-white'>Click</span> to delete block</span>">
        <v-icon name="hi-trash" @click="emit('deleteBlock')"
          class="w-6 h-6 hover:bg-neutral-100 hover:text-neutral-400 p-0.5 rounded group-hover:opacity-100 opacity-0" />
      </Tooltip>
      <Tooltip value="<span class='text-neutral-400'><span class='text-white'>Click</span> to add block below</span>">
        <v-icon name="hi-plus" @click="emit('newBlock')"
          class="w-6 h-6 hover:bg-neutral-100 hover:text-neutral-400 p-0.5 rounded group-hover:opacity-100 opacity-0" />
      </Tooltip>
      <BlockMenu ref="menu"
        @setBlockType="setBlockType"
        :blockTypes="props.block.details.blockTypes || props.blockTypes"
        />
    </div>
    <div class="w-full relative" :class="{ 'px-0': block.type !== BlockType.Divider }">
      <!-- Actual content -->
      <component :is="BlockComponents[props.block.type]" ref="content"
        :block="block" :readonly="props.readonly"
        @keydown.capture="keyDownHandler"
        @keyup="parseMarkdown" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, PropType } from 'vue'
import { Block, BlockType, BlockComponents, isTextBlock } from '@/utils/types'
import BlockMenu from './BlockMenu.vue'
import Tooltip from './elements/Tooltip.vue'

const props = defineProps({
  block: {
    type: Object as PropType<Block>,
    default: {
      type: BlockType.Text,
      details: {
        value: '<p>Hello World</p>',
      },
    },
  },
  blockTypes: {
    type: Object as PropType<null|(string|BlockType)[]>,
    default: null,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'deleteBlock',
  'newBlock',
  'moveToPrevChar',
  'moveToNextChar',
  'moveToPrevLine',
  'moveToNextLine',
  'merge',
  'split',
  'setBlockType',
])

function getFirstChild () {
  if (isTextBlock(props.block.type)) {
    if ((content.value as any).$el.firstChild.firstChild.childNodes.length > 1) {
      return (content.value as any).$el.firstChild.firstChild.firstChild
    } else {
      return (content.value as any).$el.firstChild.firstChild.firstChild
    }
  } else {
    if ((content.value as any).$el) return (content.value as any).$el.firstChild || content.value.$el
    else return (content.value as any).firstChild || content.value
  }
}

function getLastChild () {
  if (isTextBlock(props.block.type)) {
    if ((content.value as any).$el.firstChild.firstChild.childNodes.length > 1) {
      return (content.value as any).$el.firstChild.firstChild.lastChild
    } else {
      return (content.value as any).$el.firstChild.firstChild.firstChild
    }
  } else {
    if ((content.value as any).$el) return (content.value as any).$el.firstChild || content.value.$el
    else return (content.value as any).firstChild || content.value
  }
}

function getInnerContent () {
  if (isTextBlock(props.block.type)) {
    return (content.value as any).$el.firstChild.firstChild.firstChild
  } else {
    return (content.value as any).$el.firstChild
  }
}

function getTextContent () {
  const innerContent = getInnerContent()
  if (innerContent) return innerContent.parentElement ? innerContent.parentElement.textContent : innerContent.textContent
  else return ''
}

function getHtmlContent () {
  const innerContent = getInnerContent()
  if (innerContent) return innerContent.parentElement.innerHTML
  else return ''
}

function keyDownHandler (event:KeyboardEvent) {
  if (event.key === 'ArrowUp') {
    if (menu.value?.open) {
      event.preventDefault()
    }
    // If at first line, move to previous block
    else if (atFirstLine()) {
      event.preventDefault()
      emit('moveToPrevLine')
    }
  } else if (event.key === 'ArrowDown') {
    if (menu.value?.open) {
      event.preventDefault()
    }
    // If at last line, move to next block
    else if (atLastLine()) {
      event.preventDefault()
      emit('moveToNextLine')
    }
  } else if (event.key === 'ArrowLeft') {
    // If at first character, move to previous block
    if (atFirstChar()) {
      event.preventDefault()
      emit('moveToPrevChar')
    }
  } else if (event.key === 'ArrowRight') {
    // If at last character, move to next block
    if (atLastChar()) {
      event.preventDefault()
      emit('moveToNextChar')
    }
  } else if (event.key === 'Backspace' && highlightedLength() === 0) {
    if (!(menu.value && menu.value.open) && atFirstChar()) {
      event.preventDefault()
      emit('merge')
    }
  } else if (event.key === 'Enter') {
    event.preventDefault()
    if (!(menu.value && menu.value.open)) {
      emit('split')
    }
  }
}

function isContentBlock () {
  return [BlockType.Text, BlockType.Quote, BlockType.H1, BlockType.H2, BlockType.H3].includes(props.block.type)
}

const content = ref<any>(null)
const menu = ref<typeof BlockMenu|null>(null)

function atFirstChar () {
  const startCoord = getStartCoordinates()
  const coord = getCaretCoordinates()
  return coord?.x === startCoord.x && coord?.y === startCoord.y
}

function atLastChar () {
  const endCoord = getEndCoordinates()
  const coord = getCaretCoordinates()
  return coord?.x === endCoord.x && coord?.y === endCoord.y
}
function atFirstLine () {
  const startCoord = getStartCoordinates()
  const coord = getCaretCoordinates()
  return coord?.y === startCoord.y
}

function atLastLine () {
  const endCoord = getEndCoordinates()
  const coord = getCaretCoordinates()
  return coord?.y === endCoord.y
}

function highlightedLength () {
  return window.getSelection()?.toString().length
}

function moveToStart () {
  if (isContentBlock()) {
    const firstChild = getFirstChild()
    if (firstChild) {
      const selection = window.getSelection()
      const range = document.createRange()
      range.selectNodeContents(firstChild)
      range.collapse(true)
      selection?.removeAllRanges()
      selection?.addRange(range)
    } 
  } else {
    emit('moveToNextChar')
  }
}

function moveToEnd () {
  if (isContentBlock()) {
    const lastChild = getLastChild()
    if (lastChild) {
      const selection = window.getSelection()
      const range = document.createRange()
      range.selectNodeContents(lastChild)
      range.collapse()
      selection?.removeAllRanges()
      selection?.addRange(range)
    } 
  } else {
    emit('moveToPrevChar')
  }
}

async function moveToFirstLine () {
  if (isContentBlock()) {
    const textContent = getTextContent()
    if (!textContent) {
      moveToStart()
    } else {
      let prevCoord = getCaretCoordinates()
      let prevDist = 99999
      let caretPos = 1
      while (true) {
        setCaretPos(caretPos)
        const newCoord = getCaretCoordinates()
        const newDist = Math.abs((newCoord?.x as number) - (prevCoord?.x as number))
        if (newDist > prevDist) {
          if (caretPos > 0) setCaretPos(caretPos - 1)
          break
        } else if (caretPos === textContent.length || caretPos > 999) {
          // Reached end of line
          break
        } else {
          prevDist = newDist
          caretPos += 1
        }
      }
    } 
  } else {
    emit('moveToNextLine')
  }
}

async function moveToLastLine () {
  if (isContentBlock()) {
    const textContent = getTextContent()
    if (!textContent) {
      moveToStart()
    } else {
      let prevCoord = getCaretCoordinates()
      let prevDist = 99999
      let caretPos = textContent.length
      while (true) {
        setCaretPos(caretPos)
        const newCoord = getCaretCoordinates()
        const newDist = Math.abs((newCoord?.x as number) - (prevCoord?.x as number))
        if (newDist > prevDist) {
          if (caretPos < textContent.length) setCaretPos(caretPos + 1)
          break
        } else if (caretPos === 0) {
          // Reached start of line
          break
        } else {
          prevDist = newDist
          caretPos -= 1
        }
      }
    }
  } else {
    emit('moveToPrevLine')
  }
}

function getCaretCoordinates () {
  let x = 0, y = 0
  const selection = window.getSelection()
  if ((selection?.rangeCount as number) > 0) {
    const range = selection?.getRangeAt(0)
    if (range?.startContainer.firstChild) {
      const newRange = document.createRange()
      newRange.selectNodeContents(range.startContainer.firstChild)
      newRange.collapse(true)
      const rect = newRange.getBoundingClientRect()
      return rect
    }
    const rect = range?.getBoundingClientRect()
    return rect
  }
  return { x, y }
}

function getCaretPos () {
  const selection = window.getSelection()
  if (selection) {
  if (isTextBlock(props.block.type)) {
      let offsetNode, offset = 0, tag = null
      let selectedNode = selection.anchorNode
      if (['STRONG', 'EM'].includes(selectedNode?.parentElement?.tagName as string)) {
        selectedNode = selectedNode?.parentElement as Node
        tag = (selectedNode as HTMLElement).tagName.toLowerCase()
      }
      // Edge case when character length is 1
      if (selectedNode !== null && selectedNode.childNodes.length > 0) {
        if (selectedNode.childNodes[0].textContent && selectedNode.childNodes[0].textContent.length <= 1)
          selectedNode = selectedNode.childNodes[0];
      }
      for (const [i, node] of (content.value as any).$el.firstChild.firstChild.childNodes.entries()) {
        if (node === selectedNode) {
          offsetNode = node
          if (node.tagName) offset += 2 + node.tagName.length
          break
        }
        if (node.tagName) offset += node.outerHTML.length
        else offset += node.textContent.length
        offsetNode = node
      }
      return { pos: offset + selection.anchorOffset + (selectedNode?.parentElement?.tagName === 'P' ? 3 : 0), tag }
    } else {
      return { pos: selection.anchorOffset }
    }
  } else {
    return { pos: 0 }
  }
}

function getCaretPosWithoutTags () {
  const selection = window.getSelection()
  if (selection) {
  if (isTextBlock(props.block.type)) {
      let offsetNode, offset = 0, tag = null
      let selectedNode = selection.anchorNode
      if (['STRONG', 'EM'].includes(selectedNode?.parentElement?.tagName as string)) {
        selectedNode = selectedNode?.parentElement as Node
        tag = (selectedNode as HTMLElement).tagName.toLowerCase()
      }
      // Edge case when character length is 1
      if (selectedNode !== null && selectedNode.childNodes.length > 0) {
        if (selectedNode.childNodes[0].textContent && selectedNode.childNodes[0].textContent.length <= 1)
          selectedNode = selectedNode.childNodes[0];
      }
      for (const [i, node] of (content.value as any).$el.firstChild.firstChild.childNodes.entries()) {
        if (node === selectedNode) {
          offsetNode = node
          break
        }
        offset += node.textContent.length
        offsetNode = node
      }
      return { pos: offset + selection.anchorOffset, tag }
    } else {
      return { pos: selection.anchorOffset }
    }
  } else {
    return { pos: 0 }
  }
}

function setCaretPos (caretPos:number) {
  const innerContent = getInnerContent()
  if (innerContent) {
  if (isTextBlock(props.block.type)) {
      let offsetNode, offset = 0
      const numNodes = (content.value as any).$el.firstChild.firstChild.childNodes.length
      for (const [i, node] of (content.value as any).$el.firstChild.firstChild.childNodes.entries()) {
        if (offset + node.textContent.length > caretPos || i === numNodes - 1) {
          offsetNode = node
          break
        }
        offset += node.textContent.length
        offsetNode = node
      }
      const selection = window.getSelection()
      const range = document.createRange()
      range.setStart(offsetNode.firstChild || offsetNode, caretPos - offset)
      range.setEnd(offsetNode.firstChild || offsetNode, caretPos - offset)
      selection?.removeAllRanges()
      selection?.addRange(range)
    } else {
      const selection = window.getSelection()
      const range = document.createRange()
      range.setStart(innerContent, caretPos)
      range.setEnd(innerContent, caretPos)
      selection?.removeAllRanges()
      selection?.addRange(range)
    }
  }
}

function getStartCoordinates () {
  let x = 0, y = 0
  const firstChild = getFirstChild()
  if (firstChild) {
    const range = document.createRange()
    range.selectNodeContents(firstChild.firstChild || firstChild)
    range.collapse(true)
    const rect = range.getBoundingClientRect()
    x = rect.left
    y = rect.top
  }
  return { x, y }
}

function getEndCoordinates () {
  let x = 0, y = 0
  const lastChild = getLastChild()
  if (lastChild) {
    const range = document.createRange()
    range.selectNodeContents(lastChild.firstChild || lastChild)
    range.collapse()
    const rect = range.getBoundingClientRect()
    x = rect.left
    y = rect.top
  }
  return { x, y }
}

function parseMarkdown (event:KeyboardEvent) {
  const textContent = getTextContent()
  if(!textContent) return

  const markdownRegexpMap = {
    [BlockType.H1]: /^#\s(.*)$/,
    [BlockType.H2]: /^##\s(.*)$/,
    [BlockType.H3]: /^###\s(.*)$/,
    [BlockType.Quote]: /^>\s(.*)$/,
    [BlockType.Divider]: /^---$/
  }

  const handleMarkdownContent = (blockType: keyof typeof markdownRegexpMap) => {
    emit('setBlockType', blockType)
    const newContent = textContent.replace(markdownRegexpMap[blockType], '$1')
    ;(content.value as any).innerText = newContent
    props.block.details.value = newContent
  }


  if (textContent.match(markdownRegexpMap[BlockType.H1]) && event.key === ' ') {
    handleMarkdownContent(BlockType.H1)
  } else if (textContent.match(markdownRegexpMap[BlockType.H2]) && event.key === ' ') {
    handleMarkdownContent(BlockType.H2)
  } else if (textContent.match(markdownRegexpMap[BlockType.H3]) && event.key === ' ') {
    handleMarkdownContent(BlockType.H3)
  } else if (textContent.match(markdownRegexpMap[BlockType.Quote]) && event.key === ' ') {
    handleMarkdownContent(BlockType.Quote)
  } else if (textContent.match(markdownRegexpMap[BlockType.Divider])) {
    handleMarkdownContent(BlockType.Divider)
    props.block.details.value = ''
  } else if (event.key === '/') {
    if (menu.value && !menu.value.open) {
      menu.value.open = true
      menu.value.openedWithSlash = true
    }
  }
}

function setBlockType (blockType: BlockType, searchTermLength: number, openedWithSlash: boolean = false) {
  clearSearch(searchTermLength, blockType, openedWithSlash)
    .then(caretPos => {
      emit('setBlockType', blockType)
      setTimeout(() => {
        if (searchTermLength < 1 && !openedWithSlash) moveToEnd()
        else setCaretPos(caretPos)
      })
    })
}

async function clearSearch (searchTermLength: number, newBlockType: BlockType, openedWithSlash: boolean = false) {
  // If openedWithSlash, searchTermLength = 0 but we still need to clear
  const pos = getCaretPosWithoutTags().pos
  let startIdx = pos - searchTermLength - 1
  let endIdx = pos
  return new Promise<void>(resolve => {
    setTimeout(() => {
      const originalText = (content.value as any).$el.innerText
      if (!originalText) return
      props.block.details.value = originalText.substring(0, startIdx) + originalText.substring(endIdx);
      if (newBlockType === BlockType.Text) {
        props.block.details.value = `<p>${originalText.substring(0, startIdx) + originalText.substring(endIdx)}</p>`
      } else {
        (content.value as any).$el.innerText = originalText.substring(0, startIdx) + originalText.substring(endIdx)
      }
      resolve(startIdx)
    })
  })
}

defineExpose({
  content,
  getTextContent,
  getHtmlContent,
  moveToStart,
  moveToEnd,
  moveToFirstLine,
  moveToLastLine,
  getCaretPos,
  setCaretPos,
})
</script>
