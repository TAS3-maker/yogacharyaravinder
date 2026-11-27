// Landing content for the public pages: offers, prices, schedules, reviews, FAQ (edited in /admin → Landing pages).
// Used by the API (server/app.js), the build (scripts/prerender.mjs) and the seed script.
import { connect, Landing, Post } from './db.js';
import { CMS_PAGES, PAYMENTS, defaults, merged, normalize, planCatalog } from '../src/data/cms.js';
import { SITE } from '../src/site.config.js';

export const LANDING_KEYS = [...Object.keys(CMS_PAGES), PAYMENTS];
const stamp = (d) => (d ? new Date(d).toISOString() : 'seed');

async function savedDocs() {
  const docs = await Landing.find({ page: { $in: LANDING_KEYS } }).lean();
  return Object.fromEntries(docs.map((d) => [d.page, d]));
}

// Latest 3 blog posts (shown on /yoga-classes-for-weight-loss/)
export async function latestPosts(n = 3) {
  const posts = await Post.find({ status: 'published', date: { $lte: new Date() } })
    .select('slug title excerpt date image updatedAt').sort({ date: -1, _id: -1 }).limit(n).lean();
  return posts.map((p) => ({ slug: p.slug, title: p.title, excerpt: p.excerpt || '', date: p.date.toISOString(), image: p.image?.src ? p.image : null, updatedAt: p.updatedAt }));
}

/** What a page receives as `cms` (public: no admin-only fields). */
export async function landingPayload(page, docs, { posts = true } = {}) {
  docs ??= await savedDocs();
  if (page === 'thank-you') {
    const all = Object.fromEntries(Object.entries(docs).map(([k, d]) => [k, d.data]));
    const newest = Object.values(docs).map((d) => +new Date(d.updatedAt)).sort().pop();
    return { page, updatedAt: stamp(newest), catalog: planCatalog(all) };
  }
  if (!CMS_PAGES[page]) return null;
  const doc = docs[page];
  const out = { page, updatedAt: stamp(doc?.updatedAt), ...merged(page, doc?.data) };
  if (page === 'yoga-classes-for-weight-loss') {
    out.posts = posts ? await latestPosts() : [];
    out.updatedAt += '|' + (out.posts[0] ? stamp(out.posts[0].updatedAt) + out.posts.length : '0');
    out.posts.forEach((p) => delete p.updatedAt);
  }
  return out;
}

/** Admin: the full editable values for a page (defaults merged with what was saved). */
export async function landingForAdmin(page) {
  const doc = await Landing.findOne({ page }).lean();
  return { page, updatedAt: doc?.updatedAt || null, updatedBy: doc?.updatedBy || '', data: merged(page, doc?.data), saved: !!doc };
}

export async function saveLanding(page, body, user) {
  const data = normalize(page, body);
  if (!data) throw Object.assign(new Error('Unknown page'), { status: 404 });
  const doc = await Landing.findOneAndUpdate(
    { page },
    { $set: { data, updatedBy: user?.email || '' } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).lean();
  const rebuilding = await triggerRebuild();
  return { page, updatedAt: doc.updatedAt, updatedBy: doc.updatedBy, data: merged(page, doc.data), saved: true, rebuilding };
}

export async function resetLanding(page) {
  await Landing.deleteOne({ page });
  const rebuilding = await triggerRebuild();
  return { ...(await landingForAdmin(page)), rebuilding };
}

// Rebuild the static pages so the new prices are in the HTML itself (SEO, first paint).
// Set DEPLOY_HOOK_URL to a Vercel Deploy Hook (Project → Settings → Git → Deploy Hooks).
// Called inside the save request (serverless functions stop once they respond). Never blocks a save for long.
export async function triggerRebuild() {
  const url = process.env.DEPLOY_HOOK_URL;
  if (!url) return false;
  try {
    const r = await fetch(url, { method: 'POST', signal: AbortSignal.timeout(5000) });
    return r.ok;
  } catch (e) {
    console.error('Deploy hook failed:', e.message);
    return false;
  }
}

/** Build time: every page's content + Razorpay button ids. Falls back to the seed if MongoDB isn't reachable. */
export async function loadForBuild(keys) {
  const seed = async (why) => {
    const pages = {};
    for (const k of keys) pages[k] = await landingPayload(k, {}, { posts: false });
    return { pages, buttons: SITE.razorpay, source: `seed (${why})` };
  };
  if (!process.env.MONGODB_URI) return seed('MONGODB_URI not set');
  try {
    await Promise.race([connect(), new Promise((_, no) => setTimeout(() => no(new Error('timeout')), 10000))]);
    const docs = await savedDocs();
    const pages = {};
    for (const k of keys) pages[k] = await landingPayload(k, docs);
    const buttons = merged(PAYMENTS, docs[PAYMENTS]?.data).buttons;
    return { pages, buttons, source: `MongoDB (${Object.keys(docs).length} saved)` };
  } catch (e) {
    return seed(`MongoDB unavailable: ${e.message}`);
  }
}

/** Seed: write the current page content into MongoDB (only pages that aren't saved yet, unless reset). */
export async function seedLanding({ reset = false } = {}) {
  await connect();
  const done = [];
  for (const page of LANDING_KEYS) {
    if (!reset && (await Landing.exists({ page }))) continue;
    await Landing.updateOne({ page }, { $set: { data: normalize(page, defaults(page)), updatedBy: 'seed' } }, { upsert: true });
    done.push(page);
  }
  return done;
}

/** Razorpay: read a payment with the secret key (server only) → only what the Thank You page shows. */
export async function razorpayPayment(id) {
  const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) return { status: 503, body: { error: 'Razorpay keys not set' } };
  const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
  const r = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(id)}`, { headers: { Authorization: `Basic ${auth}` } });
  if (!r.ok) return { status: 404, body: { error: 'Payment not found' } };
  const p = await r.json();
  if (!['captured', 'authorized'].includes(p.status)) return { status: 409, body: { status: p.status } };
  const notes = p.notes || {};
  const full = String(notes.name || notes.full_name || notes.customer_name || '').trim();
  return { status: 200, body: { id: p.id, status: p.status, amount: p.amount / 100, currency: p.currency, firstName: full.split(/\s+/)[0] || '' } };
}
