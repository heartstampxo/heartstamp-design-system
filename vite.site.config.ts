// Vite config for building the documentation website (Vercel deployment).
// This is intentionally separate from vite.config.ts, which is the library
// build config used for npm publishing.
import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist-site',
  },
})
