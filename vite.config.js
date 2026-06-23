import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// In dev, proxy API calls to the backend (default http://localhost:3000) so the
// browser talks to the same origin and we avoid CORS. Override the target with
// VITE_PROXY_TARGET. In production, point the client at the API with
// VITE_API_BASE_URL instead (see src/api/client.js).
const proxyTarget = process.env.VITE_PROXY_TARGET || 'http://localhost:3000'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': { target: proxyTarget, changeOrigin: true },
      '/health': { target: proxyTarget, changeOrigin: true },
    },
  },
})
