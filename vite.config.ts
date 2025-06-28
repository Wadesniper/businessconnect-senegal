import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    })
  ],
  server: {
    port: 3000
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          antd: ['antd'],
          antdIcons: ['@ant-design/icons'],
          charts: ['@ant-design/plots'],
          animations: ['framer-motion', 'react-spring'],
          utils: ['moment', 'lodash'],
          routing: ['react-router-dom'],
          styled: ['@emotion/styled', '@emotion/react']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
}) 