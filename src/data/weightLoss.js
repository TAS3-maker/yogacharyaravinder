// All copy and media for /yoga-classes-for-weight-loss/ — edit here, not in components.
// Plans, client stories, reviews and FAQ can also be changed from /admin → Landing pages.
import { media, wa } from '../site.config.js';
import * as home from './home.js';
import * as dp from './discountPricing.js';

export const meta = {
  path: '/yoga-classes-for-weight-loss/',
  title: 'Online Yoga Classes for Weight Loss | Live Classes with Yogacharya Ravinder',
  description:
    'Lose weight naturally with live online yoga classes by Yogacharya Ravinder. Morning & evening batches, beginner-friendly plans built around India’s lifestyle and diet. Plans from ₹249/month.',
  ogImage: media('2026/03/Zoom-meet-image-4.png'),
  ogImageAlt: 'Live online yoga class for weight loss',
  preloadImage: media('2026/03/Zoom-meet-image-4.png'),
};

export const hero = {
  pill: 'Rated 4.9/5 by [2,500+] students across India',
  title: ['Online Yoga Classes for ', 'Weight Loss'],
  lead: 'Lose Weight Naturally with Live Guidance from Yogacharya Ravinder',
  intro: 'Join the best online yoga classes India trusts. Our live online yoga classes and live yoga classes online, guided by Yogacharya Ravinder, are designed to burn fat, build strength and restore balance. Start online yoga classes India-wide from home.',
  checks: [
    'Live online yoga classes, morning and evening batches',
    'Beginner-friendly plans built around India’s lifestyle and diet',
    'Small batches with personal posture correction',
    'No equipment or experience needed',
  ],
  primary: { label: 'Book Weight Loss Yoga Class →', href: '#pricing' },
  secondary: { label: 'Explore Our Videos', href: '#videos' },
  image: { src: media('2026/03/Zoom-meet-image-4.png'), alt: 'Live online yoga class for weight loss on Zoom' },
};

export const problem = {
  eyebrow: 'THE PROBLEM',
  title: 'Tired of Diets, Gyms and Crash Plans That Never Last?',
  subtitle: 'Long work hours, desk jobs, late dinners, stress eating and hormonal imbalance make sustainable fat loss hard for most Indians.',
  items: [
    { title: 'Crash diets', text: 'Cut muscle, slow metabolism and trigger rebound weight gain.' },
    { title: 'Gym workouts', text: 'Intimidating, expensive and hard to sustain with a busy schedule.' },
    { title: 'Random YouTube videos', text: 'No live correction, no accountability, higher risk of injury.' },
    { title: 'Stress and poor sleep', text: 'Raise cortisol, linked to belly fat, cravings and fatigue.' },
  ],
  cta: { label: 'See How Online Yoga Classes Fix This →', href: '#science' },
};

export const need = {
  eyebrow: 'THE NEED',
  title: 'Why Online Yoga Classes for Weight Loss Are the Smarter Solution',
  text: 'Weight loss needs a system that balances body, mind, metabolism and habits. That is where yoga classes online stand apart.',
  items: [
    ['Convenience:', 'practise from home, office or hotel.'],
    ['Accountability:', 'live yoga classes online with Yogacharya Ravinder correcting form.'],
    ['Low-impact fat loss:', 'safe for beginners, seniors and post-pregnancy recovery.'],
    ['Holistic results:', 'better digestion, sleep, posture and balance.'],
    ['Affordable:', 'online yoga classes India students choose cost a fraction of a gym plus trainer.'],
  ],
};

export const concerns = {
  eyebrow: 'HEALTH CONCERNS',
  title: 'Different Problems Yoga Helps With, Beyond Weight Loss',
  subtitle: 'Our online yoga classes India-wide support the health issues that quietly block weight loss.',
  items: [
    ['🔥', 'Belly fat and obesity'], ['🌸', 'PCOS'], ['🦋', 'Thyroid weight gain'],
    ['😌', 'Stress and anxiety'], ['😴', 'Insomnia'], ['🍽️', 'Digestion and bloating'],
    ['🩸', 'Diabetes and BP'], ['🧍', 'Back pain and posture'], ['🤱', 'Postpartum weight'],
  ],
  cta: { label: 'Fix My Health Problem with Live Yoga →', href: '#pricing' },
};

