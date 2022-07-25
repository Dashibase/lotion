<template>
  <editor-content :editor="editor" spellcheck="false" @keyup.enter="event => event.preventDefault()" />
</template>

<style>
[contenteditable='true']:focus-visible {
  outline: 2px solid transparent;
}
</style>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import History from '@tiptap/extension-history'
import { Editor, EditorContent } from '@tiptap/vue-3'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

const editor = ref<any>(null)

watch(props, newProps => {
    // HTML
    const isSame = editor.value?.getHTML() === newProps.modelValue
    // JSON
    // const isSame = JSON.stringify(this.editor.getJSON()) === JSON.stringify(value)

    if (isSame) {
      return
    }

    editor.value?.commands.setContent(newProps.modelValue, false)
  }
)

onMounted(() => {
  editor.value = new Editor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Bold,
      Italic,
      History,
    ],
    content: props.modelValue,
    onUpdate: () => {
      // HTML
      emit('update:modelValue', editor.value?.getHTML().replaceAll(/\<br.*?\>/g, ''))

      // JSON
      // this.$emit('update:modelValue', this.editor.getJSON())
    },
  })
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>
