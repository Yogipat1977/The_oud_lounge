// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';


export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      // When your frontend code makes a request to '/api/...'
      // Vite dev server will forward it to 'http://localhost:5000/api/...'
      '/api': {
        target: 'http://localhost:5000', // <--- YOUR BACKEND SERVER ADDRESS AND PORT
        changeOrigin: true, // Recommended for most cases
        // secure: false, // Use if your backend is HTTPS with self-signed cert (unlikely for local dev)
        // rewrite: (path) => path.replace(/^\/api/, '') // Only use if your backend routes DON'T start with /api.
                                                        // In your case, your backend routes DO start with /api
                                                        // (e.g., app.use('/api/products', ...)), so you DON'T need rewrite.
      },
    },
  },
})