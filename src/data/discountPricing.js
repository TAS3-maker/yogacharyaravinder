// All copy, prices and media for /discount-pricing/ — edit here, not in components.
import { media, wa } from '../site.config.js';

export const meta = {
  path: '/discount-pricing/',
  title: 'Yoga Membership & Yoga Class Price | Join Today',
  description:
    'Join live online yoga classes with Yogacharya Ravinder. Winter special offer: up to 30% off monthly, 3, 6 and 12-month yoga plans. Start a 5-day trial for ₹499.',
  ogImage: media('2026/08/star.png'),
  ogImageAlt: 'yoga class price',
  preloadImage: media('2026/03/Zoom-meet-image-4.png'),
};

export const offerBar = [
  { icon: '❄️', text: 'WINTER SPECIAL OFFER', tone: 'white' },
  { icon: '✨', text: 'Up To 30% OFF', tone: 'yellow' },
  { text: 'Offer Ends Soon →', tone: 'white', href: '#pricing' },
];

export const hero = {
  pill: '🔥 Only 15 slots left for the batch',
  title: ['Lose Weight from Home with ', 'Live Online', ' Yoga Classes'],
  intro: [
    'Join ',
    'Acharya Ravinder',
    '’s daily live yoga classes from the comfort of your home. Work towards weight loss, improve flexibility and build a healthier lifestyle.',
  ],
  stats: [
    { icon: '⭐', text: '4.9/5 Student Rating' },
    { icon: '👥', text: '5,241 Happy Students' },
    { icon: '🧘', text: '12+ Years Experience' },
    { icon: '🌍', text: '1M+ Social Audience' },
  ],
  primary: { label: 'Join Live Classes', icon: '🎯', href: '#pricing' },
  secondary: { label: 'Start 5 Day Trial — ₹499', href: '#trial' },
  live: 'Live Classes Running Now ·',
  seats: 'Limited seats available in each batch',
  image: { src: media('2026/03/Zoom-meet-image-4.png'), alt: 'Online yoga classes' },
  happy: { value: '5K+', label: 'Happy Students' },
  online: { label: 'Currently Online', base: 250 },
};

export const stories = {
  pill: 'Real People. Real Results.',
  title: 'Real Stories',
  titleGreen: 'Real Transformations',
  subtitle: 'Watch how our yoga programs have helped real people feel stronger, healthier & happier.',
  // Card → video pairing taken from the live page (each card's Elementor lightbox setting).
  // Clicking a card opens it in a full-screen player.
  items: [
    { poster: media('2025/12/Group-238432.png'), alt: 'Yoga fat loss results', video: '/media/2025/11/video3-2.mp4' },
    { poster: media('2025/12/Group-238433.png'), alt: 'Yoga weight loss results', video: '/media/2025/11/video3-1.mp4' },
    { poster: media('2025/12/Group-238434.png'), alt: 'Wellness transformation journey', video: '/media/2025/11/video3-3.mp4' },
    { poster: media('2026/04/image.webp'), alt: 'Online yoga classes', video: '/media/2026/04/YOGA-updated.mp4' },
    { poster: media('2026/09/image-100.png'), alt: 'Neelam ji — 6 month yoga journey', video: '/media/2026/09/neelam-ji-6-month-journey.mp4' },
    { poster: media('2026/09/image-34-Recovered.png'), alt: 'Student yoga testimonial', video: '/media/2026/09/testimonial-yoga-achariya.mp4' },
  ],
  stats: [
    { icon: 'users', value: '5000+', label: 'Happy Students' },
    { icon: 'shield', value: '100%', label: 'Real Stories' },
    { icon: 'starFill', value: '4.9/5', label: 'Student Rating' },
    { icon: 'heart', value: 'Daily', label: 'Lives Transformed' },
  ],
  note: 'No paid actors. Only real students sharing real results.',
  cta: { label: 'Join Next Batch', href: '#pricing' },
};

const planFeatures = ['Daily Live Classes', 'Free Diet Plan', 'Flexible Timing', 'Beginner Friendly'];
const planLink = (name) => wa(`Hi, I want to join the ${name} (Winter Special Offer)`);

