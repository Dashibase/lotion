<!-- Adapted from https://tiptap.dev/installation/vue3 -->
<template>
  <editor-content :editor="editor" spellcheck="false" @keyup.enter.prevent="() => {}" />
</template>

<script setup lang="ts">
import { watch } from 'vue'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import History from '@tiptap/extension-history'
import { useEditor, EditorContent } from '@tiptap/vue-3'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

const editor = useEditor({
  extensions: [
    Document,
    Paragraph,
    Text,
    Bold,
    Italic,
    History,
  ],
  editorProps: { 
    // Removing default behavior for drop event
    handleDrop : () => true,
  },
  content: props.modelValue,
  onUpdate: () => {
    emit('update:modelValue', editor.value?.getHTML().replaceAll(/\<br.*?\>/g, ''))
  },
})

watch(() => props.modelValue, value => {
  const isSame = editor.value?.getHTML() === value
  if (isSame) {
    return
  }
  editor.value?.commands.setContent(value, false)
})
</script>
