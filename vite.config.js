import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/Project-alpha/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:4000',
      '/smart': 'http://localhost:4000',
    },
  },
})
