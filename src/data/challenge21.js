// All copy and media for /21-days-weight-loss-challenge/ — edit here, not in components.
// Price, offer bar, timer, batches, bonus, "what you get" and FAQ can also be changed from /admin → Landing pages.
import { media, wa } from '../site.config.js';
import * as dp from './discountPricing.js';

export const meta = {
  path: '/21-days-weight-loss-challenge/',
  title: '21 Day Weight Loss Yoga Challenge – Only ₹499 | Yogacharya Ravinder',
  description:
    'Lose up to 3–4 kg in 21 days with live online yoga sessions, simple Indian diet guidance and daily accountability. Join the 21 Day Weight Loss Yoga Challenge for ₹499.',
  ogImage: media('2026/04/image-5.webp'),
  ogImageAlt: '21 day weight loss yoga challenge result',
  preloadImage: media('2026/04/image-5.webp'),
  fonts: ['poppins-800', 'inter'],
};

// The challenge plan (Razorpay button '21-day-challenge'). Prices are numbers; the page formats them.
export const plan = {
  pay: '21-day-challenge',
  name: '21 Day Challenge',
  price: 499,
  mrp: 799,
  features: ['21 live sessions', 'Diet guidance', 'Support group'],
  href: wa('Hi, I want to join the 21 Day Weight Loss Challenge (₹499)'),
};

export const offer = {
  hours: 24, // evergreen timer per visitor
  bar: [
    { icon: '🔥', text: '21-Day Weight Loss Challenge' },
    { text: 'Only ₹{price} Today', strong: true },
    { icon: '⏳', text: 'Limited Seats — Batch Starting Soon!' },
  ],
};

export const hero = {
  pills: [{ text: '🔥 Only Limited Seats Available', tone: 'red' }, { text: '⏳ Offer Ending Today', tone: 'amber' }],
  title: ['21 Day Weight Loss', 'Yoga Challenge'],
  lead: 'Lose up to 3–4 kg with consistent yoga – no gym required',
  intro: 'Join India’s fastest growing online yoga weight loss challenge. Daily live sessions, guided routines and accountability support designed for real results.',
  checks: ['Beginner Friendly', 'Live Guided Sessions', 'Proven Weight Loss System'],
  enrolled: '5,241+',
  image: { src: media('2026/04/image-5.webp'), alt: 'Priya before and after the 21 day challenge', caption: 'Priya Lost 4 kgs in 21 Days' },
};

export const ribbon = [
  { icon: '⭐', text: '4.9 Rating' },
  { icon: '👥', text: '5,000+ Students' },
  { icon: '🧘', text: '12+ Years Experience' },
  { icon: '🌍', text: 'Multiple Countries' },
];

export const fails = {
  title: 'Why Most People Fail At Weight Loss',
  items: [
    { icon: '❌', title: 'Slow Metabolism', text: 'Metabolism doesn’t burn fat efficiently' },
    { icon: '❌', title: 'Stubborn Belly Fat', text: 'Fat deposits that won’t budge' },
    { icon: '❌', title: 'No Consistency', text: 'Starting strong but losing motivation' },
    { icon: '⚠️', title: 'Random Workouts', text: 'No structured system or progression' },
    { icon: '⚠️', title: 'Lack of Guidance', text: 'No expert to correct your form' },
    { icon: '⚠️', title: 'No Accountability', text: 'No support to keep you on track' },
  ],
  outro: 'This is exactly why this 21 Day Challenge was created.',
  cta: 'Yes I Want To Transform',
};

export const transforms = {
  title: ['How This 21 Day Challenge ', 'Transforms Your Body'],
  items: [
    { icon: '🔥', title: 'Daily Fat Burning Yoga', points: ['Structured daily sessions', 'Progressive routines', 'Metabolism activation'] },
    { icon: '🥗', title: 'Weight Loss Diet Guidance', points: ['Simple Indian diet guidance', 'No starvation diets', 'Sustainable habits'] },
    { icon: '📱', title: 'Accountability System', points: ['WhatsApp support group', 'Daily reminders', 'Motivation tracking'] },
  ],
  cta: 'Yes I Want To Transform',
};

