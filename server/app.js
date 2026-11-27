// Express API for the admin panel, mounted in Vercel and local Vite.
import express from 'express';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { clean } from './post-html.js';
import { MAX_IMAGE_BYTES } from '../src/media-limits.js';
import crypto from 'node:crypto';
import { connect, User, Post, Category, LoginAttempt, slugify } from './db.js';
import { putMedia, getMedia, deleteMedia, listMedia, typeOf } from './media.js';
import { LANDING_KEYS, landingPayload, landingForAdmin, saveLanding, resetLanding, razorpayPayment } from './landing.js';
import { CMS_PAGES, PAYMENTS } from '../src/data/cms.js';

const COOKIE = 'yr_admin';
const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
const secret = () => {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 32) throw new Error('JWT_SECRET must be set (32+ random characters)');
  return s;
};

// ---------- helpers ----------
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const bad = (res, status, error) => res.status(status).json({ error });
const publicUser = (u) => ({ id: u._id, email: u.email, name: u.name, role: u.role });

async function uniqueSlug(Model, wanted, id) {
  const base = slugify(wanted);
  let slug = base;
  for (let i = 2; await Model.exists({ slug, ...(id ? { _id: { $ne: id } } : {}) }); i++) slug = `${base}-${i}`;
  return slug;
}

// ---------- auth ----------
function setSession(res, user) {
  const token = jwt.sign({ sub: String(user._id), v: user.tokenVersion }, secret(), { expiresIn: '7d' });
  res.cookie(COOKIE, token, { httpOnly: true, secure: isProd, sameSite: 'strict', path: '/', maxAge: 7 * 24 * 3600 * 1000 });
}

const auth = (role) =>
  wrap(async (req, res, next) => {
    const token = req.cookies?.[COOKIE];
    if (!token) return bad(res, 401, 'Not logged in');
    let payload;
    try { payload = jwt.verify(token, secret()); } catch { return bad(res, 401, 'Session expired'); }
    const user = await User.findById(payload.sub);
    if (!user || user.tokenVersion !== payload.v) return bad(res, 401, 'Session expired');
    if (role === 'admin' && user.role !== 'admin') return bad(res, 403, 'Admins only');
    req.user = user;
    next();
  });

// CSRF guard: state-changing requests must come from our own admin (custom header + SameSite=strict cookie)
const csrf = (req, res, next) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  if (req.get('x-requested-with') !== 'yr-admin') return bad(res, 403, 'Bad request origin');
  next();
};