export const pricing = {
  pill: '🔥 Limited Time Offer',
  title: 'Winter Special Offer',
  titleSuffix: '– up to',
  titleOff: '30% OFF',
  subtitle: 'All plans include daily live classes + free diet plan. Longer plans = bigger savings.',
  warning: 'Prices increase after the offer ends.',
  plans: [
    { name: '1-Month Yoga Plan', pay: 'disc-basic-plan', days: '30 Days of Yoga Practice', mrp: '₹1,299', price: '₹999', off: '23%', features: planFeatures, cta: 'Join Now', href: planLink('1-Month Yoga Plan') },
    { name: '3-Months Yoga Plan', pay: 'disc-standard-plan', days: '90 Days of Yoga Practice', mrp: '₹1,999', price: '₹1,499', off: '25%', features: planFeatures, cta: 'Claim This Offer Now', href: planLink('3-Months Yoga Plan'), popular: true },
    { name: '6-Months Yoga Plan', pay: 'disc-pro-plan', days: '180 Days of Yoga Practice', mrp: '₹3,499', price: '₹2,499', off: '29%', features: planFeatures, cta: 'Claim This Offer Now', href: planLink('6-Months Yoga Plan') },
    { name: '12-Months Yoga Plan', pay: 'disc-advanced-plan', days: '365 Days of Yoga Practice', mrp: '₹3,999', price: '₹2,999', off: '25%', features: planFeatures, cta: 'Claim This Offer Now', href: planLink('12-Months Yoga Plan') },
  ],
  recorded: [
    { icon: 'playSquare', title: 'Can’t Attend Live? No Problem!', text: 'We’ve got you covered.' },
    { icon: 'videoFill', title: 'Recorded Class Available', text: 'Watch anytime, at your convenience.' },
    { flow: ['Attend Live', 'Missed It?', 'Watch Anytime'] },
  ],
};

export const trial = {
  title: 'Start Without Risk',
  subtitle: 'Not sure yet? Try us out. No long-term commitment needed.',
  cards: [
    {
      badge: 'MOST POPULAR START', pay: 'yoga-trial-1', icon: 'sparkle', name: '5-Day Trial', sub: 'Risk-Free Starter', price: '₹499',
      text: 'Daily live classes for 5 days. Experience the real program before committing long-term.',
      features: ['5 Live sessions', 'Beginner welcome', 'WhatsApp support'],
      cta: 'Start My 5-Day Trial', href: wa('Hi, I want to start the 5-Day Trial (₹499)'), primary: true,
    },
    {
      icon: 'phoneRed', pay: 'consultaion-call', name: '1-to-1 Consultation', sub: 'Personal Guidance Call', price: '₹497',
      text: '30-minute personal call with Acharya Ravinder. Get a customized yoga plan for your health goals.',
      features: ['30-min live call', 'Free diet tips', 'Beginner welcome', 'WhatsApp support'],
      cta: 'Book My Consultation Call', href: wa('Hi, I want to book the 1-to-1 Consultation Call (₹497)'),
    },
  ],
};

export const schedule = {
  title: 'Daily Class Schedule',
  subtitle: 'Choose the timing that fits your lifestyle. Multiple batches available.',
  head: 'Monday to Friday — Daily Live Classes',
  morning: [
    { icon: '⏰', time: '7:00 AM – 8:00 AM', name: 'Morning Power Yoga' },
    { icon: '⏰', time: '10:00 AM – 11:00 AM', name: 'Mid-Morning Flow' },
  ],
  evening: [
    { icon: '🌆', time: '5:30 PM – 6:30 PM', name: 'Evening Flexibility & Strength' },
    { icon: '🕯️', time: '7:00 PM – 8:00 PM', name: 'Night Pranayama' },
  ],
  foot: 'All classes via Google Meet/Zoom — Join from anywhere in the world',
  live: 'Live Right Now',
};

