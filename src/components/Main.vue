<template>
  <div class="fixed bottom-4 right-4 bg-neutral-800 font-sans text-white px-4 rounded-lg py-2">
    <input type="checkbox" v-model="readonly" class="mr-2" />
    <label for="checkbox">Read-only</label>
  </div>
  <div class="flex">
    <div class="sticky top-0 h-screen overflow-y-auto bg-neutral-50">
      <Markdown :page="page" />
    </div>
    <div class="shrink-0 px-24 min-w-[50%] mx-auto box-border">
      <Lotion :page="page" :readonly="readonly" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { BlockType } from '@/utils/types'
import Markdown from './Markdown.vue'
import Lotion from './Lotion.vue'
import { v4 as uuidv4 } from 'uuid'

const readonly = ref(false)

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
      value: '👋 Welcome! This is a private page for you to play around with.'
    },
  }, {
    id: uuidv4(),
    type: BlockType.Text,
    details: {
      value: 'Give these things a try:'
    },
  }, {
    id: uuidv4(),
    type: BlockType.Text,
    details: {
      value: '1. Hover on the left of each line for quick actions'
    },
  }, {
    id: uuidv4(),
    type: BlockType.Text,
    details: {
      value: '2. Click on the + button to add a new line'
    },
  }, {
    id: uuidv4(),
    type: BlockType.Text,
    details: {
      value: '3. Drag the ⋮⋮ button to reorder'
    },
  }, {
    id: uuidv4(),
    type: BlockType.Text,
    details: {
      value: '4. Click the trash icon to delete this block'
    },
  }, {
    id: uuidv4(),
    type: BlockType.Text,
    details: {
      value: '5. **Bold** and *italicize* using markdown e.g. \\*\\*bold\\*\\* and \\*italics\\*'
    },
  }, {
    id: uuidv4(),
    type: BlockType.Text,
    details: {
      value: '6. Add headers and dividers with \'#\', \'##\' or \'---\' followed by a space'
    },
  }, {
    id: uuidv4(),
    type: BlockType.Text,
    details: {
      value: '7. Type \'/\' for a menu to quickly switch blocks and search by typing'
    },
  },]
})
</script>
