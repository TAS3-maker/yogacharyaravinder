import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import Icon from './Icon.jsx';
import Img from './Img.jsx';

/* ---------- Offer countdown (shared by every timer on the page) ----------
   Default: evergreen window per visitor (10 h), stored in their browser, restarts once it ends.
   The admin can change the window length per page, or set a fixed end date/time instead.
   Pages call configureCountdown() before rendering (same values on the server and in the browser). */
let cfg = { ms: 10 * 60 * 60 * 1000, endsAt: 0, key: 'yr_offer_deadline' };
let deadline = 0;
const listeners = new Set();
let timer;

export function configureCountdown({ hours, endsAt, key } = {}) {
  const next = {
    ms: (Number(hours) > 0 ? Number(hours) : 10) * 60 * 60 * 1000,
    endsAt: endsAt ? Date.parse(endsAt) || 0 : 0,
    key: key || 'yr_offer_deadline',
  };
  if (next.ms !== cfg.ms || next.endsAt !== cfg.endsAt || next.key !== cfg.key) { cfg = next; deadline = 0; }
}

function getDeadline() {
  if (deadline) return deadline;
  if (cfg.endsAt > Date.now()) return (deadline = cfg.endsAt);
  let d = 0;
  try { d = Number(localStorage.getItem(cfg.key)) || 0; } catch {}
  if (d < Date.now() || d > Date.now() + cfg.ms) {
    d = Date.now() + cfg.ms;
    try { localStorage.setItem(cfg.key, String(d)); } catch {}
  }
  return (deadline = d);
}
function subscribe(cb) {
  listeners.add(cb);
  if (!timer) timer = setInterval(() => {
    if (Date.now() > deadline) { deadline = 0; getDeadline(); }
    listeners.forEach((l) => l());
  }, 1000);
  return () => { listeners.delete(cb); if (!listeners.size) { clearInterval(timer); timer = null; } };
}
const snapshot = () => Math.max(0, Math.floor((getDeadline() - Date.now()) / 1000));
const serverSnapshot = () => cfg.ms / 1000;
const pad = (n) => String(n).padStart(2, '0');

export function useCountdown() {
  const s = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  return [pad(Math.floor(s / 3600)), pad(Math.floor((s % 3600) / 60)), pad(s % 60)];
}

export function Countdown({ variant = 'green', labels = true }) {
  const parts = useCountdown();
  const names = ['HRS', 'MINS', 'SEC'];
  return (
    <div className={`cd cd--${variant}`} role="timer" aria-label="Offer ends in">
      {parts.map((v, i) => (
        <div className="cd__box" key={names[i]}>
          <span className="cd__num">{v}</span>
          {labels && <span className="cd__lbl">{names[i]}</span>}
        </div>
      ))}
    </div>
  );
}

/* ---------- "Currently online" number that drifts a little, like the live site ---------- */
export function OnlineCount({ base = 250 }) {
  const [n, setN] = useState(base);
  useEffect(() => {
    const t = setInterval(() => setN((v) => Math.min(base + 15, Math.max(base - 5, v + Math.round(Math.random() * 4 - 1.5)))), 6000);
    return () => clearInterval(t);
  }, [base]);
  return n;
}

/* ---------- In-view helper ---------- */
function useInView(ref, margin = '200px') {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setSeen(true), io.disconnect()), { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [seen]);
  return seen;
}

/* ---------- Animated number counter (SSR renders final value for SEO / no-JS) ---------- */
export function Counter({ to, suffix = '' }) {
  const ref = useRef(null);
  const [val, setVal] = useState(to);
  useEffect(() => {
    const el = ref.current;
    if (el.getBoundingClientRect().top < innerHeight) return; // already visible: keep final value
    setVal(0);
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const dur = 1800;
      const step = (t) => {
        const p = Math.min(1, (t - start) / dur);
        setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{val.toLocaleString('en-IN')}{suffix}</span>;
}

/* ---------- Reel: silent looping video, no controls. Loads when near the screen,
   plays only while visible (saves battery/data), poster shows until the first frame. ---------- */
export function LazyVideo({ src, poster, label }) {
  const ref = useRef(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setNear(true); v.play?.().catch(() => {}); }
      else v.pause?.();
    }, { rootMargin: '200px' });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  useEffect(() => { if (near) ref.current?.play?.().catch(() => {}); }, [near]);
  return (
    <div className="vid">
      <video
        ref={ref}
        src={near ? src : undefined}
        poster={poster}
        muted
        loop
        playsInline
        autoPlay
        preload={near ? 'auto' : 'none'}
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback"
        aria-label={label}
      />
    </div>
  );
}

/* ---------- Testimonial card → opens the video in a full-screen player ---------- */
export function StoryCard({ poster, alt, video }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.body.classList.add('lb-open');
    addEventListener('keydown', onKey);
    return () => { document.body.classList.remove('lb-open'); removeEventListener('keydown', onKey); };
  }, [open]);
  return (
    <>
      <button type="button" className="story" onClick={() => video && setOpen(true)} aria-label={`Play video: ${alt}`}>
        <Img src={poster} alt={alt} width="540" height="660" sizes="(max-width: 680px) 46vw, 31vw" />
        <span className="vid__play vid__play--glass" aria-hidden="true"><Icon name="play" size={34} /></span>
      </button>
      {open && createPortal(
        <div className="lb" role="dialog" aria-modal="true" aria-label={alt} onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
          <button className="lb__close" onClick={() => setOpen(false)} aria-label="Close video"><Icon name="close" size={30} strokeWidth={2} /></button>
          <video src={video} poster={poster} controls autoPlay playsInline />
        </div>,
        document.body
      )}
    </>
  );
}

/* ---------- FAQ accordion (native <details> so it works before JS loads) ---------- */
export function Faq({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="faq">
      {items.map((it, i) => (
        <details
          key={it.q}
          className="faq__item"
          open={open === i}
          onToggle={(e) => { if (e.currentTarget.open) setOpen(i); else if (open === i) setOpen(-1); }}
        >
          <summary onClick={(e) => { e.preventDefault(); setOpen(open === i ? -1 : i); }}>
            <span>{it.q}</span>
            <Icon name="chevron" size={20} className="faq__chev" strokeWidth={2.5} />
          </summary>
          <p>{it.a}</p>
        </details>
      ))}
    </div>
  );
}
