import { defineConfig } from 'vite';

export default defineConfig({
  // Keep the sanitizer and its ESM parser in the same bundle.
  ssr: {
    noExternal: true,
    external: ['express', 'cookie-parser', 'bcryptjs', 'jsonwebtoken', 'mongoose', '@netlify/blobs', '@vercel/blob'],
  },
  build: {
    ssr: 'server/vercel-cms.js',
    target: 'node22',
    outDir: 'dist-vercel-ssr',
    emptyOutDir: false,
    copyPublicDir: false,
    rollupOptions: { output: { entryFileNames: 'cms.js' } },
  },
});
