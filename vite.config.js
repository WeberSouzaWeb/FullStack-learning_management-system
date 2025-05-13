import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer(),
      ],
    },
  },
  server: {
    port: 5173,
    open: true, // Isso pode abrir a página automaticamente no navegador
    hmr: true
  },
  build: {
    rollupOptions: {
      external: ['react-router-dom'],
    }
  }
})
