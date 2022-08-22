<template>
  <div class="text-black group w-full">
    <div class="overflow-x-auto pl-2 -ml-2 pb-2 w-full">
      <div class="divide-y w-max border border-black border-2 rounded-md overflow-hidden">
        <!-- Headings -->
        <div class="flex text-white font-semibold bg-black border-b border-b-1 border-black">
          <ResizableCell v-for="col, i in props.columns" :key="i"
            :initialWidth="col.width"
            @updateWidth="value => updateWidth(col.id, value)"
            class="hover:bg-neutral-800"
            :class="col.visible ? '' : 'hidden'">
            <div class="flex gap-2 items-center justify-between">
              <div class="focus:outline-none focus-active:outline-none">
                {{ col.label }}
              </div>
            </div>
          </ResizableCell>
        </div>
        <!-- Rows -->
        <div v-if="data.length" class="divide-y divide-black max-h-[500px] overflow-y-auto">
          <div v-for="row in data" class="flex">
            <div v-for="col, i in props.columns.filter(col => col.visible)" :style="{ width: col.width + 'px' }"
              class="px-4 py-3 truncate" :class="i === 0 ? 'font-semibold cursor-pointer' : ''" @click="i === 0 ? emit('select', row) : null">
              {{ row[col.id] }}
            </div>
          </div>
        </div>
        <div v-else class="px-3 py-1 text-neutral-400">
          No rows found
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, PropType } from 'vue'
// import { Column } from '@/utils/types'
import ResizableCell from './ResizableCell.vue'

const props = defineProps({
  columns: {
    type: Object as PropType<any[]>,
    required: true,
  },
  data: {
    type: Object as PropType<any[]>,
    default: [],
  }
})

const emit = defineEmits(['updateTitle', 'select'])

const optionsWidth = ref(40)
const tableWidth = ref(100)
const header = ref<any>(null)

const maxWidth = ref(100)

function updateWidth (column:string, width:string) {
  const updateColumn = props.columns.find(c => c.id === column)
  if (updateColumn) updateColumn.width = parseInt(width)
  let totalWidth = 0
  props.columns
    .filter(col => col.visible)
    .forEach(col => {
      totalWidth += col.width
    })
  optionsWidth.value = Math.max(40, 650 - totalWidth)
}

watch(props, newProps => {
  let totalWidth = 0
  newProps.columns
    .filter(col => col.visible)
    .forEach(col => {
      totalWidth += col.width
    })
  optionsWidth.value = Math.max(40, 650 - totalWidth)
  tableWidth.value = totalWidth + 5
})

watch(header, newHeader => {
  maxWidth.value = newHeader.clientWidth
})

onMounted(() => {
  if (header.value) {
    maxWidth.value = header.value.clientWidth
    let totalWidth = 0
    if (props.columns.every(col => col.width === 0)) {
      props.columns
        .filter(col => col.visible)
        .forEach(col => {
          col.width = Math.max(100, Math.floor((header.value.clientWidth - 10) / props.columns.length))
          totalWidth += Math.max(100, Math.floor((header.value.clientWidth - 10) / props.columns.length))
        })
    }
    tableWidth.value = totalWidth + 5
  }
})
</script>
