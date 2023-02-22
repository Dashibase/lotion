<template>
  <div class="w-full py-0 h-[1px] bg-neutral-300 mt-5"></div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { Block } from '@/utils/types'

defineProps({
  block: {
    type: Object as PropType<Block>,
    required: true,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
})
</script>
