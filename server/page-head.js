import { SITE } from '../src/site.config.js';

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

export function pageHead(m) {
  const url = esc(SITE.url + m.path);
  const img = m.ogImage ? (m.ogImage.startsWith('http') ? m.ogImage : SITE.url + m.ogImage) : '';
  return [
    `<title>${esc(m.title)}</title>`,
    `<meta name="description" content="${esc(m.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta name="robots" content="${m.noindex ? 'noindex, follow' : 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large'}" />`,
    `<meta name="theme-color" content="#33864f" />`,
    `<link rel="icon" href="${SITE.favicon}" type="image/webp" />`,
    `<link rel="apple-touch-icon" href="${SITE.favicon}" />`,
    `<meta name="google-site-verification" content="${SITE.googleSiteVerification}" />`,
    `<meta name="facebook-domain-verification" content="${SITE.facebookDomainVerification}" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta property="og:site_name" content="${SITE.name}" />`,
    `<meta property="og:type" content="${m.type || 'website'}" />`,
    `<meta property="og:title" content="${esc(m.title)}" />`,
    `<meta property="og:description" content="${esc(m.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    img && `<meta property="og:image" content="${esc(img)}" />`,
    m.ogImageAlt && `<meta property="og:image:alt" content="${esc(m.ogImageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(m.title)}" />`,
    `<meta name="twitter:description" content="${esc(m.description)}" />`,
    img && `<meta name="twitter:image" content="${esc(img)}" />`,
    m.preloadImage && !/^https?:/.test(m.preloadImage) && `<link rel="preload" as="image" imagesrcset="${m.preloadImage.replace(/\.webp$/, '-414.webp')} 414w, ${m.preloadImage.replace(/\.webp$/, '-828.webp')} 828w, ${m.preloadImage} 1400w" imagesizes="(max-width: 900px) 92vw, 46vw" fetchpriority="high" />`,
    // Preload only the fonts this page shows above the fold (default: the landing pages' Instrument Sans + Inter)
    ...(m.fonts || ['instrument-sans', 'inter']).map((f) => `<link rel="preload" href="/fonts/${f}.woff2" as="font" type="font/woff2" crossorigin />`),
    m.jsonld && `<script type="application/ld+json">${JSON.stringify(m.jsonld).replace(/</g, '\\u003c')}</script>`,
  ].filter(Boolean).join('\n    ');
}

