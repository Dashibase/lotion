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
})

function onSet () {
  alert('Moisturizing...')
}

function onUnset () {
  alert('Moisturized!')
}

defineExpose({
  onSet,
  onUnset,
})
</script>
