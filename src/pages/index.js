// Page registry. key = data-page attribute on #root. `hydrate: false` pages ship zero JavaScript.
export const pages = {
  home: { load: () => import('./Home.jsx'), path: '/', hydrate: true },
  'discount-pricing': {
    load: () => import('./DiscountPricing.jsx'),
    path: '/discount-pricing/',
    hydrate: true,
  },
  // Duplicates of the same landing page from the old site (kept so old links/ads keep working)
  'old-discount-pricing': { load: () => import('./DiscountPricing.jsx'), path: '/old-discount-pricing/', hydrate: true, noindex: true },
  'discount-pricing-test': { load: () => import('./DiscountPricing.jsx'), path: '/discount-pricing-test/', hydrate: true, noindex: true },
  'privacy-policy': { load: () => import('./PrivacyPolicy.jsx'), path: '/privacy-policy/', hydrate: false },
  'refund-policy': { load: () => import('./RefundPolicy.jsx'), path: '/refund-policy/', hydrate: false },
  'thank-you': { load: () => import('./ThankYou.jsx'), path: '/thank-you/', hydrate: false, noindex: true },
};
