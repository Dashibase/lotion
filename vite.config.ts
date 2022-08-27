/// <reference types="vitest" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  if (mode === 'library') {
    return {
      resolve:{
        alias:{
          '@' : path.resolve(__dirname, './src')
        },
      },
      plugins: [vue()],
      build: {
        lib: {
          entry: path.resolve(__dirname, 'src/index.ts'),
          name: 'Lotion',
        },
        outDir: 'lib',
        rollupOptions: {
          external: ['vue'],
          output: {
            globals: {
              vue: 'Vue',
            },
          },
        },
      }
    }
  } else {
    return {
      resolve:{
        alias:{
          '@' : path.resolve(__dirname, './src')
        },
      },
      plugins: [vue()],
      test: {
        globals: true,
        exclude: [
          '**/node_modules/**',
          '**/dist/**',
          '**/cypress/**',
          '**/.{idea,git,cache,output,temp}/**',
          // Run e2e with Playwright
          './tests/e2e/**',
        ],
        environment: 'happy-dom',
      },
    }
  }
})
