// Image storage uses the hosting provider's blob store, or ./.cms-media/ locally.
// Keys look like "cms/2026/11/my-photo-a1b2.webp".
import fs from 'node:fs';
import path from 'node:path';

const LOCAL_DIR = path.resolve(process.env.CMS_MEDIA_DIR || '.cms-media');
let store = null;

async function blobs() {
  if (store !== null) return store;
  const hasCtx = process.env.NETLIFY_BLOBS_CONTEXT || globalThis.netlifyBlobsContext;
  const siteID = process.env.NETLIFY_SITE_ID || process.env.SITE_ID;
  const hasCreds = siteID && process.env.NETLIFY_AUTH_TOKEN;
  if (!hasCtx && !hasCreds) return (store = false);
  const { getStore } = await import('@netlify/blobs');
  store = hasCtx
    ? getStore({ name: 'media', consistency: 'strong' })
    : getStore({ name: 'media', siteID, token: process.env.NETLIFY_AUTH_TOKEN, consistency: 'strong' });
  return store;
}

const safeKey = (key) => {
  const k = String(key).replace(/\\/g, '/').replace(/^\/+/, '');
  if (!k || k.split('/').some((p) => p === '..' || p === '')) throw Object.assign(new Error('Bad media key'), { status: 400 });
  return k;
};

const TYPES = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', gif: 'image/gif', avif: 'image/avif', svg: 'image/svg+xml' };
export const typeOf = (key) => TYPES[key.split('.').pop().toLowerCase()] || 'application/octet-stream';

const onVercel = () => process.env.VERCEL === '1';

async function vercelBlobs() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw Object.assign(new Error('Connect a private Vercel Blob store and set BLOB_READ_WRITE_TOKEN.'), { status: 503 });
  }
  return import('@vercel/blob');
}

export async function putMedia(key, buffer, meta = {}) {
  key = safeKey(key);
  if (onVercel()) {
    const { put } = await vercelBlobs();
    await put(key, buffer, { access: 'private', contentType: typeOf(key) });
    return key;
  }
  const s = await blobs();
  if (s) await s.set(key, buffer, { metadata: { type: typeOf(key), ...meta } });
  else {
    const f = path.join(LOCAL_DIR, key);
    fs.mkdirSync(path.dirname(f), { recursive: true });
    fs.writeFileSync(f, buffer);
  }
  return key;
}

export async function getMedia(key) {
  key = safeKey(key);
  if (onVercel()) {
    const { get } = await vercelBlobs();
    const result = await get(key, { access: 'private' });
    if (result?.statusCode === 200) return Buffer.from(await new Response(result.stream).arrayBuffer());
  }
  const s = await blobs();
  if (s) {
    const data = await s.get(key, { type: 'arrayBuffer' });
    return data ? Buffer.from(data) : null;
  }
  if (onVercel()) return null;
  const f = path.join(LOCAL_DIR, key);
  return fs.existsSync(f) ? fs.readFileSync(f) : null;
}

export async function deleteMedia(key) {
  key = safeKey(key);
  if (onVercel()) {
    const { del } = await vercelBlobs();
    return del(key);
  }
  const s = await blobs();
  if (s) await s.delete(key);
  else fs.rmSync(path.join(LOCAL_DIR, key), { force: true });
}

export async function listMedia(prefix = 'cms/') {
  if (onVercel()) {
    const { list } = await vercelBlobs();
    const keys = [];
    let cursor;
    do {
      const result = await list({ prefix, cursor });
      keys.push(...result.blobs.map((blob) => blob.pathname));
      cursor = result.hasMore ? result.cursor : undefined;
    } while (cursor);
    return keys;
  }
  const s = await blobs();
  if (s) {
    const { blobs: items } = await s.list({ prefix });
    return items.map((b) => b.key);
  }
  const dir = path.join(LOCAL_DIR, prefix);
  if (!fs.existsSync(dir)) return [];
  const out = [];
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : out.push(path.relative(LOCAL_DIR, path.join(d, e.name)).replace(/\\/g, '/'))));
  walk(dir);
  return out;
}
