import { serveBlog } from '../../server/blog.js';
import { blogSitemap } from '../../server/blog-routes.js';

export async function handler(event) {
  const headers = { 'Cache-Control': 'no-store' };
  if (!['GET', 'HEAD'].includes(event.httpMethod)) {
    return { statusCode: 405, headers: { ...headers, Allow: 'GET, HEAD' } };
  }
  try {
    const path = event.path.replace(/^\/\.netlify\/functions\/blog(?=\/|$)/, '/blogs');
    if (path === '/blogs/sitemap.xml') {
      const xml = await blogSitemap();
      return { statusCode: 200, headers: { ...headers, 'Content-Type': 'application/xml; charset=utf-8' }, body: event.httpMethod === 'HEAD' ? '' : xml };
    }
    const html = await serveBlog(path);
    const statusCode = html ? 200 : 404;
    headers['Content-Type'] = html ? 'text/html; charset=utf-8' : 'text/plain; charset=utf-8';
    return { statusCode, headers, body: event.httpMethod === 'HEAD' ? '' : html || 'Blog page not found.' };
  } catch (error) {
    console.error('Blog request failed:', error);
    return { statusCode: 503, headers, body: 'The blog is temporarily unavailable.' };
  }
}
