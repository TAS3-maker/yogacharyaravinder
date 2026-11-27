// All copy and media for /one-year-yoga-plan/ — edit here, not in components.
// Offer, price, timer, class timings, reviews and FAQ can also be changed from /admin → Landing pages.
import { media, wa } from '../site.config.js';
import * as dp from './discountPricing.js';

export const meta = {
  path: '/one-year-yoga-plan/',
  title: '1 Year Yoga Membership – Daily Live Yoga at ₹10/day | Yogacharya Ravinder',
  description:
    'Join a full year of daily live online yoga classes with Acharya Ravinder for ₹2,599 (₹10/day): free diet plan, flexible timings, 3 free 1-to-1 calls and a 7-day money back guarantee.',
  ogImage: media('2026/03/Zoom-meet-image-4.png'),
  ogImageAlt: 'Live online yoga classes',
  preloadImage: media('2026/03/Zoom-meet-image-4.png'),
};

export const offerBar = [
  { icon: '🎉', text: 'SUMMER SPECIAL OFFER –', tone: 'white' },
  { text: 'DAILY YOGA IN JUST ₹10/DAY', tone: 'orange' },
  { text: '7 seats left | Batch Filling Fast', tone: 'light' },
  { icon: '🔥', text: 'Special offer end soon', tone: 'white', href: '#pricing' },
];

export const hero = {
  ...dp.hero,
  pill: '🔥 Only 7 slots left for the batch',
  title: ['Transform Your Body with ', 'Live Online', ' Yoga Classes'],
  intro: ['Welcome to ', 'Satya Sanatan Yog Trust,', ' Yoga with Acharya Ravinder – a journey towards health, peace, and balance.'],
  primary: { label: 'Join Yoga Just ₹10/day', icon: '🎯', href: '#pricing' },
  secondary: null,
};

export const countdown = { pill: '🔥 Limited Time Offer', title: 'Summer Special Offer Ending Soon', warning: 'Prices increase after batch fills.', cta: 'Join Before Offer Ends' };

export const problems = dp.problems;
export const pillars = dp.pillars;
export const trust = dp.trust;
export const reels = dp.reels;

// The 1-year plan (Razorpay button 'one-year-yoga-plan' → pl_SxTP8bC2OCJFtE). Prices are numbers; the page formats them.
export const plan = {
  pay: 'one-year-yoga-plan',
  tag: 'Summer Special Offer',
  tagIcon: '🎉',
  name: '1 Year Yoga Membership',
  sub: '12 Months',
  price: 2599,
  mrp: 9994,
  perMonth: 216,
  badge: '₹10/day',
  offText: '75% OFF',
  features: ['Daily Live Classes', 'Free Diet Plan', 'Flexible Timing', 'Beginner Friendly', '3 free calls ( 30 min each)', '7-Day Money Back Guarantee'],
  cta: 'Claim This Offer Now',
  href: wa('Hi, I want to join the 1 Year Yoga Membership (₹2,599)'),
};

export const pricing = {
  pill: '🔥 Limited Time Offer',
  title: 'Offer Pricing Ending Soon – Lock Your Discount Today',
  subtitle: 'All plans include daily live classes + free diet plan. Longer plans = bigger savings.',
  warning: 'Limited offer — Prices increase after the batch fills',
};

export const schedule = dp.schedule;
export const coach = dp.coach;
export const transformations = dp.transformations;

export const videos = {
  title: 'Watch Real Student Results',
  items: dp.stories.items.slice(0, 3),
  note: 'No paid actors. Only real students sharing real results.',
  cta: { label: 'Join Next Batch', href: '#pricing' },
};

export const testimonials = dp.testimonials;

const q = (start) => dp.faq.items.find((f) => f.q.startsWith(start));
export const faq = {
  ...dp.faq,
  items: [q('Is this program'), q('On which platform'), q('Are class recordings'), q('What is the refund'), q('What payment'), q('Can I change')].filter(Boolean),
};

export const finalCta = {
  ...dp.finalCta,
  text: 'Start your yoga journey today and feel the difference. Your best self is one decision away.',
  secondary: null,
  proof: ['Join ', '5,241', ' students already practicing with us · 7-Day Money Back Guarantee'],
};

export const footerLinks = [['Join Classes', '#pricing'], ['Class Schedule', '#classes'], ['About Instructor', '#about'], ['FAQ', '#faq']];
