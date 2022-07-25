<template>
  <div class="flex">
    <div class="sticky top-0 h-screen overflow-y-auto bg-neutral-50">
      <pre class="whitespace-pre-wrap p-10">
{{ JSON.stringify(markdownBlocks, null, 2) }}
      </pre>
    </div>
    <div class="shrink-0 px-24 min-w-[50%] mx-auto">
      <div class="w-[65ch] mx-auto my-24">
        <h1 id="title" contenteditable="true" spellcheck="false" data-ph="Untitled" @blur="title=($event.target as HTMLElement).innerText.replace('\n', '')"
          class="px-4 sm:px-0 focus:outline-none focus-visible:outline-none text-5xl font-bold mb-12"
          :class="title ? '' : 'empty'">
          {{ title || '' }}
        </h1>
        <!-- <h1 id="title" class="px-4 sm:px-0 focus:outline-none focus-visible:outline-none text-5xl font-bold mb-12" contenteditable="true" spellcheck="false"
          :class="store.title ? '' : 'empty'"
          @blur="updateTitle($event)"
          @keydown.enter="$event.preventDefault(); appendBlock(-1);"
          @keydown.down="moveToBlocks"
          data-ph="Untitled">
          {{ store.title || '' }}
        </h1> -->
        <draggable tag="div" :list="blocks"
          v-bind="dragOptions" class="-ml-24 space-y-2 pb-4">
          <transition-group type="transition" name="flip-list">
            <div class="list-group-item relative group flex rounded-lg"
              v-for="block, i in blocks" :key="i">
              <Block :block="block"
                :ref="el => blockElements[i] = (el as unknown as typeof Block)"
                @deleteBlock="blocks.splice(i, 1)"
                @newBlock="insertBlock(i)"
                @moveToPrevChar="() => { if (blockElements[i-1]) blockElements[i-1].moveToEnd(); scrollIntoView(); }"
                @moveToNextChar="() => { if (blockElements[i+1]) blockElements[i+1].moveToStart(); scrollIntoView(); }"
                @moveToPrevLine="() => { if (blockElements[i-1]) blockElements[i-1].moveToLastLine(); scrollIntoView(); }"
                @moveToNextLine="() => { if (blockElements[i+1]) blockElements[i+1].moveToFirstLine(); scrollIntoView(); }"
                @merge="merge(i)"
                @split="split(i)"
                @setBlockType="type => setBlockType(i, type)"
                />
            </div>
          </transition-group>
        </draggable>
      </div>
    </div>
  </div>
</template>

<style>
#title.empty[contenteditable='true']:before{
  content:attr(data-ph);
  color:#BBBBBB;
}
/* .flip-list-move {
  transition: transform 0.5s;
} */
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 1;
  background: #F5F5F5;
}
.list-group {
  min-height: 20px;
}
</style>

<script setup lang="ts">
import { ref, computed, onBeforeUpdate } from 'vue'
import { VueDraggableNext as draggable } from 'vue-draggable-next'
import { BlockType } from '@/utils/types'
import Block from './Block.vue'

const dragOptions = {
  animation: 150,
  group: 'description',
  disabled: false,
  ghostClass: 'ghost',
}

const title = ref('🧴 Lotion')
const blocks = ref([{
  type: BlockType.H1,
  details: {
    value: 'Get Started'
  },
}, {
  type: BlockType.Divider,
  details: {},
}, {
  type: BlockType.Text,
  details: {
    value: '<p>👋 Welcome! This is a private page for you to play around with.</p>'
  },
}, {
  type: BlockType.Text,
  details: {
    value: '<p>Give these things a try:</p>'
  },
}, {
  type: BlockType.Text,
  details: {
    value: '<p>1. Hover on the left of each line for quick actions</p>'
  },
}, {
  type: BlockType.Text,
  details: {
    value: '<p>2. Click on the + button to add a new line</p>'
  },
}, {
  type: BlockType.Text,
  details: {
    value: '<p>3. Drag the ⋮⋮ button to reorder</p>'
  },
}, {
  type: BlockType.Text,
  details: {
    value: '<p>4. Click the trash icon to delete this block</p>'
  },
}, {
  type: BlockType.Text,
  details: {
    value: '<p>5. <strong>Bold</strong> and <em>italicize</em> using markdown e.g. *italic* or **bold**</p>'
  },
}, {
  type: BlockType.Text,
  details: {
    value: '<p>6. Add headers and dividers with \'#\', \'##\' or \'---\' followed by a space</p>'
  },
}, {
  type: BlockType.Text,
  details: {
    value: '<p>7. Type \'/\' for a menu to quickly switch blocks and search by typing</p>'
  },
}, ] as {type: BlockType, details: any}[])

