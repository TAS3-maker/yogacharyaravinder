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

const builds = new Map();
export async function serveBlog(path, buildDir = 'dist-ssr') {
  if (!builds.has(buildDir)) {
    builds.set(buildDir, Promise.all([
      import(pathToFileURL(resolve(buildDir, 'entry-server.js')).href),
      readFile(resolve(buildDir, 'blog.html'), 'utf8'),
    ]));
  }
  return renderBlog(path, ...await builds.get(buildDir));
}
