<template>
  <div ref="content" :key="props.block.type"
    :contenteditable="!props.readonly" spellcheck="false"
    @blur="props.block.details.value=content?.innerText"
    class="focus:outline-none focus-visible:outline-none w-full py-1.5 font-semibold"
    :class="headingConfig[props.block.type]?.class"
    :block-type="props.block.type"
    :data-ph="headingConfig[props.block.type]?.placeholder">
    {{ props.block.details.value }}
  </div>
</template>

<script setup lang="ts">
import { ref, PropType } from 'vue'
import { Block, BlockType } from '@/utils/types'

const headingConfig = {
  [BlockType.H1]: {
    placeholder: 'Heading 1',
    class: 'text-4xl font-semibold',
  },
  [BlockType.H2]: {
    placeholder: 'Heading 2',
    class: 'text-3xl font-medium',
  },
  [BlockType.H3]: {
    placeholder: 'Heading 3',
    class: 'text-2xl font-medium',
  },
  // Irrelevant BlockTypes
  [BlockType.Text]: null,
  [BlockType.Divider]: null,
  [BlockType.Quote]: null,
}

const props = defineProps({
  block: {
    type: Object as PropType<Block>,
    required: true,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
})

const content = ref<HTMLDivElement>()

function onSet () {
  if (content.value && props.block.details.value) content.value.innerText = props.block.details.value
}

defineExpose({
  onSet,
})
</script>
