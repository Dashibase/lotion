<!-- Adapted from https://tiptap.dev/installation/vue3 -->
<template>
  <editor-content :editor="editor" spellcheck="false" @keyup.enter.prevent="() => {}" />
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import History from '@tiptap/extension-history'
import Placeholder from '@tiptap/extension-placeholder'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import { markdownToHtml, htmlToMarkdown } from '@/utils/utils'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

const value = computed({
  get () {
    const mdValue = props.modelValue
    if (mdValue) {
      return markdownToHtml(mdValue)
    } else {
      return '<p></p>'
    }
  },
  set (newValue) {
    emit('update:modelValue', newValue)
  },
})

const editor = useEditor({
  extensions: [
    Document,
    Paragraph,
    Text,
    Bold,
    Italic,
    History,
    Placeholder.configure({
      placeholder: 'Type \'/\' for a menu'
    })
  ],
  editorProps: { 
    // Removing default behavior for drop event
    handleDrop : () => true,
  },
  content: value.value,
  onUpdate: () => {
    value.value = htmlToMarkdown(editor.value?.getHTML().replaceAll(/\<br.*?\>/g, '') || '')
  },
})

watch(() => props.modelValue, value => {
  const isSame = htmlToMarkdown(editor.value?.getHTML().replaceAll(/\<br.*?\>/g, '') || '') === value
  if (isSame) return
  editor.value?.commands.setContent(markdownToHtml(value), false)
})
</script>
