// Image storage. On Netlify: Netlify Blobs (store "media"). Locally (no Netlify credentials): ./.cms-media/
// Keys look like "cms/2026/11/my-photo-a1b2.webp".
import fs from 'node:fs';
import path from 'node:path';

const LOCAL_DIR = path.resolve(process.env.CMS_MEDIA_DIR || '.cms-media');
let store = null;

async function blobs() {
  if (store !== null) return store;
  const hasCtx = process.env.NETLIFY_BLOBS_CONTEXT || globalThis.netlifyBlobsContext;
  const siteID = process.env.NETLIFY_SITE_ID || process.env.SITE_ID; // SITE_ID is set by Netlify during builds
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

export const TYPES = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', gif: 'image/gif', avif: 'image/avif', svg: 'image/svg+xml' };
export const typeOf = (key) => TYPES[key.split('.').pop().toLowerCase()] || 'application/octet-stream';

export async function putMedia(key, buffer, meta = {}) {
  key = safeKey(key);
  const s = await blobs();
  if (s) await s.set(key, buffer, { metadata: { type: typeOf(key), ...meta } });
  else {
    const f = path.join(LOCAL_DIR, key);
    fs.mkdirSync(path.dirname(f), { recursive: true });
    fs.writeFileSync(f, buffer);
  }
  return key;
}

// true when files are stored in Netlify Blobs (not the local folder)
export const usingBlobs = async () => !!(await blobs());

export async function getMedia(key) {
  key = safeKey(key);
  const s = await blobs();
  if (s) {
    const data = await s.get(key, { type: 'arrayBuffer' });
    return data ? Buffer.from(data) : null;
  }
  const f = path.join(LOCAL_DIR, key);
  return fs.existsSync(f) ? fs.readFileSync(f) : null;
}

export async function deleteMedia(key) {
  key = safeKey(key);
  const s = await blobs();
  if (s) await s.delete(key);
  else fs.rmSync(path.join(LOCAL_DIR, key), { force: true });
}

export async function listMedia(prefix = 'cms/') {
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
