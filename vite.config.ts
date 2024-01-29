// vite.config.js
import { sveltekit } from '@sveltejs/kit/vite'
import UnoCSS from '@unocss/vite'
import extractorSvelte from '@unocss/extractor-svelte'
import { defineConfig } from 'vite'

/** @type {import('vite').UserConfig} */
export default defineConfig({
  plugins: [
    UnoCSS({
      extractors: [
        extractorSvelte(),
      ],
      /* more options */
    }),
    sveltekit(),
  ],
})
