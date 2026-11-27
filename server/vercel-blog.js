import { blogSitemap } from './blog-routes.js';
import { serveBlog } from './blog.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    res.statusCode = 405;
    return res.end();
  }

  try {
    const url = new URL(req.url, 'http://localhost');
    const route = url.searchParams.get('__blog_path') ?? req.query?.__blog_path;
    const path = url.pathname === '/api/cms' && typeof route === 'string' ? `/blogs/${route.replace(/^\/+/, '')}` : url.pathname;
    if (path === '/blogs/sitemap.xml') {
      const xml = await blogSitemap();
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      return res.end(req.method === 'HEAD' ? undefined : xml);
    }

    const html = await serveBlog(path, 'dist-vercel-ssr');
    res.statusCode = html ? 200 : 404;
    res.setHeader('Content-Type', html ? 'text/html; charset=utf-8' : 'text/plain; charset=utf-8');
    return res.end(req.method === 'HEAD' ? undefined : html || 'Blog page not found.');
  } catch (error) {
    console.error('Blog request failed:', error);
    res.statusCode = 503;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end(req.method === 'HEAD' ? undefined : 'The blog is temporarily unavailable.');
  }
}
