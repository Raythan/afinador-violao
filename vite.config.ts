import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// GitHub Pages (repositório de projeto): definir VITE_BASE_URL=/nome-do-repo/ no CI
const base = process.env.VITE_BASE_URL ?? '/'

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.svg'],
      manifest: {
        name: 'Afinador de Violão',
        short_name: 'Afinador',
        description: 'Afinador de violão PWA - 100% local, sem envio de dados',
        theme_color: '#1a1a2e',
        background_color: '#1a1a2e',
        display: 'standalone',
        orientation: 'any',
        icons: [
          { src: `${base.replace(/\/$/, '')}/icons/icon-192.svg`, sizes: '192x192', type: 'image/svg+xml' },
          { src: `${base.replace(/\/$/, '')}/icons/icon-512.svg`, sizes: '512x512', type: 'image/svg+xml' },
          {
            src: `${base.replace(/\/$/, '')}/icons/icon-512.svg`,
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}']
      }
    })
  ],
})
