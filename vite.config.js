import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dev server only: pick the page component from the URL (production uses prerendered HTML)
const devPage = () => ({
  name: 'dev-page',
  apply: 'serve',
  transformIndexHtml(html, ctx) {
    const url = (ctx.originalUrl || '/').split(/[?#]/)[0];
    const key = url.replace(/^\/|\/$/g, '') || 'home';
    const pay = fs.readFileSync('src/runtime/razorpay.js', 'utf8').replace(/__PLANS__/g, JSON.stringify(SITE.razorpay || {}));
    return html.replace('<!--page-->', key).replace('<!--head-->', '<title>Dev preview</title>').replace('<!--pay-->', `<script>${pay}</script>`);
  },
});

// Production builds swap React for Preact (same API, ~35 KB less JavaScript → faster on phones).
const preact = {
  'react-dom/server': 'preact-render-to-string',
  'react-dom/client': 'preact/compat/client',
  'react-dom': 'preact/compat',
  'react/jsx-runtime': 'preact/jsx-runtime',
  'react/jsx-dev-runtime': 'preact/jsx-dev-runtime',
  react: 'preact/compat',
};

import fs from 'node:fs';
import { SITE } from './src/site.config.js';

// The same live blog runs in dev, preview, and on Netlify.
const liveBlog = () => {
  const middleware = (server, dev) => async (req, res, next) => {
    const path = (req.url || '').split('?')[0];
    if (!/^\/blogs(?:\/|$)/.test(path)) return next();
    res.setHeader('Cache-Control', 'no-store');
    if (!['GET', 'HEAD'].includes(req.method)) {
      res.statusCode = 405;
      res.setHeader('Allow', 'GET, HEAD');
      return res.end();
    }
    try {
      await import('dotenv/config');
      if (path === '/blogs/sitemap.xml') {
        const { blogSitemap } = await import('./server/blog-routes.js');
        const xml = await blogSitemap();
        res.setHeader('Content-Type', 'application/xml; charset=utf-8');
        return res.end(req.method === 'HEAD' ? undefined : xml);
      }
      const { renderBlog, serveBlog } = await import('./server/blog.js');
      const html = dev
        ? await renderBlog(path, await server.ssrLoadModule('/src/entry-server.jsx'),
          fs.readFileSync('index.html', 'utf8')
            .replace('<!--page-->', 'blogs')
            .replace('<!--pay-->', '')
            .replace('<script type="module" src="/src/main.jsx"></script>', '')
            .replace('</head>', '<link rel="stylesheet" href="/src/styles.css" /></head>'))
        : await serveBlog(path);
      res.statusCode = html ? 200 : 404;
      res.setHeader('Content-Type', html ? 'text/html; charset=utf-8' : 'text/plain; charset=utf-8');
      res.end(req.method === 'HEAD' ? undefined : html || 'Blog page not found.');
    } catch (error) {
      server.config.logger.error(error.stack || String(error));
      res.statusCode = 503;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end('The blog is temporarily unavailable.');
    }
  };
  return {
    name: 'live-blog',
    configureServer(server) { server.middlewares.use(middleware(server, true)); },
    configurePreviewServer(server) { server.middlewares.use(middleware(server, false)); },
  };
};

// /admin + /api inside `npm run dev` and `npm run preview` (on Netlify these are the function + redirects).
// The Express API runs in-process, reading .env. No separate API server is needed.
const adminServer = () => {
  let app;
  const api = async (req, res, next) => {
    if (!req.url.startsWith('/api/')) return next();
    try {
      if (!app) {
        (await import('dotenv')).config();
        app = (await import('./server/app.js')).createApp();
      }
      app(req, res, next);
    } catch (e) { next(e); }
  };
  return {
    name: 'admin-and-api',
    configureServer(server) {
      server.middlewares.use(api);
      // SPA: every /admin/... URL serves the admin page (live-compiled)
      server.middlewares.use(async (req, res, next) => {
        const url = (req.url || '').split(/[?#]/)[0];
        if (!/^\/admin(\/|$)/.test(url) || /\.[a-z0-9]+$/i.test(url)) return next();
        if (url === '/admin') { res.statusCode = 302; res.setHeader('Location', '/admin/'); return res.end(); }
        const html = await server.transformIndexHtml(url, fs.readFileSync('admin/index.html', 'utf8'), req.originalUrl);
        res.setHeader('Content-Type', 'text/html');
        res.end(html);
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use(api);
      server.middlewares.use((req, res, next) => {
        const url = (req.url || '').split(/[?#]/)[0];
        if (!/^\/admin(\/|$)/.test(url) || /\.[a-z0-9]+$/i.test(url)) return next();
        const f = 'dist/admin/index.html';
        if (!fs.existsSync(f)) { res.statusCode = 404; return res.end('Admin not built: run "npm run build" first.'); }
        res.setHeader('Content-Type', 'text/html');
        res.end(fs.readFileSync(f));
      });
    },
  };
};

export default defineConfig(({ command }) => ({
  plugins: [react(), adminServer(), devPage(), liveBlog()],
  resolve: command === 'build' ? { alias: preact } : {},
  ssr: { noExternal: command === 'build' ? ['preact', 'preact-render-to-string'] : [] },
  build: {
    cssCodeSplit: false,
    modulePreload: { polyfill: false },
    target: 'es2019',
  },
}));
