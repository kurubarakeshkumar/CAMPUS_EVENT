import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Output directory into Spring Boot's static folder
    outDir: 'src/main/resources/static',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    allowedHosts: 'all',
    proxy: {
      '/api': 'http://localhost:8080'
    }
  }
});