export const science = {
  eyebrow: 'THE SCIENCE',
  title: 'How Do Online Yoga Classes Help with Weight Loss?',
  subtitle: 'Six evidence-backed mechanisms behind fat loss through yoga.',
  items: [
    ['Calorie burn and metabolism', 'Vinyasa and Power Yoga burn roughly 250–450 calories per hour; Surya Namaskar lifts metabolic rate.'],
    ['Cortisol reduction', 'Yoga and pranayama lower the stress hormone tied to abdominal fat and emotional eating.'],
    ['Lean muscle and core strength', 'Plank, Chair, Warrior and Boat Pose raise resting calorie burn.'],
    ['Mindful eating', 'Body awareness reduces binge and late-night eating.'],
    ['Hormonal and digestive balance', 'Better insulin sensitivity and gut health, useful in PCOS and thyroid imbalance.'],
    ['Better sleep', 'Yoga Nidra regulates ghrelin and leptin, the hunger hormones.'],
  ],
  answer: 'Yes, online yoga classes for weight loss are effective when practised 4–5 days a week with balanced nutrition and sleep. Yoga aids fat loss through calorie burn, muscle toning, stress reduction and better eating habits.',
};

export const reels = { ...dp.reels };

export const classTypes = {
  eyebrow: 'CLASS TYPES',
  title: 'Best Yoga Classes Online, Matched to Body Type and Goal',
  subtitle: 'Every format runs as live online yoga classes with real-time feedback and recorded replays.',
  head: ['Class', 'Best For', 'Intensity', 'Benefit'],
  rows: [
    ['Power Yoga', 'Fast fat loss', 'High', 'Max calorie burn'],
    ['Vinyasa Flow', 'Weight loss, flexibility', 'Medium–High', 'Cardio plus strength'],
    ['Surya Namaskar', 'Beginners, toning', 'Medium', 'Metabolism boost'],
    ['Hatha Yoga', 'Beginners, seniors', 'Low–Medium', 'Posture, foundation'],
    ['Ashtanga Yoga', 'Core strength', 'High', 'Detox, endurance'],
    ['PCOS Yoga', 'Women’s health', 'Low–Medium', 'Hormonal balance'],
    ['Pre/Postnatal Yoga', 'Pregnancy, postpartum', 'Low', 'Safe recovery'],
    ['Pranayama', 'Stress eating, sleep', 'Low', 'Cortisol control'],
  ],
  cta: { label: 'Find My Perfect Yoga Class Online →', href: '#pricing' },
};

export const process = {
  eyebrow: 'OUR PROCESS',
  title: 'How Our Live Online Yoga Classes for Weight Loss Work',
  subtitle: 'Five simple steps to lasting results.',
  items: [
    { title: 'consultation', text: 'Review of weight, lifestyle, health and goals.' },
    { title: 'Personalised plan', text: 'Right style, timing, intensity and Indian diet tips.' },
    { title: 'Join live classes', text: 'Small-batch Zoom sessions in Hindi or English.' },
    { title: 'Track weekly', text: 'Weight, inches and energy monitored.' },
    { title: 'Build habits', text: 'Community, replays and challenges.' },
  ],
};

// Same 4 plans and Razorpay buttons as the homepage ladder; the 6-month plan uses the live page's own button id.
export const pricing = {
  ...home.pricing,
  pill: 'PRICING',
  title: 'Best Online Yoga Classes India Can Trust, Made Affordable',
  subtitle: '',
  warning: '',
  plans: home.pricing.plans.map((p) => (p.pay === 'pro-plan' ? { ...p, pay: 'yfwl-6month-plan', href: wa('Hi, I want to join the Pro plan (6 Months, ₹2,499)') } : p)),
};

export const whyUs = {
  eyebrow: 'WHY US',
  title: 'Why We Are Rated Among the Best Online Yoga Classes India Has to Offer',
  text: 'A certified yoga teacher, real live interaction and plans built for Indian lifestyles.',
  cta: { label: 'Join the Best Online Yoga Classes India Loves →', href: '#pricing' },
  items: [
    ['Certified teacher:', 'Yoga Alliance / AYUSH-recognised.'],
    ['100% live sessions,', 'not pre-recorded.'],
    ['Small batches', 'with personal attention.'],
    ['Designed for India:', 'schedules, diets, festivals.'],
    ['Hindi, English and Punjabi', 'options.'],
    ['Safe for all levels,', 'with injury modifications.'],
  ],
};

