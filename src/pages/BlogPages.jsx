// Blog templates: listing, post (with "Latest Posts" sidebar) and category pages. Content comes from /admin.
// Design matches the original site: green leaf banner, masonry cards.
// These ship zero JavaScript.
import { Footer, WhatsAppFab } from '../components/Layout.jsx';
import SiteHeader from '../components/SiteHeader.jsx';

const SITE_LINKS = [
  ['Join Classes', '/#pricing'], ['5-Day Trial', '/#trial'], ['Class Schedule', '/#classes'],
  ['About Instructor', '/#about'], ['FAQ', '/#faq'],
];
const fmt = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
const href = (p) => `/blogs/${p.slug}/`;

const Shell = ({ active, children }) => (
  <>
    <a className="skip" href="#content">Skip to content</a>
    <SiteHeader active={active} />
    <main id="content">{children}</main>
    <Footer links={SITE_LINKS} credit />
    <WhatsAppFab />
  </>
);

const Banner = ({ title, compact }) => (
  <section className={`pbanner${compact ? ' pbanner--list' : ' pbanner--post'}`}>
    <div className="wrap"><h1>{title}</h1></div>
  </section>
);

const excerpt = (t = "") => (t.length > 160 ? t.slice(0, 160).replace(/\s+\S*$/, "") + "…" : t);

const PostCard = ({ p, i, eager }) => (
  <article className="bcard" style={{ order: i }}>
    {p.image?.src && (
      <a href={href(p)} className="bcard__img" tabIndex={-1} aria-hidden="true">
        <img
          src={p.image.src}
          alt="" width="828" height="466"
          loading={eager ? undefined : 'lazy'} fetchpriority={i === 0 ? 'high' : undefined} decoding="async"
        />
      </a>
    )}
    <div className="bcard__body">
      <h2 className="bcard__title"><a href={href(p)}>{p.title}</a></h2>
      {p.excerpt && <p className="bcard__ex">{excerpt(p.excerpt)}</p>}
      <a className="bcard__more" href={href(p)} aria-label={`Read more: ${p.title}`}>Read More »</a>
    </div>
    <div className="bcard__date"><time dateTime={p.date}>{fmt(p.date)}</time></div>
  </article>
);

// Masonry like the live site: post i goes to column i % 3 on desktop (rows read left → right).
// Below 1025px the columns use display: contents and the cards fall into a normal 2/1-column grid
// in their original order (style.order), so no JavaScript is needed.
export function BlogList({ title, posts }) {
  const cols = [[], [], []];
  posts.forEach((p, i) => cols[i % 3].push(<PostCard key={p.slug} p={p} i={i} eager={i === 0} />));
  return (
    <Shell active="Blog">
      <Banner title={title} compact />
      <section className="blist">
        {posts.length ? (
          <div className="wrap blist__grid">
            {cols.map((c, i) => <div key={i} className="blist__col">{c}</div>)}
          </div>
        ) : (
          <p className="wrap blist__empty">New articles are coming soon.</p>
        )}
      </section>
    </Shell>
  );
}

export function BlogPost({ post, latest }) {
  return (
    <Shell>
      <Banner title={post.title} />
      <div className="wrap bpost">
        <article className="bpost__main">
          {post.image?.src && (
            <img
              className="bpost__hero"
              src={post.image.src}
              alt={post.image.alt}
              width={post.image.width || 1400}
              height={post.image.height || 788}
              fetchpriority="high"
              decoding="async"
            />
          )}
          <div className="bprose" dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
        <aside className="bpost__side" aria-label="Latest posts">
          <div className="latest">
            <h2 className="latest__h">Latest Posts</h2>
            <ul>
              {latest.map((p) => (
                <li key={p.slug}>
                  <a href={href(p)} className="latest__item">
                    <span>
                      <span className="latest__t">{p.title}</span>
                      <time dateTime={p.date}>{fmt(p.date)}</time>
                    </span>
                    {p.image?.src && <img src={p.image.src} alt="" width="96" height="54" loading="lazy" decoding="async" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </Shell>
  );
}
