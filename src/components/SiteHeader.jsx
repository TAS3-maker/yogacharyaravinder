// Main site header (used on every page except the discount landing page). Zero JavaScript:
// the mobile menu is a native <details> element.
import Icon from './Icon.jsx';
import { Btn } from './Layout.jsx';
import { SITE, media, tel } from '../site.config.js';

export const NAV = [
  ['Classes', '/#classes'], ['About', '/#about'], ['Pricing', '/#pricing'],
  ['Testimonials', '/#testimonials'], ['FAQ', '/#faq'], ['Blog', '/blogs/'],
];

export default function SiteHeader({ local = false, active }) {
  const nav = NAV.map(([l, h]) => [l, local && h.startsWith('/#') ? h.slice(1) : h]);
  const join = local ? '#pricing' : '/#pricing';
  return (
    <header className="hdr">
      <div className="wrap hdr__in">
        <a href="/" aria-label={SITE.name}>
          <img src={media('2026/03/Frame-2147224036.png')} alt="Yoga for weight loss logo" width="160" height="46" className="hdr__logo" />
        </a>
        <nav className="hdr__nav" aria-label="Main">
          {nav.map(([l, h]) => <a key={l} href={h} aria-current={active === l ? 'page' : undefined}>{l}</a>)}
        </nav>
        <div className="hdr__cta">
          <a className="hdr__tel" href={tel}><Icon name="phoneRed" size={17} /> {SITE.phone}</a>
          <Btn href={join} className="hdr__btn">Join Live Classes</Btn>
        </div>
        <details className="hdr__menu">
          <summary aria-label="Menu"><span /><span /><span /></summary>
          <nav aria-label="Mobile">
            {nav.map(([l, h]) => <a key={l} href={h}>{l}</a>)}
            <a href={tel}>{SITE.phone}</a>
            <Btn href={join}>Join Live Classes</Btn>
          </nav>
        </details>
      </div>
    </header>
  );
}
