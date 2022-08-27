<h1 align="center"><b>🧴 Lotion</b></h1>
<p align="center">
  An open-source Notion UI built with Vue 3.
</p>
<p align="center">
  <a href="https://lotion.dashibase.com" target="_blank">Try demo</a>
</p>
<p align="center">
  <a href="https://twitter.com/dashibase">
    <img src="https://img.shields.io/badge/Twitter-00acee?logo=twitter&logoColor=white" />
  </a>
  <a href="https://discord.gg/CqgZGh4ZA8">
    <img src="https://img.shields.io/badge/Discord-5865F2?logo=discord&logoColor=white" />
  </a>
  <img src="https://img.shields.io/github/license/dashibase/lotion" />
  <br />
</p>

> We shared about Lotion and recreating the Notion UI during [CityJS Singapore's pre-conference meetup on 27th July](https://twitter.com/dashibase/status/1554070309224861696?s=20&t=f9pkIgoxYUCgAL5tRTxK4Q)!

<p align="center">
  <img src="https://github.com/Dashibase/lotion/blob/main/assets/lotion.png" style="border-radius: 10px;" />
</p>

## Features

- [x] Block-based editor
- [x] Drag to reorder blocks
- [x] Basic Markdown-parsing including bold, italic, headings and divider
- [x] Type '/' for command menu and shortcuts
- [x] Register your own blocks
- [x] Read-only mode

## Getting Started

**1. Install package**

```bash
npm i @dashibase/lotion
```

**2. Basic Lotion editor**

The following Vue component will initialize a basic Lotion editor.

```javascript
<template>
  <Lotion :page="page" />
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { Lotion, registerBlock } from '@dashibase/lotion'

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
```

**3. Create custom components**

See `examples/CustomBlock.vue` for an example of a custom block.

The custom block component can accept the following props:
- `block`: A `Block` object. See `src/utils/types.ts` for details.
- `readonly`: A boolean, which sets whether the block/editor is in read-only mode.

The custom block component can also optionally expose the following methods (remember to call `defineExpose`):
- `onSet`: This is triggered when a user converts any block into this blocktype. It is called before the blocktype is changed.
- `onUnset`: This is triggered when a user converts this block into any blocktype. It is called before the blocktype is changed.

```javascript
<template>
  <div>
    🧴
  </div>
</template>
<script setup lang="ts">
import { PropType } from 'vue'
import { types } from '../src'

const props = defineProps({
  block: {
    type: Object as PropType<types.Block>,
    required: true,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
})

function onSet () {
  alert('Moisturizing...')
}

function onUnset () {
  alert('Moisturized!')
}

defineExpose({
  onSet,
  onUnset,
})
</script>

```

**4. Register custom components**

See `examples/Example.vue` for an example of registering a custom block.

After creating the custom component, register it as follows:

```javascript
import CustomBlock from './CustomBlock.vue'
import { addIcons } from "oh-vue-icons"
import { FaPumpSoap } from "oh-vue-icons/icons"
import { registerBlock } from '@dashibase/lotion'

// Add the icon (from oh-vue-icons.js.org/)
addIcons(FaPumpSoap)
// Register the block
// registerBlock('<BLOCK_TYPE_ID>', '<BLOCK_TYPE_LABEL>', <BLOCK_COMPONENT>, 'BLOCK_ICON')
registerBlock('LOTION', 'Moisturize', CustomBlock, 'fa-pump-soap')
</script>
```

After that, you should be able to see the custom block when the user opens the menu to switch to different blocks.

## Contributing

**1. Clone this repository, go to the root directory and install packages**

```bash
git clone https://github.com/dashibase/lotion
cd lotion
npm i
```

**2. Run dev**

```bash
npm run dev
```

If you head to http://localhost:5173 on your browser, you should see what looks like the screenshot above.

**3. Contribute!**

Lotion is quite limited for now but we hope it serves as a good starting point for other folks looking to build their own editors.

We would love to make Lotion more extensible and welcome any suggestions or contributions!

See CONTRIBUTING.md for details.

## Acknowledgements

This was made much easier with the following libraries and frameworks, thank you!

- [vue-draggable-next](https://github.com/anish2690/vue-draggable-next)
- [tiptap](https://tiptap.dev/) and [ProseMirror](https://prosemirror.net/)
- [Vue 3](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Headless UI](https://headlessui.dev/)
- [Oh, Vue Icons!](https://oh-vue-icons.js.org/)
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)
