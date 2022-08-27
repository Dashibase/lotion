<template>
  <Lotion :page="page" />
</template>
<script setup lang="ts">
import { ref } from 'vue'
import CustomBlock from './CustomBlock.vue'
import { addIcons } from "oh-vue-icons"
import { FaPumpSoap } from "oh-vue-icons/icons"
import { v4 as uuidv4 } from 'uuid'
import { Lotion, registerBlock } from '../src'

addIcons(FaPumpSoap)
registerBlock('LOTION', 'Moisturize', CustomBlock, 'fa-pump-soap')

const page = ref({
  name: '🧴 Lotion',
  blocks:[{
    id: uuidv4(),
    type: 'TEXT',
    details: {
      value: 'Hello, World!'
    },
  }],
})
</script>