onBeforeUpdate(() => {
  blockElements.value = []
})

const blockElements = ref<typeof Block[]>([])

function test (i:number) {
  if (blockElements.value[i-1]) {
    blockElements.value[i-1].moveToLastLine();
    scrollIntoView();
  }
}

function scrollIntoView () {
  const selection = window.getSelection()
  if (selection?.anchorNode?.nodeType === Node.ELEMENT_NODE) {
    (selection?.anchorNode as HTMLElement).scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"})
  } else {
    (selection?.anchorNode?.parentElement as HTMLElement).scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"})
  }
}

function insertBlock (blockIdx: number) {
  blocks.value.splice(blockIdx + 1, 0, {
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

function setBlockType (blockIdx: number, type: BlockType) {
  if (blocks.value[blockIdx].type === BlockType.Text) {
    blocks.value[blockIdx].details.value = blockElements.value[blockIdx].getTextContent()
  }
  blocks.value[blockIdx].type = type
  if (type === BlockType.Divider) {
    blocks.value[blockIdx].details = {}
    insertBlock(blockIdx)
  } else setTimeout(() => blockElements.value[blockIdx].moveToEnd())
}

function merge (blockIdx: number) {
  if (blocks.value[blockIdx-1].type === BlockType.Text) {
    const prevBlockContentLength = blockElements.value[blockIdx-1].getTextContent().length
    blocks.value[blockIdx-1].details.value = ('<p>' + (blocks.value[blockIdx-1] as any).details.value.replace('<p>', '').replace('</p>', '') + blockElements.value[blockIdx].getHtmlContent().replace('<p>', '').replace('</p>', '') + '</p>').replace('</strong><strong>', '').replace('</em><em>', '')
    setTimeout(() => {
      blockElements.value[blockIdx-1].setCaretPos(prevBlockContentLength)
      blocks.value.splice(blockIdx, 1)
    })
  } else if ([BlockType.H1, BlockType.H2].includes(blocks.value[blockIdx-1].type)) {
    const prevBlockContentLength = (blocks.value[blockIdx-1] as any).details.value.length
    blocks.value[blockIdx-1].details.value += blockElements.value[blockIdx].getTextContent()
    setTimeout(() => {
      blockElements.value[blockIdx-1].setCaretPos(prevBlockContentLength)
      blocks.value.splice(blockIdx, 1)
    })
  } else {
    blocks.value.splice(blockIdx-1, 1)
    setTimeout(() => blockElements.value[blockIdx-1].moveToStart())
  }
}

function split (blockIdx: number) {
  const caretPos = blockElements.value[blockIdx].getCaretPos()
  insertBlock(blockIdx)
  blocks.value[blockIdx+1].details.value = (caretPos.tag ? `<p><${caretPos.tag}>` : '<p>') + blocks.value[blockIdx].details.value.slice(caretPos.pos)
  if (blocks.value[blockIdx].type === BlockType.Text) {
    blocks.value[blockIdx].details.value = blocks.value[blockIdx].details.value.slice(0, caretPos.pos) + (caretPos.tag ? `</${caretPos.tag}></p>` : '</p>')
  } else {
    blocks.value[blockIdx].details.value = blocks.value[blockIdx].details.value.slice(0, caretPos.pos) + (caretPos.tag ? `</${caretPos.tag}></p>` : '')
  }
  setTimeout(() => blockElements.value[blockIdx+1].moveToStart())
}

const markdownBlocks = computed(() => {
  return blocks.value.map(block => {
    if (block.type === BlockType.Text) {
      return {
        type: BlockType.Text,
        details: {
          value: block.details.value
            .replaceAll('<p>', '')
            .replaceAll('</p>', '')
            .replaceAll('<strong>', '**')
            .replaceAll('</strong>', '**')
            .replaceAll('<em>', '*')
            .replaceAll('</em>', '*')
            .replaceAll(/\<br.*?\>/g, '')
        }
      }
    } else {
      return block
    }
  })
})
</script>
