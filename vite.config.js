import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'P³ Lending - Decentralized P2P Bitcoin Lending',
        short_name: 'P³ Lending',
        description: 'Revolutionary peer-to-peer Bitcoin lending platform with AI risk analysis',
        theme_color: '#667eea',
        background_color: '#0a0a0f',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          web3: ['ethers', 'web3'],
          ui: ['framer-motion', 'lucide-react']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  },
  define: {
    global: 'globalThis'
  }
})