export const about = {
  eyebrow: 'ABOUT',
  title: 'Meet Yogacharya Ravinder, Your Online Yoga Guru for Weight Loss',
  image: dp.coach.image,
  badge1: dp.coach.badge1,
  badge2: dp.coach.badge2,
  bio: 'Yogacharya Ravinder is a certified yoga teacher with 12+ years of experience, offering professional online and offline yoga classes for weight loss, flexibility, stress relief and meditation. Through live online yoga classes, personalised plans and flexible timings, he blends Hatha, Ashtanga and Pranayama with modern weight management, helping thousands of students across India lose belly fat, manage PCOS and thyroid concerns, and build healthy habits from home.',
  badges: ['12+ Years Experience', 'Yoga Alliance / AYUSH Certified', '5,000+ Students', 'Hindi · English · Punjabi'],
};

export const stories = {
  eyebrow: 'CLIENT STORIES',
  title: 'Real People. Real Weight Loss. Real Yoga Results.',
  subtitle: 'Sample stories: replace with real, verified ones.',
  items: [
    { title: 'Lost 9 kg in 4 months without a gym', text: 'Neha, a Ludhiana professional, followed a Vinyasa plan through live yoga classes online and gained energy, digestion and confidence.', name: 'Neha S., Punjab 28' },
    { title: 'Post-delivery weight finally reducing', text: 'Priya used postnatal online yoga classes to rebuild core strength and lose 7 kg in five months.', name: 'Priya M., Delhi 35' },
    { title: 'PCOS symptoms improved, weight stabilised', text: 'Hormone-focused yoga and pranayama brought lighter periods, better mood and steady weight loss.', name: 'Ritu K., Mumbai 22' },
  ],
};

export const trust = dp.trust;

export const reviews = {
  eyebrow: 'REVIEWS',
  title: 'What Students Say About Our Online Yoga Classes',
  items: [
    { quote: 'Best online yoga classes India has for weight loss. Yogacharya Ravinder corrects every posture personally.', name: 'Anjali T., Bengaluru 32' },
    { quote: 'Live sessions keep me consistent. Recorded videos never worked for me.', name: 'Karan D., Chandigarh 47' },
    { quote: 'Beginner-friendly, affordable and effective yoga classes online.', name: 'Sunita P., Pune 39' },
  ],
  cta: { label: 'Book Your Trial →', href: '#pricing' },
};

export const blog = {
  eyebrow: 'BLOG',
  title: 'Latest Blogs on Yoga for Weight Loss and Healthy Living',
  subtitle: 'Free guides from Yogacharya Ravinder on fat loss, diet, PCOS and daily practice.',
  cta: { label: 'Explore All Yoga Blogs →', href: '/blogs/' },
};

export const faq = {
  eyebrow: 'FAQS',
  title: 'Frequently Asked Questions',
  items: [
    { q: 'Do online yoga classes for weight loss actually work?', a: 'Yes. Online yoga classes for weight loss work when practised 4–5 days a week with balanced nutrition and sleep. Yoga burns calories, builds lean muscle, lowers cortisol and reduces emotional eating.' },
    { q: 'How many calories do live yoga classes online burn?', a: 'Depending on the style and your body weight, a live session burns roughly 180–450 calories. Power Yoga and Vinyasa sit at the higher end, Hatha and Pranayama at the lower end.' },
    { q: 'How long does weight loss take with online yoga classes?', a: 'Most students notice better energy and digestion in 2 weeks and visible inch loss in 4–6 weeks. Healthy, sustainable weight loss is around 2–4 kg per month with consistent practice and diet.' },
    { q: 'Which are the best online yoga classes India offers for beginners?', a: 'Live, small-batch classes with a certified teacher who corrects your form are best for beginners. Hatha Yoga and Surya Namaskar are ideal starting points.' },
    { q: 'What is the best type of yoga for weight loss?', a: 'Power Yoga and Vinyasa Flow burn the most calories, while Surya Namaskar and Ashtanga build strength. A mix with Pranayama for stress control gives the best long-term results.' },
    { q: 'Are live online yoga classes better than recorded videos?', a: 'Yes. Live classes give real-time posture correction, a fixed routine and accountability, which recorded videos cannot. Recordings are still available here for days you miss.' },
    { q: 'Can yoga classes online reduce belly fat?', a: 'Yoga reduces belly fat by burning calories, strengthening the core and lowering cortisol, the stress hormone linked to abdominal fat—especially when combined with a balanced Indian diet.' },
    { q: 'How much do the best online yoga classes India offers cost?', a: 'Plans start at ₹999 for one month, and drop to ₹249/month on the 12-month plan—all with daily live classes, a free diet plan and recordings.' },
  ],
};
