// Seeds /admin → Landing pages with the content currently on the site (src/data/*.js):
// offers, prices, Razorpay buttons, class timings, reviews, FAQ and SEO for every landing page.
//   npm run seed-landing             → adds only pages that aren't in the database yet (safe to re-run; keeps admin edits)
//   npm run seed-landing -- --reset  → overwrites every landing page with the original content
import 'dotenv/config';
import mongoose from 'mongoose';
import { seedLanding } from '../server/landing.js';

const reset = process.argv.includes('--reset');
if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not set (add it to .env)');
  process.exit(1);
}
try {
  const done = await seedLanding({ reset });
  console.log(done.length ? `Seeded: ${done.join(', ')}` : 'Nothing to seed: every landing page is already in the database (use --reset to overwrite).');
} catch (e) {
  console.error('Seeding failed:', e.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
