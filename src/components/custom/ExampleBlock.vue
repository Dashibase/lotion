<template>
  🧴
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { Block } from '@/utils/types'

const props = defineProps({
  block: {
    type: Object as PropType<Block>,
    required: true,
  },
})

function onSet () {
  props.block.details = {}
}

defineExpose({
  onSet,
})
</script>
