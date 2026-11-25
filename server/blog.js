import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { blogRoute } from './blog-routes.js';
import { pageHead } from './page-head.js';

export async function renderBlog(path, renderer, template) {
  const route = await blogRoute(path, renderer);
  if (!route) return null;
  const body = await renderer.renderComponent(route.loader, route.props);
  const head = pageHead({ ...route.meta, path: route.path });
  return template.replace('<!--head-->', () => head).replace('<!--app-->', () => body);
}

let builtBlog;
export async function serveBlog(path) {
  builtBlog ??= Promise.all([
    import(pathToFileURL(resolve('dist-ssr/entry-server.js')).href),
    readFile(resolve('dist-ssr/blog.html'), 'utf8'),
  ]);
  return renderBlog(path, ...await builtBlog);
}
