<template>
  <div class="lotion w-[65ch] mx-auto my-24 font-sans text-base" v-if="props.page" ref="editor">
    <h1 id="title" :contenteditable="!props.readonly" spellcheck="false" data-ph="Untitled"
      @keydown.enter="$event.preventDefault()"
      @blur="props.page.name=($event.target as HTMLElement).innerText.replace('\n', '')"
      class="focus:outline-none focus-visible:outline-none text-5xl font-bold mb-12"
      :class="props.page.name ? '' : 'empty'">
      {{ props.page.name || '' }}
    </h1>
    <draggable tag="div" :list="props.page.blocks"  handle=".handle"
      v-bind="dragOptions" class="-ml-24 space-y-2 pb-4">
      <transition-group type="transition">
        <BlockComponent :block="block" v-for="block, i in props.page.blocks" :key="i" :id="'block-'+block.id"
          :blockTypes="props.blockTypes"
          :readonly="props.readonly"
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
import { ref, computed, onMounted, onBeforeUpdate, PropType } from 'vue'
import { VueDraggableNext as draggable } from 'vue-draggable-next'
import { Block, BlockType, isTextBlock } from '@/utils/types'
import BlockComponent from './Block.vue'
import { v4 as uuidv4 } from 'uuid';

const props = defineProps({
  page: {
    type: Object as PropType<{ name:string, blocks:Block[] }>,
    required: true,
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

const dragOptions = {
  animation: 150,
  group: 'blocks',
  disabled: false,
  ghostClass: 'ghost',
}

onBeforeUpdate(() => {
  blockElements.value = []
})

// const innerPage = ref<any>(null)
const blockElements = ref<typeof BlockComponent[]>([])
// const changed = computed(() => {
//   return JSON.stringify(innerPage.value) !== JSON.stringify(props.page)
// })

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
    id: uuidv4(),
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

async function setBlockType (blockIdx: number, type: BlockType) {
  if (blockElements.value[blockIdx].content.onUnset) {
    blockElements.value[blockIdx].content.onUnset()
  }
  props.page.blocks[blockIdx].details.value = blockElements.value[blockIdx].getTextContent()
  props.page.blocks[blockIdx].type = type
  if (type === BlockType.Divider) {
    props.page.blocks[blockIdx].details = {}
    insertBlock(blockIdx)
  } else setTimeout(() => {
    if (blockElements.value[blockIdx].content.onSet) {
      blockElements.value[blockIdx].content.onSet()
    } else {
      blockElements.value[blockIdx].moveToEnd()
    }
  })
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

  if (isTextBlock(props.page.blocks[blockIdx-1].type)) {
    const prevBlockContentLength = blockElements.value[blockIdx-1].getTextContent().length
    props.page.blocks[blockIdx-1].details.value = ('<p>' + (props.page.blocks[blockIdx-1] as any).details.value.replace('<p>', '').replace('</p>', '') + blockElements.value[blockIdx].getHtmlContent().replaceAll(/\<br.*?\>/g, '').replace('<p>', '').replace('</p>', '') + '</p>').replace('</strong><strong>', '').replace('</em><em>', '')
    setTimeout(() => {
      blockElements.value[blockIdx-1].setCaretPos(prevBlockContentLength)
      props.page.blocks.splice(blockIdx, 1)
    })
  } else if ([BlockType.H1, BlockType.H2, BlockType.H3].includes(props.page.blocks[blockIdx-1].type)) {
    const prevBlockContentLength = (props.page.blocks[blockIdx-1] as any).details.value.length
    props.page.blocks[blockIdx-1].details.value += blockElements.value[blockIdx].getTextContent()
    setTimeout(() => {
      blockElements.value[blockIdx-1].setCaretPos(prevBlockContentLength)
      props.page.blocks.splice(blockIdx, 1)
    })
  } else {
    props.page.blocks.splice(blockIdx-1, 1)
    setTimeout(() => blockElements.value[blockIdx-1].moveToStart())
  }
}

function split (blockIdx: number) {
  const caretPos = blockElements.value[blockIdx].getCaretPos()
  insertBlock(blockIdx)
  props.page.blocks[blockIdx+1].details.value = (caretPos.tag ? `<p><${caretPos.tag}>` : '<p>') + (props.page.blocks[blockIdx].details.value ? props.page.blocks[blockIdx].details.value?.slice(caretPos.pos) : '')
  if (isTextBlock(props.page.blocks[blockIdx].type)) {
    props.page.blocks[blockIdx].details.value = (props.page.blocks[blockIdx].details.value ? props.page.blocks[blockIdx].details.value?.slice(0, caretPos.pos) : '') + (caretPos.tag ? `</${caretPos.tag}></p>` : '</p>')
  } else {
    props.page.blocks[blockIdx].details.value = (props.page.blocks[blockIdx].details.value ? props.page.blocks[blockIdx].details.value?.slice(0, caretPos.pos) : '') + (caretPos.tag ? `</${caretPos.tag}></p>` : '')
  }
  setTimeout(() => blockElements.value[blockIdx+1].moveToStart())
}

// onMounted(() => {
//   innerPage.value = JSON.parse(JSON.stringify(props.page))
// })

// defineExpose({
//   changed,
//   innerPage,
// })
</script>
