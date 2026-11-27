// ONE-TIME: saves the site's own images & videos (logo, hero, testimonials…) into public/media,
// optimised (WebP 1400/828/414 + video posters). Commit public/media to Git afterwards — builds never download anything.
// Only needed if public/media is incomplete. Downloads from the current live site while it is still up.
//   npm run save-assets
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';

let ffmpeg = null;
try { ffmpeg = (await import('ffmpeg-static')).default; } catch { console.warn('ffmpeg not available — video posters will be skipped'); }

const ORIGIN = process.env.ASSET_ORIGIN || 'https://yogacharyaravinder.com/wp-content/uploads/';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'public/media');
const cache = path.join(root, '.cache/originals');

// [file, ...alternative source names]
const ASSETS = [
  ['2026/03/Frame-2147224036.png'],
  ['2026/03/cropped-fav-icon-green-270x270.png'],
  ['2026/08/star.png'],
  ['2026/03/Zoom-meet-image-4.png'],
  ['2025/12/Group-238432.png', '2025/12/Group-238432-251x300.png'],
  ['2025/12/Group-238433.png', '2025/12/Group-238433-251x300.png'],
  ['2025/12/Group-238434.png', '2025/12/Group-238434-251x300.png'],
  ['2026/04/image.webp', '2026/04/image-251x300.webp'],
  ['2026/09/image-100.png', '2026/09/image-100-251x300.png'],
  ['2026/09/image-34-Recovered.png', '2026/09/image-34-Recovered-251x300.png'],
  ['2025/11/hero-img.png'],
  ['2026/04/image-5.webp', '2026/04/image-5-1024x1024.webp'],
  ['2026/04/image-6.webp', '2026/04/image-6-1024x1024.webp'],
  ['2026/04/image-7.webp', '2026/04/image-7-1024x1024.webp'],
  ['2026/03/instagram-tempelate-1.mp4'],
  ['2026/03/instagram-tempelate-2.mp4'],
  ['2026/03/instagram-tempelate-3.mp4'],
  ['2026/03/instagram-tempelate-4.mp4'],
  // Real Stories testimonial videos (open on click)
  ['2025/11/video3-1.mp4'],
  ['2025/11/video3-2.mp4'],
  ['2025/11/video3-3.mp4'],
  ['2026/04/YOGA-updated.mp4'],
  ['2026/09/testimonial-yoga-achariya.mp4'],
  ['2026/09/neelam-ji-6-month-journey.mp4', '2026/09/6-mahine-ki-Yoga-Journey-ne-Neelam-ji-ki-life-mein-ek-positive-change-laaya.-🙏Uttar-Pradesh-ki-.mp4'],
];

const webpName = (p) => p.replace(/\.(png|jpe?g|webp|gif)$/i, '.webp');
let ok = 0, skipped = 0, failed = [];

async function download(src) {
  const file = path.join(cache, src);
  if (fs.existsSync(file)) return file;
  const res = await fetch(ORIGIN + encodeURI(src), { headers: { 'User-Agent': 'Mozilla/5.0 (asset-save)' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  return file;
}

async function savePoster(video, target) {
  const poster = video.replace(/\.mp4$/, '.webp');
  if (!ffmpeg || !/instagram-tempelate/.test(target) || fs.existsSync(poster)) return;
  const frame = video.replace(/\.mp4$/, '.jpg');
  try {
    execFileSync(ffmpeg, ['-y', '-loglevel', 'error', '-ss', '0.5', '-i', video, '-frames:v', '1', frame]);
    await sharp(frame).resize({ width: 540, withoutEnlargement: true }).webp({ quality: 72 }).toFile(poster);
  } catch (e) {
    console.warn('  poster failed for', target, e.message);
  } finally {
    fs.rmSync(frame, { force: true });
  }
}

async function processOne([target, ...fallbacks]) {
  const isVideo = /\.mp4$/i.test(target);
  const dest = path.join(out, isVideo ? target : webpName(target));
  if (fs.existsSync(dest)) {
    if (isVideo) await savePoster(dest, target);
    return skipped++;
  }
  let file;
  let lastErr;
  for (const src of [target, ...fallbacks]) {
    try { file = await download(src); break; } catch (e) { lastErr = e.message; }
  }
  if (!file) return failed.push(`${target} (${lastErr})`);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (isVideo) {
    fs.copyFileSync(file, dest);
    await savePoster(dest, target);
  } else {
    const img = sharp(file, { animated: false });
    await img.clone().resize({ width: 1400, withoutEnlargement: true }).webp({ quality: 78 }).toFile(dest);
    await img.clone().resize({ width: 828, withoutEnlargement: true }).webp({ quality: 74 }).toFile(dest.replace(/\.webp$/, '-828.webp'));
    await img.clone().resize({ width: 414, withoutEnlargement: true }).webp({ quality: 72 }).toFile(dest.replace(/\.webp$/, '-414.webp'));
  }
  ok++;
}


console.log(`Saving ${ASSETS.length} site files into public/media…`);
const queue = [...ASSETS];
await Promise.all(Array.from({ length: 6 }, async () => { while (queue.length) await processOne(queue.shift()); }));
console.log(`Done: ${ok} saved, ${skipped} already present, ${failed.length} failed`);
if (failed.length) console.log('  Could not download:\n   ' + failed.join('\n   '));
else console.log('Now commit public/media to Git.');
