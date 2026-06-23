import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Pure front-end app — no backend. Everything runs in the browser.
export default defineConfig({
  plugins: [react()],
})
