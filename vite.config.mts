import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

const safeDeployMode = process.env.VITE_SAFE_DEPLOY_MODE === 'true'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@shared': path.resolve(__dirname, 'packages/shared/src')
    }
  },
  build: safeDeployMode
    ? {
        minify: false,
        sourcemap: false,
        cssCodeSplit: true,
        chunkSizeWarningLimit: 300,
        rollupOptions: {
          output: {
            entryFileNames: 'assets/app-[hash].js',
            chunkFileNames: 'assets/chunk-[hash].js',
            assetFileNames: 'assets/file-[hash][extname]',
            manualChunks(id) {
              if (!id.includes('node_modules')) {
                return undefined
              }

              if (id.includes('react-router')) {
                return 'router'
              }

              if (id.includes('@reduxjs') || id.includes('react-redux')) {
                return 'state'
              }

              if (id.includes('recharts')) {
                return 'charts'
              }

              if (id.includes('papaparse')) {
                return 'reporting'
              }

              if (id.includes('axios')) {
                return 'network'
              }

              if (id.includes('react')) {
                return 'react-vendor'
              }

              return undefined
            }
          }
        }
      }
    : undefined,
  server: {
    port: 3001
  }
})
