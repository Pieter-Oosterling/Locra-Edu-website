import { defineConfig } from 'vite';
import compression from 'vite-plugin-compression';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'esbuild',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    target: 'es2022'
  },
  server: {
    port: 3000,
    open: true,
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  },
  plugins: [
    compression({
      algorithm: 'gzip',
      ext: '.gz'
    }),
    compression({
      algorithm: 'brotliCompress',
      ext: '.br'
    })
  ],
  css: {
    devSourcemap: true
  }
});