import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `npm run build`          -> dist/          (Vercel uchun)
// `npm run build:offline`  -> dist-offline/  (bitta HTML fayl, internetsiz ochiladi)
export default defineConfig(({ mode }) => ({
  base: './',
  plugins: [react(), ...(mode === 'offline' ? [viteSingleFile()] : [])],
  build: mode === 'offline' ? { outDir: 'dist-offline', assetsInlineLimit: 100000000 } : { chunkSizeWarningLimit: 1200 },
  server: { port: 5173, strictPort: true, proxy: { '/api': 'http://localhost:3000' } },
}))
