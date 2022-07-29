<template>
  <div ref="content"
    contenteditable spellcheck="false"
    @blur="props.block.details.value=content?.innerText"
    class="focus:outline-none focus-visible:outline-none w-full py-1.5 font-semibold"
    :class="sizeClass"
    :block-type="props.block.type"
    :data-ph="placeholder">
    {{ props.block.details.value }}
  </div>
</template>

<script setup lang="ts">
import { ref, computed, PropType } from 'vue'
import { Block, BlockType } from '@/utils/types'

const props = defineProps({
  block: {
    type: Object as PropType<Block>,
    required: true,
  },
})

const content = ref<HTMLDivElement>()

const placeholder = computed(() => {
  if (props.block.type === BlockType.H1) return 'Heading 1'
  else if (props.block.type === BlockType.H2) return 'Heading 2'
  else if (props.block.type === BlockType.H3) return 'Heading 3'
})

const sizeClass = computed(() => {
  if (props.block.type === BlockType.H1) return 'text-4xl'
  else if (props.block.type === BlockType.H2) return 'text-3xl'
  else if (props.block.type === BlockType.H3) return 'text-2xl'
})
</script>
