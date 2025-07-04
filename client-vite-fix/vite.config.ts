import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        pure_funcs: ['eval']
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          antd: ['antd'],
          router: ['react-router-dom'],
          utils: ['@ant-design/pro-layout']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  server: {
    host: true
  }
})
