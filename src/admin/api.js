// Tiny fetch wrapper for the admin API
export async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch('/api' + path, {
    method,
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'yr-admin' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error || `Request failed (${res.status})`), { status: res.status });
  return data;
}

// Resize big photos in the browser (max 2000px, WebP) before upload: faster uploads, small storage.
export async function uploadImage(file) {
  if (!/^image\/(png|jpe?g|webp|gif|avif)$/.test(file.type)) throw new Error('Please choose a PNG, JPG, WebP, GIF or AVIF image');
  let dataUrl, width, height;
  if (file.type === 'image/gif') {
    dataUrl = await new Promise((ok, no) => { const r = new FileReader(); r.onload = () => ok(r.result); r.onerror = no; r.readAsDataURL(file); });
    const img = await createImageBitmap(file); width = img.width; height = img.height;
  } else {
    const img = await createImageBitmap(file);
    const scale = Math.min(1, 2000 / Math.max(img.width, img.height));
    width = Math.round(img.width * scale); height = Math.round(img.height * scale);
    const c = document.createElement('canvas'); c.width = width; c.height = height;
    c.getContext('2d').drawImage(img, 0, 0, width, height);
    dataUrl = c.toDataURL('image/webp', 0.88);
    if (!dataUrl.startsWith('data:image/webp')) dataUrl = c.toDataURL('image/jpeg', 0.88); // Safari fallback
  }
  const { url } = await api('/media', { method: 'POST', body: { name: file.name, data: dataUrl } });
  return { url, width, height };
}

export const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
