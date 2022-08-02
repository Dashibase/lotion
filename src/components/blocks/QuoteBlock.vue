<template>
  <Editor
    v-model="props.block.details.value"
    class="py-1.5 border-l-3 border-black border-solid px-3"
  />
</template>

<script setup lang="ts">
import { PropType } from "vue";
import { Block } from "@/utils/types";
import Editor from "../elements/Editor.vue";

const props = defineProps({
  block: {
    type: Object as PropType<Block>,
    required: true,
  },
});
</script>
