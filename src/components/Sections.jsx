// Reusable page sections. Each takes its content as props so other pages can reuse them.
import Icon from './Icon.jsx';
import Img from './Img.jsx';
import { Emoji } from './Emoji.jsx';
import { Btn, Head, Pill } from './Layout.jsx';
import { Countdown, Counter, LazyVideo, StoryCard, Faq, OnlineCount } from './interactive.jsx';
import { SITE, wa } from '../site.config.js';

export function Hero({ d }) {
  return (
    <section className="hero">
      <div className="wrap hero__grid">
        <div className="hero__copy">
          <Pill>{d.pill}</Pill>
          <h1 className="h1">
            {d.title[0]}<span className="hl">{d.title[1]}</span>{d.title[2]}
          </h1>
          <p className="hero__intro">{d.intro[0]}<strong>{d.intro[1]}</strong>{d.intro[2]}</p>
          <ul className="hero__stats">
            {d.stats.map((s) => <li key={s.text}><Emoji e={s.icon} /> {s.text}</li>)}
          </ul>
          <div className="btnrow">
            <Btn href={d.primary.href} shine>{d.primary.icon} {d.primary.label}</Btn>
            <Btn href={d.secondary.href} variant="outline">{d.secondary.label}</Btn>
          </div>
          <p className="hero__live"><i className="dot dot--pulse" /> {d.live} <span>{d.seats}</span></p>
        </div>
        <div className="hero__media">
          <div className="hero__img">
            <Img src={d.image.src} alt={d.image.alt} width="790" height="790" priority sizes="(max-width: 900px) 92vw, 46vw" />
            <span className="hero__liveTag"><i className="dot dot--pulse" /> LIVE CLASS</span>
            <div className="float float--happy"><b>{d.happy.value}</b><span>{d.happy.label}</span></div>
            <div className="float float--online"><span>{d.online.label}</span><b><OnlineCount base={d.online.base} /> Students</b></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Stories({ d }) {
  return (
    <section className="sec sec--mint" id="testimonials">
      <div className="wrap">
        <header className="shead">
          <span className="pill pill--mint"><Icon name="star" size={30} strokeWidth={1.5} /> {d.pill}</span>
          <h2 className="h2">{d.title}<br /><span className="g">{d.titleGreen}</span></h2>
          <p className="shead__sub shead__sub--it">{d.subtitle}</p>
        </header>
        <div className="grid3 stories">
          {d.items.map((s, i) => <StoryCard key={i} {...s} />)}
        </div>
        <div className="grid4 statcards">
          {d.stats.map((s) => (
            <div className="statcard" key={s.label}>
              <Icon name={s.icon === 'users' ? 'usersFill' : s.icon} size={56} />
              <b>{s.value}</b><span>{s.label}</span>
            </div>
          ))}
        </div>
        <p className="note">{d.note}</p>
        <div className="center"><Btn href={d.cta.href} shine>{d.cta.label}</Btn></div>
      </div>
    </section>
  );
}

export function Pricing({ d }) {
  return (
    <section className="sec sec--grey" id="pricing">
      <div className="wrap">
        <header className="shead">
          <Pill>{d.pill}</Pill>
          <h2 className="h2 pricing__title">
            <Emoji e="❄️" /> <span className="g">{d.title}</span>{' '}
            <small>{d.titleSuffix}</small> <span className="o">{d.titleOff}</span>
          </h2>
          <p className="shead__sub">{d.subtitle}</p>
          <p className="warn"><i className="dot" /> {d.warning}</p>
        </header>
        <div className="plans">
          {d.plans.map((p) => (
            <article className={`plan${p.popular ? ' plan--pop' : ''}`} key={p.name}>
              {p.popular && <div className="plan__tab"><Icon name="bolt" size={20} /> MOST POPULAR</div>}
              <div className="plan__body">
                <div className="plan__head"><h3>{p.name}</h3><p>– {p.days} –</p></div>
                <div className="plan__price">
                  <div><s>{p.mrp}</s><b>{p.price}</b></div>
                  <span className="burst"><em>{p.off}</em>OFF</span>
                </div>
                <ul className="ticks">
                  {p.features.map((f) => <li key={f}><Icon name="check" size={18} /> {f}</li>)}
                </ul>
                <div className="plan__rec"><Icon name="playSquare" size={24} strokeWidth={1.6} /> Recorded Class Available</div>
                <Btn href={p.href} id={p.pay} data-pay={p.pay} variant={p.popular ? 'primary' : 'outline'} shine={p.popular} className="btn--block">
                  {p.cta} <Icon name="arrowLong" size={22} />
                </Btn>
              </div>
            </article>
          ))}
        </div>
        <div className="grid3 recrow">
          {d.recorded.map((r, i) =>
            r.flow ? (
              <div className="rec rec--flow" key={i}>
                {r.flow.map((f, j) => <span key={f}>{f}{j < r.flow.length - 1 && <b aria-hidden="true"> → </b>}</span>)}
              </div>
            ) : (
              <div className="rec" key={i}>
                <Icon name={r.icon} size={r.icon === 'videoFill' ? 44 : 40} strokeWidth={1.5} className={r.icon === 'videoFill' ? 'rec__vid' : 'rec__ic'} />
                <div><h3>{r.title}</h3><p>{r.text}</p></div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}

export function PlanLadder({ d }) {
  return (
    <section className="sec sec--grey" id="pricing">
      <div className="wrap">
        <header className="shead">
          <Pill>{d.pill}</Pill>
          <h2 className="h2">{d.title}</h2>
          <p className="shead__sub">{d.subtitle}</p>
          <p className="warn"><i className="dot" /> {d.warning}</p>
        </header>
        <div className="plans plans--ladder">
          {d.plans.map((p) => (
            <article className={`lp${p.popular ? ' lp--pop' : ''}`} key={p.name}>
              {p.popular && <div className="plan__tab"><Icon name="bolt" size={20} /> MOST POPULAR</div>}
              <div className="lp__body">
                <div className="lp__top">
                  <div><h3>{p.name}</h3><p className="lp__dur">{p.duration}</p></div>
                  {p.badge && <span className="lp__badge">{p.badge}</span>}
                </div>
                <b className="lp__price">{p.price}</b>
                <span className="lp__month">{p.perMonth}/month</span>
                <ul className="ticks lp__ticks">
                  {p.features.map((f) => <li key={f}><Icon name="check" size={18} /> {f}</li>)}
                </ul>
                <div className="plan__rec"><Icon name="playSquare" size={24} strokeWidth={1.6} /> Recorded Class Available</div>
                <Btn href={p.href} id={p.pay} data-pay={p.pay} variant={p.popular ? 'primary' : 'outline'} shine={p.popular} className="btn--block lp__btn">
                  Join Now <Icon name="arrowLong" size={22} />
                </Btn>
              </div>
            </article>
          ))}
        </div>
        <div className="grid3 recrow">
          {d.recorded.map((r, i) =>
            r.flow ? (
              <div className="rec rec--flow" key={i}>
                {r.flow.map((f, j) => <span key={f}>{f}{j < r.flow.length - 1 && <b aria-hidden="true"> → </b>}</span>)}
              </div>
            ) : (
              <div className="rec" key={i}>
                <Icon name={r.icon} size={r.icon === 'videoFill' ? 44 : 40} strokeWidth={1.5} className={r.icon === 'videoFill' ? 'rec__vid' : 'rec__ic'} />
                <div><h3>{r.title}</h3><p>{r.text}</p></div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}

export function Trial({ d }) {
  return (
    <section className="sec" id="trial">
      <div className="wrap wrap--md">
        <Head title={d.title} subtitle={d.subtitle} />
        <div className="trials">
          {d.cards.map((c) => (
            <article className={`trial${c.primary ? ' trial--pop' : ''}`} key={c.name}>
              {c.badge && <div className="trial__tab"><Emoji e="⭐" /> {c.badge}</div>}
              <div className="trial__body">
                <div className="trial__top">
                  <Icon name={c.icon} size={c.icon === 'sparkle' ? 40 : 46} className={`trial__ic trial__ic--${c.icon}`} />
                  <div>
                    <h3>{c.name}</h3>
                    <p className="trial__sub">{c.sub}</p>
                    <b className="trial__price">{c.price}</b>
                  </div>
                </div>
                <p className="trial__text">{c.text}</p>
                <ul className="ticks ticks--2">
                  {c.features.map((f) => <li key={f}><Icon name="check" size={18} /> {f}</li>)}
                </ul>
                <Btn href={c.href} id={c.pay} data-pay={c.pay} variant={c.primary ? 'primary' : 'outline'} shine={c.primary} className="btn--block">
                  {!c.primary && <Icon name="message" size={22} />} {c.cta} {c.primary && <Icon name="message" size={22} />}
                </Btn>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Schedule({ d }) {
  const col = (title, icon, cls, rows) => (
    <div className={`sch__col sch__col--${cls}`}>
      <h3><Icon name={icon} size={28} strokeWidth={1.6} /> {title}</h3>
      {rows.map((r) => (
        <div className="sch__row" key={r.time}>
          <span className="sch__emoji"><Emoji e={r.icon} /></span>
          <div><b>{r.time}</b><span>{r.name}</span></div>
        </div>
      ))}
    </div>
  );
  return (
    <section className="sec" id="classes">
      <div className="wrap wrap--md">
        <Head title={d.title} subtitle={d.subtitle} />
        <div className="sch">
          <div className="sch__head"><Icon name="clock" size={28} strokeWidth={1.8} /> {d.head}</div>
          <div className="sch__cols">
            {col('Morning Batches', 'sun', 'am', d.morning)}
            {col('Evening Batches', 'moon', 'pm', d.evening)}
          </div>
          <div className="sch__foot">
            <span><Icon name="smartphone" size={26} strokeWidth={1.6} className="sch__phone" /> {d.foot}</span>
            <span className="sch__live"><i className="dot dot--pulse" /> {d.live}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Problems({ d }) {
  return (
    <section className="sec sec--grey">
      <div className="wrap">
        <Head pill={d.pill} title={d.title} />
        <div className="probs">
          {d.items.map((p) => (
            <div className="prob" key={p.title}>
              <span className="icbox icbox--blue"><Icon name={p.icon} size={24} strokeWidth={1.8} /></span>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </div>
          ))}
        </div>
        <p className="probs__out">{d.outro[0]} <span>{d.outro[1]}</span></p>
      </div>
    </section>
  );
}

export function OfferCountdown({ d }) {
  return (
    <section className="sec sec--cd">
      <div className="wrap center">
        <Pill>{d.pill}</Pill>
        <h2 className="h2">{d.icon && <><Emoji e={d.icon} />{' '}</>}{d.title}</h2>
        {d.badge && <p className="cdbadge">{d.badge} <Icon name="clock" size={34} strokeWidth={2} /></p>}
        {d.offer && (
          <p className="offerbox">
            <Emoji e="❄️" /> <span className="g">{d.offer}</span>
            <span className="offerbox__off">{d.upto} <b>{d.off}</b> {d.offWord}</span>
          </p>
        )}
        <Countdown />
        <Btn href="#pricing" variant="outline" shine>🎯 {d.cta}</Btn>
      </div>
    </section>
  );
}

export function Pillars({ d }) {
  return (
    <section className="sec">
      <div className="wrap">
        <Head pill={d.pill} pillTone="plain" pillDot title={d.title} subtitle={d.subtitle} />
        <div className="grid3">
          {d.items.map((p) => (
            <div className={`pillar pillar--${p.tone}`} key={p.title}>
              <span className={`icbox icbox--${p.tone}`}><Icon name={p.icon} size={24} strokeWidth={1.8} /></span>
              <h3>{p.title}</h3>
              <p className="pillar__sub">{p.sub}</p>
              <ul>{p.points.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Trust({ d }) {
  return (
    <section className="sec sec--tint">
      <div className="wrap">
        <Head title={d.title} />
        <div className="grid4">
          {d.items.map((t) => (
            <div className={`trust trust--${t.tone}`} key={t.label}>
              <span className="icbox icbox--mint"><Icon name={t.icon} size={26} strokeWidth={1.6} /></span>
              <b><Counter to={t.to} suffix={t.suffix} /></b>
              <span>{t.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Reels({ d }) {
  return (
    <section className="sec">
      <div className="wrap">
        <Head title={d.title} subtitle={d.subtitle} />
        <div className="grid4 reels">
          {d.items.map((r, i) => <LazyVideo key={r.src} src={r.src} poster={r.poster} label={`Instagram reel ${i + 1}`} />)}
        </div>
        <div className="center">
          <Btn href={SITE.social.instagram} variant="outline"><Icon name="external" size={22} /> {d.cta}</Btn>
        </div>
      </div>
    </section>
  );
}

export function Coach({ d }) {
  return (
    <section className="sec" id="about">
      <div className="wrap">
        <Head title={d.title} />
        <div className="coach">
          <div className="coach__media">
            <Img src={d.image.src} alt={d.image.alt} width="830" height="860" sizes="(max-width: 900px) 92vw, 48vw" />
            <div className="float float--tl"><b className="o">{d.badge1.value}</b><span>{d.badge1.label}</span></div>
            <div className="float float--br"><b>{d.badge2.value}</b><span>{d.badge2.label}</span></div>
          </div>
          <div className="coach__copy">
            <h3>{d.name}</h3>
            <p className="coach__role">{d.role}</p>
            <p className="coach__bio">{d.bio}</p>
            <ul className="coach__pts">{d.points.map((p) => <li key={p}><Icon name="circleCheck" size={22} strokeWidth={1.6} /> {p}</li>)}</ul>
            <Btn href={d.cta.href}>{d.cta.label} <Icon name="arrow" size={20} strokeWidth={2.5} /></Btn>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Transformations({ d }) {
  return (
    <section className="sec">
      <div className="wrap">
        <Head title={d.title} subtitle={d.subtitle} />
        <div className="grid3">
          {d.items.map((t) => (
            <figure className="tf" key={t.label}>
              <div className="tf__img">
                <Img src={t.src} alt={t.alt} width="545" height="545" sizes="(max-width: 680px) 92vw, (max-width: 900px) 46vw, 31vw" />
              </div>
              <figcaption><Icon name="squareCheck" size={22} /> {t.label}</figcaption>
            </figure>
          ))}
        </div>
        <div className="grid3 tfstats">
          {d.stats.map((s) => (
            <div className="tfstat" key={s.label}>
              <b>{s.value}{s.star && <Icon name="starFill" size={30} className="tfstat__star" />}</b>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
        <div className="center"><Btn href={d.cta.href}>{d.cta.label}</Btn></div>
      </div>
    </section>
  );
}

export function Testimonials({ d }) {
  return (
    <section className="sec sec--grey2">
      <div className="wrap">
        <Head pill={d.pill} title={d.title} subtitle={d.subtitle} />
        <div className="grid3">
          {d.items.map((t) => (
            <figure className="tcard" key={t.name}>
              <div className="stars" role="img" aria-label="5 out of 5 stars">
                {[0, 1, 2, 3, 4].map((i) => <Icon key={i} name="starFill" size={26} />)}
              </div>
              <blockquote>“{t.quote}”</blockquote>
              <figcaption>
                <span className="avatar" aria-hidden="true">{t.name[0]}</span>
                <span className="tcard__who"><b>{t.name}</b><span>{t.place}</span></span>
                <span className="chip">{t.duration}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FaqSection({ d }) {
  return (
    <section className="sec" id="faq">
      <div className="wrap wrap--sm">
        <header className="shead">
          <h2 className="h2">{d.title}</h2>
          <p className="shead__sub">{d.subtitle} <a className="g" href={wa()} target="_blank" rel="noopener">{SITE.phone}</a></p>
        </header>
        <Faq items={d.items} />
      </div>
    </section>
  );
}

export function FinalCta({ d }) {
  return (
    <section className="sec sec--tight">
      <div className="wrap wrap--lg">
        <div className="fcta">
          <span className="pill pill--glass"><i className="dot dot--white" /> {d.pill}</span>
          <h2 className="h2">{d.title}</h2>
          <p>{d.text}</p>
          <div className="btnrow btnrow--center">
            <Btn href={d.primary.href} variant="white">{d.primary.icon} {d.primary.label}</Btn>
            <Btn href={d.secondary.href} variant="glass">{d.secondary.icon} {d.secondary.label}</Btn>
          </div>
          <p className="fcta__proof"><Icon name="circleCheck" size={30} strokeWidth={1.5} /> <span>{d.proof[0]}<b>{d.proof[1]}</b>{d.proof[2]}</span></p>
        </div>
      </div>
    </section>
  );
}
