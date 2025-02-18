import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8081,
    host: true,
    strictPort: true,  // This will fail if port 8081 is already in use
    watch: {
      usePolling: true,
      interval: 1000,
      // Exclude node_modules and other large directories from watching
      ignored: ['**/node_modules/**', '**/dist/**', '**/.git/**']
    }
  }
})
