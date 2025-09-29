// base url (from config.js)
const API_BASE = window.API_BASE || '';

// read ?id=
function getParam(name) {
  try {
    const url = new URL(location.href);
    return url.searchParams.get(name);
  } catch {
    return null;
  }
}

// format money
const moneyFmt = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' });
function money(n) {
  const v = Number(n);
  return Number.isFinite(v) ? moneyFmt.format(v) : '—';
}

// format date
function dstr(d) {
  const t = new Date(d);
  return isNaN(t) ? '—' : t.toLocaleString();
}

// tiny dom helpers
function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined && text !== null) n.textContent = String(text);
  return n;
}
function img(src, alt) {
  const im = document.createElement('img');
  im.src = src || 'public/img/placeholder.jpg';
  im.alt = alt || '';
  im.loading = 'lazy';
  im.referrerPolicy = 'no-referrer';
  im.addEventListener('error', () => (im.src = 'public/img/placeholder.jpg'));
  return im;
}

async function loadEvent() {
  const id = getParam('id');
  const box = document.getElementById('eventCard');
  const err = document.getElementById('eventError');
  if (!box || !err) return;

  box.replaceChildren();
  err.style.display = 'none';
  box.append(el('p', 'small', 'Loading...'));

  if (!id) {
    box.replaceChildren();
    err.textContent = 'No event selected.';
    err.style.display = 'block';
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/events/${encodeURIComponent(id)}`, {
      headers: { Accept: 'application/json' }
    });
    if (!res.ok) throw new Error(res.status);

    const json = await res.json();
    const e = json?.data;
    if (!json?.ok || !e) throw new Error(json?.error || 'bad data');

    const priceNum = Number(e.ticket_price);
    const priceText = priceNum > 0 ? money(priceNum) : 'Free';

    const goal = Number(e.goal_amount);
    const raised = Number(e.raised_amount);
    const pct = goal > 0 && Number.isFinite(raised)
      ? Math.min(100, Math.max(0, Math.round((raised / goal) * 100)))
      : 0;

    // render
    box.replaceChildren();

    box.append(img(e.image_url, `${e.name || 'Event'} image`));
    box.append(el('h2', null, e.name || 'Untitled Event'));

    // past tag
    if (new Date(e.end_datetime) < new Date()) {
      box.append(el('div', 'badge', 'Past'));
    }

    if (e.category_name) box.append(el('div', 'badge', e.category_name));

    const p1 = el('p', 'small');
    p1.innerHTML = `<strong>When:</strong> ${dstr(e.start_datetime)} — ${dstr(e.end_datetime)}`;
    box.append(p1);

    const p2 = el('p', 'small');
    p2.innerHTML = `<strong>Where:</strong> ${e.location || '—'}`;
    box.append(p2);

    const p3 = el('p', 'small');
    p3.innerHTML = `<strong>Organiser:</strong> ${e.org_name || '—'}${e.org_mission ? ' — ' + e.org_mission : ''}`;
    box.append(p3);

    box.append(el('h3', null, 'Purpose'));
    box.append(el('p', null, e.purpose || ''));

    box.append(el('h3', null, 'About the Event'));
    box.append(el('p', null, e.description || ''));

    box.append(el('h3', null, 'Tickets'));
    const p4 = el('p');
    p4.innerHTML = `Price: <strong>${priceText}</strong>`;
    box.append(p4);

    const btn = el('button', 'btn', 'Register');
    btn.id = 'registerBtn';
    btn.addEventListener('click', () => alert('This feature is currently under construction.'));
    box.append(btn);

    box.append(el('h3', null, 'Goal vs Progress'));
    const p5 = el('p', null, `Goal: ${Number.isFinite(goal) ? money(goal) : '—'} · Raised: ${Number.isFinite(raised) ? money(raised) : '—'} (${pct}%)`);
    box.append(p5);

  } catch (ex) {
    box.replaceChildren();
    err.textContent = 'Failed to load event. ' + (ex?.message || ex);
    err.style.display = 'block';
  }
}

document.addEventListener('DOMContentLoaded', loadEvent);
