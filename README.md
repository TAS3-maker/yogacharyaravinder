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
| `npm run save-assets` | One-time only: save the site's own images/videos into `public/media` (see below) |

Requires Node 18.17+. No WordPress: the blog comes only from `/admin`.

**Site images & videos** (logo, hero, testimonials…) live in `public/media/` as optimised WebP/MP4 and are committed to Git, so builds never download anything. If `public/media` is incomplete, run `npm run save-assets` once (while the old site is still online), then commit `public/media`. Blog images are served by the CMS media endpoint.

**Deploy:** Netlify (see *Admin panel* below). Caching rules are in `_headers`.

## Admin panel (CMS) — /admin

Blog posts and categories are managed at **https://yogacharyaravinder.com/admin** (login required). It's a MERN app inside this project:

| Part | Where |
|---|---|
| Admin UI (React) | `admin/index.html`, `src/admin/*` — built separately (`npm run build:admin`), so it adds **zero** JavaScript to the public pages |
| API (Express) | `server/app.js` — runs as the Netlify Function `netlify/functions/api.mjs` at `/api/*` |
| Database | MongoDB Atlas (`server/db.js`: users, posts, categories) |
| Uploaded images | Netlify Blobs (local folder `.cms-media/` on your computer). Resized in the browser before upload (max 2000px, WebP) |

**How publishing works:** The server reads MongoDB on every blog request. Posts marked published appear on the listing, category page, and sitemap once their publish date and time arrive. Saving an edit or unpublishing takes effect on the next request. Local dev, preview, and Netlify use the same visibility rule.

Security: passwords hashed with bcrypt, login in an httpOnly SameSite=strict cookie (7 days), CSRF header check, login rate limit (8 failed tries per 15 min), HTML sanitised on save, /admin is noindex. Changing your password logs out other devices.

### One-time setup (Netlify)
1. **MongoDB Atlas**: create a free cluster → Database Access: add a user → Network Access: allow `0.0.0.0/0` (Netlify has no fixed IPs) → copy the connection string.
2. **Netlify**: push this folder to GitHub → *Add new site → Import from Git*. `netlify.toml` already sets the build command, functions and redirects.
3. **Environment variables** (Site configuration → Environment variables), see `.env.example`:
   `MONGODB_URI`, `JWT_SECRET` (64 random chars), `ADMIN_EMAIL`, and `ADMIN_PASSWORD`. Make them available to Functions.
4. Open `/admin`, log in with `ADMIN_EMAIL` / `ADMIN_PASSWORD` (this creates the owner account on first login), change the password under *My account*, then remove `ADMIN_PASSWORD` from Netlify.
5. Write your first post in `/admin` and set its publish date and time.
6. In Razorpay → Payment Buttons, set the success redirect to `https://yogacharyaravinder.com/thank-you/`.

Extra users: *Users* page (admins only). Editors can manage posts and categories. A forgotten password can be reset with `npm run create-admin -- email "new-password"`.

### Local development
```bash
cp .env.example .env    # fill MONGODB_URI + JWT_SECRET (+ ADMIN_EMAIL / ADMIN_PASSWORD for the first login)
npm run dev             # site + admin at http://localhost:5173/admin (the API runs inside the dev server)
```
`npm run preview` (after `npm run build`) also serves /admin and the API. If something is missing, the login screen says exactly what (e.g. "MONGODB_URI is not set" or "Can't connect to MongoDB").
Note: images you upload locally are stored in `.cms-media/` on your computer, and images uploaded on the live site are stored in Netlify Blobs. Use one MongoDB database for both, but upload the real posts' images on the live admin.

## Razorpay
The plan buttons open Razorpay Payment Buttons, the same IDs and element ids as the live site (`basic-plan`, `disc-pro-plan`, `yoga-trial-1`, ...), so GTM click triggers keep working. The mapping lives in `SITE.razorpay` in `src/site.config.js`. Razorpay's script loads only when a visitor hovers or taps a plan button (no PageSpeed cost). If it can't load, the button falls back to its WhatsApp link. Code: `src/runtime/razorpay.js`.

## Tracking
GTM `GTM-M7GT89HB` is on every page. Optional direct pixels (Meta Pixel, GA4, Google Ads, Microsoft Clarity) can be switched on by filling their IDs in `SITE.pixels`. Leave them empty if they already fire through GTM, or they'll double-count. All tags load through the same deferred loader as GTM.

## Where to edit things

- **Text, prices, plans, testimonials, FAQ** → `src/data/discountPricing.js`
- **Phone, WhatsApp, social links, GTM ID, verification codes** → `src/site.config.js`
- **Colours, fonts, spacing** → CSS variables at the top of `src/styles.css` (colours are exact values measured from the live site)
- **Sections (shared by all landing pages)** → `src/components/Sections.jsx`
- **Blog templates** (listing, post with "Latest Posts" sidebar, categories) → `src/pages/BlogPages.jsx`, styles under "Blog" in `src/styles.css`
- **Thank-you page** (after payment) → `src/pages/ThankYou.jsx`

## Tracking carried over from the original site
- Google Tag Manager `GTM-M7GT89HB` (script + noscript on every page)
- Google site verification, Facebook domain verification meta tags
- `gtmDefer: true` in `site.config.js` loads GTM on the visitor's first interaction (or after 4 s). That keeps PageSpeed mobile at ~100. Set it to `false` to load GTM immediately like the old site did; this costs roughly 10–20 points of mobile PageSpeed.

## Pages
- Built: `/` (homepage, content in `src/data/home.js`), `/discount-pricing/` (+ the `/old-discount-pricing/` and `/discount-pricing-test/` duplicates, set to noindex), `/privacy-policy/` and `/refund-policy/` (hand-built, text in `src/pages/PrivacyPolicy.jsx` / `RefundPolicy.jsx`), `/thank-you/` (`src/pages/ThankYou.jsx`), `/blogs/`, every blog post and blog category (from `/admin`)
- To do (need screenshots): `/21-days-weight-loss-challenge/`, `/yoga-classes-for-weight-loss/`, `/one-year-yoga-plan/`, `/contact-us/`
  **Don't switch the live domain until these are built**, or those URLs will 404.

## Things to confirm
- Testimonial video files for the 6 "Real Stories" cards (`stories.items[].video` in the data file). Until they're added, the cards show their thumbnail images.
- "Trusted by Students Worldwide" counter targets (5,000 / 480 / 12+ / 1M+). The live page showed these mid-animation, so the exact values weren't visible.
- FAQ answers 2–6 were rewritten from the live page's content; check the wording.
- The offer countdown is an evergreen 10-hour timer per visitor, which restarts when it ends. This copies the behaviour of the live site.
