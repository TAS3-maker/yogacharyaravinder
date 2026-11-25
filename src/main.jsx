import { hydrateRoot, createRoot } from 'react-dom/client';
import { pages } from './pages/index.js';
import './styles.css';

const root = document.getElementById('root');
const page = pages[root?.dataset.page];
if (page) {
  const prerendered = !!root.firstElementChild;
  // Production: pages are pre-rendered HTML; only interactive ones hydrate.
  // Dev server: nothing is pre-rendered, so every page renders here.
  if (!prerendered || page.hydrate) {
    page.load().then(({ default: Page }) => (prerendered ? hydrateRoot(root, <Page />) : createRoot(root).render(<Page />)));
  }
}
