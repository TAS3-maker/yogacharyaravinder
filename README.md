# Yogacharya Ravinder — React rebuild

React site with pre-rendered landing pages and server-rendered blog pages. Built with Vite and Preact in production.

## Commands

| Command | What it does |
|---|---|
| `npm install` | Install dependencies (once) |
| `npm run dev` | Dev server: site at http://localhost:5173/, admin at http://localhost:5173/admin |
| `npm run build` | Build the static pages, live blog renderer, and `/admin` |
| `npm run preview` | Open the built site (and admin) at http://localhost:4173/ |
| `npm run create-admin -- email "password" "Name"` | Create an admin / reset a password |
| `npm run seed-landing` | Put the current offers, prices, timings, reviews and FAQ into MongoDB so they can be edited in `/admin → Landing pages` (safe to re-run; `-- --reset` restores the originals) |
| `npm run import-wp` | Import public posts from the original WordPress site into MongoDB |
| `npm run save-assets` | One-time only: save the site's own images/videos into `public/media` (see below) |

Requires Node 22.12+. Manage blog content in `/admin`.

**Site images & videos** (logo, hero, testimonials…) live in `public/media/` as optimised WebP/MP4 and are committed to Git, so builds never download anything. If `public/media` is incomplete, run `npm run save-assets` once (while the old site is still online), then commit `public/media`. Blog images are served by the CMS media endpoint.

## Deploy to Vercel

