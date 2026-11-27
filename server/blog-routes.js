import { connect, Post, Category } from './db.js';
import { clean } from './post-html.js';
import { SITE } from '../src/site.config.js';

// Accessibility: post content often starts at <h3>. Shift headings up so they follow the page <h1> without gaps,
// keeping each heading's original look through data-l (styled in styles.css).
function fixHeadings(html = '') {
  const levels = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => +m[1]);
  if (!levels.length) return html;
  const shift = Math.min(...levels) - 2;
  if (shift === 0) return html;
  return html.replace(/<(\/?)h([1-6])(\s|>)/g, (m, close, n, after) => {
    const to = Math.min(6, Math.max(2, +n - shift));
    return close ? `</h${to}${after}` : `<h${to} data-l="${n}"${after}`;
  });
}
const text = (html = '') => html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const describe = (p) => p.seo?.description || p.excerpt || text(p.content).slice(0, 155).replace(/\s+\S*$/, '') + '…';
const visiblePosts = () => ({ status: 'published', date: { $lte: new Date() } });

export async function blogSitemap() {
  await connect();
  const posts = await Post.find(visiblePosts()).select('slug categories').lean();
  const categoryIds = [...new Set(posts.flatMap((post) => (post.categories ?? []).map(String)))];
  const categories = categoryIds.length ? await Category.find({ _id: { $in: categoryIds } }).select('slug').lean() : [];
  const paths = ['/blogs/', ...posts.map(({ slug }) => `/blogs/${encodeURIComponent(slug)}/`),
    ...categories.map(({ slug }) => `/blogs/category/${encodeURIComponent(slug)}/`)];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths
    .map((path) => `  <url><loc>${SITE.url}${path}</loc></url>`).join('\n')}\n</urlset>\n`;
}

export async function blogRoute(path, { BlogList, BlogPost }) {
  const match = /^\/blogs(?:\/(category\/)?([a-z0-9-]+))?\/?$/.exec(path);
  if (!match) return null;
  const [, categoryPath, slug] = match;
  await connect();
  const visible = visiblePosts();
  const category = categoryPath && await Category.findOne({ slug }).lean();
  if (categoryPath && !category) return null;
  const cards = (filter = visible) => Post.find(filter).select('slug title excerpt date image').sort({ date: -1, _id: -1 });
  const toCard = (post) => ({ ...post, date: post.date.toISOString() });
  const L = (C) => async () => ({ default: C });
  if (!slug) return {
    path: '/blogs/', loader: L(BlogList),
    props: { title: 'Our Blogs', posts: (await cards().lean()).map(toCard) },
    meta: { fonts: ['montserrat', 'instrument-sans'], title: 'Blogs - yogacharyaravinder.com', description: 'Yoga tips, weight-loss guides and wellness articles from Yogacharya Ravinder.' },
  };

  if (category) {
    const posts = (await cards({ ...visible, categories: category._id }).lean()).map(toCard);
    if (!posts.length) return null;
    return {
      path: `/blogs/category/${slug}/`, loader: L(BlogList),
      props: { title: category.name, posts },
      meta: { fonts: ['montserrat', 'instrument-sans'], title: `${category.name} - yogacharyaravinder.com`, description: category.description || `Articles about ${category.name} from Yogacharya Ravinder.` },
    };
  }

  // Sidebar on every post = the 3 newest posts (same as the live "Latest Posts" widget)
  const post = await Post.findOne({ ...visible, slug }).lean();
  if (!post) return null;
  const p = { ...toCard(post), modified: (post.updatedAt || post.date).toISOString() };
  const latest = (await cards().limit(3).lean()).map(toCard);
  const url = `${SITE.url}/blogs/${p.slug}/`;
  return {
    path: `/blogs/${p.slug}/`, loader: L(BlogPost),
    props: { post: { ...p, content: fixHeadings(clean(p.content)) }, latest },
    meta: {
      type: 'article',
      fonts: ['montserrat', 'inter'],
      title: p.seo?.title || `${p.title} - yogacharyaravinder.com`,
      description: describe(p).slice(0, 160),
      ogImage: p.image?.src,
      ogImageAlt: p.image?.alt,
      jsonld: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'BlogPosting', headline: p.title, datePublished: p.date, dateModified: p.modified,
            image: p.image?.src ? (p.image.src.startsWith('/') ? SITE.url + p.image.src : p.image.src) : undefined, mainEntityOfPage: url,
            author: { '@type': 'Person', name: 'Yogacharya Ravinder' },
            publisher: { '@type': 'Organization', name: SITE.name, logo: { '@type': 'ImageObject', url: SITE.url + '/media/2026/03/Frame-2147224036.webp' } },
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url + '/' },
              { '@type': 'ListItem', position: 2, name: 'Blogs', item: SITE.url + '/blogs/' },
              { '@type': 'ListItem', position: 3, name: p.title, item: url },
            ],
          },
        ],
      },
    },
  };
}
