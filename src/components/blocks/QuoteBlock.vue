<template>
  <Editor v-if="!props.readonly"
    v-model="props.block.details.value"
    class="py-1.5 border-l-3 border-black border-solid px-3"
  />
  <div v-else v-html="markdownToHtml(props.block.details.value)"
    class="py-1.5 border-l-3 border-black border-solid px-3"></div>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import { Block } from "@/utils/types"
import { markdownToHtml } from '@/utils/utils'
import Editor from "../elements/Editor.vue"

const props = defineProps({
  block: {
    type: Object as PropType<Block>,
    required: true,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
});
</script>
