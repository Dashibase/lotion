<template>
  <div class="group flex w-full rounded"
    :class="{
      // Add top margin for headings
      'pt-12 first:pt-0': block.type === BlockType.H1,
      'pt-4 first:pt-0': block.type === BlockType.H2,
    }">
    <div class="h-full px-2 pl-4 py-1.5 text-center cursor-pointer transition-all duration-150 text-neutral-300 flex"
      :class="{
        'py-3.5': block.type === BlockType.H1,
        'py-3': block.type === BlockType.H2,
        'py-2.5': block.type === BlockType.H3,
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
        class="handle"
        @setBlockType="type => emit('setBlockType', type)"
        @clearSearch="clearSearch"
        />
    </div>
    <div class="w-full relative" :class="{ 'px-4 sm:px-0': block.type !== BlockType.Divider }">
      <!-- Actual content -->
      <component :is="BlockComponents[props.block.type]" ref="content"
        :block="block"
        @keydown.capture="keyDownHandler"
        @keyup="parseMarkdown" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, PropType } from 'vue'
import { Block, BlockType, BlockComponents } from '@/utils/types'
import BlockMenu from './BlockMenu.vue'
import Tooltip from './elements/Tooltip.vue'

const props = defineProps({
  block: {
    type: Object as PropType<Block>,
    default: {
      type: BlockType.Text,
      details: {},
    },
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
  if (props.block.type === BlockType.Text) {
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
  if (props.block.type === BlockType.Text) {
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
  if (props.block.type === BlockType.Text) {
    return (content.value as any).$el.firstChild.firstChild.firstChild
  } else {
    return (content.value as any).$el.firstChild;
  }
}

function getTextContent () {
  const innerContent = getInnerContent()
  if (innerContent) return innerContent.parentElement ? innerContent.parentElement.textContent : innerContent.textContent
}

function getHtmlContent () {
  const innerContent = getInnerContent()
  if (innerContent) return innerContent.parentElement.innerHTML
  else return ""
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
  return [BlockType.Text, BlockType.H1, BlockType.H2, BlockType.H3].includes(props.block.type)
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
    if (props.block.type === BlockType.Text) {
      let offsetNode, offset = 0, tag = null
      let selectedNode = selection.anchorNode
      if (['STRONG', 'EM'].includes(selectedNode?.parentElement?.tagName as string)) {
        selectedNode = selectedNode?.parentElement as Node
        tag = (selectedNode as HTMLElement).tagName.toLowerCase()
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
    if (props.block.type === BlockType.Text) {
      let offsetNode, offset = 0, tag = null
      let selectedNode = selection.anchorNode
      if (['STRONG', 'EM'].includes(selectedNode?.parentElement?.tagName as string)) {
        selectedNode = selectedNode?.parentElement as Node
        tag = (selectedNode as HTMLElement).tagName.toLowerCase()
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
    if (props.block.type === BlockType.Text) {
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

  const headingRegexpMap = {
    [BlockType.H1]: /^#\s(.*)$/,
    [BlockType.H2]: /^##\s(.*)$/,
    [BlockType.H3]: /^###\s(.*)$/,
  }
  const handleHeadingContent = (blockType: keyof typeof headingRegexpMap) => {
    emit('setBlockType', blockType)
    const newContent = textContent.replace(headingRegexpMap[blockType], '$1')
    ;(content.value as any).innerText = newContent
    props.block.details.value = newContent
  }

  if (textContent.match(headingRegexpMap[BlockType.H1]) && event.key === ' ') {
    handleHeadingContent(BlockType.H1)
  } else if (textContent.match(headingRegexpMap[BlockType.H2]) && event.key === ' ') {
    handleHeadingContent(BlockType.H2)
  } else if (textContent.match(headingRegexpMap[BlockType.H3]) && event.key === ' ') {
    handleHeadingContent(BlockType.H3)
  } else if (textContent.match(/^---$/)) {
    emit('setBlockType', BlockType.Divider);
    (content.value as any).innerText = ''
  } else if (event.key === '/') {
    if (menu.value && !menu.value.open) {
      menu.value.open = true
      menu.value.openedWithSlash = true
    }
  }
}

function clearSearch (searchTermLength: number) {
  if (searchTermLength <= 1)
    return
  const pos = getCaretPosWithoutTags().pos
  const startIdx = pos - searchTermLength - 1
  const endIdx = pos
  setTimeout(() => {
    const originalText = (content.value as any).$el.innerText
    props.block.details.value = originalText.substring(0, startIdx) + originalText.substring(endIdx);
    if (props.block.type === BlockType.Text) {
      props.block.details.value = `<p>${originalText.substring(0, startIdx) + originalText.substring(endIdx)}</p>`
    } else {
      (content.value as any).$el.innerText = originalText.substring(0, startIdx) + originalText.substring(endIdx)
    }
    setTimeout(() => setCaretPos(startIdx))
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
