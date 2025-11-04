import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'images/*.png', 'images/*.jpg'],
      manifest: {
        name: 'Les Délices de Caro',
        short_name: 'Caro Delice',
        description: 'Application de commande de crêpes en ligne pour étudiants',
        theme_color: '#8B4513',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        icons: [
          {
            src: '/images/icon-72x72.png',
            sizes: '72x72',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/images/icon-96x96.png',
            sizes: '96x96',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/images/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/images/icon-144x144.png',
            sizes: '144x144',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/images/icon-152x152.png',
            sizes: '152x152',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/images/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/images/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/images/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        shortcuts: [
          {
            name: 'Menu',
            short_name: 'Menu',
            description: 'Voir le menu',
            url: '/?shortcut=menu',
            icons: [{ src: '/images/icon-96x96.png', sizes: '96x96' }]
          },
          {
            name: 'Panier',
            short_name: 'Panier',
            description: 'Voir mon panier',
            url: '/?shortcut=cart',
            icons: [{ src: '/images/icon-96x96.png', sizes: '96x96' }]
          }
        ],
        categories: ['food', 'shopping']
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp}'],
        skipWaiting: true, // Force l'activation immédiate du nouveau service worker
        clientsClaim: true, // Force la prise de contrôle des pages ouvertes
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/firebase\.googleapis\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'firebase-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ],
  // Forcer le rechargement des variables d'environnement
  envPrefix: 'VITE_',
})

