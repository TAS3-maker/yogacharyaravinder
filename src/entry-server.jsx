import { renderToString } from 'react-dom/server';
import { pages } from './pages/index.js';

export { pages };

// props.cms = this page's admin content (from MongoDB at build time); the page's getMeta() turns it into SEO tags.
export async function renderPage(key, props = {}) {
  const mod = await pages[key].load();
  const { default: Page, meta, getMeta } = mod;
  return { html: renderToString(<Page {...props} />), meta: getMeta ? getMeta(props.cms) : meta };
}

// Renderer for the blog pages (scripts/blog-routes.mjs)
export async function renderComponent(loader, props) {
  const { default: C } = await loader();
  return renderToString(<C {...props} />);
}

export { BlogList, BlogPost } from './pages/BlogPages.jsx';
