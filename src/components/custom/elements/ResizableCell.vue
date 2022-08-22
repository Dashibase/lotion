<!-- Resizable cell whose width can be adjusted by clicking and dragging the right edge -->
<template>
  <div ref="container" class="flex justify-between min-w-min" :style="{ width }" @click="focus">
    <div ref="content" class="px-4 py-3">
      <slot />
    </div>
    <div ref="handle"
      class="shrink-0 -mr-1 w-2 z-10 h-full bg-[#FF00FF] cursor-col-resize opacity-0 hover:opacity-100 transition duration-300"
      :class="resizing ? 'opacity-100' : ''">
      &nbsp;
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  initialWidth: {
    type: Number,
    default: 100,
  }
})

const emit = defineEmits(['updateWidth'])

document.addEventListener("selectstart", event => {
  if (resizing.value) {
    event.preventDefault()
    event.stopPropagation()
  }
})

watch(props, newProps => {
  width.value = `${newProps.initialWidth}px`
})

const width = ref(`${props.initialWidth}px`)
const minWidth = ref(0)
const container = ref<any>(null)
const content = ref<any>(null)
const handle = ref<any>(null)
const resizing = ref(false)

function initResize(e:any) {
  e.preventDefault()
  e.stopPropagation()
  window.addEventListener('mousemove', resize, false);
  window.addEventListener('mouseup', stopResize, false);
  resizing.value = true
}

function resize(e:any) {
  e.preventDefault()
  e.stopPropagation()
  const padding = 5 // for handle
  width.value = Math.max(minWidth.value + padding, (e.clientX - container.value.getBoundingClientRect().left)) + 'px'
  setTimeout(() => {
    width.value = container.value.clientWidth + 'px'
    emit('updateWidth', container.value.clientWidth)
  })
  
}

function stopResize(e:any) {
  e.preventDefault()
  e.stopPropagation()
  window.removeEventListener('mousemove', resize, false);
  window.removeEventListener('mouseup', stopResize, false);
  resizing.value = false
}

function focus (e:Event) {
  const range = document.createRange()
  range.selectNodeContents(content.value.firstElementChild.firstElementChild)
  range.collapse()
  const selection = window.getSelection()
  selection?.removeAllRanges()
  selection?.addRange(range)
}

onMounted(() => {
  if (handle.value) {
    handle.value.addEventListener('mousedown', initResize, false)
  }
  if (content.value) {
    minWidth.value = content.value.clientWidth
  }
})

</script>
