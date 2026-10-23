import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  base: process.env.NODE_ENV === 'production'
    ? '/zg-library-week12/'
    : '/',
  plugins: [vue()],
})
