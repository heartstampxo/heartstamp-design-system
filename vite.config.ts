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
    /* Video is always emitted as a file, never base64'd. The tablet clip is
       under the 2 MB threshold, so the default would inline it into BOTH the
       ESM and CJS bundles — about 3.4 MB of duplicated data URI for one asset.

       Large SVGs are held to the same rule for the same reason: the
       Thanksgiving promo strip is one 800 KB drawing, and base64 adds a third
       again on top before it is duplicated across both bundles. The 512 KB
       floor is deliberately above every other SVG we ship, so this changes
       that one asset and leaves the rest inlined as they were.

       Everything else keeps the previous numeric behaviour. */
    assetsInlineLimit: (filePath: string, content: Buffer) => {
      if (/\.(mp4|webm|mov|m4v)$/i.test(filePath)) return false
      if (/\.svg$/i.test(filePath) && content.length > 524288) return false
      return content.length <= 2097152
    },
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