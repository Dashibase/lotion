<template>
  <div class="flex">
    <div class="sticky top-0 h-screen overflow-y-auto bg-neutral-50">
      <Markdown :page="page" />
    </div>
    <div class="shrink-0 px-24 min-w-[50%] mx-auto">
      <Lotion :page="page" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { BlockType } from '@/utils/types'
import Markdown from './Markdown.vue'
import Lotion from './Lotion.vue'

const page = ref({
  name: '🧴 Lotion',
  blocks:[{
    type: BlockType.H1,
    details: {
      value: 'Get Started'
    },
  }, {
    type: BlockType.Divider,
    details: {},
  }, {
    type: BlockType.Text,
    details: {
      value: '<p>👋 Welcome! This is a private page for you to play around with.</p>'
    },
  }, {
    type: BlockType.Text,
    details: {
      value: '<p>Give these things a try:</p>'
    },
  }, {
    type: BlockType.Text,
    details: {
      value: '<p>1. Hover on the left of each line for quick actions</p>'
    },
  }, {
    type: BlockType.Text,
    details: {
      value: '<p>2. Click on the + button to add a new line</p>'
    },
  }, {
    type: BlockType.Text,
    details: {
      value: '<p>3. Drag the ⋮⋮ button to reorder</p>'
    },
  }, {
    type: BlockType.Text,
    details: {
      value: '<p>4. Click the trash icon to delete this block</p>'
    },
  }, {
    type: BlockType.Text,
    details: {
      value: '<p>5. <strong>Bold</strong> and <em>italicize</em> using markdown e.g. *italic* or **bold**</p>'
    },
  }, {
    type: BlockType.Text,
    details: {
      value: '<p>6. Add headers and dividers with \'#\', \'##\' or \'---\' followed by a space</p>'
    },
  }, {
    type: BlockType.Text,
    details: {
      value: '<p>7. Type \'/\' for a menu to quickly switch blocks and search by typing</p>'
    },
  },]
})
</script>
