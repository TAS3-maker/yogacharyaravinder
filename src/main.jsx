import { hydrateRoot, createRoot } from 'react-dom/client';
import { pages } from './pages/index.js';
import './styles.css';

const root = document.getElementById('root');
const key = root?.dataset.page;
const page = pages[key];

// Admin content the page was prerendered with (embedded by scripts/prerender.mjs)
let cms;
try { cms = JSON.parse(document.getElementById('cms-data')?.textContent || 'null') || undefined; } catch {}

if (page) {
  const prerendered = !!root.firstElementChild;
  // Production: pages are pre-rendered HTML; only interactive ones hydrate.
  // Dev server: nothing is pre-rendered, so every page renders here. 
  if (!prerendered || page.hydrate) {
    page.load().then(({ default: Page }) => {
      const r = prerendered ? hydrateRoot(root, <Page cms={cms} />) : createRoot(root);
      if (!prerendered) r.render(<Page cms={cms} />);
      if (page.cms) refresh(page.cms, (fresh) => r.render(<Page cms={fresh} />));
    });
  }
}

// Offers/prices changed in /admin after this page was built? Show the new values straight away
// (the static page itself is rebuilt by the deploy hook). Runs when the browser is idle; cached at the CDN.
function refresh(cmsKey, apply) {
  const run = () => fetch('/api/landing/' + cmsKey, { headers: { Accept: 'application/json' } })
    .then((res) => (res.ok ? res.json() : null))
    .then((fresh) => { if (fresh && fresh.updatedAt !== cms?.updatedAt) { cms = fresh; apply(fresh); } })
    .catch(() => {});
  const idle = window.requestIdleCallback || ((f) => setTimeout(f, 1500));
  if (document.readyState === 'complete') idle(run, { timeout: 4000 });
  else addEventListener('load', () => idle(run, { timeout: 4000 }), { once: true });
}
