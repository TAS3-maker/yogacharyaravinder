// Sections used only by /21-days-weight-loss-challenge/ (c21-*) and /yoga-classes-for-weight-loss/ (wl-*).
// Shared sections (coach, transformations, reels, trust, FAQ, pricing ladder) come from Sections.jsx.
import Icon from './Icon.jsx';
import Img from './Img.jsx';
import { Emoji, tx } from './Emoji.jsx';
import { Btn } from './Layout.jsx';
import { Countdown, StoryCard, Faq } from './interactive.jsx';

const Check = ({ size = 16 }) => <Icon name="circleCheck" size={size} strokeWidth={1.8} />;

/* ================= 21 Day Challenge ================= */

export function C21Bar({ items }) {
  return (
    <div className="c21-bar">
      {items.map((b, i) => (
        <span key={i} className={b.strong ? 'c21-bar__strong' : undefined}>
          {b.icon && <Emoji e={b.icon} />} {b.text}
        </span>
      ))}
    </div>
  );
}

export function C21Hero({ d, plan }) {
  return (
    <section className="c21-hero">
      <div className="wrap c21-hero__grid">
        <div>
          <div className="c21-pills">
            {d.pills.map((p) => <span key={p.text} className={`c21-pill c21-pill--${p.tone}`}>{tx(p.text)}</span>)}
          </div>
          <h1 className="c21-h1"><span className="c21-g">{d.title[0]}</span><br />{d.title[1]}</h1>
          <p className="c21-lead">{d.lead}</p>
          <p className="c21-intro">{d.intro}</p>
          <div className="c21-pricebox">
            <div>
              {plan.mrpText && <s>Earlier Price {plan.mrpText}</s>}
              <b>Today Only {plan.priceText}</b>
            </div>
            {plan.saveText && <span className="c21-off">{plan.saveText} OFF</span>}
          </div>
          <Btn href="#join" className="btn--block c21-btn">Join 21 Day Challenge for {plan.priceText}</Btn>
          <ul className="c21-checks">{d.checks.map((c) => <li key={c}><Check size={14} /> {c}</li>)}</ul>
          <p className="c21-enrolled"><i className="dot dot--green" /> <b>{d.enrolled}</b> students already enrolled</p>
        </div>
        <figure className="c21-hero__media">
          <Img src={d.image.src} alt={d.image.alt} width="545" height="460" priority sizes="(max-width: 900px) 92vw, 42vw" />
          <figcaption>{d.image.caption}</figcaption>
        </figure>
      </div>
    </section>
  );
}

export const C21Ribbon = ({ items }) => (
  <div className="c21-ribbon">
    <div className="wrap c21-ribbon__in">{items.map((r) => <span key={r.text}><Emoji e={r.icon} /> {r.text}</span>)}</div>
  </div>
);

