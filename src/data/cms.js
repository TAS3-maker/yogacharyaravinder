// Admin-managed landing content (offers, pricing, schedules, reviews, FAQ, SEO).
//
// One module, used everywhere:
//   • defaults(page)        → the seed: built from the data files in this folder (so they stay the source of truth)
//   • normalize(page, body) → cleans what the admin sends (server, before saving)
//   • apply*(data, cms)     → puts the admin's values into a page's data (pages, at build time and in the browser)
//
// Prices are stored as numbers (₹, no paise). "% OFF" is always calculated from MRP and price.
import * as dp from './discountPricing.js';
import * as home from './home.js';
import * as c21 from './challenge21.js';
import * as wl from './weightLoss.js';
import * as oy from './oneYear.js';
import { SITE } from '../site.config.js';

import { inr, offPct } from './cms-apply.js';
export * from './cms-apply.js';
export const num = (s) => (typeof s === 'number' ? s : Number(String(s ?? '').replace(/[^\d.]/g, '')) || 0);

// Pages the admin can edit, and which sections each one has (drives the admin form too).
export const CMS_PAGES = {
  'discount-pricing': { label: 'Discount Pricing (Winter Offer)', path: '/discount-pricing/', sections: ['offer', 'plans', 'trial', 'schedule', 'testimonials', 'faq', 'seo'] },
  home: { label: 'Homepage', path: '/', sections: ['slots', 'plans', 'trial', 'schedule', 'testimonials', 'faq', 'seo'] },
  '21-days-weight-loss-challenge': { label: '21 Day Weight Loss Challenge', path: '/21-days-weight-loss-challenge/', sections: ['offer', 'plans', 'schedule', 'inside', 'bonus', 'faq', 'seo'] },
  'yoga-classes-for-weight-loss': { label: 'Yoga Classes for Weight Loss', path: '/yoga-classes-for-weight-loss/', sections: ['plans', 'stories', 'reviews', 'faq', 'seo'] },
  'one-year-yoga-plan': { label: 'One Year Yoga Plan (₹10/day)', path: '/one-year-yoga-plan/', sections: ['offer', 'plans', 'schedule', 'testimonials', 'faq', 'seo'] },
};
// Global Razorpay payment button ids (key = the button's element id used on the pages)
export const PAYMENTS = '_payments';

/* ------------------------------------------------------------------ defaults (seed) */
const planOf = (p, extra = {}) => ({
  pay: p.pay, name: p.name, sub: p.days || p.duration || p.sub || '', price: num(p.price), mrp: p.mrp ? num(p.mrp) : null,
  perMonth: p.perMonth ? num(p.perMonth) : null, badge: p.badge || '', popular: !!p.popular, features: [...(p.features || [])],
  cta: p.cta || '', active: true, ...extra,
});
const trialOf = (c) => ({ pay: c.pay, name: c.name, sub: c.sub, price: num(c.price), text: c.text, features: [...c.features], cta: c.cta, active: true });
const rows = (list) => list.map((r) => ({ icon: r.icon || '', time: r.time, name: r.name }));
const seoOf = (m) => ({ title: m.title, description: m.description });

