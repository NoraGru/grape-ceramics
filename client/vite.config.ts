import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
  },
  server: {
    port: 5173,
    proxy: {
      '/.netlify/functions': {
        target:
          mode === 'production'
            ? 'https://grapeceramics.netlify.app' // Produktion API
            : 'http://localhost:5000', // Lokal development
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
}));
