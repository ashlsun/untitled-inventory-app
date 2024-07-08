import { defineConfig } from 'vitest/config'
import { sveltekit } from '@sveltejs/kit/vite'
import { svelteTesting } from '@testing-library/svelte/vite'

export default defineConfig({
  plugins: [
    sveltekit(),
    svelteTesting(),
  ],
  optimizeDeps: {
    exclude: ['@electric-sql/pglite'],
  },
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      enabled: true,
    },
    reporters: ['html', 'default'],
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },
  // build: {
  //   commonjsOptions: {
  //     include: [/@electric-sql\/pglite/, /node_modules/],
  //   },
  // },
  // server: {
  //   fs: {
  //     allow: ['..'],
  //   },
  // },
  // resolve: {
  //   alias: {
  //     '@electric-sql/pglite': '@electric-sql/pglite/dist/index.js',
  //   },
  // },
})
