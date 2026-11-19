import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, '../dist-client'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        'nexa-chatbot': path.resolve(__dirname, 'src/main-widget.tsx'),
        'standalone-chat': path.resolve(__dirname, 'src/main-standalone.tsx'),
        'admin-dashboard': path.resolve(__dirname, 'src/main-admin.tsx')
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'nexa-chatbot.css';
          }
          return 'assets/[name].[ext]';
        }
      }
    }
  }
});
