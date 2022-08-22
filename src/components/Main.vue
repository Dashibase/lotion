<template>
  <div class="flex">
    <div class="sticky top-0 h-screen overflow-y-auto bg-neutral-50">
      <Markdown :page="page" />
    </div>
    <div class="shrink-0 px-24 min-w-[50%] mx-auto box-border">
      <Lotion :page="page" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { BlockType } from '@/utils/types'
import Markdown from './Markdown.vue'
import Lotion from './Lotion.vue'
import { v4 as uuidv4 } from 'uuid';

// Example of how to add a custom block
// A "Moisturize" option should appear in the menu
import { FaPumpSoap } from "oh-vue-icons/icons"
import { addIcons } from "oh-vue-icons"
import { registerBlock } from '@/utils/utils'
import ExampleBlock from './custom/ExampleBlock.vue'
addIcons(FaPumpSoap)
registerBlock('LOTION', 'Moisturize', ExampleBlock, 'fa-pump-soap')

const page = ref({
  name: '🧴 Lotion',
  blocks:[{
    id: uuidv4(),
    type: BlockType.H1,
    details: {
      value: 'Get Started'
    },
  }, {
    id: uuidv4(),
    type: BlockType.Divider,
    details: {},
  }, {
    id: uuidv4(),
    type: BlockType.Text,
    details: {
      value: '<p>👋 Welcome! This is a private page for you to play around with.</p>'
    },
  }, {
    id: uuidv4(),
    type: BlockType.Text,
    details: {
      value: '<p>Give these things a try:</p>'
    },
  }, {
    id: uuidv4(),
    type: BlockType.Text,
    details: {
      value: '<p>1. Hover on the left of each line for quick actions</p>'
    },
  }, {
    id: uuidv4(),
    type: BlockType.Text,
    details: {
      value: '<p>2. Click on the + button to add a new line</p>'
    },
  }, {
    id: uuidv4(),
    type: BlockType.Text,
    details: {
      value: '<p>3. Drag the ⋮⋮ button to reorder</p>'
    },
  }, {
    id: uuidv4(),
    type: BlockType.Text,
    details: {
      value: '<p>4. Click the trash icon to delete this block</p>'
    },
  }, {
    id: uuidv4(),
    type: BlockType.Text,
    details: {
      value: '<p>5. <strong>Bold</strong> and <em>italicize</em> using markdown e.g. *italic* or **bold**</p>'
    },
  }, {
    id: uuidv4(),
    type: BlockType.Text,
    details: {
      value: '<p>6. Add headers and dividers with \'#\', \'##\' or \'---\' followed by a space</p>'
    },
  }, {
    id: uuidv4(),
    type: BlockType.Text,
    details: {
      value: '<p>7. Type \'/\' for a menu to quickly switch blocks and search by typing</p>'
    },
  },]
})
</script>