// ---------- app ----------
export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', true);
  app.use(express.json({ limit: '8mb' }));
  app.use(cookieParser());

  const r = express.Router();
  r.use((req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
  r.use(csrf);
  // Public: images uploaded through the CMS (used by the editor preview and by the site build)
  r.get(/^\/media\/(.+)$/, wrap(async (req, res) => {
    const key = decodeURIComponent(req.params[0]);
    const buf = await getMedia(key);
    if (!buf) return bad(res, 404, 'Not found');
    res.set('Content-Type', typeOf(key)).set('Cache-Control', 'public, max-age=31536000, immutable').send(buf);
  }));

  r.use(wrap(async (req, res, next) => { await connect(); next(); }));

  // ----- landing pages (public read: used by the pages to pick up new prices without waiting for a rebuild) -----
  const isLanding = (p) => p === 'thank-you' || !!CMS_PAGES[p];
  r.get('/landing/:page', wrap(async (req, res) => {
    if (!isLanding(req.params.page)) return bad(res, 404, 'Not found');
    res.set('Cache-Control', 'public, max-age=30, s-maxage=60, stale-while-revalidate=300');
    res.json(await landingPayload(req.params.page));
  }));
  // Thank You page: amount actually paid (needs RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET)
  r.get('/razorpay-payment', wrap(async (req, res) => {
    const id = String(req.query.id || '');
    if (!/^pay_[A-Za-z0-9]{6,30}$/.test(id)) return bad(res, 400, 'Invalid payment id');
    const { status, body } = await razorpayPayment(id);
    if (status === 200) res.set('Cache-Control', 'private, max-age=300');
    res.status(status).json(body);
  }));

  r.post('/auth/login', wrap(async (req, res) => {
    secret(); // config check
    const email = String(req.body?.email || '').toLowerCase().trim();
    const password = String(req.body?.password || '');
    if (!email || !password) return bad(res, 400, 'Email and password are required');
    const key = `${email}|${req.ip}`;
    if ((await LoginAttempt.countDocuments({ key })) >= 8) return bad(res, 429, 'Too many attempts. Try again in 15 minutes.');

    // First run: create the owner account from ADMIN_EMAIL / ADMIN_PASSWORD env vars
    if ((await User.estimatedDocumentCount()) === 0 && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD
      && email === process.env.ADMIN_EMAIL.toLowerCase() && password === process.env.ADMIN_PASSWORD) {
      await User.create({ email, name: 'Admin', role: 'admin', passwordHash: await bcrypt.hash(password, 12) });
    }

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      await LoginAttempt.create({ key });
      return bad(res, 401, 'Wrong email or password');
    }
    await LoginAttempt.deleteMany({ key });
    setSession(res, user);
    res.json({ user: publicUser(user) });
  }));

  r.post('/auth/logout', (req, res) => {
    res.clearCookie(COOKIE, { path: '/' });
    res.json({ ok: true });
  });

  r.get('/auth/me', auth(), (req, res) => res.json({ user: publicUser(req.user) }));

  r.post('/auth/password', auth(), wrap(async (req, res) => {
    const { current, next } = req.body || {};
    if (!(await bcrypt.compare(String(current || ''), req.user.passwordHash))) return bad(res, 400, 'Current password is wrong');
    if (String(next || '').length < 10) return bad(res, 400, 'New password must be at least 10 characters');
    req.user.passwordHash = await bcrypt.hash(next, 12);
    req.user.tokenVersion += 1; // logs out other devices
    await req.user.save();
    setSession(res, req.user);
    res.json({ ok: true });
  }));

  // ----- users (admins only) -----
  r.get('/users', auth('admin'), wrap(async (req, res) => res.json({ users: (await User.find().sort('createdAt')).map(publicUser) })));
  r.post('/users', auth('admin'), wrap(async (req, res) => {
    const { email, name = '', password, role = 'editor' } = req.body || {};
    if (!email || String(password || '').length < 10) return bad(res, 400, 'Email and a password of 10+ characters are required');
    if (await User.exists({ email: String(email).toLowerCase() })) return bad(res, 409, 'A user with this email already exists');
    const u = await User.create({ email, name, role: role === 'admin' ? 'admin' : 'editor', passwordHash: await bcrypt.hash(password, 12) });
    res.status(201).json({ user: publicUser(u) });
  }));
  r.delete('/users/:id', auth('admin'), wrap(async (req, res) => {
    if (String(req.user._id) === req.params.id) return bad(res, 400, "You can't delete your own account");
    await User.deleteOne({ _id: req.params.id });
    res.json({ ok: true });
  }));

  // ----- categories -----
  r.get('/categories', auth(), wrap(async (req, res) => {
    const cats = await Category.find().sort('name').lean();
    const counts = await Post.aggregate([{ $unwind: '$categories' }, { $group: { _id: '$categories', n: { $sum: 1 } } }]);
    const n = Object.fromEntries(counts.map((c) => [String(c._id), c.n]));
    res.json({ categories: cats.map((c) => ({ ...c, count: n[String(c._id)] || 0 })) });
  }));
  r.post('/categories', auth(), wrap(async (req, res) => {
    const { name, description = '' } = req.body || {};
    if (!name?.trim()) return bad(res, 400, 'Name is required');
    const c = await Category.create({ name, description, slug: await uniqueSlug(Category, req.body.slug || name) });
    res.status(201).json({ category: c });
  }));
  r.put('/categories/:id', auth(), wrap(async (req, res) => {
    const { name, description = '', slug } = req.body || {};
    const c = await Category.findById(req.params.id);
    if (!c) return bad(res, 404, 'Not found');
    c.name = name || c.name;
    c.description = description;
    if (slug && slug !== c.slug) c.slug = await uniqueSlug(Category, slug, c._id);
    await c.save();
    res.json({ category: c });
  }));
  r.delete('/categories/:id', auth(), wrap(async (req, res) => {
    await Category.deleteOne({ _id: req.params.id });
    await Post.updateMany({}, { $pull: { categories: req.params.id } });
    res.json({ ok: true });
  }));

  // ----- posts -----
  r.get('/posts', auth(), wrap(async (req, res) => {
    const { q = '', status } = req.query;
    const find = {};
    if (status) find.status = status;
    if (q) find.title = { $regex: String(q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
    const limit = 30;
    const requested = Number(req.query.page ?? 1);
    const page = requested >= 1 && Number.isSafeInteger(requested) && Number.isSafeInteger((requested - 1) * limit) ? requested : 1;
    const loadPage = (number) => Post.find(find).select('title slug status date image categories updatedAt')
      .sort({ date: -1, _id: -1 }).skip((number - 1) * limit).limit(limit).populate('categories', 'name').lean();
    const [items, total] = await Promise.all([
      loadPage(page),
      Post.countDocuments(find),
    ]);
    const pages = Math.ceil(total / limit);
    const shownPage = Math.min(page, pages || 1);
    const posts = pages && shownPage !== page ? await loadPage(shownPage) : items;
    res.json({ posts, total, pages, page: shownPage });
  }));
  r.get('/posts/:id', auth(), wrap(async (req, res) => {
    const p = await Post.findById(req.params.id).lean();
    if (!p) return bad(res, 404, 'Not found');
    res.json({ post: p });
  }));

  const postFields = async (body, id) => {
    const out = {
      title: String(body.title || '').trim(),
      status: body.status === 'published' ? 'published' : 'draft',
      date: body.date ? new Date(body.date) : new Date(),
      excerpt: String(body.excerpt || '').trim(),
      content: clean(body.content),
      categories: Array.isArray(body.categories) ? body.categories : [],
      image: body.image?.src ? { src: body.image.src, alt: body.image.alt || '', width: body.image.width, height: body.image.height } : undefined,
      seo: { title: String(body.seo?.title || '').trim(), description: String(body.seo?.description || '').trim() },
    };
    if (!out.title) throw Object.assign(new Error('Title is required'), { status: 400 });
    if (Number.isNaN(out.date.getTime())) throw Object.assign(new Error('Enter a valid publish date'), { status: 400 });
    out.slug = await uniqueSlug(Post, body.slug || out.title, id);
    return out;
  };

  r.post('/posts', auth(), wrap(async (req, res) => {
    const p = await Post.create({ ...(await postFields(req.body)), author: req.user._id });
    res.status(201).json({ post: p });
  }));
  r.put('/posts/:id', auth(), wrap(async (req, res) => {
    const p = await Post.findById(req.params.id);
    if (!p) return bad(res, 404, 'Not found');
    Object.assign(p, await postFields(req.body, p._id));
    if (!p.image?.src) p.image = undefined;
    await p.save();
    res.json({ post: p });
  }));
  r.delete('/posts/:id', auth(), wrap(async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  }));

  // ----- landing pages (admins only: prices and payment buttons) -----
  r.get('/admin-landing', auth('admin'), (req, res) => res.json({
    pages: [...Object.entries(CMS_PAGES).map(([key, p]) => ({ key, label: p.label, path: p.path, sections: p.sections })),
      { key: PAYMENTS, label: 'Razorpay payment buttons', path: '', sections: ['buttons'] }],
    rebuild: !!process.env.DEPLOY_HOOK_URL,
  }));
  r.get('/admin-landing/:page', auth('admin'), wrap(async (req, res) => {
    if (!LANDING_KEYS.includes(req.params.page)) return bad(res, 404, 'Not found');
    res.json(await landingForAdmin(req.params.page));
  }));
  r.put('/admin-landing/:page', auth('admin'), wrap(async (req, res) => {
    if (!LANDING_KEYS.includes(req.params.page)) return bad(res, 404, 'Not found');
    res.json(await saveLanding(req.params.page, req.body?.data || {}, req.user));
  }));
  r.delete('/admin-landing/:page', auth('admin'), wrap(async (req, res) => {
    if (!LANDING_KEYS.includes(req.params.page)) return bad(res, 404, 'Not found');
    res.json(await resetLanding(req.params.page));
  }));

  // ----- media -----
  r.get('/media-library', auth(), wrap(async (req, res) => res.json({ items: (await listMedia('cms/')).reverse().map((k) => ({ key: k, url: '/api/media/' + k })) })));
  r.post('/media', auth(), wrap(async (req, res) => {
    const { name = 'image', data } = req.body || {};
    const m = /^data:(image\/(png|jpe?g|webp|gif|avif));base64,(.+)$/.exec(String(data || ''));
    if (!m) return bad(res, 400, 'Send a PNG, JPG, WebP, GIF or AVIF image');
    const buf = Buffer.from(m[3], 'base64');
    if (buf.length > MAX_IMAGE_BYTES) return bad(res, 413, 'Image is larger than 3 MB');
    const ext = m[2] === 'jpeg' ? 'jpg' : m[2];
    const d = new Date();
    const key = `cms/${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${slugify(name.replace(/\.[a-z0-9]+$/i, '')).slice(0, 50)}-${crypto.randomBytes(3).toString('hex')}.${ext}`;
    await putMedia(key, buf, { by: String(req.user._id) });
    res.status(201).json({ key, url: '/api/media/' + key });
  }));
  r.delete(/^\/media\/(.+)$/, auth(), wrap(async (req, res) => {
    await deleteMedia(decodeURIComponent(req.params[0]));
    res.json({ ok: true });
  }));

  r.use((req, res) => bad(res, 404, 'Unknown API route'));

  app.use('/api', r);
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (err.code === 11000) return bad(res, 409, 'That slug or email is already used');
    if (err.name === 'CastError') return bad(res, 404, 'Not found');
    // Missing setup (env vars / database) → say exactly what's wrong instead of a generic error
    if (/MONGODB_URI|JWT_SECRET/.test(err.message)) return bad(res, 503, `Admin not configured: ${err.message}. Add it to .env (local) or Vercel environment variables.`);
    if (/ECONNREFUSED|ENOTFOUND|querySrv|Server selection timed out|MongoServerSelectionError|bad auth|Authentication failed/i.test(err.message + err.name))
      return bad(res, 503, `Can't connect to MongoDB (${err.message.slice(0, 120)}). Check MONGODB_URI and Atlas → Network Access (allow 0.0.0.0/0).`);
    console.error(err);
    bad(res, err.status || 500, err.status ? err.message : 'Server error');
  });
  return app;
}
