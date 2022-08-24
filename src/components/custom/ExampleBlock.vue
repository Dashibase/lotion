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

function onUnset () {
  props.block.details.value = 'Moisturized'
}

defineExpose({
  onSet,
  onUnset,
})
</script>
