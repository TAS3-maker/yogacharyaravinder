// Homepage content ("/"). Shares most sections with the discount page; only what differs is defined here.
import * as dp from './discountPricing.js';
import { media, wa } from '../site.config.js';

export const meta = {
  path: '/',
  title: 'Start Online Yoga Classes with Yogacharya Ravinder',
  description: 'Transform your body and mind with Yogacharya Ravinder online yoga classes. Enroll now and practice yoga from home!',
  ogImage: media('2026/03/Zoom-meet-image-4.png'),
  preloadImage: media('2026/03/Zoom-meet-image-4.png'),
};

export const hero = {
  ...dp.hero,
  pill: '🔥 Only 15 slots left for the batch',
  title: ['Lose Weight Naturally with ', 'Live Online', ' Yoga Classes'],
};

const planLink = (name) => wa(`Hi, I want to join the ${name}`);
const features = ['Daily Live Classes', 'Free Diet Plan', 'Flexible Timing', 'Beginner Friendly'];

export const pricing = {
  pill: '🔥 Limited Time Offer',
  title: 'Choose Your Yoga Transformation Plan',
  subtitle: 'All plans include daily live classes + free diet plan. Longer plans = bigger savings.',
  warning: 'Limited offer — Prices increase after the batch fills',
  plans: [
    { name: 'Basic', pay: 'basic-plan', duration: '1 Month', price: '₹999', perMonth: '₹999', features, href: planLink('Basic plan (1 Month, ₹999)') },
    { name: 'Standard', pay: 'standard-plan', duration: '3 Months', price: '₹1,999', perMonth: '₹666', badge: 'BEST VALUE', popular: true, features, href: planLink('Standard plan (3 Months, ₹1,999)') },
    { name: 'Pro', pay: 'pro-plan', duration: '6 Months', price: '₹2,499', perMonth: '₹416', features, href: planLink('Pro plan (6 Months, ₹2,499)') },
    { name: 'Advanced', pay: 'advanced-plan', duration: '12 Months', price: '₹2,999', perMonth: '₹249', features: [...features, 'Personal Guidance'], href: planLink('Advanced plan (12 Months, ₹2,999)') },
  ],
  recorded: dp.pricing.recorded,
};

export const schedule = {
  ...dp.schedule,
  morning: [
    { icon: '⏰', time: '7:00 AM – 8:00 AM', name: 'Morning Power Yoga' },
    { icon: '⏰', time: '10:00 AM – 11:00 AM', name: 'Mid-Morning Flow' },
  ],
  evening: [
    { icon: '🌆', time: '5:30 PM – 6:30 PM', name: 'Evening Flexibility & Strength' },
    { icon: '🕯️', time: '7:00 PM – 8:00 PM', name: 'Night Meditation & Pranayama' },
  ],
};

// Same questions as the discount page, in the homepage order
const q = Object.fromEntries(dp.faq.items.map((i) => [i.q, i]));
export const faq = {
  ...dp.faq,
  items: [
    'Is this program beginner-friendly?', 'On which platform are the classes held?', 'Are class recordings available if I miss a session?',
    'What is the refund policy?', 'What payment options are available?', 'Can I change my class timing after enrolling?',
  ].map((k) => q[k]),
};

// Mobile-only bottom bar
export const mobileBar = [
  { label: '5 Day Trial — ₹499', href: '#trial', variant: 'outline' },
  { label: 'Start Transformation', href: '#pricing', variant: 'primary' },
];

export const { stories, trial, problems, pillars, trust, reels, coach, transformations, testimonials, finalCta } = dp;
