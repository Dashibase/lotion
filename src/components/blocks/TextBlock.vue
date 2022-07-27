<template>
  <Editor v-model="props.block.details.value"
    class="py-1.5" />
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { Block } from '@/utils/types'
import Editor from '../elements/Editor.vue'

const props = defineProps({
  block: {
    type: Object as PropType<Block>,
    required: true,
  }
})
</script>