1. Import this repository as one Vercel project and use the repository root. `vercel.json` selects Vite, runs `npm run build`, serves `dist`, and routes `/admin`, `/api`, and `/blogs`.
2. Set `MONGODB_URI` and `JWT_SECRET` in Vercel (also used **at build time** for the landing-page prices). Optional: `DEPLOY_HOOK_URL`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` (see *Landing pages* and *Thank You page*). Run `npm run seed-landing` once against the production database. Use your existing Atlas database and ensure it allows connections from the deployment. `ADMIN_EMAIL` and `ADMIN_PASSWORD` are needed only to create the first owner when the database has no users.
3. Connect a **private Vercel Blob** store to the project and make `BLOB_READ_WRITE_TOKEN` available to the deployment. This stores images uploaded through `/admin`.
4. If existing posts use images from `.cms-media/`, run `npm run migrate:vercel-media` locally with the destination store's `BLOB_READ_WRITE_TOKEN`. The script preserves the existing media keys. For an existing Netlify store, set `NETLIFY_SITE_ID` and `NETLIFY_AUTH_TOKEN` on Vercel to keep serving images from it as a fallback.

The frontend, admin API, and blog renderer deploy together. Post updates and scheduled publication are served directly from MongoDB.

## Admin panel (CMS) — /admin

Blog posts and categories are managed at **https://yogacharyaravinder.com/admin** (login required). It's a MERN app inside this project:

| Part | Where |
|---|---|
| Admin UI (React) | `admin/index.html`, `src/admin/*` — built separately (`npm run build:admin`), so it adds **zero** JavaScript to the public pages |
| API (Express) | `server/app.js` — runs at `/api/*` on Vercel and during local development |
| Database | MongoDB Atlas (`server/db.js`: users, posts, categories) |
| Uploaded images | Vercel Blob, Netlify Blobs, or `.cms-media/` locally. Photos are resized in the browser before upload (max 2000px and 3 MB per image). |

**How publishing works:** The server reads MongoDB on every blog request. Posts marked published appear on the listing, category page, and sitemap once their publish date and time arrive. Saving an edit or unpublishing takes effect on the next request. Local dev, preview, and Vercel use the same visibility rule.

### Landing pages (offers & prices) — /admin → Landing pages

Admins (not editors) can change, without touching code:

| Page | Editable |
|---|---|
| `/discount-pricing/` (+ its two old duplicates) | Offer on/off, name, emoji, “up to % OFF”, slots left, timer (hours per visitor **or** a fixed end date/time), offer bar text, sticky button, 4 plans (name, duration line, price, MRP → % OFF is calculated, features, button text, most popular, show/hide), 5-Day Trial & Consultation, class timings, reviews, FAQ, SEO |
| `/` (homepage) | Slots left, 4 plans (+ per-month price and badge), trial & consultation, class timings, reviews, FAQ, SEO |
| `/21-days-weight-loss-challenge/` | Offer on/off, timer, offer bar (`{price}` / `{mrp}` placeholders), price & MRP, features, morning/evening batches, “What you get”, free bonus, FAQ, SEO |
| `/yoga-classes-for-weight-loss/` | 4 plans, client stories, reviews, FAQ, SEO (the “Latest blogs” cards come from the 3 newest posts automatically) |
| Razorpay payment buttons | The `pl_…` id behind every plan button |

**How a change reaches the site.** The pages stay pre-rendered static HTML (PageSpeed ~100):
1. **At build time** `scripts/prerender.mjs` reads the saved values from MongoDB and bakes them into the HTML (no database → the original content in `src/data/*.js` is used).
2. **Right after saving**, open pages fetch `/api/landing/<page>` once the browser is idle (cached 60 s at Vercel's edge) and show the new values — so changes are live within about a minute.
3. **Optional, recommended:** set `DEPLOY_HOOK_URL` (Vercel → Project → Settings → Git → Deploy Hooks). Every save then rebuilds the site so the new prices are in the HTML itself too (SEO, first paint). Razorpay button-id changes apply on that rebuild.

`src/data/*.js` stay the defaults/seed: anything never edited in the admin keeps coming from there. Code: `src/data/cms.js` (defaults, validation), `src/data/cms-apply.js` (applies values to a page), `server/landing.js`, `src/admin/Landing.jsx`.

Security: passwords hashed with bcrypt, login in an httpOnly SameSite=strict cookie (7 days), CSRF header check, login rate limit (8 failed tries per 15 min), HTML sanitised on save, /admin is noindex. Changing your password logs out other devices.

Extra users: *Users* page (admins only). Editors can manage posts and categories. A forgotten password can be reset with `npm run create-admin -- email "new-password"`.

### Import WordPress posts

Run `npm run import-wp -- --dry-run` to check the source, then `npm run import-wp` to seed the database configured by `MONGODB_URI`. Pass a different WordPress base URL after `--` to import from another host. The import keeps the original publish dates and categories and skips existing post slugs. WordPress-hosted images are copied to local CMS storage, or directly to Vercel Blob when `BLOB_READ_WRITE_TOKEN` is set.

### Local development
```bash
cp .env.example .env    # fill MONGODB_URI + JWT_SECRET (+ ADMIN_EMAIL / ADMIN_PASSWORD for the first login)
npm run dev             # site + admin at http://localhost:5173/admin (the API runs inside the dev server)
```
`npm run preview` (after `npm run build`) also serves /admin and the API. If something is missing, the login screen says exactly what (e.g. "MONGODB_URI is not set" or "Can't connect to MongoDB").
Images uploaded locally are stored in `.cms-media/`. Images uploaded on the live site go to the deployment's blob store.

## Razorpay
The plan buttons open Razorpay Payment Buttons, the same IDs and element ids as the live site (`basic-plan`, `disc-pro-plan`, `yoga-trial-1`, ...), so GTM click triggers keep working. The ids can be changed in `/admin → Landing pages → Razorpay payment buttons` (defaults: `SITE.razorpay` in `src/site.config.js`). Razorpay's script loads only when a visitor hovers or taps a plan button (no PageSpeed cost). If it can't load, the button falls back to its WhatsApp link. Code: `src/runtime/razorpay.js`.

### Thank You page (/thank-you/)
Shows **“You’re officially enrolled in our “<plan>” · Your payment of ₹<amount>…”** using, in order:
1. `?razorpay_payment_id=pay_…` → `/api/razorpay-payment` reads the payment from Razorpay (amount actually paid, payer's first name). Needs `RAZORPAY_KEY_ID` + `RAZORPAY_KEY_SECRET` on the server.
2. `?plan=<button key>` in the redirect URL, e.g. `https://yogacharyaravinder.com/thank-you/?plan=21-day-challenge`. Set it per button in Razorpay → Payment Buttons → *Redirect to your website*. Keys: `basic-plan`, `standard-plan`, `pro-plan`, `advanced-plan`, `yfwl-6month-plan`, `yoga-trial-1`, `consultaion-call`, `disc-basic-plan`, `disc-standard-plan`, `disc-pro-plan`, `disc-advanced-plan`, `21-day-challenge`.
3. The plan button the visitor clicked in this browser (remembered by `src/runtime/razorpay.js`).

Unknown values are left out (no more “Rs.0” or empty quotes). It also pushes a GA4-style `purchase` event (value, currency INR, plan) to `dataLayer` once per payment.

## Tracking
GTM `GTM-M7GT89HB` is on every page. Optional direct pixels (Meta Pixel, GA4, Google Ads, Microsoft Clarity) can be switched on by filling their IDs in `SITE.pixels`. Leave them empty if they already fire through GTM, or they'll double-count. All tags load through the same deferred loader as GTM.

## Where to edit things

- **Offers, prices, plans, timings, reviews, FAQ** → `/admin → Landing pages` (defaults in `src/data/discountPricing.js`, `home.js`, `challenge21.js`, `weightLoss.js`)
- **Other text on the landing pages** → the same data files
- **Phone, WhatsApp, social links, GTM ID, verification codes** → `src/site.config.js`
- **Colours, fonts, spacing** → CSS variables at the top of `src/styles.css` (colours are exact values measured from the live site)
- **Sections (shared by all landing pages)** → `src/components/Sections.jsx`
- **Blog templates** (listing, post with "Latest Posts" sidebar, categories) → `src/pages/BlogPages.jsx`, styles under "Blog" in `src/styles.css`
- **Thank-you page** (after payment) → `src/pages/ThankYou.jsx`
- **21 Day Challenge / Weight-loss page sections** → `src/components/LandingSections.jsx` (styles under “21 Day Challenge” / “Yoga Classes for Weight Loss” in `src/styles.css`)

## Tracking carried over from the original site
- Google Tag Manager `GTM-M7GT89HB` (script + noscript on every page)
- Google site verification, Facebook domain verification meta tags
- `gtmDefer: true` in `site.config.js` loads GTM on the visitor's first interaction (or after 4 s). That keeps PageSpeed mobile at ~100. Set it to `false` to load GTM immediately like the old site did; this costs roughly 10–20 points of mobile PageSpeed.

## Pages
- Built: `/` (homepage, content in `src/data/home.js`), `/discount-pricing/` (+ the `/old-discount-pricing/` and `/discount-pricing-test/` duplicates, set to noindex), `/privacy-policy/` and `/refund-policy/` (hand-built, text in `src/pages/PrivacyPolicy.jsx` / `RefundPolicy.jsx`), `/thank-you/` (`src/pages/ThankYou.jsx`), `/blogs/`, every blog post and blog category (from `/admin`)
- Built: `/21-days-weight-loss-challenge/` (landing page: offer bar, no site header, like the live page) and `/yoga-classes-for-weight-loss/` (site header + footer)
- To do (need screenshots): `/one-year-yoga-plan/`, `/contact-us/`
  **Don't switch the live domain until these are built**, or those URLs will 404.

## Things to confirm
- Testimonial video files for the 6 "Real Stories" cards (`stories.items[].video` in the data file). Until they're added, the cards show their thumbnail images.
- "Trusted by Students Worldwide" counter targets (5,000 / 480 / 12+ / 1M+). The live page showed these mid-animation, so the exact values weren't visible.
- FAQ answers 2–6 were rewritten from the live page's content; check the wording.
- The offer countdown is an evergreen 10-hour timer per visitor, which restarts when it ends. This copies the behaviour of the live site.
