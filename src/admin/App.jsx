// Admin panel: login, blog posts, categories, users, account. Client-side only (served at /admin).
import { useEffect, useState, useCallback } from 'react';
import { api, uploadImage, fmtDate } from './api.js';
import Editor from './Editor.jsx';

// ---------- tiny router (/admin/...) ----------
const usePath = () => {
  const [p, setP] = useState(location.pathname.replace(/^\/admin/, '') || '/');
  useEffect(() => { const f = () => setP(location.pathname.replace(/^\/admin/, '') || '/'); addEventListener('popstate', f); return () => removeEventListener('popstate', f); }, []);
  return p;
};
export const go = (to) => { history.pushState(null, '', '/admin' + to); dispatchEvent(new PopStateEvent('popstate')); window.scrollTo(0, 0); };
const A = ({ to, children, onClick, ...rest }) => (
  <a href={'/admin' + to} {...rest} onClick={(e) => { onClick?.(e); if (e.metaKey || e.ctrlKey) return; e.preventDefault(); go(to); }}>{children}</a>
);

// ---------- toast ----------
let pushToast = () => {};
export const toast = (msg, tone = 'ok') => pushToast({ msg, tone, id: Math.random() });
function Toasts() {
  const [list, setList] = useState([]);
  pushToast = (t) => { setList((l) => [...l, t]); setTimeout(() => setList((l) => l.filter((x) => x.id !== t.id)), 5000); };
  return <div className="toasts" role="status">{list.map((t) => <div key={t.id} className={`toast toast--${t.tone}`}>{t.msg}</div>)}</div>;
}

// ---------- app ----------
export default function App() {
  const [user, setUser] = useState(undefined);
  const path = usePath();
  useEffect(() => { api('/auth/me').then((d) => setUser(d.user)).catch(() => setUser(null)); }, []);
  if (user === undefined) return <div className="center-screen">Loading…</div>;
  if (!user) return <><Login onIn={setUser} /><Toasts /></>;

  let page;
  const m = path.match(/^\/posts\/([^/]+)$/);
  if (m) page = <PostEdit id={m[1]} />;
  else if (path === '/categories') page = <Categories />;
  else if (path === '/users' && user.role === 'admin') page = <Users me={user} />;
  else if (path === '/account') page = <Account user={user} />;
  else page = <Posts />;

  const logout = async () => { await api('/auth/logout', { method: 'POST' }); setUser(null); go('/'); };
  const nav = [['/', 'Blog posts'], ['/categories', 'Categories'], ...(user.role === 'admin' ? [['/users', 'Users']] : []), ['/account', 'My account']];
  return (
    <div className="shell">
      <aside className="side">
        <div className="side__brand">🧘 Yogacharya<br /><small>Admin</small></div>
        <nav>
          {nav.map(([to, l]) => <A key={to} to={to} className={(to === '/' ? path === '/' || path.startsWith('/posts') : path === to) ? 'on' : ''}>{l}</A>)}
        </nav>
        <div className="side__foot">
          <a href="/" target="_blank" rel="noopener">View site ↗</a>
          <button className="linkbtn" onClick={logout}>Log out</button>
          <small>{user.email}</small>
        </div>
      </aside>
      <main className="main">{page}</main>
      <Toasts />
    </div>
  );
}

// ---------- login ----------
function Login({ onIn }) {
  const [f, setF] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setErr(''); setBusy(true);
    try { onIn((await api('/auth/login', { method: 'POST', body: f })).user); } catch (e2) { setErr(e2.message); } finally { setBusy(false); }
  };
  return (
    <div className="center-screen">
      <form className="card login" onSubmit={submit}>
        <h1>🧘 Admin login</h1>
        <p className="muted">Yogacharya Ravinder website</p>
        <label>Email<input type="email" autoComplete="username" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></label>
        <label>Password<input type="password" autoComplete="current-password" required value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></label>
        {err && <p className="err">{err}</p>}
        <button className="btn" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </div>
  );
}

