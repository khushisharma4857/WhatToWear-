import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const IMGLY_CDN = 'https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.7.0/dist'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/models': {
        target: IMGLY_CDN,
        changeOrigin: true,
        rewrite: path => path,
      },
      '/wasm': {
        target: IMGLY_CDN,
        changeOrigin: true,
        rewrite: path => path,
      },
      '/onnxruntime-web': {
        target: IMGLY_CDN,
        changeOrigin: true,
        rewrite: path => path,
      },
    },
  },
  optimizeDeps: {
    exclude: ['@imgly/background-removal'],
  },
})
