import { renderToString } from 'react-dom/server';
import { pages } from './pages/index.js';

export { pages };

export async function renderPage(key, props = {}) {
  const { default: Page, meta } = await pages[key].load();
  return { html: renderToString(<Page {...props} />), meta };
}

// Renderer for the blog pages (scripts/blog-routes.mjs)
export async function renderComponent(loader, props) {
  const { default: C } = await loader();
  return renderToString(<C {...props} />);
}

export { BlogList, BlogPost } from './pages/BlogPages.jsx';
