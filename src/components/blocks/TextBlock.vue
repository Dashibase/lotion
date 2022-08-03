<template>
  <Editor v-model="props.block.details.value"
    class="py-1.5 "
    :class="textConfig[props.block.type]?.class"
  />
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { Block, BlockType } from '@/utils/types'
import Editor from '../elements/Editor.vue'

const props = defineProps({
  block: {
    type: Object as PropType<Block>,
    required: true,
  }
})

const textConfig = {
  [BlockType.Text]: {
    class: '',
  },
  [BlockType.H1]: {
    class: 'text-4xl font-semibold',
  },
  [BlockType.H2]: {
    class: 'text-3xl font-medium',
  },
  [BlockType.H3]: {
    class: 'text-2xl font-medium',
  },
  // Irrelevant BlockTypes
  [BlockType.Divider]: null,
  [BlockType.Quote]: null,
}
</script>
