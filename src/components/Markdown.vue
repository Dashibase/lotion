<template>
  <pre class="whitespace-pre-wrap p-10">
{{ JSON.stringify(markdownBlocks, null, 2) }}
  </pre>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue'
import { Block, BlockType } from '@/utils/types'

const props = defineProps({
  page: {
    type: Object as PropType<{ name:string, blocks:Block[] }>,
    required: true,
  }
})

const markdownBlocks = computed(() => {
  return props.page.blocks.map(block => {
    if (block.type === BlockType.Text || block.type === BlockType.Quote) {
      return {
        type: block.type,
        details: {
          value: (block.details.value as string)
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
