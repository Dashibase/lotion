<template>
  <div class="relative group-tooltip">
    <slot></slot>
    <div class="z-10 absolute translate-y-2 left-1/2 -translate-x-1/2 w-max text-white bg-neutral-800 text-sm font-medium px-2 py-1 rounded opacity-0 pointer-events-none transition duration-150 group-tooltip-hover:delay-500"
      :class="disabled ? 'delay-75' : 'group-tooltip-hover:opacity-100'" v-html="props.value"></div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  value: {
    type: String,
    default: 'Hello World',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
</script>