export function C21Fails({ d }) {
  return (
    <section className="sec c21-sec">
      <div className="wrap wrap--c21 center">
        <h2 className="c21-h2">{d.title}</h2>
        <div className="grid3 c21-fails">
          {d.items.map((f) => (
            <div className="c21-card" key={f.title}>
              <Emoji e={f.icon} size={32} />
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
        <p className="c21-accent">{d.outro}</p>
        <Btn href="#join" shine className="c21-btn">{d.cta}</Btn>
      </div>
    </section>
  );
}

export function C21Transforms({ d }) {
  return (
    <section className="sec sec--mint c21-sec">
      <div className="wrap wrap--c21 center">
        <h2 className="c21-h2">{d.title[0]}<span className="c21-g">{d.title[1]}</span></h2>
        <div className="grid3 c21-pillars">
          {d.items.map((p) => (
            <div className="c21-card c21-card--white" key={p.title}>
              <Emoji e={p.icon} size={46} />
              <h3>{p.title}</h3>
              <ul className="c21-list">{p.points.map((x) => <li key={x}><Check size={14} /> {x}</li>)}</ul>
            </div>
          ))}
        </div>
        <Btn href="#join" shine className="c21-btn">{d.cta}</Btn>
      </div>
    </section>
  );
}

export function C21Videos({ d }) {
  return (
    <section className="sec sec--mint c21-sec" id="testimonials">
      <div className="wrap wrap--c21 center">
        <h2 className="c21-h2">{d.title}</h2>
        <div className="grid3 stories">{d.items.map((s, i) => <StoryCard key={i} {...s} />)}</div>
        <p className="note">{d.note}</p>
        <Btn href="#join" shine className="c21-btn">{d.cta}</Btn>
      </div>
    </section>
  );
}

export function C21Inside({ d, plan }) {
  return (
    <section className="sec c21-sec">
      <div className="wrap wrap--c21">
        <h2 className="c21-h2 center">{d.title}</h2>
        <div className="c21-inside">
          <ul className="c21-inside__list">{d.items.map((x) => <li key={x}><Check /> {x}</li>)}</ul>
          <div>
            {d.bonus?.length > 0 && (
              <div className="c21-bonus">
                <h3><Emoji e="🎁" /> {d.bonusTitle}</h3>
                <ul>{d.bonus.map((x) => <li key={x}><Check /> {x}</li>)}</ul>
              </div>
            )}
            <div className="c21-pricecard">
              {plan.mrpText && <s>Earlier Price {plan.mrpText}</s>}
              <b>Today Only {plan.priceText}</b>
              {plan.saveText && <em>You save {plan.saveText}</em>}
            </div>
            <Btn href="#join" className="btn--block c21-btn">Join Now At {plan.priceText}</Btn>
          </div>
        </div>
      </div>
    </section>
  );
}

export function C21Steps({ d }) {
  return (
    <section className="sec sec--mint c21-sec">
      <div className="wrap wrap--c21 center">
        <h2 className="c21-h2">{d.title}</h2>
        <ol className="c21-steps">
          {d.items.map((s, i) => <li key={s.title}><span>{i + 1}</span><b>{s.title}</b><small>{s.text}</small></li>)}
        </ol>
      </div>
    </section>
  );
}

export function C21Join({ d, plan, offerOn }) {
  const slot = (b) => <div className="c21-slot" key={b.time}><b>{b.time}</b><span>{b.name}</span></div>;
  return (
    <section className="sec c21-sec" id="batches">
      <div className="wrap wrap--c21">
        <header className="center c21-joinhead">
          <h2 className="c21-h2">{d.title}</h2>
          <p className="c21-sub">{d.subtitle}</p>
        </header>
        <div className="c21-join">
          <div className="c21-plan" id="join">
            <span className="c21-tag">{d.tag}</span>
            <h3>{plan.name}</h3>
            {plan.mrpText && <s>{plan.mrpText}</s>}
            <b className="c21-plan__price">{plan.priceText}</b>
            <small>Today Only</small>
            {plan.saveText && <span className="c21-save">You Save {plan.saveText}</span>}
            <ul className="c21-checks c21-checks--center">{plan.features.map((f) => <li key={f}><Check size={14} /> {f}</li>)}</ul>
            {offerOn && (
              <div className="c21-expire">
                <p><Icon name="clock" size={20} strokeWidth={2} /> Offer Expires In</p>
                <Countdown variant="glass" />
              </div>
            )}
            {d.urgency.map((u) => <p className="c21-warn" key={u}>{tx(u)}</p>)}
            <Btn href={plan.href} id={plan.pay} data-pay={plan.pay} shine className="c21-btn">{d.cta} {plan.priceText}</Btn>
          </div>
          <div>
            {d.morning.length > 0 && <div className="c21-batch c21-batch--am"><h3><Emoji e="🌅" /> Morning Batches</h3>{d.morning.map(slot)}</div>}
            {d.evening.length > 0 && <div className="c21-batch c21-batch--pm"><h3><Emoji e="🌙" /> Evening Batches</h3>{d.evening.map(slot)}</div>}
            <div className="c21-online">
              <p><Emoji e="🌐" /> All classes via <span className="c21-g">{d.online}</span> — Join from anywhere in the world</p>
              <span className="c21-live"><i className="dot dot--white" /> Live Right Now</span>
            </div>
            <Btn href="#join" className="btn--block c21-btn">{d.book}</Btn>
          </div>
        </div>
      </div>
    </section>
  );
}

export function C21Faq({ d }) {
  return (
    <section className="sec c21-sec" id="faq">
      <div className="wrap wrap--sm">
        <h2 className="c21-h2 center">{d.title}</h2>
        <Faq items={d.items} />
      </div>
    </section>
  );
}

export function C21Final({ d, plan }) {
  return (
    <section className="c21-final">
      <div className="wrap center">
        <h2>{d.title}</h2>
        <p>{d.text[0]}<br />{d.text[1]}</p>
        <p className="c21-final__price">{plan.mrpText && <s>{plan.mrpText}</s>} {plan.priceText} Today</p>
        <p className="c21-final__warn">{tx(d.warn)}</p>
        <div className="btnrow btnrow--center">
          <Btn href="#join" shine className="c21-btn">{d.cta}</Btn>
          <Btn href={d.whatsapp.href} variant="ghost" className="c21-btn"><Icon name="message" size={20} /> {d.whatsapp.label}</Btn>
        </div>
      </div>
    </section>
  );
}

/* ================= Yoga Classes for Weight Loss ================= */

const Eyebrow = ({ children }) => <p className="eyebrow">{children}</p>;

export function WlHero({ d }) {
  return (
    <section className="wl-hero">
      <div className="wrap hero__grid">
        <div className="hero__copy">
          <span className="wl-rating"><Icon name="starFill" size={14} /> {d.pill}</span>
          <h1 className="h1">{d.title[0]}<span className="hl">{d.title[1]}</span></h1>
          <p className="wl-lead">{d.lead}</p>
          <p className="hero__intro">{d.intro}</p>
          <ul className="wl-checks">{d.checks.map((c) => <li key={c}><Icon name="check" size={18} strokeWidth={2.6} /> {c}</li>)}</ul>
          <div className="btnrow">
            <Btn href={d.primary.href} className="btn--pill">{d.primary.label}</Btn>
            <Btn href={d.secondary.href} variant="outline" className="btn--pill">{d.secondary.label}</Btn>
          </div>
        </div>
        <div className="hero__media">
          <div className="hero__img">
            <Img src={d.image.src} alt={d.image.alt} width="790" height="790" priority sizes="(max-width: 900px) 92vw, 46vw" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function WlProblem({ d }) {
  return (
    <section className="sec">
      <div className="wrap">
        <Eyebrow>{d.eyebrow}</Eyebrow>
        <h2 className="wl-h2">{d.title}</h2>
        <p className="wl-sub">{d.subtitle}</p>
        <ol className="wl-num">
          {d.items.map((p, i) => (
            <li key={p.title}><span>{String(i + 1).padStart(2, '0')}</span><div><h3>{p.title}</h3><p>{p.text}</p></div></li>
          ))}
        </ol>
        <Btn href={d.cta.href} className="btn--pill">{d.cta.label}</Btn>
      </div>
    </section>
  );
}

export function WlSplit({ d, tone }) {
  return (
    <section className={`sec${tone ? ' sec--' + tone : ''}`}>
      <div className="wrap wl-split">
        <div>
          <Eyebrow>{d.eyebrow}</Eyebrow>
          <h2 className="wl-h2">{d.title}</h2>
          <p className="wl-sub">{d.text}</p>
          {d.cta && <Btn href={d.cta.href} className="btn--pill">{d.cta.label}</Btn>}
        </div>
        <ul className="wl-dotted">
          {d.items.map(([b, t]) => <li key={b}><Icon name="circleCheck" size={20} strokeWidth={2} /><p><b>{b}</b> {t}</p></li>)}
        </ul>
      </div>
    </section>
  );
}

export function WlConcerns({ d }) {
  return (
    <section className="sec sec--mint wl-skew">
      <div className="wrap center">
        <Eyebrow>{d.eyebrow}</Eyebrow>
        <h2 className="wl-h2">{d.title}</h2>
        <p className="wl-sub">{d.subtitle}</p>
        <div className="wl-concerns">{d.items.map(([e, t]) => <span key={t}><Emoji e={e} /> {t}</span>)}</div>
        <Btn href={d.cta.href} className="btn--pill">{d.cta.label}</Btn>
      </div>
    </section>
  );
}

export function WlScience({ d }) {
  return (
    <section className="sec" id="science">
      <div className="wrap">
        <Eyebrow>{d.eyebrow}</Eyebrow>
        <h2 className="wl-h2">{d.title}</h2>
        <p className="wl-sub">{d.subtitle}</p>
        <ul className="wl-timeline">{d.items.map(([t, x]) => <li key={t}><h3>{t}</h3><p>{x}</p></li>)}</ul>
        <p className="wl-answer"><b>Direct answer:</b> {d.answer}</p>
      </div>
    </section>
  );
}

export function WlTable({ d }) {
  return (
    <section className="sec">
      <div className="wrap">
        <Eyebrow>{d.eyebrow}</Eyebrow>
        <h2 className="wl-h2">{d.title}</h2>
        <p className="wl-sub">{d.subtitle}</p>
        <div className="wl-tablewrap">
          <table className="wl-table">
            <thead><tr>{d.head.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
            <tbody>{d.rows.map(([a, ...rest]) => <tr key={a}><th scope="row">{a}</th>{rest.map((c, i) => <td key={i}>{c}</td>)}</tr>)}</tbody>
          </table>
        </div>
        <Btn href={d.cta.href} className="btn--pill wl-mt">{d.cta.label}</Btn>
      </div>
    </section>
  );
}

export function WlProcess({ d }) {
  return (
    <section className="sec sec--mint">
      <div className="wrap center">
        <Eyebrow>{d.eyebrow}</Eyebrow>
        <h2 className="wl-h2">{d.title}</h2>
        <p className="wl-sub">{d.subtitle}</p>
        <ol className="c21-steps c21-steps--dash">
          {d.items.map((s, i) => <li key={s.title}><span>{i + 1}</span><b>{s.title}</b><small>{s.text}</small></li>)}
        </ol>
      </div>
    </section>
  );
}

export function WlAbout({ d }) {
  return (
    <section className="sec" id="about">
      <div className="wrap coach">
        <div className="coach__media">
          <Img src={d.image.src} alt={d.image.alt} width="830" height="860" sizes="(max-width: 900px) 92vw, 48vw" />
          <div className="float float--tl"><b className="o">{d.badge1.value}</b><span>{d.badge1.label}</span></div>
          <div className="float float--br"><b>{d.badge2.value}</b><span>{d.badge2.label}</span></div>
        </div>
        <div className="coach__copy">
          <Eyebrow>{d.eyebrow}</Eyebrow>
          <h2 className="wl-h2">{d.title}</h2>
          <p className="coach__bio">{d.bio}</p>
          <div className="wl-badges">{d.badges.map((b) => <span key={b}>{b}</span>)}</div>
        </div>
      </div>
    </section>
  );
}

export function WlStories({ d }) {
  return (
    <section className="sec">
      <div className="wrap">
        <Eyebrow>{d.eyebrow}</Eyebrow>
        <h2 className="wl-h2">{d.title}</h2>
        {d.subtitle && <p className="wl-sub">{d.subtitle}</p>}
        <ul className="wl-stories">
          {d.items.map((s) => (
            <li key={s.title}>
              <svg className="wl-quote" viewBox="0 0 50 40" aria-hidden="true"><path fill="currentColor" d="M22 0v16c0 14-7 22-20 24l-2-5c8-3 11-8 11-15H2V0zm28 0v16c0 14-7 22-20 24l-2-5c8-3 11-8 11-15h-9V0z" /></svg>
              <div><h3>{s.title}</h3><p>{s.text}</p><b>{s.name}</b></div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function WlReviews({ d }) {
  return (
    <section className="sec">
      <div className="wrap">
        <Eyebrow>{d.eyebrow}</Eyebrow>
        <h2 className="wl-h2">{d.title}</h2>
        <div className="wl-quotes">
          {d.items.map((r) => (
            <figure key={r.name}>
              <div className="stars wl-stars" role="img" aria-label="5 out of 5 stars">{[0, 1, 2, 3, 4].map((i) => <Icon key={i} name="starFill" size={22} />)}</div>
              <blockquote>“{r.quote}”</blockquote>
              <figcaption>{r.name}</figcaption>
            </figure>
          ))}
        </div>
        <Btn href={d.cta.href} variant="outline" className="btn--pill">{d.cta.label}</Btn>
      </div>
    </section>
  );
}

const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'Asia/Kolkata' });

export function WlBlog({ d, posts }) {
  if (!posts?.length) return null;
  return (
    <section className="sec sec--mint">
      <div className="wrap center">
        <Eyebrow>{d.eyebrow}</Eyebrow>
        <h2 className="wl-h2">{d.title}</h2>
        <p className="wl-sub">{d.subtitle}</p>
        <div className="grid3 wl-posts">
          {posts.slice(0, 3).map((p) => (
            <article className="wl-post" key={p.slug}>
              <a href={`/blogs/${p.slug}/`} aria-label={p.title}>
                {p.image?.src && <img src={p.image.src} alt={p.image.alt || ''} width={p.image.width || 640} height={p.image.height || 360} loading="lazy" decoding="async" />}
              </a>
              <h3><a href={`/blogs/${p.slug}/`}>{p.title}</a></h3>
              {p.excerpt && <p>{p.excerpt.length > 120 ? p.excerpt.slice(0, 117).replace(/\s+\S*$/, '') + '…' : p.excerpt}</p>}
              <time dateTime={p.date}><Emoji e="📅" /> {fmtDate(p.date)}</time>
              <a className="wl-more" href={`/blogs/${p.slug}/`}>Read More »</a>
            </article>
          ))}
        </div>
        <Btn href={d.cta.href} variant="outline" className="btn--pill">{d.cta.label}</Btn>
      </div>
    </section>
  );
}

export function WlFaq({ d }) {
  return (
    <section className="sec" id="faq">
      <div className="wrap">
        <Eyebrow>{d.eyebrow}</Eyebrow>
        <h2 className="wl-h2">{d.title}</h2>
        <div className="wl-faq"><Faq items={d.items} /></div>
      </div>
    </section>
  );
}