export const problems = {
  pill: 'You’re Not Alone',
  title: 'Are You Facing These Problems?',
  items: [
    { icon: 'battery', title: 'Low Stamina', text: 'Feeling tired and drained throughout the day, no energy for daily tasks.' },
    { icon: 'trending', title: 'Weight Gain', text: 'Struggling to lose weight despite diet changes and random exercise attempts.' },
    { icon: 'activity', title: 'Body Stiffness', text: 'Tight muscles, limited movement, and discomfort while bending or stretching.' },
    { icon: 'moon', title: 'Stress & Poor Sleep', text: 'Anxious mind, trouble sleeping, and waking up still feeling exhausted.' },
    { icon: 'clock', title: 'Lack of Routine', text: 'No consistent wellness habit; starting and stopping fitness plans constantly.' },
  ],
  outro: ['If yes,', 'structured yoga can help you.'],
};

export const countdown1 = { pill: '🔥 Limited Time Offer', icon: '❄️', title: 'Winter Special Offer End Soon', badge: 'Offer Ends Soon', cta: 'Join Before Offer Ends' };
export const countdown2 = { pill: '🔥 Limited Time Offer', title: 'Special Offer End Soon', offerIcon: '❄️', offer: 'Winter Special Offer', upto: 'UP TO', off: '30%', offWord: 'OFF', cta: 'Join Before Offer Ends' };

export const pillars = {
  pill: 'Live Daily Classes',
  title: 'How Our Yoga Program Helps',
  subtitle: 'A science-backed, holistic approach that works on all 3 pillars of wellness.',
  items: [
    { icon: 'flame', tone: 'orange', title: 'Weight Management', sub: 'Burn, Build & Transform', points: ['Burn calories effectively', 'Improve metabolism naturally', 'Build lean strength'] },
    { icon: 'wind', tone: 'green', title: 'Flexibility & Mobility', sub: 'Move Freely Again', points: ['Reduce chronic stiffness', 'Improve posture & alignment', 'Enhance joint mobility'] },
    { icon: 'sparkles', tone: 'blue', title: 'Mental Wellness', sub: 'Find Calm & Clarity', points: ['Reduce stress & anxiety', 'Improve sleep quality', 'Master breathing techniques'] },
  ],
};

// Animated counters (final values from the live site).
export const trust = {
  title: 'Trusted by Students Worldwide',
  items: [
    { icon: 'users', tone: 'green', to: 5241, suffix: '', label: 'Happy Students' },
    { icon: 'award', tone: 'orange', to: 500, suffix: '', label: 'Transformations' },
    { icon: 'calendar', tone: 'blue', to: 12, suffix: '+', label: 'Years Experience' },
    { icon: 'globe', tone: 'green', to: 1, suffix: 'M+', label: 'Social Audience' },
  ],
};

export const reels = {
  title: 'Instagram Videos',
  subtitle: 'Short Videos, Big Impact',
  items: [1, 2, 3, 4].map((n) => ({ src: `/media/2026/03/instagram-tempelate-${n}.mp4`, poster: `/media/2026/03/instagram-tempelate-${n}.webp` })),
  cta: 'View More Videos on Instagram',
};

export const coach = {
  title: 'Meet Your Yoga Coach',
  image: { src: media('2025/11/hero-img.png'), alt: 'Yogacharya Ravinder' },
  badge1: { value: '5,000+', label: 'Transformations' },
  badge2: { value: '12+', label: 'Years Teaching' },
  name: 'Acharya Ravinder',
  role: 'Certified Yoga Acharya · Patanjali Trained',
  bio: 'With over 12 years of yoga teaching, Acharya Ravinder has helped thousands of students across India and abroad transform their bodies and minds. His teaching style is empathetic, precise, and deeply rooted in traditional Hatha & Vinyasa yoga principles.',
  points: [
    '12+ years of dedicated yoga teaching experience',
    'Trained at Patanjali Yogpeeth, Haridwar',
    'Taught students from 20+ countries internationally',
    '5,000+ successful student transformations documented',
    'Specializes in therapeutic & weight-loss yoga',
    'Personal attention approach — every student matters',
  ],
  cta: { label: 'Start Your Journey With Me', href: '#pricing' },
};

