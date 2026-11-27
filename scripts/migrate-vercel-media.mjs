import 'dotenv/config';
import { readdir, readFile } from 'node:fs/promises';
import { join, relative, resolve, sep } from 'node:path';
import { listMedia, putMedia } from '../server/media.js';

const root = resolve(process.env.CMS_MEDIA_DIR || '.cms-media');
if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error('Set BLOB_READ_WRITE_TOKEN for the destination Vercel Blob store.');
process.env.VERCEL = '1';

const entries = await readdir(join(root, 'cms'), { recursive: true, withFileTypes: true });
const existing = new Set(await listMedia());
let uploaded = 0;
for (const entry of entries.filter((entry) => entry.isFile())) {
  const file = join(entry.parentPath, entry.name);
  const key = relative(root, file).split(sep).join('/');
  if (existing.has(key)) continue;
  await putMedia(key, await readFile(file));
  uploaded++;
}
console.log(`Copied ${uploaded} image(s) to Vercel Blob with their existing media keys.`);