// ---------- posts list ----------
function Posts() {
  const [q, setQ] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const filters = new URLSearchParams({ q: search, status }).toString();
  const path = `/posts?${filters}&page=${page}`;
  const requestKey = `${path}#${attempt}`;
  const waitingForSearch = q !== search;
  const loading = waitingForSearch || result?.key !== requestKey;
  const error = loading ? null : result.error;
  const d = result?.data;

  useEffect(() => {
    const timer = setTimeout(() => setSearch(q), 200);
    return () => clearTimeout(timer);
  }, [q]);

  useEffect(() => {
    if (waitingForSearch) return;
    const controller = new AbortController();
    api(path, { signal: controller.signal }).then((data) => {
      if (!controller.signal.aborted) setResult({ key: requestKey, data, filters });
    }).catch((err) => {
      if (!controller.signal.aborted) setResult((previous) => ({ ...previous, key: requestKey, error: err.message }));
    });
    return () => controller.abort();
  }, [filters, path, requestKey, waitingForSearch]);

  const shownPage = d?.page ?? 1;
  const loadingPage = loading && !waitingForSearch && result?.filters === filters && page !== shownPage;
  return (
    <>
      <header className="ph">
        <h1>Blog posts</h1>
        <A to="/posts/new" className="btn">+ New post</A>
      </header>
      <div className="filters">
        <input placeholder="Search titles…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="">All</option><option value="published">Published</option><option value="draft">Drafts</option>
        </select>
      </div>
      <div role="status" className="post-list-status">
        {loading && <span className="post-list-loading"><span className="post-list-spinner" aria-hidden="true" />{loadingPage ? `Loading page ${page}…` : 'Loading posts…'}</span>}
        {error && <span className="err">{error} <button className="btn btn--ghost btn--sm" onClick={() => setAttempt((n) => n + 1)}>Retry</button></span>}
      </div>
      {d && (d.posts.length === 0 ? (!loading && !error && <p className="muted card pad">{q || status ? 'No posts match these filters.' : 'No posts yet. Click “New post”.'}</p>) : (
        <div className="card post-results" aria-busy={loading}>
          <table className="tbl">
            <thead><tr><th /><th>Title</th><th>Categories</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {d.posts.map((p) => (
                <tr key={p._id} onClick={() => go('/posts/' + p._id)}>
                  <td className="thumb">{p.image?.src && <img src={p.image.src} alt="" loading="lazy" decoding="async" />}</td>
                  <td><A to={'/posts/' + p._id} onClick={(e) => e.stopPropagation()}>{p.title}</A><small className="muted block">/blogs/{p.slug}/</small></td>
                  <td>{p.categories.map((c) => c.name).join(', ')}</td>
                  <td><span className={`badge badge--${p.status}`}>{p.status === 'published' ? 'Published' : 'Draft'}</span></td>
                  <td>{fmtDate(p.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {d.pages > 1 && (
            <nav className="pager" aria-label="Blog posts pagination">
              <button className="btn btn--ghost btn--sm" disabled={loading || !!error || shownPage <= 1} onClick={() => setPage(shownPage - 1)}>{loadingPage && page < shownPage ? 'Loading…' : '← Prev'}</button>
              <span>Page {shownPage} of {d.pages}</span>
              <button className="btn btn--ghost btn--sm" disabled={loading || !!error || shownPage >= d.pages} onClick={() => setPage(shownPage + 1)}>{loadingPage && page > shownPage ? 'Loading…' : 'Next →'}</button>
            </nav>
          )}
        </div>
      ))}
    </>
  );
}

// ---------- post editor ----------
const blank = { title: '', slug: '', status: 'draft', date: new Date().toISOString(), excerpt: '', content: '', categories: [], image: null, seo: { title: '', description: '' } };
const toLocalInput = (d) => { const x = new Date(d); return new Date(x - x.getTimezoneOffset() * 60000).toISOString().slice(0, 16); };

function PostEdit({ id }) {
  const isNew = id === 'new';
  const [p, setP] = useState(isNew ? blank : null);
  const [cats, setCats] = useState([]);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [imgBusy, setImgBusy] = useState(false);
  useEffect(() => {
    api('/categories').then((d) => setCats(d.categories));
    if (!isNew) api('/posts/' + id).then((d) => setP({ ...blank, ...d.post, seo: { ...blank.seo, ...d.post.seo } })).catch((e) => { toast(e.message, 'err'); go('/'); });
    else setP(blank);
  }, [id]);
  useEffect(() => {
    const f = (e) => { if (dirty) { e.preventDefault(); e.returnValue = ''; } };
    addEventListener('beforeunload', f); return () => removeEventListener('beforeunload', f);
  }, [dirty]);
  const set = (k, v) => { setP((x) => ({ ...x, [k]: v })); setDirty(true); };
  if (!p) return <p className="muted">Loading…</p>;

  const save = async (status = p.status) => {
    if (!p.title.trim()) return toast('Add a title first', 'err');
    if (!p.date) return toast('Enter a valid publish date', 'err');
    setSaving(true);
    try {
      const { title, slug, date, excerpt, content, categories, image, seo } = p;
      const body = { title, slug, status, date, excerpt, content, categories, image, seo };
      const d = isNew ? await api('/posts', { method: 'POST', body }) : await api('/posts/' + id, { method: 'PUT', body });
      setP({ ...blank, ...d.post, seo: { ...blank.seo, ...d.post.seo } });
      setDirty(false);
      toast(status === 'draft' ? 'Draft saved' : Date.parse(date) > Date.now() ? 'Post scheduled' : 'Post published');
      if (isNew) go('/posts/' + d.post._id);
    } catch (e) { toast(e.message, 'err'); } finally { setSaving(false); }
  };
  const del = async () => {
    if (!confirm(`Delete "${p.title}"? This can't be undone.`)) return;
    try { await api('/posts/' + id, { method: 'DELETE' }); toast('Post deleted'); setDirty(false); go('/'); } catch (e) { toast(e.message, 'err'); }
  };
  const pickImage = async (e) => {
    const f = e.target.files?.[0]; e.target.value = '';
    if (!f) return;
    setImgBusy(true);
    try { const { url, width, height } = await uploadImage(f); set('image', { src: url, width, height, alt: p.image?.alt || p.title }); } catch (err) { toast(err.message, 'err'); } finally { setImgBusy(false); }
  };
  const toggleCat = (cid) => set('categories', p.categories.includes(cid) ? p.categories.filter((c) => c !== cid) : [...p.categories, cid]);
  const seoTitle = p.seo.title || `${p.title} - yogacharyaravinder.com`;
  const seoDesc = p.seo.description || p.excerpt.slice(0, 158);

  return (
    <>
      <header className="ph">
        <div>
          <A to="/" className="muted">← All posts</A>
          <h1>{isNew ? 'New post' : 'Edit post'} {!isNew && <span className={`badge badge--${p.status}`}>{p.status === 'published' ? 'Published' : 'Draft'}</span>}</h1>
        </div>
        <div className="row">
          {!isNew && p.status === 'published' && Date.parse(p.date) <= Date.now() && <a className="btn btn--ghost" href={`/blogs/${p.slug}/`} target="_blank" rel="noopener">View ↗</a>}
          {p.status === 'published'
            ? <button className="btn btn--ghost" disabled={saving} onClick={() => save('draft')}>Unpublish</button>
            : <button className="btn btn--ghost" disabled={saving} onClick={() => save('draft')}>Save draft</button>}
          <button className="btn" disabled={saving} onClick={() => save('published')}>{saving ? 'Saving…' : p.status === 'published' ? 'Update' : 'Publish'}</button>
        </div>
      </header>

      <div className="edit">
        <div className="edit__main">
          <input className="title-in" placeholder="Post title" value={p.title} onChange={(e) => set('title', e.target.value)} />
          <div className="slug">yogacharyaravinder.com/blogs/<input value={p.slug} placeholder={'auto-from-title'} onChange={(e) => set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))} />/</div>
          <Editor value={p.content} onChange={(v) => set('content', v)} />
        </div>

        <div className="edit__side">
          <section className="card pad">
            <h3>Featured image</h3>
            {p.image?.src ? (
              <>
                <img className="fimg" src={p.image.src} alt="" />
                <label>Alt text<input value={p.image.alt || ''} onChange={(e) => set('image', { ...p.image, alt: e.target.value })} /></label>
                <div className="row">
                  <label className="btn btn--ghost btn--sm">Replace<input type="file" accept="image/*" hidden onChange={pickImage} /></label>
                  <button className="btn btn--ghost btn--sm" onClick={() => set('image', null)}>Remove</button>
                </div>
              </>
            ) : (
              <label className="drop">{imgBusy ? 'Uploading…' : 'Click to upload (1400×788 recommended)'}<input type="file" accept="image/*" hidden onChange={pickImage} /></label>
            )}
          </section>

          <section className="card pad">
            <h3>Publish date</h3>
            <input type="datetime-local" value={p.date ? toLocalInput(p.date) : ''} onChange={(e) => set('date', e.target.value ? new Date(e.target.value).toISOString() : '')} />
            <small className="muted">Scheduled posts appear automatically at the publish date and time.</small>
          </section>

          <section className="card pad">
            <h3>Categories</h3>
            {cats.length === 0 && <small className="muted">No categories yet — add them under Categories.</small>}
            {cats.map((c) => (
              <label key={c._id} className="check"><input type="checkbox" checked={p.categories.includes(c._id)} onChange={() => toggleCat(c._id)} /> {c.name}</label>
            ))}
          </section>

          <section className="card pad">
            <h3>Excerpt</h3>
            <textarea rows={4} value={p.excerpt} maxLength={300} placeholder="Short summary shown on the blog page" onChange={(e) => set('excerpt', e.target.value)} />
          </section>

          <section className="card pad">
            <h3>SEO</h3>
            <label>SEO title <small className="muted">({seoTitle.length}/60)</small><input value={p.seo.title} placeholder={`${p.title} - yogacharyaravinder.com`} onChange={(e) => set('seo', { ...p.seo, title: e.target.value })} /></label>
            <label>Meta description <small className="muted">({seoDesc.length}/158)</small><textarea rows={3} value={p.seo.description} placeholder="Defaults to the excerpt" onChange={(e) => set('seo', { ...p.seo, description: e.target.value })} /></label>
            <div className="serp"><b>{seoTitle}</b><span>yogacharyaravinder.com › blogs › {p.slug || '…'}</span><p>{seoDesc || 'Add an excerpt or meta description.'}</p></div>
          </section>

          {!isNew && <button className="linkbtn danger" onClick={del}>Delete post</button>}
        </div>
      </div>
    </>
  );
}

// ---------- categories ----------
function Categories() {
  const [list, setList] = useState(null);
  const [f, setF] = useState({ name: '', description: '' });
  const [edit, setEdit] = useState(null);
  const load = () => api('/categories').then((d) => setList(d.categories));
  useEffect(() => { load(); }, []);
  const add = async (e) => { e.preventDefault(); try { await api('/categories', { method: 'POST', body: f }); setF({ name: '', description: '' }); toast('Category added'); load(); } catch (e2) { toast(e2.message, 'err'); } };
  const saveEdit = async () => { try { await api('/categories/' + edit._id, { method: 'PUT', body: edit }); setEdit(null); toast('Saved'); load(); } catch (e) { toast(e.message, 'err'); } };
  const del = async (c) => { if (!confirm(`Delete category "${c.name}"? Posts stay, they just lose this category.`)) return; await api('/categories/' + c._id, { method: 'DELETE' }); load(); };
  return (
    <>
      <header className="ph"><h1>Categories</h1></header>
      <form className="card pad row wrap" onSubmit={add}>
        <input required placeholder="New category name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
        <input placeholder="Description (optional)" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />
        <button className="btn">Add</button>
      </form>
      <div className="card">
        <table className="tbl tbl--static">
          <thead><tr><th>Name</th><th>URL</th><th>Posts</th><th /></tr></thead>
          <tbody>
            {list?.map((c) => edit?._id === c._id ? (
              <tr key={c._id}>
                <td><input value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /><input placeholder="Description" value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} /></td>
                <td><input value={edit.slug} onChange={(e) => setEdit({ ...edit, slug: e.target.value })} /></td>
                <td>{c.count}</td>
                <td className="row"><button className="btn btn--sm" onClick={saveEdit}>Save</button><button className="linkbtn" onClick={() => setEdit(null)}>Cancel</button></td>
              </tr>
            ) : (
              <tr key={c._id}>
                <td><b>{c.name}</b>{c.description && <small className="muted block">{c.description}</small>}</td>
                <td><small>/blogs/category/{c.slug}/</small></td>
                <td>{c.count}</td>
                <td className="row"><button className="linkbtn" onClick={() => setEdit(c)}>Edit</button><button className="linkbtn danger" onClick={() => del(c)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ---------- users ----------
function Users({ me }) {
  const [list, setList] = useState([]);
  const [f, setF] = useState({ email: '', name: '', password: '', role: 'editor' });
  const load = () => api('/users').then((d) => setList(d.users));
  useEffect(() => { load(); }, []);
  const add = async (e) => { e.preventDefault(); try { await api('/users', { method: 'POST', body: f }); setF({ email: '', name: '', password: '', role: 'editor' }); toast('User added'); load(); } catch (e2) { toast(e2.message, 'err'); } };
  const del = async (u) => { if (!confirm(`Remove ${u.email}?`)) return; try { await api('/users/' + u.id, { method: 'DELETE' }); load(); } catch (e) { toast(e.message, 'err'); } };
  return (
    <>
      <header className="ph"><h1>Users</h1></header>
      <form className="card pad row wrap" onSubmit={add}>
        <input required type="email" placeholder="Email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
        <input placeholder="Name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
        <input required minLength={10} type="password" placeholder="Password (10+ chars)" autoComplete="new-password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
        <select value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })}><option value="editor">Editor (posts only)</option><option value="admin">Admin</option></select>
        <button className="btn">Add user</button>
      </form>
      <div className="card">
        <table className="tbl tbl--static">
          <thead><tr><th>Email</th><th>Name</th><th>Role</th><th /></tr></thead>
          <tbody>{list.map((u) => <tr key={u.id}><td>{u.email}</td><td>{u.name}</td><td>{u.role}</td><td>{u.id !== me.id && <button className="linkbtn danger" onClick={() => del(u)}>Remove</button>}</td></tr>)}</tbody>
        </table>
      </div>
    </>
  );
}

// ---------- account ----------
function Account({ user }) {
  const [f, setF] = useState({ current: '', next: '', again: '' });
  const submit = async (e) => {
    e.preventDefault();
    if (f.next !== f.again) return toast('New passwords do not match', 'err');
    try { await api('/auth/password', { method: 'POST', body: f }); setF({ current: '', next: '', again: '' }); toast('Password changed. Other devices were logged out.'); } catch (e2) { toast(e2.message, 'err'); }
  };
  return (
    <>
      <header className="ph"><h1>My account</h1></header>
      <form className="card pad narrow" onSubmit={submit}>
        <p className="muted">{user.email} · {user.role}</p>
        <label>Current password<input type="password" autoComplete="current-password" required value={f.current} onChange={(e) => setF({ ...f, current: e.target.value })} /></label>
        <label>New password<input type="password" autoComplete="new-password" minLength={10} required value={f.next} onChange={(e) => setF({ ...f, next: e.target.value })} /></label>
        <label>Repeat new password<input type="password" autoComplete="new-password" minLength={10} required value={f.again} onChange={(e) => setF({ ...f, again: e.target.value })} /></label>
        <button className="btn">Change password</button>
      </form>
    </>
  );
}
