import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    port: 3000
  },
  define: {
    __API_URL__: JSON.stringify(process.env.VITE_BACKEND_URL),
    __ENV__: JSON.stringify(mode)
  }
}))