export function defaults(page) {
  switch (page) {
    case 'discount-pricing':
      return {
        seo: seoOf(dp.meta),
        offer: {
          active: true, name: dp.pricing.title, icon: '❄️', upTo: num(dp.pricing.titleOff), slots: num(dp.hero.pill), hours: 10, endsAt: null,
          bar: dp.offerBar.map((b) => ({ icon: b.icon || '', text: b.text })), sticky: dp.sticky.cta,
        },
        plans: dp.pricing.plans.map((p) => planOf(p)),
        trial: dp.trial.cards.map(trialOf),
        schedule: { morning: rows(dp.schedule.morning), evening: rows(dp.schedule.evening) },
        testimonials: dp.testimonials.items.map((t) => ({ ...t })),
        faq: dp.faq.items.map((f) => ({ ...f })),
      };
    case 'home':
      return {
        seo: seoOf(home.meta),
        offer: { slots: num(home.hero.pill) },
        plans: home.pricing.plans.map((p) => planOf(p)),
        trial: home.trial.cards.map(trialOf),
        schedule: { morning: rows(home.schedule.morning), evening: rows(home.schedule.evening) },
        testimonials: home.testimonials.items.map((t) => ({ ...t })),
        faq: home.faq.items.map((f) => ({ ...f })),
      };
    case '21-days-weight-loss-challenge':
      return {
        seo: seoOf(c21.meta),
        offer: { active: true, hours: c21.offer.hours, endsAt: null, bar: c21.offer.bar.map((b) => ({ icon: b.icon || '', text: b.text })) },
        plans: [planOf(c21.plan)],
        schedule: { morning: rows(c21.join.morning), evening: rows(c21.join.evening) },
        inside: [...c21.inside.items],
        bonus: [...c21.inside.bonus],
        faq: c21.faq.items.map((f) => ({ ...f })),
      };
    case 'yoga-classes-for-weight-loss':
      return {
        seo: seoOf(wl.meta),
        plans: wl.pricing.plans.map((p) => planOf(p)),
        stories: wl.stories.items.map((s) => ({ ...s })),
        reviews: wl.reviews.items.map((r) => ({ ...r })),
        faq: wl.faq.items.map((f) => ({ ...f })),
      };
    case 'one-year-yoga-plan':
      return {
        seo: seoOf(oy.meta),
        offer: {
          active: true, name: 'Summer Special Offer', icon: '🎉', slots: num(oy.hero.pill), hours: 10, endsAt: null,
          bar: oy.offerBar.map((b) => ({ icon: b.icon || '', text: b.text })),
        },
        plans: [planOf(oy.plan, { offText: oy.plan.offText, tag: oy.plan.tag })],
        schedule: { morning: rows(oy.schedule.morning), evening: rows(oy.schedule.evening) },
        testimonials: oy.testimonials.items.map((t) => ({ ...t })),
        faq: oy.faq.items.map((f) => ({ ...f })),
      };
    case PAYMENTS:
      return { buttons: { ...SITE.razorpay } };
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ normalize (server-side clean-up) */
const str = (v, max = 400) => String(v ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max);
const money = (v) => (v === null || v === undefined || v === '' ? null : Math.max(0, Math.min(1e7, Math.round(Number(v) || 0))));
const list = (v, fn, max = 40) => (Array.isArray(v) ? v.slice(0, max).map(fn).filter(Boolean) : undefined);
const strs = (v, max = 30, len = 200) => list(v, (x) => str(x, len) || null, max);
const date = (v) => { if (!v) return null; const t = Date.parse(v); return Number.isNaN(t) ? null : new Date(t).toISOString(); };

export function normalize(page, body = {}) {
  const def = defaults(page);
  if (!def) return null;
  if (page === PAYMENTS) {
    const out = {};
    for (const [k, v] of Object.entries(body.buttons || {})) {
      const key = str(k, 60).replace(/[^a-z0-9-]/gi, '');
      const id = str(v, 40);
      if (key && /^pl_[A-Za-z0-9]{6,30}$/.test(id)) out[key] = id;
    }
    return { buttons: out };
  }
  const out = {};
  if (body.seo) out.seo = { title: str(body.seo.title, 120), description: str(body.seo.description, 300) };
  if (body.offer && def.offer) {
    const o = body.offer;
    out.offer = {};
    if ('active' in def.offer) out.offer.active = !!o.active;
    if ('name' in def.offer) out.offer.name = str(o.name, 60);
    if ('icon' in def.offer) out.offer.icon = str(o.icon, 8);
    if ('upTo' in def.offer) out.offer.upTo = Math.max(0, Math.min(99, Math.round(Number(o.upTo) || 0)));
    if ('slots' in def.offer) out.offer.slots = Math.max(0, Math.min(999, Math.round(Number(o.slots) || 0)));
    if ('hours' in def.offer) out.offer.hours = Math.max(1, Math.min(720, Number(o.hours) || def.offer.hours));
    if ('endsAt' in def.offer) out.offer.endsAt = date(o.endsAt);
    if ('bar' in def.offer) out.offer.bar = def.offer.bar.map((d, i) => ({ icon: str(o.bar?.[i]?.icon, 8), text: str(o.bar?.[i]?.text, 80) || d.text }));
    if ('sticky' in def.offer) out.offer.sticky = str(o.sticky, 40) || def.offer.sticky;
  }
  // Plans and trial cards: same set as the page (matched by Razorpay key); the admin edits them, can hide them, can't invent new keys.
  const editPlans = (incoming, base, isTrial) => base.map((d) => {
    const p = (incoming || []).find((x) => x?.pay === d.pay) || d;
    const o = {
      pay: d.pay, name: str(p.name, 80) || d.name, sub: str(p.sub, 80), price: money(p.price) ?? 0, active: p.active !== false,
      features: strs(p.features, 12, 80) ?? d.features, cta: str(p.cta, 40) || d.cta,
    };
    if (isTrial) o.text = str(p.text, 300);
    else Object.assign(o, { mrp: money(p.mrp), perMonth: money(p.perMonth), badge: str(p.badge, 20), popular: !!p.popular });
    if ('offText' in d) o.offText = str(p.offText, 20);
    if ('tag' in d) o.tag = str(p.tag, 40);
    return o;
  });
  if (body.plans && def.plans) out.plans = editPlans(body.plans, def.plans, false);
  if (body.trial && def.trial) out.trial = editPlans(body.trial, def.trial, true);
  if (body.schedule && def.schedule) {
    const r = (x) => (x && str(x.time, 40) ? { icon: str(x.icon, 8), time: str(x.time, 40), name: str(x.name, 60) } : null);
    out.schedule = { morning: list(body.schedule.morning, r, 8) ?? [], evening: list(body.schedule.evening, r, 8) ?? [] };
  }
  if (body.testimonials && def.testimonials) out.testimonials = list(body.testimonials, (t) => (str(t?.quote) ? { quote: str(t.quote, 500), name: str(t.name, 60), place: str(t.place, 60), duration: str(t.duration, 30) } : null), 24);
  if (body.faq && def.faq) out.faq = list(body.faq, (f) => (str(f?.q) ? { q: str(f.q, 200), a: str(f.a, 1200) } : null), 30);
  if (body.inside && def.inside) out.inside = strs(body.inside, 15, 100);
  if (body.bonus && def.bonus) out.bonus = strs(body.bonus, 10, 100);
  if (body.stories && def.stories) out.stories = list(body.stories, (s) => (str(s?.title) ? { title: str(s.title, 120), text: str(s.text, 500), name: str(s.name, 60) } : null), 12);
  if (body.reviews && def.reviews) out.reviews = list(body.reviews, (r) => (str(r?.quote) ? { quote: str(r.quote, 400), name: str(r.name, 60) } : null), 12);
  return out;
}

/** Saved values over defaults (sections replace whole; plans keep the page's set and order). */
export function merged(page, saved) {
  const def = defaults(page);
  if (!def || !saved) return def;
  const out = { ...def };
  for (const k of Object.keys(def)) {
    if (saved[k] === undefined || saved[k] === null) continue;
    if (k === 'plans' || k === 'trial') out[k] = def[k].map((d) => ({ ...d, ...(saved[k].find((s) => s.pay === d.pay) || {}) }));
    else if (k === 'offer' || k === 'seo' || k === 'buttons') out[k] = { ...def[k], ...saved[k] };
    else out[k] = saved[k];
  }
  return out;
}

/** Every sellable plan by Razorpay key → { name, price } (Thank You page). */
export function planCatalog(all = {}) {
  const out = {};
  for (const page of Object.keys(CMS_PAGES)) {
    const m = merged(page, all[page]);
    for (const p of [...(m.plans || []), ...(m.trial || [])]) {
      // Homepage-style plans are named "Basic", "Pro"… → "Basic Plan (1 Month)"
      const name = p.perMonth && p.sub && !/\s/.test(p.name.trim()) ? `${p.name} Plan (${p.sub})` : p.name;
      if (!out[p.pay]) out[p.pay] = { name, price: p.price };
    }
  }
  // Same Razorpay buttons used elsewhere on the site
  out['discounted-pro-plan'] ??= out['disc-pro-plan'];
  out['start-journey'] ??= out['disc-standard-plan'];
  out['pro-plan'] ??= out['yfwl-6month-plan'];
  out['one-year-yoga-plan'] ??= { name: '1-Year Yoga Plan', price: null };
  return out;
}
