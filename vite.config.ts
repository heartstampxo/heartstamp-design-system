import { defineConfig } from 'vitest/config'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

const entries = {
  index: path.resolve(__dirname, 'src/index.ts'),
  core: path.resolve(__dirname, 'src/entries/core.ts'),
  hs: path.resolve(__dirname, 'src/entries/hs.ts'),
  'stampy-chat': path.resolve(__dirname, 'src/entries/stampy-chat.ts'),
  'style-sidebar': path.resolve(__dirname, 'src/entries/style-sidebar.ts'),
}

export default defineConfig({
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 5173,
  },
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    dts({ entryRoot: 'src', rollupTypes: false, insertTypesEntry: true, exclude: ['src/pages/**', 'src/test/**', 'src/**/*.test.{ts,tsx}', 'src/main.tsx', 'src/app/App.tsx', 'src/app/routes.tsx', 'src/styles/**'] }),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    assetsInlineLimit: 2097152,
    copyPublicDir: false,
    rollupOptions: {
      external: (id: string) => {
        // Keep only project-internal modules in the bundle; everything else
        // (React, Radix, etc.) is imported at runtime so consumers can dedupe.
        if (id.startsWith('.') || id.startsWith('/')) return false
        return true
      },
      preserveEntrySignatures: 'strict',
      input: entries,
      output: [
        {
          format: 'es',
          dir: 'dist',
          entryFileNames: '[name].mjs',
          chunkFileNames: 'chunks/[name]-[hash].mjs',
          assetFileNames: 'assets/[name]-[hash][extname]',
          preserveModules: true,
          preserveModulesRoot: 'src',
        },
        {
          format: 'cjs',
          dir: 'dist',
          entryFileNames: '[name].js',
          chunkFileNames: 'chunks/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]',
          preserveModules: true,
          preserveModulesRoot: 'src',
          exports: 'named',
        },
      ],
    },
  },

  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})