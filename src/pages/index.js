// Page registry. key = data-page attribute on #root. `hydrate: false` pages ship zero JavaScript.
// `cms` = which /admin → Landing pages entry feeds the page (offers, prices, schedules, FAQ…).
export const pages = {
  home: { load: () => import('./Home.jsx'), path: '/', hydrate: true, cms: 'home' },
  'discount-pricing': {
    load: () => import('./DiscountPricing.jsx'),
    path: '/discount-pricing/',
    hydrate: true,
    cms: 'discount-pricing',
  },
  // Duplicates of the same landing page from the old site (kept so old links/ads keep working)
  'old-discount-pricing': { load: () => import('./DiscountPricing.jsx'), path: '/old-discount-pricing/', hydrate: true, noindex: true, cms: 'discount-pricing' },
  'discount-pricing-test': { load: () => import('./DiscountPricing.jsx'), path: '/discount-pricing-test/', hydrate: true, noindex: true, cms: 'discount-pricing' },
  '21-days-weight-loss-challenge': {
    load: () => import('./TwentyOneDayChallenge.jsx'),
    path: '/21-days-weight-loss-challenge/',
    hydrate: true,
    cms: '21-days-weight-loss-challenge',
  },
  'yoga-classes-for-weight-loss': {
    load: () => import('./WeightLossClasses.jsx'),
    path: '/yoga-classes-for-weight-loss/',
    hydrate: true,
    cms: 'yoga-classes-for-weight-loss',
  },
  'privacy-policy': { load: () => import('./PrivacyPolicy.jsx'), path: '/privacy-policy/', hydrate: false },
  'refund-policy': { load: () => import('./RefundPolicy.jsx'), path: '/refund-policy/', hydrate: false },
  'thank-you': { load: () => import('./ThankYou.jsx'), path: '/thank-you/', hydrate: true, noindex: true, cms: 'thank-you' },
};