export const transformations = { ...dp.transformations, cta: { label: 'Start My Transformation', href: '#join' } };

export const videos = {
  title: 'Watch Real Student Results',
  items: dp.stories.items.slice(0, 3),
  note: 'No paid actors. Only real students sharing real results.',
  cta: 'Join Next Batch',
};

export const inside = {
  title: 'What You Get Inside 21 Day Challenge',
  items: ['21 Live Yoga Sessions', 'Daily fat loss routines', 'Simple diet plan', 'Morning & evening batch options', 'WhatsApp support group', 'Progress tracking guidance', 'Daily accountability support'],
  bonusTitle: 'FREE BONUS',
  bonus: ['Fat Loss Diet Plan (PDF)', 'Progress Tracking Sheet', 'Daily feedback in live'],
};

export const steps = {
  title: 'How The 21 Day Challenge Works',
  items: [
    { title: 'Join Challenge', text: 'Sign up and secure your spot' },
    { title: 'Get WhatsApp Access', text: 'Join the support community' },
    { title: 'Attend Daily Sessions', text: 'Live yoga every single day' },
    { title: 'Follow Guidance', text: 'Diet tips + accountability' },
    { title: 'Track Transformation', text: 'Measure your real progress' },
  ],
};

export const join = {
  title: '21 Day Transformation Challenge',
  subtitle: 'Join today before the batch fills up',
  tag: 'MOST POPULAR',
  urgency: ['🔥 Limited Seats Per Batch', '⏳ Price increases after batch fills', '⚠️ Next batch may close anytime'],
  cta: 'Join Challenge Now',
  morning: [
    { time: '6:00 AM – 7:00 AM', name: 'Morning Power Yoga' },
    { time: '7:30 AM – 8:30 AM', name: 'Morning Power Yoga' },
    { time: '10:00 AM – 11:00 AM', name: 'Mid-Morning Flow' },
  ],
  evening: [
    { time: '5:30 PM – 6:30 PM', name: 'Evening Flexibility & Strength' },
    { time: '7:00 PM – 8:00 PM', name: 'Night Pranayama' },
  ],
  online: 'Google Meet / Zoom',
  book: 'Book Your Batch Now',
};

export const coach = { ...dp.coach, cta: { label: 'Start Your Journey With Me', href: '#join' } };

export const faq = {
  title: 'Frequently Asked Questions',
  subtitle: 'Have more questions? WhatsApp us at',
  items: [
    { q: 'Is this beginner friendly?', a: 'Yes, completely beginner friendly. No prior yoga experience needed. All sessions are designed for absolute beginners.' },
    { q: 'Will I lose weight?', a: 'Most students who attend the daily sessions and follow the simple diet guidance lose 3–4 kg in 21 days. Results depend on consistency, starting weight and lifestyle.' },
    { q: 'Do I need a gym?', a: 'No. All you need is a yoga mat, a phone or laptop and a little space at home. Every session is live on Google Meet / Zoom.' },
    { q: 'Is a diet required?', a: 'There is no starvation diet. You get simple Indian diet guidance that fits your normal meals and helps you lose fat sustainably.' },
  ],
};

export const final = {
  title: 'Your Transformation Can Start Today',
  text: ['21 days from now you can either stay the same or become lighter,', 'healthier and more confident. Decision is yours.'],
  warn: '⏰ Next batch starting soon.',
  cta: 'Join 21 Day Weight Loss Challenge',
  whatsapp: { label: 'Chat On WhatsApp', href: wa('Hi, I have a question about the 21 Day Weight Loss Challenge') },
};

export const footerLinks = [
  ['Join Classes', '#join'], ['21 Days Challenge', '#join'], ['Class Schedule', '#batches'], ['About Instructor', '#about'], ['FAQ', '#faq'],
];
