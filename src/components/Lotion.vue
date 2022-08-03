<template>
  <div class="w-[65ch] mx-auto my-24">
    <h1 id="title" contenteditable="true" spellcheck="false" data-ph="Untitled" @blur="props.page.name=($event.target as HTMLElement).innerText.replace('\n', '')"
      class="px-4 sm:px-0 focus:outline-none focus-visible:outline-none text-5xl font-bold mb-12"
      :class="props.page.name ? '' : 'empty'">
      {{ props.page.name || '' }}
    </h1>
    <draggable tag="div" :list="props.page.blocks"  handle=".handle"
      v-bind="dragOptions" class="-ml-24 space-y-2 pb-4">
      <transition-group type="transition">
        <BlockComponent :block="block" v-for="block, i in props.page.blocks" :key="i"
          :ref="el => blockElements[i] = (el as unknown as typeof Block)"
          @deleteBlock="deleteBlock(i)"
          @newBlock="insertBlock(i)"
          @moveToPrevChar="() => { if (blockElements[i-1]) blockElements[i-1].moveToEnd(); scrollIntoView(); }"
          @moveToNextChar="() => { if (blockElements[i+1]) blockElements[i+1].moveToStart(); scrollIntoView(); }"
          @moveToPrevLine="() => { if (blockElements[i-1]) blockElements[i-1].moveToLastLine(); scrollIntoView(); }"
          @moveToNextLine="() => { if (blockElements[i+1]) blockElements[i+1].moveToFirstLine(); scrollIntoView(); }"
          @merge="merge(i)"
          @split="split(i)"
          @setBlockType="type => setBlockType(i, type)"
          />
      </transition-group>
    </draggable>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUpdate, PropType, nextTick } from 'vue'
import { VueDraggableNext as draggable } from 'vue-draggable-next'
import { Block, BlockType, blockTagMap } from '@/utils/types'
import BlockComponent from './Block.vue'

const props = defineProps({
  page: {
    type: Object as PropType<{ name:string, blocks:Block[] }>,
    required: true,
  }
})

const dragOptions = {
  animation: 150,
  group: 'blocks',
  disabled: false,
  ghostClass: 'ghost',
}

onBeforeUpdate(() => {
  blockElements.value = []
})

const blockElements = ref<typeof BlockComponent[]>([])

function scrollIntoView () {
  const selection = window.getSelection()
  if (selection?.anchorNode?.nodeType === Node.ELEMENT_NODE) {
    (selection?.anchorNode as HTMLElement).scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"})
  } else {
    (selection?.anchorNode?.parentElement as HTMLElement).scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"})
  }
}

function insertBlock (blockIdx: number) {
  props.page.blocks.splice(blockIdx + 1, 0, {
    type: BlockType.Text,
    details: {
      value: '',
    },
  })
  setTimeout(() => {
    blockElements.value[blockIdx+1].moveToStart()
    scrollIntoView()
  })
}

function deleteBlock (blockIdx: number) {
  props.page.blocks.splice(blockIdx, 1)
  // Always keep at least one block
  if (props.page.blocks.length === 0) {
    insertBlock(0)
  }
}

function setBlockType (blockIdx: number, type: BlockType) {
  if (props.page.blocks[blockIdx].type === BlockType.Text || props.page.blocks[blockIdx].type === BlockType.Quote) {
    props.page.blocks[blockIdx].details.value = blockElements.value[blockIdx].getTextContent()
  }
  props.page.blocks[blockIdx].type = type
  if (type === BlockType.Divider) {
    props.page.blocks[blockIdx].details = {}
    insertBlock(blockIdx)
  } else setTimeout(() => blockElements.value[blockIdx].moveToEnd())
}

function merge (blockIdx: number) {
  // When deleting the first character of non-text block
  // the block should first turn into a text block
  if([BlockType.H1, BlockType.H2, BlockType.H3,BlockType.Quote]
      .includes(props.page.blocks[blockIdx].type)){
    setBlockType(blockIdx, BlockType.Text)
    setTimeout(()=>{
      blockElements.value[blockIdx].moveToStart()
    })
    return
  }

  if (blockIdx === 0) return

  if (props.page.blocks[blockIdx-1].type === BlockType.Text || props.page.blocks[blockIdx-1].type === BlockType.Quote) {
    const prevBlockContentLength = blockElements.value[blockIdx-1].getTextContent().length
    props.page.blocks[blockIdx-1].details.value = replaceTag(
      (removeTag(props.page.blocks[blockIdx-1].details.value) + removeTag(blockElements.value[blockIdx].getHtmlContent())).replace('</strong><strong>', '').replace('</em><em>', ''),
      blockTagMap[props.page.blocks[blockIdx-1].type],
    )
    
    nextTick(() => {
      blockElements.value[blockIdx-1].setCaretPos(prevBlockContentLength)
      props.page.blocks.splice(blockIdx, 1)
    })
  } else if (props.page.blocks[blockIdx-1].type === BlockType.H1) {
    const prevBlockContentLength = blockElements.value[blockIdx-1].getTextContent().length
    props.page.blocks[blockIdx-1].details.value = replaceTag(
      removeTag(props.page.blocks[blockIdx-1].details.value) + blockElements.value[blockIdx].getTextContent(),
      blockTagMap[props.page.blocks[blockIdx-1].type],
    )
    nextTick(() => {
      blockElements.value[blockIdx-1].setCaretPos(prevBlockContentLength)
      props.page.blocks.splice(blockIdx, 1)
    })
  } else if ([BlockType.H2, BlockType.H3].includes(props.page.blocks[blockIdx-1].type)) {
    const prevBlockContentLength = (props.page.blocks[blockIdx-1] as any).details.value.length
    props.page.blocks[blockIdx-1].details.value += blockElements.value[blockIdx].getTextContent()
    nextTick(() => {
      blockElements.value[blockIdx-1].setCaretPos(prevBlockContentLength)
      props.page.blocks.splice(blockIdx, 1)
    })
  } else {
    props.page.blocks.splice(blockIdx-1, 1)
    nextTick(() => blockElements.value[blockIdx-1].moveToStart())
  }
}

function split (blockIdx: number) {
  const caretPos = blockElements.value[blockIdx].getCaretPos()
  insertBlock(blockIdx)
  const [prevContent, nextContent] = splitContentByIndex(props.page.blocks[blockIdx].details.value, caretPos.pos)

  props.page.blocks[blockIdx+1].details.value = replaceTag(caretPos.tag ? `<${caretPos.tag}>${nextContent}` : nextContent, 'p')

  props.page.blocks[blockIdx].details.value = replaceTag(caretPos.tag ? `${prevContent}</${caretPos.tag}>` : prevContent, blockTagMap[props.page.blocks[blockIdx].type])

  nextTick(() => blockElements.value[blockIdx+1].moveToStart())
}


function splitContentByIndex(content: string | undefined, index: number) {
  if (!content) return ['', '']
  return [content.slice(0, index), content.slice(index)];
}

function removeTag(content: string | undefined) {
  if (!content) return ''
  return content.replace(/^<(p|h[123])>/, '').replace(/<\/(p|h[123])>$/, '')
}

function replaceTag(content: string, tag: string) {
  const text = removeTag(content)

  if (!tag) return text
  return `<${tag}>${text}</${tag}>`
}
</script>
