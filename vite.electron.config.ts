import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';
import path from 'path';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    electron([
      {
        entry: 'electron-app/main.ts',
        onstart(args) {
          args.reload();
        },
        vite: {
          build: {
            sourcemap: true,
            minify: false,
            outDir: 'electron-app/dist',
            rollupOptions: {
              external: ['electron'],
            },
          },
        },
      },
      {
        entry: 'electron-app/preload.ts',
        onstart(args) {
          args.reload();
        },
        vite: {
          build: {
            sourcemap: 'inline',
            minify: false,
            outDir: 'electron-app/dist',
            rollupOptions: {
              external: ['electron'],
            },
          },
        },
      },
    ]),
    // Use Node.js API in the Renderer-process
    renderer(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  clearScreen: false,
});
