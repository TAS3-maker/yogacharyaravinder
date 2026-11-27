// Turns the built React app into static HTML files (one per URL) for 100/100 PageSpeed + SEO.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pathToFileURL } from 'node:url';
import { SITE } from '../src/site.config.js';
import 'dotenv/config';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const blogOnly = process.argv.includes('--blog-only');
const ssrDir = path.join(root, blogOnly ? 'dist-vercel-ssr' : 'dist-ssr');
const { pageHead } = await import('../server/page-head.js');
// Warn about any /media file a page uses that isn't in public/media
const missing = new Set();
const hasLocal = (u) => fs.existsSync(path.join(root, 'public', decodeURI(u)));
const checkMedia = (html) => { for (const [u] of html.matchAll(/\/media\/[^"'\s,)]+/g)) if (!hasLocal(u)) missing.add(u); return html; };

let template = fs.readFileSync(path.join(blogOnly ? root : dist, 'index.html'), 'utf8');

// 1) Inline the stylesheet (removes the only render-blocking request)
const inlineStyle = (file) => `<style>${fs.readFileSync(file, 'utf8').replace(/<\/style/gi, '<\\/style')}</style>`;
template = blogOnly
  ? template.replace('</head>', () => `${inlineStyle(path.join(root, 'src/styles.css'))}</head>`)
  : template.replace(/<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/, (_, href) => inlineStyle(path.join(dist, href)));

// 2) Google Tag Manager + any extra pixels from site.config.js (all fired by one loader)
const px = SITE.pixels || {};
const gtagIds = [px.ga4Id, px.googleAdsId].filter(Boolean);
const tags = [
  `w.dataLayer=w.dataLayer||[];w.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});add('https://www.googletagmanager.com/gtm.js?id=${SITE.gtmId}');`,
  gtagIds.length && `w.gtag=function(){w.dataLayer.push(arguments)};gtag('js',new Date());${gtagIds.map((id) => `gtag('config','${id}');`).join('')}add('https://www.googletagmanager.com/gtag/js?id=${gtagIds[0]}');`,
  px.metaPixelId && `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[]}(w,d);fbq('init','${px.metaPixelId}');fbq('track','PageView');add('https://connect.facebook.net/en_US/fbevents.js');`,
  px.clarityId && `w.clarity=w.clarity||function(){(w.clarity.q=w.clarity.q||[]).push(arguments)};add('https://www.clarity.ms/tag/${px.clarityId}');`,
].filter(Boolean).join('');
const loader = `function(){${tags}}`;
const gtm = `<script>(function(w,d){var done=0;function add(u){var s=d.createElement('script');s.async=true;s.src=u;d.head.appendChild(s)}function load(){if(done)return;done=1;(${loader})()}${
  SITE.gtmDefer
    ? `['scroll','click','touchstart','keydown','mousemove'].forEach(function(e){w.addEventListener(e,load,{once:true,passive:true})});w.addEventListener('load',function(){setTimeout(load,4000)});`
    : 'load();'
}})(window,document);</script>`;
const gtmNoscript = `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${SITE.gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>${
  px.metaPixelId ? `<noscript><img height="1" width="1" style="display:none" alt="" src="https://www.facebook.com/tr?id=${px.metaPixelId}&ev=PageView&noscript=1"/></noscript>` : ''
}`;

// 3) Admin content (offers, prices, schedules, FAQ…) from MongoDB → baked into each page.
//    Without MONGODB_URI (or if the database can't be reached) the pages use the seed in src/data/*.js.
const ssrPages = blogOnly ? {} : (await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href)).pages;
const cmsKeys = [...new Set(Object.values(ssrPages).map((p) => p.cms).filter(Boolean))];
const { loadForBuild } = await import('../server/landing.js');
const cms = blogOnly ? { pages: {}, buttons: SITE.razorpay, source: 'not needed' } : await loadForBuild(cmsKeys);
if (!blogOnly) console.log(`Landing content: ${cms.source}`);
const cmsScript = (data) => (data ? `<script type="application/json" id="cms-data">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>` : '');

// 4) Razorpay payment buttons (tiny inline script; Razorpay itself loads only on intent).
//    Button ids: /admin → Landing pages → Razorpay payment buttons (falls back to SITE.razorpay).
const payScript = `<script>${fs.readFileSync(path.join(root, 'src/runtime/razorpay.js'), 'utf8')
  .replace(/^\s*\/\/.*$/gm, '').replace(/\n\s*/g, '\n').trim()
  .replace(/__PLANS__/g, JSON.stringify({ ...SITE.razorpay, ...cms.buttons }))}</script>`;

function write(route, html, meta, pageKey, hydrate, data) {
  let out = template
    .replace('<!--head-->', () => pageHead({ ...meta, path: route }))
    .replace('<!--gtm-->', () => gtm)
    .replace('<!--gtm-noscript-->', () => gtmNoscript)
    .replace('<!--pay-->', () => (hydrate ? cmsScript(data) : '') + payScript)
    .replace('<!--page-->', pageKey)
    .replace('<!--app-->', () => html);
  out = checkMedia(out).replace(/ poster="(\/media\/[^"]+)"/g, (m, u) => (hasLocal(u) ? m : ''));
  if (!hydrate) {
    out = out.replace(/<script type="module"[^>]*><\/script>/g, '').replace(/<link rel="modulepreload"[^>]*>/g, '');
  }
  const file = path.join(dist, route, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, out);
  urls.push({ loc: SITE.url + route, noindex: meta.noindex });
  console.log('  ✓', route);
}

// The live blog uses the same document shell and server renderer.
fs.writeFileSync(path.join(ssrDir, 'package.json'), '{"type":"module"}');
fs.writeFileSync(path.join(ssrDir, 'blog.html'), template
  .replace('<!--gtm-->', () => gtm)
  .replace('<!--gtm-noscript-->', () => gtmNoscript)
  .replace('<!--page-->', 'blogs')
  .replace('<!--pay-->', '')
  .replace(/<script type="module"[^>]*><\/script>/g, '')
  .replace(/<link rel="modulepreload"[^>]*>/g, ''));

const urls = [];
if (!blogOnly) await writeStaticPages();

async function writeStaticPages() {
  const ssr = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href);
  fs.rmSync(path.join(dist, 'index.html')); // template only; real pages are written below
  console.log('Prerendering:');
  for (const [key, p] of Object.entries(ssr.pages)) {
    const data = p.cms ? cms.pages[p.cms] : undefined;
    const { html, meta } = await ssr.renderPage(key, { cms: data });
    write(p.path, html, { ...meta, noindex: p.noindex }, key, p.hydrate, data);
  }

  // Until the homepage is rebuilt, opening "/" goes to the discount page (so previews aren't a blank 404)
  if (!fs.existsSync(path.join(dist, 'index.html'))) {
    fs.writeFileSync(path.join(dist, 'index.html'), '<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url=/discount-pricing/"><link rel="canonical" href="/discount-pricing/"><a href="/discount-pricing/">Continue</a>');
  }

  // 5) sitemap + robots
  fs.writeFileSync(
    path.join(dist, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
      .filter((u) => !u.noindex)
      .map((u) => `  <url><loc>${u.loc}</loc></url>`)
      .join('\n')}\n</urlset>\n`
  );
  fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\nSitemap: ${SITE.url}/blogs/sitemap.xml\n`);
  console.log(`Done: ${urls.length} pages written to dist/`);
  await (await import('mongoose')).default.disconnect();
  if (missing.size) console.log(`⚠ ${missing.size} media files are missing from public/media:\n   ${[...missing].slice(0, 15).join('\n   ')}`);
}
