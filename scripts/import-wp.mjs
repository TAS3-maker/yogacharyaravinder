import 'dotenv/config';
import { createHash } from 'node:crypto';
import mongoose from 'mongoose';
import sanitizeHtml from 'sanitize-html';
import { connect, Category, Post, slugify } from '../server/db.js';
import { clean } from '../server/post-html.js';
import { getMedia, putMedia } from '../server/media.js';
import { MAX_IMAGE_BYTES } from '../src/media-limits.js';
import { SITE } from '../src/site.config.js';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const [source = process.env.WP_SOURCE_URL || SITE.url] = args.filter((arg) => arg !== '--dry-run');
const origin = new URL(source.replace(/\/?$/, '/'));
if (!['http:', 'https:'].includes(origin.protocol)) throw new Error('Use an HTTP(S) WordPress site URL.');

async function fetchAll(collection, params = {}) {
  const url = new URL(`wp-json/wp/v2/${collection}`, origin);
  url.search = new URLSearchParams({ per_page: '100', ...params });
  const all = [];
  let pages = 1;
  for (let page = 1; page <= pages; page++) {
    url.searchParams.set('page', String(page));
    const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
    if (!response.ok) throw new Error(`WordPress ${collection} request returned HTTP ${response.status} at ${url.origin}.`);
    const items = await response.json();
    if (!Array.isArray(items)) throw new Error(`WordPress ${collection} response was not a list.`);
    all.push(...items);
    pages = Number(response.headers.get('x-wp-totalpages')) || 1;
  }
  return all;
}

const namedEntities = { amp: '&', apos: "'", gt: '>', lt: '<', nbsp: ' ', quot: '"' };
function plainText(html = '') {
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
    .replace(/&(#(?:x[\da-f]+|\d+)|amp|apos|gt|lt|nbsp|quot);/gi, (entity, key) => {
      if (!key.startsWith('#')) return namedEntities[key.toLowerCase()];
      const point = key[1].toLowerCase() === 'x' ? parseInt(key.slice(2), 16) : Number(key.slice(1));
      return point <= 0x10ffff ? String.fromCodePoint(point) : entity;
    })
    .replace(/\s+/g, ' ').trim();
}

const [wpPosts, wpCategories] = await Promise.all([
  fetchAll('posts', { status: 'publish', _embed: 'wp:featuredmedia' }),
  fetchAll('categories'),
]);
const posts = wpPosts.filter((post) => post.status === 'publish' && !post.content?.protected).map((post) => {
  const title = plainText(post.title?.rendered);
  const dateGmt = post.date_gmt;
  const date = new Date(dateGmt ? (dateGmt.endsWith('Z') ? dateGmt : `${dateGmt}Z`) : NaN);
  if (!title || Number.isNaN(date.getTime())) throw new Error(`WordPress post ${post.id} is missing a title or GMT publish date.`);
  const image = post._embedded?.['wp:featuredmedia']?.[0];
  return {
    slug: slugify(post.slug || title), title, date, status: 'published',
    excerpt: plainText(post.excerpt?.rendered), content: clean(post.content?.rendered),
    image: image?.source_url ? {
      src: image.source_url, alt: image.alt_text || '', width: image.media_details?.width, height: image.media_details?.height,
    } : undefined,
    categoryIds: post.categories ?? [],
  };
});

const imageSource = /(<img\b[^>]*?\bsrc=")([^"]+)(")/gi;
const imageTypes = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'image/avif': 'avif' };

async function copyImages(posts) {
  if (process.env.BLOB_READ_WRITE_TOKEN) process.env.VERCEL = '1';
  const sources = new Set(posts.flatMap((post) => [post.image?.src, ...Array.from(post.content.matchAll(imageSource), (m) => m[2])].filter(Boolean)));
  const copied = new Map();
  const queue = [...sources];
  const failures = [];
  await Promise.all(Array.from({ length: 6 }, async () => {
    while (queue.length) {
      const src = queue.shift();
      const value = src.replaceAll('&amp;', '&');
      if (!URL.canParse(value, origin)) continue;
      const url = new URL(value, origin);
      if (url.origin !== origin.origin || !url.pathname.startsWith('/wp-content/uploads/')) continue;
      const hash = createHash('sha256').update(url.href).digest('hex').slice(0, 24);
      try {
        const response = await fetch(url, { redirect: 'error', signal: AbortSignal.timeout(15000) });
        const extension = imageTypes[response.headers.get('content-type')?.split(';')[0]];
        if (!response.ok || !extension || Number(response.headers.get('content-length')) > MAX_IMAGE_BYTES) {
          await response.body?.cancel();
          throw new Error(`Unsupported media response (HTTP ${response.status}) or image over 3 MB`);
        }
        const key = `cms/wordpress/${hash}.${extension}`;
        if (await getMedia(key)) {
          await response.body?.cancel();
        } else {
          const buffer = Buffer.from(await response.arrayBuffer());
          if (buffer.length > MAX_IMAGE_BYTES) throw new Error('Image is over 3 MB');
          await putMedia(key, buffer);
        }
        copied.set(src, `/api/media/${key}`);
      } catch (error) {
        failures.push(`${url.pathname} (${error.message})`);
      }
    }
  }));
  for (const post of posts) {
    if (copied.has(post.image?.src)) post.image.src = copied.get(post.image.src);
    post.content = post.content.replace(imageSource, (_, start, src, end) => start + (copied.get(src) ?? src) + end);
  }
  console.log(`Preserved ${copied.size} WordPress image URLs in CMS storage.`);
  if (failures.length) console.warn(`Kept the original URL for ${failures.length} images that could not be copied:\n${failures.join('\n')}`);
}

console.log(`Found ${posts.length} public WordPress posts at ${origin.origin}.`);
if (!dryRun && posts.length) {
  try {
    await connect();
    await Promise.all([Post.init(), Category.init()]);
    const existing = new Set(await Post.distinct('slug', { slug: { $in: posts.map((post) => post.slug) } }));
    const pending = posts.filter((post) => !existing.has(post.slug));
    if (pending.length) await copyImages(pending);
    const needed = new Set(pending.flatMap((post) => post.categoryIds));
    const categories = new Map();
    for (const category of wpCategories.filter((category) => needed.has(category.id))) {
      const fields = { slug: slugify(category.slug || category.name), name: plainText(category.name), description: plainText(category.description) };
      const doc = await Category.findOneAndUpdate({ slug: fields.slug }, {
        $setOnInsert: { ...fields, createdAt: new Date(), updatedAt: new Date() },
      }, { upsert: true, returnDocument: 'after', runValidators: true, timestamps: false });
      categories.set(category.id, doc._id);
    }
    let inserted = 0;
    for (const { categoryIds, ...post } of pending) {
      const result = await Post.updateOne({ slug: post.slug }, {
        $setOnInsert: { ...post, categories: categoryIds.map((id) => categories.get(id)).filter(Boolean), createdAt: new Date(), updatedAt: new Date() },
      }, { upsert: true, runValidators: true, timestamps: false });
      inserted += result.upsertedCount;
    }
    console.log(`Inserted ${inserted} posts. Skipped ${posts.length - inserted} existing slugs.`);
  } catch (error) {
    if (error.name !== 'MongooseServerSelectionError') throw error;
    console.error('Could not connect to MongoDB Atlas. Check the cluster status and Network Access list, then rerun npm run import-wp.');
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}
