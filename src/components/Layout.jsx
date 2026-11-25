import Icon from './Icon.jsx';
import { tx, Emoji } from './Emoji.jsx';
import { useCountdown } from './interactive.jsx';
import { SITE, wa, tel, media } from '../site.config.js';

export const Btn = ({ href, children, variant = 'primary', shine, className = '', ...rest }) => {
  const ext = /^https?:/.test(href);
  return (
    <a
      href={href}
      className={`btn btn--${variant}${shine ? ' btn--shine' : ''} ${className}`}
      {...(ext ? { target: '_blank', rel: 'noopener' } : {})}
      {...rest}
    >
      {tx(children)}
    </a>
  );
};

export const Pill = ({ children, tone = 'orange', dot }) => (
  <span className={`pill pill--${tone}`}>
    {dot && <i className="dot" />}
    {tx(children)}
  </span>
);

export const Head = ({ pill, pillTone, pillDot, title, subtitle, children }) => (
  <header className="shead">
    {pill && <Pill tone={pillTone} dot={pillDot}>{pill}</Pill>}
    {title && <h2 className="h2">{title}</h2>}
    {children}
    {subtitle && <p className="shead__sub">{subtitle}</p>}
  </header>
);

export function OfferBar({ items }) {
  const row = (hidden) => items.map((it, i) => {
    const inner = (
      <>
        {it.icon && <Emoji e={it.icon} />} {it.text}
      </>
    );
    return it.href ? (
      <a key={i} href={it.href} className={`obar__item obar__item--${it.tone}`} tabIndex={hidden ? -1 : undefined}>{inner}</a>
    ) : (
      <span key={i} className={`obar__item obar__item--${it.tone}`}>{inner}</span>
    );
  });
  return (
    <div className="obar">
      <div className="obar__row">
        {row(false)}
        <div className="obar__dup" aria-hidden="true">{row(true)}</div>
      </div>
    </div>
  );
}

export function Footer({ links = defaultLinks, credit = false, active }) {
  return (
    <footer className="foot">
      <div className="wrap foot__grid">
        <div>
          <a href="/" aria-label={SITE.name}>
            <img className="foot__logo" src={media('2026/03/Frame-2147224036.png')} alt="Yoga for weight loss logo" width="250" height="72" loading="lazy" decoding="async" />
          </a>
          <p className="foot__tag">{SITE.tagline}</p>
        </div>
        <div>
          <h2 className="foot__h">CONTACT US</h2>
          <a className="foot__contact" href={tel}><Icon name="phone" size={20} strokeWidth={1.6} /> {SITE.phone}</a>
          <a className="foot__contact" href={`https://wa.me/${SITE.phoneIntl}`} target="_blank" rel="noopener"><Icon name="message" size={20} strokeWidth={1.6} /> WhatsApp Us</a>
          <div className="foot__social">
            <a href={SITE.social.facebook} target="_blank" rel="noopener" aria-label="Facebook"><Icon name="facebook" size={17} /></a>
            <a href={SITE.social.instagram} target="_blank" rel="noopener" aria-label="Instagram"><Icon name="instagram" size={17} /></a>
            <a href={SITE.social.youtube} target="_blank" rel="noopener" aria-label="YouTube"><Icon name="youtube" size={17} /></a>
          </div>
        </div>
        <nav aria-label="Quick links">
          <h2 className="foot__h">QUICK LINKS</h2>
          {links.map(([label, href]) => <a key={label} className="foot__link" href={href}>{label}</a>)}
        </nav>
      </div>
      <div className="wrap foot__bottom">
        <span>
          {SITE.copyright}
          {credit && <> | Website &amp; Automation by <a className="foot__credit" href={SITE.credit.url} target="_blank" rel="noopener">{SITE.credit.name}</a></>}
        </span>
        <span className="foot__legal">
          <a href="/privacy-policy/" aria-current={active === 'privacy' ? 'page' : undefined}>Privacy Policy</a>
          <a href="/refund-policy/" aria-current={active === 'refund' ? 'page' : undefined}>Refund Policy</a>
        </span>
      </div>
    </footer>
  );
}
const defaultLinks = [
  ['Join Classes', '#pricing'],
  ['5-Day Trial', '#trial'],
  ['Class Schedule', '#classes'],
  ['About Instructor', '#about'],
  ['FAQ', '#faq'],
];

export function StickyOffer({ label, cta, href }) {
  const [h, m, s] = useCountdown();
  return (
    <div className="sticky" role="region" aria-label="Offer countdown">
      <div className="wrap sticky__in">
        <div className="sticky__timer">
          <span className="sticky__lbl"><Emoji e="⏳" /> {label}</span>
          <span className="sticky__box">{h}</span>
          <span className="sticky__box">{m}</span>
          <span className="sticky__box">{s}</span>
        </div>
        <a className="sticky__btn" href={href}><Icon name="star" size={20} /> {cta}</a>
      </div>
    </div>
  );
}

export const WhatsAppFab = () => (
  <a className="fab" href={wa()} target="_blank" rel="noopener" aria-label="Chat on WhatsApp">
    <Icon name="whatsapp" size={34} />
  </a>
);
