// Central site settings: edit here, everything else reads from this file.
export const SITE = {
  name: 'Yogacharya Ravinder',
  url: 'https://yogacharyaravinder.com',
  phone: '8146990576',
  phoneIntl: '918146990576',
  copyright: '© 2026 Satya Sanatan Yog Trust. All rights reserved.',
  // Footer credit shown on the policy pages (as on the live site)
  credit: { name: 'MohanAutomation', url: 'https://mohanautomation.com/' },
  tagline:
    'Bringing the ancient science of yoga to modern lives. Live classes, personal guidance, and real transformation.',
  social: {
    facebook: 'https://www.facebook.com/ravinder.kissle',
    instagram: 'https://www.instagram.com/yogacharya_ravinder?igsh=MXhlcXNlZ2JlY3hnYQ==',
    youtube: 'https://www.youtube.com/@Yogacharyaravinderofficial',
  },
  // Tracking & verification codes carried over from the original site
  gtmId: 'GTM-M7GT89HB',
  // true = load GTM on first user interaction or after 4s idle (keeps PageSpeed at ~100).
  // false = load GTM immediately like the old site did (PageSpeed mobile drops by ~10-20).
  gtmDefer: true,
  googleSiteVerification: '518Y19-jyxYcGOlGI0CCe5_Vk9IPkdolUvFYuIxpFBc',
  facebookDomainVerification: 'gvzriyfetpzerb65w4lpt0dsr5mmah',
  favicon: '/media/2026/03/cropped-fav-icon-green-270x270.webp',
  // Razorpay Payment Buttons, same IDs as the original site.
  // key = the button's element id (also used by GTM click triggers), value = Razorpay payment button id.
  razorpay: {
    'basic-plan': 'pl_SP46kp3G1VBI8m',
    'standard-plan': 'pl_SP48t5ax15yOtQ',
    'pro-plan': 'pl_SP4Aj67FC4Byde',
    'advanced-plan': 'pl_SP4FdkI2jBH7uB',
    'yoga-trial-1': 'pl_TdVlExYo7IxjS2',
    'consultaion-call': 'pl_SP4ky3fO2xxd6m',
    'disc-basic-plan': 'pl_RqcZKFiEyT1Pnf',
    'disc-standard-plan': 'pl_RqcfJSTixjLHYa',
    'disc-pro-plan': 'pl_RqdWM2ksJLI6u4',
    'disc-advanced-plan': 'pl_RqdXO1SydjSKyb',
    'discounted-pro-plan': 'pl_RqdWM2ksJLI6u4',
    '21-day-challenge': 'pl_SaWX1CzyAjVwic',
    'one-year-yoga-plan': 'pl_SxTP8bC2OCJFtE',
    'start-journey': 'pl_RqcfJSTixjLHYa',
    'yfwl-6month-plan': 'pl_SP4Aj67FC4Byde',
  },
  // Extra tracking pixels (leave '' if they are already fired through GTM). All load deferred, like GTM.
  pixels: {
    metaPixelId: '', // Facebook / Meta Pixel ID, e.g. '1234567890'
    ga4Id: '', // Google Analytics 4, e.g. 'G-XXXXXXX'
    googleAdsId: '', // Google Ads, e.g. 'AW-XXXXXXX'
    clarityId: '', // Microsoft Clarity project id
  },
};

export const wa = (text = "Hi, I'm interested in joining the yoga classes") =>
  `https://wa.me/${SITE.phoneIntl}?text=${encodeURIComponent(text)}`;
export const tel = `tel:${SITE.phone}`;

// Kept for the existing page code: media files live in public/media, so URLs are used as is.
export const resolveMedia = (url) => url;

// Media helper: '2026/03/x.png' -> '/media/2026/03/x.webp' (optimised files in public/media)
export const media = (p) => '/media/' + p.replace(/\.(png|jpe?g)$/i, '.webp');
