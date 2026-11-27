// Admin → Landing pages: offers, prices, Razorpay buttons, schedules, reviews, FAQ, SEO for the public landing pages.
// Admins only. Saving updates the live pages within ~1 minute and (with DEPLOY_HOOK_URL set) rebuilds the static HTML.
import { useEffect, useState } from 'react';
import { api, fmtDate } from './api.js';
import { EMOJI_CHOICES } from '../components/Emoji.jsx';
import { inr, offPct } from '../data/cms-apply.js';

// ---------- list ----------
export function LandingList({ A }) {
  const [d, setD] = useState(null);
  const [err, setErr] = useState('');
  useEffect(() => { api('/admin-landing').then(setD).catch((e) => setErr(e.message)); }, []);
  return (
    <>
      <header className="ph"><h1>Landing pages</h1></header>
      <p className="muted lp-intro">Offers, prices, payment buttons, class timings, reviews and FAQ on the public pages.
        {d && (d.rebuild ? ' Saving updates the live pages in about a minute and rebuilds them for SEO.' : ' Saving updates the live pages in about a minute. Set DEPLOY_HOOK_URL so the static HTML is rebuilt too.')}</p>
      {err && <p className="err">{err}</p>}
      {!d && !err && <p className="muted">Loading…</p>}
      {d && (
        <div className="card">
          <table className="tbl">
            <thead><tr><th>Page</th><th>Edits</th><th /></tr></thead>
            <tbody>
              {d.pages.map((p) => (
                <tr key={p.key}>
                  <td><A to={'/landing/' + p.key}><b>{p.label}</b></A>{p.path && <small className="muted block">{p.path}</small>}</td>
                  <td><small className="muted">{p.sections.map((s) => LABELS[s] || s).join(' · ')}</small></td>
                  <td className="row">
                    <A to={'/landing/' + p.key} className="btn btn--ghost btn--sm">Edit</A>
                    {p.path && <a className="linkbtn" href={p.path} target="_blank" rel="noopener">View ↗</a>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

const LABELS = {
  offer: 'Offer & timer', slots: 'Slots left', plans: 'Plans & prices', trial: 'Trial & consultation', schedule: 'Class timings',
  testimonials: 'Reviews', faq: 'FAQ', seo: 'SEO', inside: 'What you get', bonus: 'Free bonus', stories: 'Client stories', reviews: 'Reviews', buttons: 'Razorpay buttons',
};

// ---------- editor ----------
const toLocalInput = (d) => { const x = new Date(d); return new Date(x - x.getTimezoneOffset() * 60000).toISOString().slice(0, 16); };

export function LandingEdit({ pageKey, A, toast }) {
  const [meta, setMeta] = useState(null);
  const [res, setRes] = useState(null);
  const [v, setV] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api('/admin-landing').then((d) => setMeta(d.pages.find((p) => p.key === pageKey) || null));
    api('/admin-landing/' + pageKey).then((d) => { setRes(d); setV(d.data); }).catch((e) => toast(e.message, 'err'));
  }, [pageKey]);
  useEffect(() => {
    const f = (e) => { if (dirty) { e.preventDefault(); e.returnValue = ''; } };
    addEventListener('beforeunload', f); return () => removeEventListener('beforeunload', f);
  }, [dirty]);

  if (!v || !meta) return <p className="muted">Loading…</p>;
  const set = (k, val) => { setV((x) => ({ ...x, [k]: val })); setDirty(true); };
  const has = (s) => meta.sections.includes(s);

  const save = async () => {
    setSaving(true);
    try {
      const d = await api('/admin-landing/' + pageKey, { method: 'PUT', body: { data: v } });
      setRes(d); setV(d.data); setDirty(false);
      toast(d.rebuilding ? 'Saved. Live in about a minute; the static pages are rebuilding.' : 'Saved. Live on the site in about a minute.');
    } catch (e) { toast(e.message, 'err'); } finally { setSaving(false); }
  };
  const reset = async () => {
    if (!confirm('Go back to the original content for this page? Your saved changes for this page will be removed.')) return;
    try { const d = await api('/admin-landing/' + pageKey, { method: 'DELETE' }); setRes(d); setV(d.data); setDirty(false); toast('Back to the original content'); } catch (e) { toast(e.message, 'err'); }
  };

  return (
    <>
      <header className="ph">
        <div>
          <A to="/landing" className="muted">← Landing pages</A>
          <h1>{meta.label}</h1>
          <small className="muted">{res?.updatedAt ? `Last saved ${fmtDate(res.updatedAt)}${res.updatedBy ? ' by ' + res.updatedBy : ''}` : 'Showing the original content (not edited yet)'}</small>
        </div>
        <div className="row">
          {meta.path && <a className="btn btn--ghost" href={meta.path} target="_blank" rel="noopener">View ↗</a>}
          <button className="btn" disabled={saving || !dirty} onClick={save}>{saving ? 'Saving…' : dirty ? 'Save changes' : 'Saved'}</button>
        </div>
      </header>

      <div className="lp-edit">
        {has('buttons') && <Buttons value={v.buttons} onChange={(b) => set('buttons', b)} />}
        {(has('offer') || has('slots')) && <Offer value={v.offer} slotsOnly={!has('offer')} onChange={(o) => set('offer', o)} />}
        {has('plans') && <Plans title="Plans & prices" value={v.plans} onChange={(p) => set('plans', p)} />}
        {has('trial') && <Plans title="Trial & consultation" trial value={v.trial} onChange={(p) => set('trial', p)} />}
        {has('schedule') && <Schedule value={v.schedule} onChange={(s) => set('schedule', s)} />}
        {has('inside') && <Section title="What you get"><Lines value={v.inside} onChange={(x) => set('inside', x)} /></Section>}
        {has('bonus') && <Section title="Free bonus"><Lines value={v.bonus} onChange={(x) => set('bonus', x)} /></Section>}
        {has('testimonials') && <Rows title="Reviews" value={v.testimonials} onChange={(x) => set('testimonials', x)}
          fields={[['quote', 'Review', 'area'], ['name', 'Name'], ['place', 'City · Age'], ['duration', 'With us for']]} />}
        {has('stories') && <Rows title="Client stories" value={v.stories} onChange={(x) => set('stories', x)}
          fields={[['title', 'Headline'], ['text', 'Story', 'area'], ['name', 'Name, city, age']]} />}
        {has('reviews') && <Rows title="Reviews" value={v.reviews} onChange={(x) => set('reviews', x)} fields={[['quote', 'Review', 'area'], ['name', 'Name, city, age']]} />}
        {has('faq') && <Rows title="FAQ" value={v.faq} onChange={(x) => set('faq', x)} fields={[['q', 'Question'], ['a', 'Answer', 'area']]} />}
        {has('seo') && (
          <Section title="SEO">
            <label>Page title <small className="muted">({(v.seo.title || '').length}/60)</small><input value={v.seo.title} onChange={(e) => set('seo', { ...v.seo, title: e.target.value })} /></label>
            <label>Meta description <small className="muted">({(v.seo.description || '').length}/158)</small><textarea rows={3} value={v.seo.description} onChange={(e) => set('seo', { ...v.seo, description: e.target.value })} /></label>
          </Section>
        )}
        {res?.saved && <button className="linkbtn danger" onClick={reset}>Reset this page to the original content</button>}
      </div>
    </>
  );
}

// ---------- sections ----------
const Section = ({ title, hint, children }) => (
  <section className="card pad lp-sec"><h3>{title}</h3>{hint && <p className="muted lp-hint">{hint}</p>}{children}</section>
);

function EmojiSelect({ value, onChange }) {
  return (
    <select className="lp-emoji" value={value || ''} onChange={(e) => onChange(e.target.value)} aria-label="Emoji">
      <option value="">—</option>
      {EMOJI_CHOICES.map((e) => <option key={e} value={e}>{e}</option>)}
    </select>
  );
}

function Offer({ value: o, slotsOnly, onChange }) {
  const up = (k, val) => onChange({ ...o, [k]: val });
  if (slotsOnly) {
    return (
      <Section title="Slots left" hint="Shown in the hero as “🔥 Only N slots left for the batch”. 0 hides it.">
        <label className="lp-narrow">Slots left<input type="number" min="0" value={o.slots ?? 0} onChange={(e) => up('slots', e.target.value)} /></label>
      </Section>
    );
  }
  return (
    <Section title="Offer & timer" hint="Turning the offer off hides the offer bar, countdowns and sticky bar. Prices stay.">
      <label className="check lp-toggle"><input type="checkbox" checked={o.active !== false} onChange={(e) => up('active', e.target.checked)} /> Offer is running</label>
      <div className="lp-grid">
        {'name' in o && <label>Offer name<input value={o.name} onChange={(e) => up('name', e.target.value)} /></label>}
        {'icon' in o && <label>Emoji<EmojiSelect value={o.icon} onChange={(x) => up('icon', x)} /></label>}
        {'upTo' in o && <label>Up to % OFF<input type="number" min="0" max="99" value={o.upTo ?? 0} onChange={(e) => up('upTo', e.target.value)} /></label>}
        {'slots' in o && <label>Slots left <small className="muted">(0 hides)</small><input type="number" min="0" value={o.slots ?? 0} onChange={(e) => up('slots', e.target.value)} /></label>}
        <label>Timer per visitor (hours)<input type="number" min="1" value={o.hours ?? 10} onChange={(e) => up('hours', e.target.value)} /></label>
        <label>…or fixed end date &amp; time<input type="datetime-local" value={o.endsAt ? toLocalInput(o.endsAt) : ''} onChange={(e) => up('endsAt', e.target.value ? new Date(e.target.value).toISOString() : null)} /></label>
        {'sticky' in o && <label>Sticky bar button<input value={o.sticky} onChange={(e) => up('sticky', e.target.value)} /></label>}
      </div>
      <p className="muted lp-hint">With a fixed end date the countdown runs to that moment for everyone; afterwards the evergreen timer takes over again.</p>
      {o.bar && (
        <>
          <h4>Offer bar</h4>
          <p className="muted lp-hint">Use {'{price}'} or {'{mrp}'} to insert the plan’s current price.</p>
          {o.bar.map((b, i) => (
            <div className="lp-barrow" key={i}>
              <EmojiSelect value={b.icon} onChange={(x) => up('bar', o.bar.map((y, j) => (j === i ? { ...y, icon: x } : y)))} />
              <input value={b.text} onChange={(e) => up('bar', o.bar.map((y, j) => (j === i ? { ...y, text: e.target.value } : y)))} />
            </div>
          ))}
        </>
      )}
    </Section>
  );
}

function Plans({ title, value, trial, onChange }) {
  const up = (i, k, val) => onChange(value.map((p, j) => (j === i ? { ...p, [k]: val } : p)));
  return (
    <Section title={title} hint="Each card is linked to its own Razorpay button (shown in grey). Uncheck “Show” to hide a card.">
      <div className="lp-plans">
        {value.map((p, i) => (
          <div className={`lp-plan${p.active === false ? ' lp-plan--off' : ''}`} key={p.pay}>
            <div className="lp-plan__top">
              <code>{p.pay}</code>
              <label className="check"><input type="checkbox" checked={p.active !== false} onChange={(e) => up(i, 'active', e.target.checked)} /> Show</label>
            </div>
            <label>Name<input value={p.name} onChange={(e) => up(i, 'name', e.target.value)} /></label>
            <label>{trial ? 'Subtitle' : 'Duration line'}<input value={p.sub} onChange={(e) => up(i, 'sub', e.target.value)} /></label>
            <div className="lp-grid lp-grid--2">
              <label>Price ₹<input type="number" min="0" value={p.price ?? ''} onChange={(e) => up(i, 'price', e.target.value)} /></label>
              {!trial && <label>MRP ₹ <small className="muted">(struck out)</small><input type="number" min="0" value={p.mrp ?? ''} onChange={(e) => up(i, 'mrp', e.target.value)} /></label>}
              {!trial && 'perMonth' in p && p.perMonth !== null && <label>Per month ₹<input type="number" min="0" value={p.perMonth ?? ''} onChange={(e) => up(i, 'perMonth', e.target.value)} /></label>}
              {!trial && <label>Badge<input value={p.badge || ''} placeholder="e.g. BEST VALUE" onChange={(e) => up(i, 'badge', e.target.value)} /></label>}
            </div>
            {('offText' in p || 'tag' in p) && (
              <div className="lp-grid lp-grid--2">
                {'tag' in p && <label>Offer tag <small className="muted">(above the card)</small><input value={p.tag || ''} onChange={(e) => up(i, 'tag', e.target.value)} /></label>}
                {'offText' in p && <label>“% OFF” text <small className="muted">(empty = hide)</small><input value={p.offText || ''} placeholder="e.g. 75% OFF" onChange={(e) => up(i, 'offText', e.target.value)} /></label>}
              </div>
            )}
            {!trial && Number(p.mrp) > Number(p.price) && <p className="lp-off">Shows {inr(p.mrp)} → {inr(p.price)} · <b>{offPct({ mrp: Number(p.mrp), price: Number(p.price) })}% OFF</b></p>}
            {trial && <label>Description<textarea rows={2} value={p.text} onChange={(e) => up(i, 'text', e.target.value)} /></label>}
            <label>Features <small className="muted">(one per line)</small><Lines value={p.features} onChange={(x) => up(i, 'features', x)} /></label>
            {p.cta !== undefined && p.cta !== '' && <label>Button text<input value={p.cta} onChange={(e) => up(i, 'cta', e.target.value)} /></label>}
            {!trial && <label className="check"><input type="checkbox" checked={!!p.popular} onChange={(e) => up(i, 'popular', e.target.checked)} /> Most popular</label>}
          </div>
        ))}
      </div>
    </Section>
  );
}

function Schedule({ value, onChange }) {
  const col = (k, label) => (
    <div>
      <h4>{label}</h4>
      {value[k].map((r, i) => (
        <div className="lp-barrow" key={i}>
          <EmojiSelect value={r.icon} onChange={(x) => onChange({ ...value, [k]: value[k].map((y, j) => (j === i ? { ...y, icon: x } : y)) })} />
          <input placeholder="7:00 AM – 8:00 AM" value={r.time} onChange={(e) => onChange({ ...value, [k]: value[k].map((y, j) => (j === i ? { ...y, time: e.target.value } : y)) })} />
          <input placeholder="Class name" value={r.name} onChange={(e) => onChange({ ...value, [k]: value[k].map((y, j) => (j === i ? { ...y, name: e.target.value } : y)) })} />
          <button className="linkbtn danger" onClick={() => onChange({ ...value, [k]: value[k].filter((_, j) => j !== i) })} aria-label="Remove">✕</button>
        </div>
      ))}
      <button className="linkbtn" onClick={() => onChange({ ...value, [k]: [...value[k], { icon: '', time: '', name: '' }] })}>+ Add batch</button>
    </div>
  );
  return <Section title="Class timings"><div className="lp-grid lp-grid--2">{col('morning', 'Morning batches')}{col('evening', 'Evening batches')}</div></Section>;
}

function Lines({ value = [], onChange }) {
  const [text, setText] = useState(value.join('\n'));
  useEffect(() => { if (text.split('\n').map((s) => s.trim()).filter(Boolean).join('\n') !== value.join('\n')) setText(value.join('\n')); }, [value.join('\n')]);
  return <textarea rows={Math.max(3, value.length + 1)} value={text} onChange={(e) => { setText(e.target.value); onChange(e.target.value.split('\n').map((s) => s.trim()).filter(Boolean)); }} />;
}

function Rows({ title, value = [], fields, onChange }) {
  const up = (i, k, val) => onChange(value.map((r, j) => (j === i ? { ...r, [k]: val } : r)));
  const move = (i, d) => { const a = [...value]; const [x] = a.splice(i, 1); a.splice(i + d, 0, x); onChange(a); };
  return (
    <Section title={`${title} (${value.length})`}>
      {value.map((r, i) => (
        <div className="lp-row" key={i}>
          <div className="lp-row__fields">
            {fields.map(([k, l, type]) => (
              <label key={k} className={type === 'area' ? 'lp-row__wide' : ''}>{l}
                {type === 'area' ? <textarea rows={2} value={r[k] || ''} onChange={(e) => up(i, k, e.target.value)} /> : <input value={r[k] || ''} onChange={(e) => up(i, k, e.target.value)} />}
              </label>
            ))}
          </div>
          <div className="lp-row__btns">
            <button className="btn btn--ghost btn--sm" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up">↑</button>
            <button className="btn btn--ghost btn--sm" disabled={i === value.length - 1} onClick={() => move(i, 1)} aria-label="Move down">↓</button>
            <button className="btn btn--ghost btn--sm danger" onClick={() => confirm('Remove this item?') && onChange(value.filter((_, j) => j !== i))} aria-label="Remove">✕</button>
          </div>
        </div>
      ))}
      <button className="btn btn--ghost btn--sm" onClick={() => onChange([...value, Object.fromEntries(fields.map(([k]) => [k, '']))])}>+ Add</button>
    </Section>
  );
}

function Buttons({ value, onChange }) {
  return (
    <Section title="Razorpay payment buttons" hint="Key = the plan button on the site (also used by GTM click triggers). Value = the Razorpay Payment Button id (pl_…). Changes apply after the next rebuild.">
      <table className="tbl tbl--static lp-btns">
        <thead><tr><th>Button on the site</th><th>Razorpay payment button id</th></tr></thead>
        <tbody>
          {Object.entries(value).map(([k, id]) => (
            <tr key={k}>
              <td><code>{k}</code></td>
              <td><input value={id} pattern="pl_[A-Za-z0-9]+" onChange={(e) => onChange({ ...value, [k]: e.target.value.trim() })} />
                {!/^pl_[A-Za-z0-9]{6,30}$/.test(id) && <small className="err block">Must look like pl_XXXXXXXX — this one won’t be saved</small>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  );
}
