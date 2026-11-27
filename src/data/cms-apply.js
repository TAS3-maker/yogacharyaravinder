// Page-side half of the admin content: turns the admin's values (`cms`) into a page's data.
// Kept separate from cms.js so public pages don't download every page's default content.
export const inr = (n) => (n === null || n === undefined || n === '' || Number.isNaN(Number(n)) ? '' : '₹' + Number(n).toLocaleString('en-IN'));
export const offPct = (p) => (p.mrp > p.price && p.price > 0 ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0);
const fill = (t, vars) => String(t ?? '').replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? ''));

/* ------------------------------------------------------------------ apply (pages) */
const meta = (m, c) => (c?.seo ? { ...m, title: c.seo.title || m.title, description: c.seo.description || m.description } : m);
const byPay = (list, pay) => list?.find((x) => x.pay === pay);
const sched = (base, c) => (c?.schedule
  ? { ...base, morning: c.schedule.morning.map((r) => ({ ...r, icon: r.icon || '⏰' })), evening: c.schedule.evening.map((r, i) => ({ ...r, icon: r.icon || (i % 2 ? '🕯️' : '🌆') })) }
  : base);

function pricedPlans(basePlans, cPlans, kind) {
  if (!cPlans) return basePlans;
  return basePlans
    .map((b) => {
      const c = byPay(cPlans, b.pay);
      if (!c) return b;
      if (c.active === false) return null;
      const p = { ...b, name: c.name || b.name, features: c.features?.length ? c.features : b.features, cta: c.cta || b.cta, price: inr(c.price) };
      if (kind === 'discount') Object.assign(p, { days: c.sub || b.days, mrp: c.mrp ? inr(c.mrp) : '', off: offPct(c) ? offPct(c) + '%' : '', popular: c.popular });
      if (kind === 'ladder') Object.assign(p, { duration: c.sub || b.duration, perMonth: c.perMonth ? inr(c.perMonth) : '', badge: c.badge, popular: c.popular });
      if (kind === 'trial') Object.assign(p, { sub: c.sub || b.sub, text: c.text || b.text });
      return p;
    })
    .filter(Boolean);
}

export function applyDiscount(d, c) {
  if (!c) return { ...d, offerOn: true, countdown: { hours: 10 } };
  const o = c.offer || {};
  const on = o.active !== false;
  const trialCard = byPay(c.trial, 'yoga-trial-1');
  const bar = d.offerBar.map((b, i) => ({ ...b, icon: o.bar?.[i]?.icon ?? b.icon, text: o.bar?.[i]?.text || b.text }));
  return {
    ...d,
    offerOn: on,
    countdown: { hours: o.hours, endsAt: o.endsAt, key: 'yr_offer_deadline' },
    meta: meta(d.meta, c),
    offerBar: bar,
    hero: {
      ...d.hero,
      pill: o.slots > 0 ? `🔥 Only ${o.slots} slots left for the batch` : '',
      secondary: trialCard ? { ...d.hero.secondary, label: `Start 5 Day Trial — ${inr(trialCard.price)}` } : d.hero.secondary,
    },
    pricing: {
      ...d.pricing,
      icon: on ? o.icon : '',
      title: on ? o.name || d.pricing.title : 'Choose Your Yoga Plan',
      titleSuffix: on && o.upTo ? d.pricing.titleSuffix : '',
      titleOff: on && o.upTo ? `${o.upTo}% OFF` : '',
      pill: on ? d.pricing.pill : '',
      warning: on ? d.pricing.warning : '',
      plans: pricedPlans(d.pricing.plans, c.plans, 'discount'),
    },
    trial: { ...d.trial, cards: pricedPlans(d.trial.cards, c.trial, 'trial') },
    schedule: sched(d.schedule, c),
    countdown1: { ...d.countdown1, icon: o.icon || d.countdown1.icon, title: `${o.name || 'Special Offer'} End Soon` },
    countdown2: { ...d.countdown2, offerIcon: o.icon || '', offer: o.name || d.countdown2.offer, off: `${o.upTo}%` },
    testimonials: c.testimonials ? { ...d.testimonials, items: c.testimonials } : d.testimonials,
    faq: c.faq ? { ...d.faq, items: c.faq } : d.faq,
    sticky: { ...d.sticky, cta: o.sticky || d.sticky.cta },
  };
}

export function applyHome(d, c) {
  if (!c) return d;
  const trialCard = byPay(c.trial, 'yoga-trial-1');
  const slots = c.offer?.slots;
  return {
    ...d,
    meta: meta(d.meta, c),
    hero: {
      ...d.hero,
      pill: slots > 0 ? `🔥 Only ${slots} slots left for the batch` : '',
      secondary: trialCard ? { ...d.hero.secondary, label: `Start 5 Day Trial — ${inr(trialCard.price)}` } : d.hero.secondary,
    },
    pricing: { ...d.pricing, plans: pricedPlans(d.pricing.plans, c.plans, 'ladder') },
    trial: { ...d.trial, cards: pricedPlans(d.trial.cards, c.trial, 'trial') },
    schedule: sched(d.schedule, c),
    testimonials: c.testimonials ? { ...d.testimonials, items: c.testimonials } : d.testimonials,
    faq: c.faq ? { ...d.faq, items: c.faq } : d.faq,
    mobileBar: trialCard ? d.mobileBar.map((b) => (b.href === '#trial' ? { ...b, label: `5 Day Trial — ${inr(trialCard.price)}` } : b)) : d.mobileBar,
  };
}

export function applyChallenge(d, c) {
  const p = byPay(c?.plans, d.plan.pay) || {};
  const plan = { ...d.plan, ...(c ? { name: p.name || d.plan.name, price: p.price ?? d.plan.price, mrp: p.mrp ?? null, features: p.features?.length ? p.features : d.plan.features } : {}) };
  const o = c?.offer || {};
  const vars = { price: Number(plan.price).toLocaleString('en-IN'), mrp: plan.mrp ? Number(plan.mrp).toLocaleString('en-IN') : '' };
  const bar = (o.bar?.length ? o.bar : d.offer.bar).map((b, i) => ({ ...d.offer.bar[i], ...b, text: fill(b.text, vars) }));
  return {
    ...d,
    meta: meta(d.meta, c),
    offerOn: o.active !== false,
    countdown: { hours: o.hours || d.offer.hours, endsAt: o.endsAt, key: 'yr_21day_deadline' },
    plan: { ...plan, priceText: inr(plan.price), mrpText: plan.mrp ? inr(plan.mrp) : '', saveText: plan.mrp > plan.price ? inr(plan.mrp - plan.price) : '' },
    bar,
    inside: { ...d.inside, items: c?.inside || d.inside.items, bonus: c?.bonus || d.inside.bonus },
    join: c?.schedule ? { ...d.join, morning: c.schedule.morning, evening: c.schedule.evening } : d.join,
    faq: c?.faq ? { ...d.faq, items: c.faq } : d.faq,
  };
}

export function applyWeightLoss(d, c) {
  if (!c) return d;
  return {
    ...d,
    meta: meta(d.meta, c),
    pricing: { ...d.pricing, plans: pricedPlans(d.pricing.plans, c.plans, 'ladder') },
    stories: c.stories ? { ...d.stories, items: c.stories } : d.stories,
    reviews: c.reviews ? { ...d.reviews, items: c.reviews } : d.reviews,
    faq: c.faq ? { ...d.faq, items: c.faq } : d.faq,
  };
}

