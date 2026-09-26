import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'node:fs'

// Local HTTPS for `npm run dev` only, using mkcert certificates.
// With localhost.pem + localhost-key.pem present, the dev server uses a
// locally trusted certificate; otherwise it falls back to plain HTTP so a
// fresh clone still starts. Production builds never read this block.
const keyPath = 'localhost-key.pem'
const certPath = 'localhost.pem'
const hasLocalCert = fs.existsSync(keyPath) && fs.existsSync(certPath)

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: 'localhost',
    port: 5173,
    ...(hasLocalCert
      ? { https: { key: fs.readFileSync(keyPath), cert: fs.readFileSync(certPath) } }
      : {}),
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // The web manifest is hand-authored in public/manifest.webmanifest.
      manifest: false,
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest}'],
        // Single-page app: serve the cached shell for navigation requests.
        navigateFallback: 'index.html',
      },
    }),
  ],
})
