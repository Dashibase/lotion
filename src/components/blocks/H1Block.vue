<template>
  <div ref="content"
    contenteditable spellcheck="false"
    @blur="props.block.details.value=content?.innerText"
    class="focus:outline-none focus-visible:outline-none w-full py-1.5 text-4xl font-semibold"
    :block-type="props.block.type"
    data-ph="Heading 1">
    {{ props.block.details.value }}
  </div>
</template>

<script setup lang="ts">
import { ref, PropType } from 'vue'
import { Block } from '@/utils/types'

const props = defineProps({
  block: {
    type: Object as PropType<Block>,
    required: true,
  },
})

const content = ref<HTMLDivElement|null>(null)
</script>
