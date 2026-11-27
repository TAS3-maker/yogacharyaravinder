import { createApp } from './app.js';
import renderBlog from './vercel-blog.js';

const app = createApp();

export default function handler(req, res) {
  const url = new URL(req.url, 'http://localhost');
  if (/^\/blogs(?:\/|$)/.test(url.pathname) || url.searchParams.has('__blog_path') || req.query?.__blog_path !== undefined) {
    return renderBlog(req, res);
  }
  const path = url.searchParams.get('__cms_path') ?? req.query?.__cms_path;
  if (url.pathname === '/api/cms' && typeof path === 'string') {
    url.pathname = `/api/${path}`;
  }
  url.searchParams.delete('__cms_path');
  req.url = url.pathname + url.search;
  return app(req, res);
}
