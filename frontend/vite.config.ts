import { defineConfig } from 'vite'
import react            from '@vitejs/plugin-react'
import { resolve }      from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': resolve(__dirname, './src') },
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': { target: 'http://localhost:4000', changeOrigin: true },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor:   ['react', 'react-dom', 'react-router-dom'],
          map:      ['leaflet'],
          supabase: ['@supabase/supabase-js'],
          i18n:     ['i18next', 'react-i18next'],
          // hls.js NON è nel manualChunks: viene caricato dinamicamente
          // solo quando serve un HLS stream (già implementato in StreamPlayer)
        },
      },
    },
    chunkSizeWarningLimit: 700,
  },
  test: {
    globals:     true,
    environment: 'jsdom',
    setupFiles:  ['./src/test/setup.ts'],
    include:     ['src/**/*.{test,spec}.{ts,tsx}'],
  },
})
