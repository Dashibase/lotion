<template>
  <div>
    🧴
  </div>
</template>
<script setup lang="ts">
import { PropType } from 'vue'
import { types } from '../src'

const props = defineProps({
  block: {
    type: Object as PropType<types.Block>,
    required: true,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
})

// This is triggered when a user converts any block into this block
// It is called before the blocktype is changed
function onSet () {
  alert('Moisturizing...')
}

// This is triggered when a user converts this block into any other block
// It is called before the blocktype is changed
function onUnset () {
  alert('Moisturized!')
}

defineExpose({
  onSet,
  onUnset,
})
</script>