export const transformations = {
  title: 'Real Student Transformations',
  subtitle: 'Real results from real students who followed the system consistently.',
  items: [
    { src: media('2026/04/image-5.webp'), alt: 'Yoga body transformation', label: 'Lost 4 kg in 21 days' },
    { src: media('2026/04/image-7.webp'), alt: 'Yoga weight loss transformation', label: 'Lost 12 kg in 3 months' },
    { src: media('2026/04/image-6.webp'), alt: 'Before and after weight loss yoga', label: 'Lost 10 kg in 2 months' },
  ],
  stats: [
    { value: '3–6 kg', label: 'Average weight loss in 21 days' },
    { value: '5,000+', label: 'Students trained' },
    { value: '4.9', star: true, label: 'Average student rating' },
  ],
  cta: { label: 'Start My Transformation', href: '#pricing' },
};

export const testimonials = {
  pill: 'Real People, Real Results',
  title: 'Real Student Results',
  subtitle: 'No actors, no paid reviews. These are stories from real students who transformed their lives.',
  items: [
    { quote: 'I lost 8 kgs in 3 months! I was skeptical about online yoga but Acharya Ravinder’s live sessions kept me accountable. The morning batch at 6 AM changed my entire day’s energy.', name: 'Priya Sharma', place: 'Delhi · Age 34', duration: '3 months' },
    { quote: 'My back pain of 5 years reduced by 80% within 2 months of joining. The flexibility routines are progressive and beginner-friendly. Best investment I made for my health.', name: 'Rajesh Kumar', place: 'Mumbai · Age 47', duration: '6 months' },
    { quote: 'I was stressed and not sleeping well. After just 1 month of evening yoga + meditation, I sleep like a baby. The diet plan was a bonus that helped me lose 3 kgs too!', name: 'Anita Verma', place: 'Bangalore · Age 29', duration: '1 month' },
    { quote: 'I am a 52-year-old with diabetes and high BP. After 12 months, both are under control without increasing my medication dosage. Acharya ji gives personal attention which is rare.', name: 'Suresh Nair', place: 'Kerala · Age 52', duration: '12 months' },
    { quote: 'I joined as a complete beginner. The pace is perfect and Acharya Ravinder explains every asana in detail. I’ve finally built a consistent routine after years of trying.', name: 'Meena Agarwal', place: 'Pune · Age 38', duration: '3 months' },
    { quote: 'Lost 12 kgs and gained so much confidence. The whatsapp group keeps us motivated and the recordings help me catch up on days I miss. Worth every rupee!', name: 'Kavita Singh', place: 'Hyderabad · Age 41', duration: '6 months' },
  ],
};

export const faq = {
  title: 'Frequently Asked Questions',
  subtitle: 'Have more questions? WhatsApp us at',
  items: [
    { q: 'Is this program beginner-friendly?', a: 'Yes, absolutely. The program is designed for beginners, with simple step-by-step guidance so you can start comfortably from day one—no prior experience required.' },
    { q: 'On which platform are the classes held?', a: 'Classes are held live on Zoom and Google Meet. You will receive your unique meeting link after enrollment, and you can join from your phone, tablet or laptop.' },
    { q: 'What is the refund policy?', a: 'We offer a 7-day money-back guarantee on the 6-Months and 12-Months plans — just message us on WhatsApp within 7 days. The 1-Month and 3-Months plans are non-refundable.' },
    { q: 'What payment options are available?', a: 'You can pay via UPI (GPay, PhonePe, Paytm), net banking, credit/debit cards and EMI. If you need help with payment, message us on WhatsApp.' },
    { q: 'Can I change my class timing after enrolling?', a: 'Yes. Message us on WhatsApp and we will move you to another batch, based on availability.' },
    { q: 'Are class recordings available if I miss a session?', a: 'Yes. Recordings are available for all sessions, so you can catch up on any class you miss and watch anytime.' },
  ],
};

export const finalCta = {
  pill: 'Live Daily Classes',
  title: 'Ready To Start Your Transformation?',
  text: 'Start your yoga journey today and feel the difference in just 5 days. Your best self is one decision away.',
  primary: { label: 'Join Now — Best Offer', icon: '🎯', href: '#pricing' },
  secondary: { label: 'Start 5-Day Trial First', icon: '🌟', href: '#trial' },
  proof: ['Join ', '5,241', ' students already practicing with us'],
};

export const sticky = { label: 'Offer Ends In:', cta: 'Join 3 Month Plan', href: '#pricing' };
