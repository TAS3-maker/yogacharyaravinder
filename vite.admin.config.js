// Builds the admin panel (/admin) separately from the public site, with real React (no Preact alias)
// so nothing here touches the public pages' PageSpeed.  npm run build:admin
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  root: path.resolve('admin'),
  base: '/admin/',
  publicDir: false,
  plugins: [react()],
  resolve: { alias: { '/src': path.resolve('src') } },
  build: { outDir: path.resolve('dist/admin'), emptyOutDir: true },
});
